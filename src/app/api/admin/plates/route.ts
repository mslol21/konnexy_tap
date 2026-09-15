import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";
import {
  generateDeviceCode,
  isValidDeviceCodeFormat,
  validateDestinationUrl,
} from "@/lib/security";

const createPlateSchema = z.object({
  business_name: z.string().trim().min(2).max(140),
  category: z.string().trim().min(2).max(100).default("Comércio local"),
  city: z.string().trim().max(120).optional().nullable(),
  state: z.string().trim().length(2).optional().nullable(),
  location: z.string().trim().min(2).max(100).default("Balcão principal"),
  google_url: z.string().trim().url().max(1200),
  code: z.string().trim().max(16).optional().nullable(),
  status: z.enum(["pending", "active"]).default("active"),
  lead_id: z.string().uuid().optional().nullable(),
});

const updatePlateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "active", "inactive", "suspended"]).optional(),
  destination_url: z.string().trim().url().max(1200).optional(),
  location: z.string().trim().min(2).max(100).optional(),
  business_name: z.string().trim().min(2).max(140).optional(),
  category: z.string().trim().min(2).max(100).optional(),
  city: z.string().trim().max(120).optional().nullable(),
  state: z.string().trim().length(2).optional().nullable(),
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function authError(auth: Awaited<ReturnType<typeof requireAdmin>>) {
  if (auth.ok) return null;
  const message =
    auth.reason === "config"
      ? "Supabase ainda não configurado."
      : auth.reason === "unauthenticated"
        ? "Não autenticado."
        : "Acesso negado.";
  return NextResponse.json({ error: message }, { status: auth.status });
}

