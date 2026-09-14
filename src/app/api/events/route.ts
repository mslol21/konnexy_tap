import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessId, deviceId, eventType, linkId, sessionId } = body;

    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";

    // Se Supabase estiver conectado, salvar no banco
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createClient();
      await supabase.from("events").insert({
        business_id: businessId,
        device_id: deviceId || null,
        event_type: eventType,
        link_id: linkId || null,
        session_id: sessionId || null,
        user_agent: userAgent.substring(0, 255),
        referrer: referrer.substring(0, 255),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 200 }); // Não quebrar a navegação do cliente
  }
}
