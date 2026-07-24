"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Gauge } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "./favorite-button";
import { TransposeController } from "./transpose-controller";
import { ChordRenderer } from "./chord-renderer";
import { TwoColumnChordRenderer } from "./two-column-chord-renderer";
import { ViewerToolbar } from "./viewer-toolbar";
import { ShareModal } from "@/components/sharing/share-modal";
import { toggleFavorite, deleteSong } from "@/app/actions/songs";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { useFontScale } from "@/hooks/use-large-text-mode";
import { cn } from "@/lib/utils";
import type { Song } from "@/types";

export function SongDetailClient({ song: initialSong }: { song: Song }) {
  const router = useRouter();
  const [song, setSong] = React.useState(initialSong);
  const [semitones, setSemitones] = React.useState(0);
  const [stageMode, setStageMode] = React.useState(false);
  const [twoColumn, setTwoColumn] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const viewerRef = React.useRef<HTMLDivElement>(null);
  const { scale, increase, decrease } = useFontScale(1);
  const { isScrolling, toggle, speed, setSpeed, stop } = useAutoScroll(viewerRef);

  async function handleToggleFavorite() {
    setSong((s) => ({ ...s, isFavorite: !s.isFavorite }));
    try {
      await toggleFavorite(song.id);
    } catch (err) {
      setSong((s) => ({ ...s, isFavorite: !s.isFavorite }));
      toast.error(err instanceof Error ? err.message : "Couldn't update favorite");
    }
  }

  async function handleDelete() {
    stop();
    setDeleting(true);
    try {
      await deleteSong(song.id);
      toast.success(`"${song.title}" removed from your library`);
      router.push("/songs");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete this song");
      setDeleting(false);
    }
  }

  return (
    <>
      <Topbar
        title={song.title}
        actions={
          <div className="hidden items-center gap-2 md:flex">
            <ShareModal resourceId={song.slug} resourceType="song" title={song.title} />
            <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-full">
              <Link href={`/songs/${song.slug}/edit`}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
            </Button>
          </div>
        }
      />

      <div className={cn("flex-1 space-y-5 px-5 py-6 md:px-8", stageMode && "stage-mode")}>
        <Link href="/songs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to library
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{song.title}</h1>
              <FavoriteButton active={!!song.isFavorite} onToggle={handleToggleFavorite} />
            </div>
            <p className="mt-1 text-muted-foreground">{song.artist}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{song.category}</Badge>
              {song.bpm && (
                <Badge variant="outline" className="gap-1">
                  <Gauge className="h-3 w-3" /> {song.bpm} BPM
                </Badge>
              )}
              {song.capo > 0 && <Badge variant="outline">Capo {song.capo}</Badge>}
              <span className="text-xs text-muted-foreground">Added by {song.createdByName}</span>
            </div>
          </div>

          <TransposeController originalKey={song.key} semitones={semitones} onChange={setSemitones} />
        </div>

        <ViewerToolbar
          fontScale={scale}
          onIncrease={increase}
          onDecrease={decrease}
          stageMode={stageMode}
          onToggleStageMode={() => setStageMode((v) => !v)}
          isScrolling={isScrolling}
          onToggleScroll={toggle}
          scrollSpeed={speed}
          onScrollSpeedChange={setSpeed}
          twoColumn={twoColumn}
          onToggleTwoColumn={() => setTwoColumn((v) => !v)}
        />

        <Card className={cn(stageMode && "bg-[#0c0714] text-white border-transparent")}>
          <CardContent
            ref={viewerRef}
            className={cn("max-h-[65vh] overflow-y-auto p-6 sm:p-8", isScrolling && "auto-scroll-active")}
          >
            {twoColumn ? (
              <TwoColumnChordRenderer
                chordSheet={song.chordSheet}
                songKey={song.key}
                semitones={semitones}
                fontScale={scale}
              />
            ) : (
              <ChordRenderer
                chordSheet={song.chordSheet}
                songKey={song.key}
                semitones={semitones}
                fontScale={scale}
              />
            )}
          </CardContent>
        </Card>

        {song.notes && (
          <Card>
            <CardContent className="p-5">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
              <p className="text-sm leading-relaxed">{song.notes}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-2 md:hidden">
          <ShareModal resourceId={song.slug} resourceType="song" title={song.title} trigger={<Button variant="outline" className="flex-1 rounded-full">Share</Button>} />
          <Button asChild variant="outline" className="flex-1 gap-1.5 rounded-full">
            <Link href={`/songs/${song.slug}/edit`}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={deleting}
          className="gap-1.5 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5" /> {deleting ? "Deleting..." : "Delete song"}
        </Button>
      </div>
    </>
  );
}
