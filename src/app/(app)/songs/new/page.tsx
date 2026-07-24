import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { SongEditorForm } from "@/components/songs/song-editor-form";

export default function NewSongPage() {
  return (
    <>
      <Topbar title="New Song" />
      <div className="flex-1 px-5 py-6 md:px-8">
        <Link href="/songs" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to library
        </Link>
        <h1 className="mb-6 font-display text-2xl font-bold">Add a new song</h1>
        <SongEditorForm />
      </div>
    </>
  );
}
