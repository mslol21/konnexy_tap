import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { validateDestinationUrl, sanitizeSource, isValidDeviceCodeFormat } from "@/lib/security";
import { DEMO_DEVICES, DEMO_BUSINESS } from "@/lib/mock-data";

interface RouteProps { params: Promise<{ code: string }>; }

export async function GET(request: NextRequest, { params }: RouteProps) {
  const { code: rawCode } = await params;
  const url = request.nextUrl;
  if (!rawCode || !isValidDeviceCodeFormat(rawCode)) {
    return NextResponse.redirect(new URL(`/t/${rawCode || "unknown"}/status?reason=not_found`, url), { status: 307 });
  }

  const code = rawCode.toUpperCase().trim();
  const source = sanitizeSource(url.searchParams.get("src"));
  let device: any = null;
  let business: any = null;
  let serviceClient: ReturnType<typeof createServiceClient> | null = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      serviceClient = createServiceClient();
      const { data, error } = await serviceClient.from("tap_devices").select("*, businesses(*)").eq("code", code).maybeSingle();
      if (!error && data) { device = data; business = data.businesses; }
    } catch {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase.from("tap_devices").select("*, businesses(*)").eq("code", code).maybeSingle();
        if (!error && data) { device = data; business = data.businesses; }
      } catch {}
    }
  }

  if (!device && process.env.NODE_ENV !== "production") {
    const foundDemo = DEMO_DEVICES.find((d) => d.code.toUpperCase() === code || d.code.replace("KX-", "").toUpperCase() === code.replace("KX-", ""));
    if (foundDemo) { device = foundDemo; business = DEMO_BUSINESS; }
  }

  if (!device) return NextResponse.redirect(new URL(`/t/${code}/status?reason=not_found`, url), { status: 307 });
  const status = device.status || (device.active ? "active" : "inactive");
  if (status !== "active") return NextResponse.redirect(new URL(`/t/${code}/status?reason=${status}`, url), { status: 307 });

  const experienceMode = device.experience_mode || "direct_review";
  const lastTapCookie = request.cookies.get("otimiza_last_tap")?.value;
  const now = Date.now();
  let isRecentDuplicate = false;
  if (lastTapCookie) {
    const [lastDeviceId, lastTimestampStr] = lastTapCookie.split("_");
    const lastTimestamp = Number.parseInt(lastTimestampStr, 10);
    isRecentDuplicate = lastDeviceId === device.id && Number.isFinite(lastTimestamp) && now - lastTimestamp < 10000;
  }

  if (!isRecentDuplicate && serviceClient) {
    const { error } = await serviceClient.from("events").insert({
      business_id: device.business_id,
      device_id: device.id,
      event_type: experienceMode === "smart_page" ? "page_view" : "review_redirect",
      user_agent: (request.headers.get("user-agent") || "").substring(0, 255),
      referrer: (request.headers.get("referer") || "").substring(0, 255),
      session_id: source,
      source,
    });
    if (error) console.error("Falha ao registrar evento da placa", error.message);
  }

  let destination: string;
  if (experienceMode === "smart_page") {
    if (!business?.slug) return NextResponse.redirect(new URL(`/t/${code}/status?reason=invalid_destination`, url), { status: 307 });
    destination = new URL(`/${business.slug}?device=${encodeURIComponent(device.id)}`, url).toString();
  } else {
    const rawDestination = device.destination_url || business?.google_review_url || (process.env.NODE_ENV !== "production" ? DEMO_BUSINESS.google_review_url : null);
    const validation = validateDestinationUrl(rawDestination, device.destination_type || "google_review");
    if (!validation.isValid) return NextResponse.redirect(new URL(`/t/${code}/status?reason=invalid_destination`, url), { status: 307 });
    destination = validation.sanitizedUrl;
  }

  const response = NextResponse.redirect(destination, { status: 307, headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate", Pragma: "no-cache", Expires: "0" } });
  response.cookies.set("otimiza_last_tap", `${device.id}_${now}`, { maxAge: 60, path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return response;
}
