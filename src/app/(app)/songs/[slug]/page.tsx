import Link from "next/link";
import { Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SongDetailClient } from "@/components/songs/song-detail-client";
import { getSongBySlug } from "@/lib/supabase/queries";

export default async function SongDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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

  return <SongDetailClient song={song} />;
}
