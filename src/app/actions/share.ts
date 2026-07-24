"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Generates (or retrieves) a UUID share token for a given setlist.
 * The token is stored in `share_links` table for indirection.
 * If Supabase isn't configured or the table doesn't exist, the setlist
 * UUID itself is used directly as the token.
 *
 * Uses the auth client for INSERT (so RLS can verify the user owns the setlist)
 * and the admin client for SELECT (so the lookup always works).
 */
export async function getOrCreateShareToken(setlistId: string): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Demo / local mode: just return the setlist id as the token
  if (!url || !key) return setlistId;

  try {
    // Use admin client to look up existing token (bypasses RLS on share_links)
    const admin = createAdminClient();
    const { data: existing } = await admin
      .from("share_links")
      .select("token")
      .eq("setlist_id", setlistId)
      .maybeSingle();

    if (existing?.token) return existing.token as string;

    // No existing link — create one with a new UUID using the auth client
    // so RLS can enforce that only the setlist owner can create share links.
    const supabase = await createClient();
    const token = crypto.randomUUID();
    const { error } = await supabase.from("share_links").insert({
      token,
      setlist_id: setlistId,
    });

    if (error) {
      // Table may not exist yet — fall back to setlist ID as token
      console.warn("share_links insert failed, falling back to setlist id:", error.message);
      return setlistId;
    }

    return token;
  } catch {
    return setlistId;
  }
}

/**
 * Looks up the setlist ID for a given share token.
 * Uses the admin client so anon users can resolve tokens.
 */
export async function getSetlistIdByToken(token: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Demo mode: the token IS the setlist id
  if (!url || !key) return token;

  try {
    // Use admin client — anon users need to resolve tokens too
    const admin = createAdminClient();
    const { data } = await admin
      .from("share_links")
      .select("setlist_id")
      .eq("token", token)
      .maybeSingle();

    // If share_links table exists and we found a row, return the setlist_id
    if (data?.setlist_id) return data.setlist_id as string;

    // Fallback: treat token as a raw setlist UUID (e.g., before migration is run)
    return token;
  } catch {
    return token;
  }
}