export async function GET() {
  const auth = await requireAdmin();
  const denied = authError(auth);
  if (denied) return denied;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY ainda não configurada." },
      { status: 503 }
    );
  }

  const service = createServiceClient();
  const { data, error } = await service
    .from("tap_devices")
    .select(
      "id,business_id,code,name,type,location,active,status,destination_url,destination_type,created_at,businesses(id,name,slug,category,city,state,google_review_url)"
    )
    .order("created_at", { ascending: false })
    .limit(250);

  if (error) {
    console.error("Falha ao listar placas", error.message);
    return NextResponse.json({ error: "Não foi possível carregar as placas." }, { status: 500 });
  }

  const deviceIds = (data ?? []).map((item) => item.id);
  const accessByDevice = new Map<string, number>();

  if (deviceIds.length > 0) {
    const { data: events, error: eventsError } = await service
      .from("events")
      .select("device_id")
      .in("device_id", deviceIds)
      .eq("event_type", "review_redirect")
      .limit(10000);

    if (!eventsError) {
      for (const event of events ?? []) {
        if (!event.device_id) continue;
        accessByDevice.set(event.device_id, (accessByDevice.get(event.device_id) ?? 0) + 1);
      }
    }
  }

  const plates = (data ?? []).map((item) => ({
    ...item,
    access_count: accessByDevice.get(item.id) ?? 0,
  }));

  return NextResponse.json({ plates });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  const denied = authError(auth);
  if (denied) return denied;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Configure a SUPABASE_SERVICE_ROLE_KEY antes de cadastrar placas reais." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = createPlateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados da placa inválidos." }, { status: 400 });
    }

    const validation = validateDestinationUrl(parsed.data.google_url, "google_review");
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || "Link de avaliação do Google inválido." },
        { status: 400 }
      );
    }

    let code = (parsed.data.code || generateDeviceCode("OM")).toUpperCase().trim();
    if (!isValidDeviceCodeFormat(code)) {
      return NextResponse.json({ error: "Código da placa inválido." }, { status: 400 });
    }

    const service = createServiceClient();

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const { data: existing } = await service
        .from("tap_devices")
        .select("id")
        .eq("code", code)
        .maybeSingle();

      if (!existing) break;
      if (parsed.data.code) {
        return NextResponse.json({ error: "Esse código de placa já está em uso." }, { status: 409 });
      }
      code = generateDeviceCode("OM");
    }

    const baseSlug = slugify(parsed.data.business_name) || "negocio";
    const slug = `${baseSlug}-${code.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

    const { data: business, error: businessError } = await service
      .from("businesses")
      .insert({
        slug,
        name: parsed.data.business_name,
        category: parsed.data.category,
        city: parsed.data.city || null,
        state: parsed.data.state?.toUpperCase() || null,
        google_review_url: validation.sanitizedUrl,
        is_active: true,
        plan_id: "free",
      })
      .select("id,name,slug,category,city,state,google_review_url")
      .single();

    if (businessError || !business) {
      console.error("Falha ao criar estabelecimento", businessError?.message);
      return NextResponse.json({ error: "Não foi possível cadastrar o estabelecimento." }, { status: 500 });
    }

    const { data: device, error: deviceError } = await service
      .from("tap_devices")
      .insert({
        business_id: business.id,
        code,
        name: `Placa ${parsed.data.business_name}`,
        type: "nfc_plate",
        location: parsed.data.location,
        active: parsed.data.status === "active",
        status: parsed.data.status,
        destination_url: validation.sanitizedUrl,
        destination_type: "google_review",
      })
      .select("id,business_id,code,name,type,location,active,status,destination_url,destination_type,created_at")
      .single();

    if (deviceError || !device) {
      console.error("Falha ao criar placa", deviceError?.message);
      await service.from("businesses").delete().eq("id", business.id);
      return NextResponse.json({ error: "Não foi possível cadastrar a placa." }, { status: 500 });
    }

    if (parsed.data.lead_id) {
      const { error: leadError } = await service
        .from("leads")
        .update({
          status: "reserved",
          converted_business_id: business.id,
          converted_device_id: device.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", parsed.data.lead_id);

      if (leadError) {
        console.error("Placa criada, mas falhou ao vincular lead", leadError.message);
      }
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, "");

    return NextResponse.json(
      {
        success: true,
        business,
        plate: { ...device, access_count: 0 },
        urls: {
          nfc: `${appUrl}/t/${device.code}?src=nfc`,
          qr: `${appUrl}/t/${device.code}?src=qr`,
          test: `${appUrl}/t/${device.code}?src=direct`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar placa", error);
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  const denied = authError(auth);
  if (denied) return denied;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase ainda não configurado." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const parsed = updatePlateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const service = createServiceClient();
    const { data: current, error: currentError } = await service
      .from("tap_devices")
      .select("id,business_id")
      .eq("id", parsed.data.id)
      .maybeSingle();

    if (currentError || !current) {
      return NextResponse.json({ error: "Placa não encontrada." }, { status: 404 });
    }

    const deviceUpdate: Record<string, string | boolean> = {};
    const businessUpdate: Record<string, string | null> = {};

    if (parsed.data.location !== undefined) deviceUpdate.location = parsed.data.location;
    if (parsed.data.status !== undefined) {
      deviceUpdate.status = parsed.data.status;
      deviceUpdate.active = parsed.data.status === "active";
    }
    if (parsed.data.business_name !== undefined) {
      businessUpdate.name = parsed.data.business_name;
      deviceUpdate.name = `Placa ${parsed.data.business_name}`;
    }
    if (parsed.data.category !== undefined) businessUpdate.category = parsed.data.category;
    if (parsed.data.city !== undefined) businessUpdate.city = parsed.data.city || null;
    if (parsed.data.state !== undefined) businessUpdate.state = parsed.data.state?.toUpperCase() || null;

    if (parsed.data.destination_url !== undefined) {
      const validation = validateDestinationUrl(parsed.data.destination_url, "google_review");
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      deviceUpdate.destination_url = validation.sanitizedUrl;
      businessUpdate.google_review_url = validation.sanitizedUrl;
    }

    if (Object.keys(deviceUpdate).length === 0 && Object.keys(businessUpdate).length === 0) {
      return NextResponse.json({ error: "Nenhuma alteração informada." }, { status: 400 });
    }

    if (Object.keys(businessUpdate).length > 0) {
      const { error: businessError } = await service
        .from("businesses")
        .update(businessUpdate)
        .eq("id", current.business_id);

      if (businessError) {
        console.error("Falha ao atualizar estabelecimento", businessError.message);
        return NextResponse.json({ error: "Não foi possível atualizar o estabelecimento." }, { status: 500 });
      }
    }

    if (Object.keys(deviceUpdate).length > 0) {
      const { error: deviceError } = await service
        .from("tap_devices")
        .update(deviceUpdate)
        .eq("id", parsed.data.id);

      if (deviceError) {
        console.error("Falha ao atualizar placa", deviceError.message);
        return NextResponse.json({ error: "Não foi possível atualizar a placa." }, { status: 500 });
      }
    }

    const { data: updated, error: updatedError } = await service
      .from("tap_devices")
      .select("id,business_id,code,name,type,location,active,status,destination_url,destination_type,created_at,businesses(id,name,slug,category,city,state,google_review_url)")
      .eq("id", parsed.data.id)
      .single();

    if (updatedError || !updated) {
      return NextResponse.json({ error: "Alteração salva, mas não foi possível recarregar a placa." }, { status: 500 });
    }

    return NextResponse.json({ success: true, plate: updated });
  } catch (error) {
    console.error("Erro ao atualizar placa", error);
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
}
