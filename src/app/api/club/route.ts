import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessId, deviceId, name, phone, birthDate, consent, source } = body;

    if (!consent) {
      return NextResponse.json(
        { error: "Consentimento obrigatório não fornecido." },
        { status: 400 }
      );
    }

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nome e WhatsApp são obrigatórios." },
        { status: 400 }
      );
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createClient();

      // Inserir cliente
      const { data: customerData, error: custError } = await supabase
        .from("customers")
        .insert({
          business_id: businessId,
          name,
          phone,
          birth_date: birthDate || null,
        })
        .select()
        .single();

      if (!custError && customerData) {
        // Registrar consentimento LGPD
        await supabase.from("customer_consents").insert({
          customer_id: customerData.id,
          business_id: businessId,
          consent: true,
          source: source || "public_page",
        });

        // Registrar evento de telemetria
        await supabase.from("events").insert({
          business_id: businessId,
          device_id: deviceId || null,
          event_type: "club_signup",
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true }); // Fallback gracioso
  }
}
