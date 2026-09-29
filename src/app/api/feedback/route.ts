import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const businessId = typeof body.businessId === "string" ? body.businessId : "";
    const deviceId = typeof body.deviceId === "string" ? body.deviceId : null;
    const rating = Number(body.rating);
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 1500) : "";

    if (!businessId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Feedback inválido." }, { status: 400 });
    }

    const throttleCookie = `otimiza_feedback_${businessId.slice(0, 8)}`;
    if (request.cookies.get(throttleCookie)?.value === "1") {
      return NextResponse.json({ error: "Aguarde um pouco antes de enviar outro feedback." }, { status: 429 });
    }

    const supabase = createServiceClient();
    const { data: business } = await supabase.from("businesses").select("id").eq("id", businessId).eq("is_active", true).maybeSingle();
    if (!business) return NextResponse.json({ error: "Estabelecimento não encontrado." }, { status: 404 });

    if (deviceId) {
      const { data: device } = await supabase
        .from("tap_devices")
        .select("id")
        .eq("id", deviceId)
        .eq("business_id", businessId)
        .eq("status", "active")
        .maybeSingle();
      if (!device) return NextResponse.json({ error: "Placa inválida." }, { status: 400 });
    }

    const { error } = await supabase.from("feedbacks").insert({
      business_id: businessId,
      device_id: deviceId,
      rating,
      message: message || null,
      status: "new",
    });
    if (error) throw error;

    await supabase.from("events").insert({
      business_id: businessId,
      device_id: deviceId,
      event_type: "suggestion_sent",
      user_agent: (request.headers.get("user-agent") || "").substring(0, 255),
      referrer: (request.headers.get("referer") || "").substring(0, 255),
    });

    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set(throttleCookie, "1", {
      maxAge: 60,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("Falha ao salvar feedback", error);
    return NextResponse.json({ error: "Não foi possível enviar o feedback." }, { status: 500 });
  }
}
