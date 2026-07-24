import { createBrowserClient } from "@supabase/ssr";

/**
 * Unauthenticated (anon) Supabase client for use in public pages.
 * Uses the public anon key only — no session cookies are needed.
 * This allows anonymous users to read publicly-accessible data.
 */
export function createPublicClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}
