import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Acesso negado." }, { status: auth.status });
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("business_experiences").select("*").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ experiences: data ?? [] });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "Acesso negado." }, { status: auth.status });

  const body = await request.json();
  const businessId = typeof body.business_id === "string" ? body.business_id : "";
  if (!businessId) return NextResponse.json({ error: "Empresa inválida." }, { status: 400 });

  const allowed = ["google_enabled","whatsapp_enabled","services_enabled","maps_enabled","wifi_enabled","feedback_enabled","promotions_enabled","instagram_enabled","website_enabled","wifi_ssid","wifi_password"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) if (key in body) updates[key] = body[key];
  if ("wifi_ssid" in updates && typeof updates.wifi_ssid === "string") updates.wifi_ssid = updates.wifi_ssid.trim().slice(0, 100);
  if ("wifi_password" in updates && typeof updates.wifi_password === "string") updates.wifi_password = updates.wifi_password.slice(0, 128);

  const supabase = createServiceClient();
  const { data, error } = await supabase.from("business_experiences").upsert({ business_id: businessId, ...updates }, { onConflict: "business_id" }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ experience: data });
}
