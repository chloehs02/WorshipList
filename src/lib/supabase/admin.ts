import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase admin client using the service role key.
 * Bypasses Row Level Security — use ONLY in server-side code for
 * operations that must succeed regardless of user session (e.g., public
 * share link reads).
 *
 * Never expose this client or the service role key to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    // Fall back to anon key if service role key isn't configured.
    // This means RLS will apply — public reads may fail until the
    // share_links migration has been run and RLS policies updated.
    return createSupabaseClient(
      url ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
