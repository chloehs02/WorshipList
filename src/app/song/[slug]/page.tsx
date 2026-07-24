import { getSongBySlug } from "@/lib/supabase/queries";
import { PublicSongClient } from "./public-song-client";

export default async function PublicSongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const song = await getSongBySlug(slug);

  return <PublicSongClient song={song} />;
}
