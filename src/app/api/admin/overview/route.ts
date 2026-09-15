import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    const message =
      auth.reason === "config"
        ? "Supabase ainda não configurado."
        : auth.reason === "unauthenticated"
          ? "Não autenticado."
          : "Acesso negado.";
    return NextResponse.json({ error: message }, { status: auth.status });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY ainda não configurada." },
      { status: 503 }
    );
  }

  const service = createServiceClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfSevenDays = new Date();
  startOfSevenDays.setDate(startOfSevenDays.getDate() - 6);
  startOfSevenDays.setHours(0, 0, 0, 0);

  const [
    totalLeadsResult,
    newLeadsResult,
    reservedResult,
    soldResult,
    activeDevicesResult,
    pendingDevicesResult,
    inactiveDevicesResult,
    todayEventsResult,
    sevenDayEventsResult,
    recentLeadsResult,
    recentDevicesResult,
  ] = await Promise.all([
    service.from("leads").select("id", { count: "exact", head: true }),
    service.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    service.from("leads").select("id", { count: "exact", head: true }).eq("status", "reserved"),
    service.from("leads").select("id", { count: "exact", head: true }).eq("status", "sold"),
    service.from("tap_devices").select("id", { count: "exact", head: true }).eq("status", "active"),
    service.from("tap_devices").select("id", { count: "exact", head: true }).eq("status", "pending"),
    service.from("tap_devices").select("id", { count: "exact", head: true }).in("status", ["inactive", "suspended"]),
    service
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "review_redirect")
      .gte("created_at", startOfDay.toISOString()),
    service
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "review_redirect")
      .gte("created_at", startOfSevenDays.toISOString()),
    service
      .from("leads")
      .select("id,name,business_name,whatsapp,city,status,created_at,converted_device_id")
      .order("created_at", { ascending: false })
      .limit(5),
    service
      .from("tap_devices")
      .select("id,code,name,location,status,active,created_at,businesses(name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const errors = [
    totalLeadsResult.error,
    newLeadsResult.error,
    reservedResult.error,
    soldResult.error,
    activeDevicesResult.error,
    pendingDevicesResult.error,
    inactiveDevicesResult.error,
    todayEventsResult.error,
    sevenDayEventsResult.error,
    recentLeadsResult.error,
    recentDevicesResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    console.error("Falha ao carregar visão geral administrativa", errors.map((error) => error?.message));
    return NextResponse.json({ error: "Não foi possível carregar o painel operacional." }, { status: 500 });
  }

  const totalLeads = totalLeadsResult.count ?? 0;
  const sold = soldResult.count ?? 0;

  return NextResponse.json({
    metrics: {
      totalLeads,
      newLeads: newLeadsResult.count ?? 0,
      reserved: reservedResult.count ?? 0,
      sold,
      conversionRate: totalLeads > 0 ? Math.round((sold / totalLeads) * 100) : 0,
      activeDevices: activeDevicesResult.count ?? 0,
      pendingDevices: pendingDevicesResult.count ?? 0,
      inactiveDevices: inactiveDevicesResult.count ?? 0,
      accessesToday: todayEventsResult.count ?? 0,
      accesses7d: sevenDayEventsResult.count ?? 0,
    },
    recentLeads: recentLeadsResult.data ?? [],
    recentDevices: recentDevicesResult.data ?? [],
  });
}
