import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  business_name: z.string().trim().min(2).max(140),
  whatsapp: z.string().trim().min(8).max(24),
  instagram: z.string().trim().max(120).optional().nullable(),
  segment: z.string().trim().max(100).optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  source: z
    .enum(["instagram", "whatsapp", "facebook", "presencial", "indicacao", "site", "outro"])
    .default("site"),
});

const updateLeadSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "interested", "reserved", "sold", "lost"]).optional(),
  notes: z.string().trim().max(2000).optional().nullable(),
  name: z.string().trim().min(2).max(100).optional(),
  business_name: z.string().trim().min(2).max(140).optional(),
  whatsapp: z.string().trim().min(8).max(24).optional(),
  instagram: z.string().trim().max(120).optional().nullable(),
  segment: z.string().trim().max(100).optional().nullable(),
  city: z.string().trim().max(120).optional().nullable(),
  source: z.enum(["instagram", "whatsapp", "facebook", "presencial", "indicacao", "site", "outro"]).optional(),
});

function adminDenied(auth: Awaited<ReturnType<typeof requireAdmin>>) {
  if (auth.ok) return null;
  const message =
    auth.reason === "config"
      ? "Supabase ainda não configurado."
      : auth.reason === "unauthenticated"
        ? "Não autenticado."
        : "Acesso negado.";
  return NextResponse.json({ error: message }, { status: auth.status });
}

function hasPublicSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!hasPublicSupabaseConfig()) {
      return NextResponse.json({ error: "Serviço temporariamente indisponível." }, { status: 503 });
    }

    const body = await request.json();
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("leads").insert({
      ...parsed.data,
      instagram: parsed.data.instagram || null,
      segment: parsed.data.segment || null,
      city: parsed.data.city || null,
      status: "new",
      notes: null,
      converted_business_id: null,
      converted_device_id: null,
    });

    if (error) {
      console.error("Falha ao registrar lead", error.message);
      return NextResponse.json({ error: "Não foi possível registrar a reserva." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
}

export async function GET() {
  const auth = await requireAdmin();
  const denied = adminDenied(auth);
  if (denied) return denied;
  if (!auth.ok) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

  const { data, error } = await auth.supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Não foi possível carregar os leads." }, { status: 500 });
  }

  return NextResponse.json({ leads: data ?? [] });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  const denied = adminDenied(auth);
  if (denied) return denied;
  if (!auth.ok) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

  try {
    const body = await request.json();
    const parsed = updateLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const { id, ...patch } = parsed.data;
    const updateData = Object.fromEntries(
      Object.entries(patch).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nenhuma alteração informada." }, { status: 400 });
    }

    const { data, error } = await auth.supabase
      .from("leads")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Não foi possível atualizar o lead." }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data });
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
}
