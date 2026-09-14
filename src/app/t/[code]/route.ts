import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateDestinationUrl, sanitizeSource, isValidDeviceCodeFormat } from "@/lib/security";
import { DEMO_DEVICE, DEMO_DEVICES, DEMO_BUSINESS } from "@/lib/mock-data";

interface RouteProps {
  params: Promise<{ code: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const { code: rawCode } = await params;
  const url = request.nextUrl;

  if (!rawCode || !isValidDeviceCodeFormat(rawCode)) {
    return NextResponse.redirect(new URL(`/t/${rawCode || "unknown"}/status?reason=not_found`, url), {
      status: 307,
    });
  }

  const code = rawCode.toUpperCase().trim();
  const rawSrc = url.searchParams.get("src");
  const source = sanitizeSource(rawSrc);

  let device = null;
  let business = null;

  // 1. Busca no Supabase quando variáveis de ambiente configuradas
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("tap_devices")
        .select("*, businesses(*)")
        .eq("code", code)
        .maybeSingle();

      if (!error && data) {
        device = data;
        business = data.businesses;
      }
    } catch {
      // Continua para fallback
    }
  }

  // 2. Fallback para demonstração / código local
  if (!device) {
    const foundDemo = DEMO_DEVICES.find(
      (d) => d.code.toUpperCase() === code || d.code.replace("KX-", "").toUpperCase() === code.replace("KX-", "")
    );
    if (foundDemo) {
      device = foundDemo;
      business = DEMO_BUSINESS;
    }
  }

  // 3. Placa não encontrada
  if (!device) {
    return NextResponse.redirect(new URL(`/t/${code}/status?reason=not_found`, url), {
      status: 307,
    });
  }

  // 4. Verificação de status da placa (pending, inactive, suspended)
  const status = device.status || (device.active ? "active" : "inactive");
  if (status !== "active") {
    return NextResponse.redirect(new URL(`/t/${code}/status?reason=${status}`, url), {
      status: 307,
    });
  }

  // 5. Obtenção do destino Google Reviews
  const rawDestination =
    device.destination_url ||
    business?.google_review_url ||
    DEMO_BUSINESS.google_review_url;

  // 6. Validação rigorosa de segurança contra Open Redirect
  const validation = validateDestinationUrl(
    rawDestination,
    device.destination_type || "google_review"
  );

  if (!validation.isValid) {
    return NextResponse.redirect(
      new URL(`/t/${code}/status?reason=invalid_destination`, url),
      { status: 307 }
    );
  }

  // 7. Deduplicação e registro de telemetria server-side
  const lastTapCookie = request.cookies.get("kx_last_tap")?.value;
  const now = Date.now();
  let isRecentDuplicate = false;

  if (lastTapCookie) {
    const [lastDeviceId, lastTimestampStr] = lastTapCookie.split("_");
    const lastTimestamp = parseInt(lastTimestampStr, 10);
    // Se for o mesmo dispositivo em menos de 10 segundos, não contabiliza duplicata
    if (lastDeviceId === device.id && !isNaN(lastTimestamp) && now - lastTimestamp < 10000) {
      isRecentDuplicate = true;
    }
  }

  if (!isRecentDuplicate) {
    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";

    // Registro assíncrono server-side no Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      createClient()
        .then((supabase) => {
          return supabase.from("events").insert({
            business_id: device.business_id,
            device_id: device.id,
            event_type: "review_redirect",
            user_agent: userAgent.substring(0, 255),
            referrer: referrer.substring(0, 255),
            session_id: source,
          });
        })
        .catch(() => {});
    }
  }

  // 8. Redirecionamento temporário instantâneo HTTP 307 para o Google Reviews
  const response = NextResponse.redirect(validation.sanitizedUrl, {
    status: 307,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  // Grava cookie para evitar spam de reload (expira em 60 segundos)
  response.cookies.set("kx_last_tap", `${device.id}_${now}`, {
    maxAge: 60,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
