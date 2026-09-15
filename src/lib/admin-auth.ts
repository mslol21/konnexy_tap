import { createClient } from "@/lib/supabase/server";

export type AdminAuthResult =
  | { ok: true; status: 200; supabase: Awaited<ReturnType<typeof createClient>>; userId: string }
  | { ok: false; status: 401 | 403 | 503; reason: "config" | "unauthenticated" | "forbidden" };

/**
 * Valida uma sessão autenticada e confirma se o usuário consta em app_admins.
 * Deve ser chamado somente em código server-side.
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { ok: false, status: 503, reason: "config" };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, status: 401, reason: "unauthenticated" };
  }

  const { data: adminRecord, error: adminError } = await supabase
    .from("app_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !adminRecord) {
    return { ok: false, status: 403, reason: "forbidden" };
  }

  return { ok: true, status: 200, supabase, userId: user.id };
}
