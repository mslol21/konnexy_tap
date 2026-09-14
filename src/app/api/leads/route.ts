import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { DEMO_LEADS } from "@/lib/mock-data";
import { Lead } from "@/lib/types";

// Schema de validação Zod para novos leads
const createLeadSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  business_name: z.string().min(2, "Nome da empresa é obrigatório"),
  whatsapp: z.string().min(8, "WhatsApp válido é obrigatório"),
  instagram: z.string().optional().nullable(),
  segment: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  source: z.enum(["instagram", "whatsapp", "facebook", "presencial", "indicacao", "site", "outro"]).default("site"),
  notes: z.string().optional().nullable(),
});

// Memória local de fallback para modo demo ou quando Supabase não estiver configurado
let localLeads: Lead[] = [...DEMO_LEADS];

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = createLeadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, business_name, whatsapp, instagram, segment, city, source, notes } = parsed.data;

    // Se Supabase estiver conectado:
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("leads")
          .insert({
            name,
            business_name,
            whatsapp,
            instagram: instagram || null,
            segment: segment || null,
            city: city || null,
            source,
            status: "new",
            notes: notes || null,
          })
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, lead: data }, { status: 201 });
        }
      } catch {
        // Fallback local
      }
    }

    // Gravação no fallback local
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      business_name,
      whatsapp,
      instagram: instagram || undefined,
      segment: segment || undefined,
      city: city || undefined,
      source,
      status: "new",
      notes: notes || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localLeads = [newLead, ...localLeads];

    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erro interno ao processar lead", message: err?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return NextResponse.json({ leads: data });
      }
    } catch {
      // Fallback
    }
  }

  return NextResponse.json({ leads: localLeads });
}

export async function PATCH(request: NextRequest) {
  try {
    const json = await request.json();
    const { id, status, notes } = json;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = await createClient();
        const updateData: any = { updated_at: new Date().toISOString() };
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const { error } = await supabase.from("leads").update(updateData).eq("id", id);
        if (!error) {
          return NextResponse.json({ success: true });
        }
      } catch {
        // Fallback
      }
    }

    localLeads = localLeads.map((l) =>
      l.id === id ? { ...l, ...(status ? { status } : {}), ...(notes !== undefined ? { notes } : {}) } : l
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar lead" }, { status: 500 });
  }
}
