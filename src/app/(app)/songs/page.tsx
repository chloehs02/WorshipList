import Link from "next/link";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { SongLibraryClient } from "@/components/songs/song-library-client";
import { getSongs } from "@/lib/supabase/queries";

export default async function SongLibraryPage() {
  const songs = await getSongs();

  return (
    <>
      <Topbar
        title="Song Library"
        actions={
          <Button asChild size="sm" className="gap-1.5 rounded-full">
            <Link href="/songs/new">
              <Plus className="h-3.5 w-3.5" /> New song
            </Link>
          </Button>
        }
      />
      <SongLibraryClient initialSongs={songs} />
    </>
  );
}
