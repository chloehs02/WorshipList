"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be logged in to do that.");
  return { supabase, userId: user.id };
}

export async function createSetlist(input: { title: string; date: string; notes?: string; serviceType?: string }) {
  const { supabase, userId } = await requireUserId();

  const { data, error } = await supabase
    .from("setlists")
    .insert({
      title: input.title,
      date: input.date,
      notes: input.notes ?? "",
      service_type: input.serviceType ?? null,
      created_by: userId,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/setlists");
  revalidatePath("/dashboard");
  return data.id as string;
}

export async function deleteSetlist(setlistId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase.from("setlists").delete().eq("id", setlistId);
  if (error) throw new Error(error.message);

  revalidatePath("/setlists");
  revalidatePath("/dashboard");
}

export async function addSongToSetlist(setlistId: string, songId: string) {
  const { supabase } = await requireUserId();

  const { count } = await supabase
    .from("setlist_songs")
    .select("id", { count: "exact", head: true })
    .eq("setlist_id", setlistId);

  const { error } = await supabase.from("setlist_songs").insert({
    setlist_id: setlistId,
    song_id: songId,
    order_number: (count ?? 0) + 1,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/setlists/${setlistId}`);
}

export async function removeSongFromSetlist(setlistSongId: string, setlistId: string) {
  const { supabase } = await requireUserId();
  const { error } = await supabase.from("setlist_songs").delete().eq("id", setlistSongId);
  if (error) throw new Error(error.message);
  revalidatePath(`/setlists/${setlistId}`);
}

/** Persists a full reorder: array of setlist_song ids in their new display order. */
export async function reorderSetlistSongs(setlistId: string, orderedSetlistSongIds: string[]) {
  const { supabase } = await requireUserId();

  await Promise.all(
    orderedSetlistSongIds.map((id, index) =>
      supabase.from("setlist_songs").update({ order_number: index + 1 }).eq("id", id)
    )
  );

  revalidatePath(`/setlists/${setlistId}`);
}
