import { createBrowserClient } from "@supabase/ssr";

function getPublicSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-public-key"
  );
}

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-konnexy.supabase.co";
  const supabasePublicKey = getPublicSupabaseKey();

  return createBrowserClient(supabaseUrl, supabasePublicKey);
}
