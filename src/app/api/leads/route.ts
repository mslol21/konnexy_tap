import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
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
});

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false as const, status: 401, supabase };
  }

  const { data: adminRecord, error: adminError } = await supabase
    .from("app_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRecord) {
    return { ok: false as const, status: 403, supabase };
  }

  return { ok: true as const, status: 200, supabase };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: "Serviço temporariamente indisponível." }, { status: 503 });
    }

    const body = await request.json();
    const parsed = createLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        ...parsed.data,
        instagram: parsed.data.instagram || null,
        segment: parsed.data.segment || null,
        city: parsed.data.city || null,
        status: "new",
        notes: null,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Falha ao registrar lead", error.message);
      return NextResponse.json({ error: "Não foi possível registrar a reserva." }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.status === 401 ? "Não autenticado." : "Acesso negado." }, { status: auth.status });
  }

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
  if (!auth.ok) {
    return NextResponse.json({ error: auth.status === 401 ? "Não autenticado." : "Acesso negado." }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const parsed = updateLeadSchema.safeParse(body);

    if (!parsed.success || (parsed.data.status === undefined && parsed.data.notes === undefined)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const updateData: Record<string, string | null> = {};
    if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
    if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes;

    const { error } = await auth.supabase
      .from("leads")
      .update(updateData)
      .eq("id", parsed.data.id);

    if (error) {
      return NextResponse.json({ error: "Não foi possível atualizar o lead." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
}
