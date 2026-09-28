import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: membership, error: membershipError } = await supabase
    .from("business_members")
    .select("business_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError || !membership) {
    return NextResponse.json({ error: "Nenhum estabelecimento vinculado." }, { status: 404 });
  }

  const [{ data: business, error: businessError }, { data: devices, error: devicesError }] = await Promise.all([
    supabase
      .from("businesses")
      .select("id,name,slug,category,city,state,is_active")
      .eq("id", membership.business_id)
      .maybeSingle(),
    supabase
      .from("tap_devices")
      .select("id,business_id,code,name,type,location,active,status,destination_url,destination_type,experience_mode,created_at")
      .eq("business_id", membership.business_id)
      .order("created_at", { ascending: false }),
  ]);

  if (businessError || devicesError || !business) {
    return NextResponse.json({ error: "Não foi possível carregar a conta." }, { status: 500 });
  }

  return NextResponse.json({
    business,
    role: membership.role,
    devices: devices ?? [],
  });
}
