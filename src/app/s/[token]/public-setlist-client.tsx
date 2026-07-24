"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Music2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Gauge,
  Hash,
  ListMusic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { TransposeController } from "@/components/songs/transpose-controller";
import { ChordRenderer } from "@/components/songs/chord-renderer";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Setlist, SetlistSong } from "@/types";

interface SongRowProps {
  item: SetlistSong;
  index: number;
}

function SongRow({ item, index }: SongRowProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [semitones, setSemitones] = React.useState(0);
  const song = item.song;
  const effectiveKey = item.keyOverride ?? song.key;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
        aria-expanded={expanded}
      >
        {/* Index number */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
          {index + 1}
        </span>

        {/* Song info */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{song.title}</p>
          <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
        </div>

        {/* Badges */}
        <div className="hidden items-center gap-2 sm:flex">
          <Badge variant="secondary" className="text-xs">
            {effectiveKey}
          </Badge>
          {song.bpm && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Gauge className="h-3 w-3" />
              {song.bpm}
            </Badge>
          )}
          {song.capo > 0 && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Hash className="h-3 w-3" />
              Capo {song.capo}
            </Badge>
          )}
        </div>

        {/* Expand toggle */}
        <span className="ml-2 shrink-0 text-muted-foreground">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {/* Expanded chord sheet */}
      {expanded && (
        <div className="border-t border-border px-5 pb-6 pt-4">
          {/* Mobile badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:hidden">
            <Badge variant="secondary">{effectiveKey}</Badge>
            {song.bpm && (
              <Badge variant="outline" className="gap-1">
                <Gauge className="h-3 w-3" />
                {song.bpm} BPM
              </Badge>
            )}
            {song.capo > 0 && <Badge variant="outline">Capo {song.capo}</Badge>}
          </div>

          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-muted-foreground">Chords & Lyrics</p>
            <TransposeController
              originalKey={effectiveKey}
              semitones={semitones}
              onChange={setSemitones}
            />
          </div>

          {song.chordSheet ? (
            <div className="max-h-[60vh] overflow-y-auto rounded-xl bg-secondary/30 p-4">
              <ChordRenderer
                chordSheet={song.chordSheet}
                songKey={effectiveKey}
                semitones={semitones}
                fontScale={1}
              />
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No chord sheet available for this song.
            </p>
          )}

          {song.notes && (
            <div className="mt-4 rounded-xl bg-accent/5 p-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">Notes</p>
              <p className="text-sm text-muted-foreground">{song.notes}</p>
            </div>
          )}
          {item.notes && (
            <div className="mt-3 rounded-xl bg-secondary/50 p-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Setlist note
              </p>
              <p className="text-sm text-muted-foreground">{item.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PublicSetlistClient({ setlist }: { setlist: Setlist | null }) {
  const totalSongs = setlist?.songs.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-5 py-3 backdrop-blur-md md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-bold">WorshipFlow</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="hidden rounded-full sm:flex">
            <Link href="/register">Get started free</Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      {!setlist ? (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-32 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <ListMusic className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-display text-xl font-semibold">This setlist link doesn&apos;t exist</p>
          <p className="max-w-sm text-muted-foreground">
            The link may have expired or the setlist has been deleted.
          </p>
          <Button asChild variant="outline" className="mt-2 rounded-full">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      ) : (
        <main className="mx-auto max-w-3xl space-y-6 px-5 py-8 md:px-8">
          {/* Setlist header */}
          <Card className="overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary/60" />
            <CardHeader className="pb-3 pt-5">
              <div className="flex items-center gap-2 text-sm font-medium text-accent">
                <CalendarDays className="h-4 w-4" />
                {formatDate(setlist.date)}
                {setlist.serviceType && <span className="text-muted-foreground">· {setlist.serviceType}</span>}
              </div>
              <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{setlist.title}</h1>
              {setlist.notes && (
                <p className="mt-2 max-w-xl text-muted-foreground">{setlist.notes}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="gap-1.5">
                  <Music2 className="h-3 w-3" />
                  {totalSongs} {totalSongs === 1 ? "song" : "songs"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  by {setlist.createdByName}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Song list */}
          {setlist.songs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              This setlist has no songs yet.
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Tap any song to expand chords &amp; lyrics
              </p>
              {setlist.songs.map((item, idx) => (
                <SongRow key={item.id} item={item} index={idx} />
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border pt-6 pb-10 text-center">
            <p className="text-xs text-muted-foreground">
              Shared via{" "}
              <Link href="/" className="text-accent underline-offset-2 hover:underline">
                WorshipFlow
              </Link>{" "}
              · Viewer access only
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Want to manage your own worship setlists?{" "}
              <Link href="/register" className="font-medium text-accent underline-offset-2 hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
