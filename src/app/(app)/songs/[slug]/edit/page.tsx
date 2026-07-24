import Link from "next/link";
import { ArrowLeft, Music2 } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { SongEditorForm } from "@/components/songs/song-editor-form";
import { getSongBySlug } from "@/lib/supabase/queries";

export default async function EditSongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const song = await getSongBySlug(slug);

  if (!song) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <Music2 className="h-10 w-10 text-muted-foreground" />
        <p className="font-display text-lg font-semibold">Song not found</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/songs">Back to library</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Topbar title={`Edit · ${song.title}`} />
      <div className="flex-1 px-5 py-6 md:px-8">
        <Link
          href={`/songs/${song.slug}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to song
        </Link>
        <h1 className="mb-6 font-display text-2xl font-bold">Edit song</h1>
        <SongEditorForm initialSong={song} />
      </div>
    </>
  );
}
