import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  businessId: z.string().uuid(),
  fullName: z.string().trim().min(2).max(140),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().nullable(),
});

function authError(auth: Awaited<ReturnType<typeof requireAdmin>>) {
  if (auth.ok) return null;
  return NextResponse.json(
    { error: auth.reason === "unauthenticated" ? "Não autenticado." : "Acesso negado." },
    { status: auth.status }
  );
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  const denied = authError(auth);
  if (denied) return denied;

  const businessId = request.nextUrl.searchParams.get("businessId");
  if (!businessId || !z.string().uuid().safeParse(businessId).success) {
    return NextResponse.json({ error: "Estabelecimento inválido." }, { status: 400 });
  }

  const service = createServiceClient();
  const { data: members, error } = await service
    .from("business_members")
    .select("id,business_id,user_id,role,created_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: "Não foi possível carregar os acessos." }, { status: 500 });

  const ids = (members ?? []).map((item) => item.user_id);
  const profilesResult = ids.length
    ? await service.from("profiles").select("id,email,full_name,phone").in("id", ids)
    : { data: [], error: null };

  if (profilesResult.error) return NextResponse.json({ error: "Não foi possível carregar os usuários." }, { status: 500 });

  const byId = new Map((profilesResult.data ?? []).map((profile) => [profile.id, profile]));
  return NextResponse.json({
    members: (members ?? []).map((member) => ({ ...member, profile: byId.get(member.user_id) ?? null })),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  const denied = authError(auth);
  if (denied) return denied;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: issue?.message || "Revise os dados do acesso." }, { status: 400 });
  }

  const { businessId, fullName, email, phone } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const service = createServiceClient();

  const { data: business } = await service
    .from("businesses")
    .select("id,name")
    .eq("id", businessId)
    .maybeSingle();

  if (!business) return NextResponse.json({ error: "Estabelecimento não encontrado." }, { status: 404 });

  const { data: existingProfile } = await service
    .from("profiles")
    .select("id,email,full_name,phone")
    .ilike("email", normalizedEmail)
    .maybeSingle();

  let userId = existingProfile?.id ?? null;
  let invited = false;

  if (!userId) {
    const appUrl = request.nextUrl.origin.replace(/\/$/, "");
    const { data: invitedUser, error: inviteError } = await service.auth.admin.inviteUserByEmail(normalizedEmail, {
      redirectTo: `${appUrl}/login`,
      data: { full_name: fullName, phone: phone || null },
    });

    if (inviteError || !invitedUser.user) {
      return NextResponse.json({ error: "Não foi possível enviar o convite de acesso. Verifique o e-mail e a configuração de autenticação." }, { status: 400 });
    }

    userId = invitedUser.user.id;
    invited = true;

    await service.from("profiles").upsert({
      id: userId,
      email: normalizedEmail,
      full_name: fullName,
      phone: phone?.trim() || null,
    }, { onConflict: "id" });
  } else {
    await service.from("profiles").update({
      full_name: fullName,
      phone: phone?.trim() || null,
    }).eq("id", userId);
  }

  const { error: memberError } = await service.from("business_members").upsert({
    business_id: businessId,
    user_id: userId,
    role: "owner",
  }, { onConflict: "business_id,user_id" });

  if (memberError) {
    return NextResponse.json({ error: "Não foi possível vincular o proprietário ao estabelecimento." }, { status: 500 });
  }

  await service.from("businesses").update({
    contact_name: fullName,
    contact_email: normalizedEmail,
    contact_phone: phone?.trim() || null,
  }).eq("id", businessId);

  return NextResponse.json({
    success: true,
    invited,
    user: { id: userId, email: normalizedEmail, full_name: fullName, phone: phone?.trim() || null, role: "owner" },
    message: invited
      ? "Convite do proprietário enviado. Ele deve abrir o e-mail para definir o acesso."
      : "Conta existente vinculada como proprietária deste estabelecimento.",
  }, { status: invited ? 201 : 200 });
}
