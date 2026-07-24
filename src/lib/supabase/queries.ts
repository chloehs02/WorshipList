import "server-only";
import { createClient } from "./server";
import type { Song, Setlist, SetlistSong, TeamMember, UserProfile } from "@/types";

function toSong(row: any): Song {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    artist: row.artist ?? "",
    key: row.key ?? "C",
    bpm: row.bpm,
    capo: row.capo ?? 0,
    category: (row.category ?? "Worship") as Song["category"],
    chordSheet: row.chords ?? "",
    notes: row.notes ?? "",
    tags: row.tags ?? [],
    createdBy: row.owner_id,
    createdByName: row.users?.name ?? "Unknown",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isFavorite: !!row.is_favorite,
  };
}

/** Returns the signed-in user's app profile row (public.users), or null if not authenticated. */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();
  if (!data) {
    // Profile row hasn't synced yet (trigger race on first sign-up) — fall back to auth metadata.
    return {
      id: user.id,
      name: (user.user_metadata?.name as string) ?? user.email?.split("@")[0] ?? "You",
      email: user.email ?? "",
      role: "member",
      instrument: null,
      teamId: null,
    };
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    instrument: data.instrument,
    avatarUrl: data.avatar_url,
    teamId: data.team_id,
  };
}

/** All songs the current user owns, plus any explicitly shared with them, with favorite status. */
export async function getSongs(): Promise<Song[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const [{ data: songs }, { data: favorites }] = await Promise.all([
    supabase
      .from("songs")
      .select("*, users(name)")
      .order("updated_at", { ascending: false }),
    supabase.from("favorites").select("song_id").eq("user_id", user.id),
  ]);

  const favoriteIds = new Set((favorites ?? []).map((f) => f.song_id));
  return (songs ?? []).map((row) => toSong({ ...row, is_favorite: favoriteIds.has(row.id) }));
}

export async function getSongBySlug(slug: string): Promise<Song | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: row } = await supabase
    .from("songs")
    .select("*, users(name)")
    .eq("slug", slug)
    .maybeSingle();
  if (!row) return null;

  let isFavorite = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("song_id", row.id)
      .maybeSingle();
    isFavorite = !!fav;
  }

  return toSong({ ...row, is_favorite: isFavorite });
}

export async function getSetlists(): Promise<Setlist[]> {
  const supabase = await createClient();
  const { data: setlists } = await supabase
    .from("setlists")
    .select("*, users(name)")
    .order("date", { ascending: false });

  if (!setlists || setlists.length === 0) return [];

  const setlistIds = setlists.map((s) => s.id);
  const { data: setlistSongs } = await supabase
    .from("setlist_songs")
    .select("*, songs(*, users(name))")
    .in("setlist_id", setlistIds)
    .order("order_number", { ascending: true });

  return setlists.map((s) => ({
    id: s.id,
    title: s.title,
    date: s.date ?? "",
    serviceType: s.service_type ?? undefined,
    notes: s.notes ?? undefined,
    createdBy: s.created_by,
    createdByName: (s as any).users?.name ?? "Unknown",
    songs: (setlistSongs ?? [])
      .filter((ss) => ss.setlist_id === s.id)
      .map(
        (ss): SetlistSong => ({
          id: ss.id,
          setlistId: ss.setlist_id,
          songId: ss.song_id,
          orderNumber: ss.order_number,
          keyOverride: ss.key_override ?? undefined,
          notes: ss.notes ?? undefined,
          song: toSong((ss as any).songs),
        })
      ),
  }));
}

export async function getSetlistById(id: string): Promise<Setlist | null> {
  const all = await getSetlists();
  return all.find((s) => s.id === id) ?? null;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const profile = await getCurrentUserProfile();
  if (!profile?.teamId) return profile ? [{ id: profile.id, name: profile.name, email: profile.email, instrument: profile.instrument ?? "", role: profile.role === "leader" ? "leader" : "member" }] : [];

  const { data } = await supabase.from("users").select("*").eq("team_id", profile.teamId);
  return (data ?? []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatarUrl: u.avatar_url,
    instrument: u.instrument ?? "",
    role: u.role === "leader" ? "leader" : "member",
  }));
}
