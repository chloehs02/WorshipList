"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { SongCategory } from "@/types";

export interface SongInput {
  title: string;
  artist?: string;
  key?: string;
  bpm?: number | null;
  capo?: number;
  category?: SongCategory;
  chordSheet?: string;
  notes?: string;
}

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be logged in to do that.");
  return { supabase, userId: user.id };
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, title: string, ignoreId?: string) {
  const base = slugify(title) || "song";
  let slug = base;
  let attempt = 1;
  // Try a few candidates before giving up and appending a timestamp.
  while (attempt < 8) {
    const query = supabase.from("songs").select("id").eq("slug", slug).limit(1);
    const { data } = await query;
    const taken = (data ?? []).some((row) => row.id !== ignoreId);
    if (!taken) return slug;
    attempt += 1;
    slug = `${base}-${attempt}`;
  }
  return `${base}-${Date.now()}`;
}

export async function createSong(input: SongInput) {
  const { supabase, userId } = await requireUserId();
  const slug = await uniqueSlug(supabase, input.title);

  const { data, error } = await supabase
    .from("songs")
    .insert({
      title: input.title,
      artist: input.artist ?? null,
      key: input.key ?? "C",
      bpm: input.bpm ?? null,
      capo: input.capo ?? 0,
      category: input.category ?? "Worship",
      chords: input.chordSheet ?? "",
      notes: input.notes ?? "",
      owner_id: userId,
      slug,
    })
    .select("slug")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/songs");
  revalidatePath("/dashboard");
  return data.slug as string;
}

export async function updateSong(songId: string, input: SongInput) {
  const { supabase } = await requireUserId();

  const { data, error } = await supabase
    .from("songs")
    .update({
      title: input.title,
      artist: input.artist ?? null,
      key: input.key ?? "C",
      bpm: input.bpm ?? null,
      capo: input.capo ?? 0,
      category: input.category ?? "Worship",
      chords: input.chordSheet ?? "",
      notes: input.notes ?? "",
    })
    .eq("id", songId)
    .select("slug")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/songs");
  revalidatePath(`/songs/${data.slug}`);
  revalidatePath("/dashboard");
  return data.slug as string;
}

export async function deleteSong(songId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase.from("songs").delete().eq("id", songId);
  if (error) throw new Error(error.message);

  revalidatePath("/songs");
  revalidatePath("/dashboard");
}

export async function toggleFavorite(songId: string) {
  const { supabase, userId } = await requireUserId();

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("song_id", songId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("favorites").insert({ user_id: userId, song_id: songId });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/songs");
  revalidatePath("/dashboard");
  return !existing;
}
