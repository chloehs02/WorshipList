"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Sparkles, Gauge, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { TransposeController } from "@/components/songs/transpose-controller";
import { ChordRenderer } from "@/components/songs/chord-renderer";
import { ViewerToolbar } from "@/components/songs/viewer-toolbar";
import { getSongBySlug } from "@/lib/data/mock-songs";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { useFontScale } from "@/hooks/use-large-text-mode";
import { cn } from "@/lib/utils";

export default function PublicSongPage() {
  const params = useParams<{ slug: string }>();
  const song = getSongBySlug(params.slug);
  const [semitones, setSemitones] = React.useState(0);
  const [stageMode, setStageMode] = React.useState(false);
  const viewerRef = React.useRef<HTMLDivElement>(null);
  const { scale, increase, decrease } = useFontScale(1);
  const { isScrolling, toggle, speed, setSpeed } = useAutoScroll(viewerRef);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold">WorshipFlow</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/login">Open in app</Link>
          </Button>
        </div>
      </header>

      {!song ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
          <Music2 className="h-10 w-10 text-muted-foreground" />
          <p className="font-display text-lg font-semibold">This song link doesn&apos;t exist</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      ) : (
        <div className={cn("mx-auto max-w-3xl space-y-5 px-5 py-8 md:px-8", stageMode && "stage-mode")}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{song.title}</h1>
              <p className="mt-1 text-muted-foreground">{song.artist}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{song.category}</Badge>
                {song.bpm && (
                  <Badge variant="outline" className="gap-1">
                    <Gauge className="h-3 w-3" /> {song.bpm} BPM
                  </Badge>
                )}
                {song.capo > 0 && <Badge variant="outline">Capo {song.capo}</Badge>}
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
          />

          <Card className={cn(stageMode && "bg-[#0c0714] text-white border-transparent")}>
            <CardContent ref={viewerRef} className={cn("max-h-[70vh] overflow-y-auto p-6 sm:p-8", isScrolling && "auto-scroll-active")}>
              <ChordRenderer chordSheet={song.chordSheet} songKey={song.key} semitones={semitones} fontScale={scale} />
            </CardContent>
          </Card>

          <p className="pb-8 text-center text-xs text-muted-foreground">
            Shared via WorshipFlow · Viewer access
          </p>
        </div>
      )}
    </div>
  );
}
