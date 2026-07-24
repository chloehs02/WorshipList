import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSetlistIdByToken } from "@/app/actions/share";
import { PublicSetlistClient } from "./public-setlist-client";
import type { Setlist, SetlistSong } from "@/types";

async function getPublicSetlist(setlistId: string): Promise<Setlist | null> {
  try {
    // Use the admin (service role) client so RLS does not block anonymous reads.
    // This is safe because we're on the server and only reading — never writing.
    const supabase = createAdminClient();

    const { data: setlist } = await supabase
      .from("setlists")
      .select("*, users(name)")
      .eq("id", setlistId)
      .maybeSingle();

    if (!setlist) return null;

    const { data: setlistSongs } = await supabase
      .from("setlist_songs")
      .select("*, songs(*, users(name))")
      .eq("setlist_id", setlistId)
      .order("order_number", { ascending: true });

    return {
      id: setlist.id,
      title: setlist.title,
      date: setlist.date ?? "",
      serviceType: setlist.service_type ?? undefined,
      notes: setlist.notes ?? undefined,
      createdBy: setlist.created_by,
      createdByName: (setlist as any).users?.name ?? "Unknown",
      songs: (setlistSongs ?? []).map(
        (ss): SetlistSong => ({
          id: ss.id,
          setlistId: ss.setlist_id,
          songId: ss.song_id,
          orderNumber: ss.order_number,
          keyOverride: ss.key_override ?? undefined,
          notes: ss.notes ?? undefined,
          song: {
            id: ss.songs.id,
            slug: ss.songs.slug,
            title: ss.songs.title,
            artist: ss.songs.artist ?? "",
            key: ss.songs.key ?? "C",
            bpm: ss.songs.bpm,
            capo: ss.songs.capo ?? 0,
            category: (ss.songs.category ?? "Worship") as any,
            chordSheet: ss.songs.chords ?? "",
            notes: ss.songs.notes ?? "",
            tags: ss.songs.tags ?? [],
            createdBy: ss.songs.owner_id,
            createdByName: (ss.songs as any).users?.name ?? "Unknown",
            createdAt: ss.songs.created_at,
            updatedAt: ss.songs.updated_at,
          },
        })
      ),
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const setlistId = await getSetlistIdByToken(token);
  if (!setlistId) return { title: "Shared Setlist · WorshipFlow" };

  const setlist = await getPublicSetlist(setlistId);
  return {
    title: setlist ? `${setlist.title} · WorshipFlow` : "Shared Setlist · WorshipFlow",
    description: setlist
      ? `View the "${setlist.title}" setlist shared via WorshipFlow`
      : "A shared setlist from WorshipFlow",
  };
}

export default async function SharedSetlistPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const setlistId = await getSetlistIdByToken(token);
  if (!setlistId) notFound();

  const setlist = await getPublicSetlist(setlistId!);

  return <PublicSetlistClient setlist={setlist} />;
}
