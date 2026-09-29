import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { sanitizeSource } from "@/lib/security";

const linkTypes = [
  "google_review",
  "whatsapp",
  "instagram",
  "menu",
  "catalog",
  "booking",
  "website",
  "maps",
  "suggestion",
  "custom",
] as const;

const bodySchema = z.object({
  businessId: z.string().uuid(),
  deviceId: z.string().uuid().nullable().optional(),
  linkId: z.string().max(100).nullable().optional(),
  linkType: z.enum(linkTypes),
  source: z.string().max(20).nullable().optional(),
});

const eventByType: Record<(typeof linkTypes)[number], string> = {
  google_review: "google_click",
  whatsapp: "whatsapp_click",
  instagram: "instagram_click",
  menu: "services_click",
  catalog: "services_click",
  booking: "custom_link_click",
  website: "website_click",
  maps: "maps_click",
  suggestion: "feedback_open",
  custom: "custom_link_click",
};

function isUuid(value?: string | null) {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

export async function POST(request: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
    }

    const { businessId, deviceId, linkId, linkType } = parsed.data;
    const source = sanitizeSource(parsed.data.source);
    const eventType = eventByType[linkType];
    const dedupeKey = `${deviceId || businessId}:${eventType}`;
    const recent = request.cookies.get("otimiza_last_action")?.value;

    if (recent === dedupeKey) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const service = createServiceClient();

    const { data: business } = await service
      .from("businesses")
      .select("id")
      .eq("id", businessId)
      .eq("is_active", true)
      .maybeSingle();

    if (!business) {
      return NextResponse.json({ error: "Estabelecimento não encontrado." }, { status: 404 });
    }

    if (deviceId) {
      const { data: device } = await service
        .from("tap_devices")
        .select("id")
        .eq("id", deviceId)
        .eq("business_id", businessId)
        .eq("status", "active")
        .maybeSingle();

      if (!device) {
        return NextResponse.json({ error: "Placa inválida." }, { status: 400 });
      }
    }

    let persistedLinkId: string | null = null;
    if (isUuid(linkId)) {
      const { data: link } = await service
        .from("business_links")
        .select("id,type,is_active")
        .eq("id", linkId as string)
        .eq("business_id", businessId)
        .maybeSingle();

      if (link?.is_active && link.type === linkType) {
        persistedLinkId = link.id;
      }
    }

    const { error } = await service.from("events").insert({
      business_id: businessId,
      device_id: deviceId || null,
      event_type: eventType,
      link_id: persistedLinkId,
      source,
      session_id: source,
      user_agent: (request.headers.get("user-agent") || "").substring(0, 255),
      referrer: (request.headers.get("referer") || "").substring(0, 255),
    });

    if (error) {
      console.error("Falha ao registrar clique público", error.message);
      return NextResponse.json({ error: "Não foi possível registrar o evento." }, { status: 500 });
    }

    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set("otimiza_last_action", dedupeKey, {
      maxAge: 3,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("Falha ao processar clique público", error);
    return NextResponse.json({ error: "Evento inválido." }, { status: 400 });
  }
}
