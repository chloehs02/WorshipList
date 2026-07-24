"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Save, Wand2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChordRenderer } from "./chord-renderer";
import { songCategories, songKeys } from "@/lib/data/mock-songs";
import { tidyChordSheet } from "@/lib/chords/format";
import { useCurrentUser } from "@/components/providers/user-provider";
import { createSong, updateSong } from "@/app/actions/songs";
import type { Song, SongCategory } from "@/types";

const PLACEHOLDER_SHEET = `## Verse 1
[G]Type your lyrics here, wrap [C]chords in brackets
[Em]Section headers use ## before the [D]label

## Chorus
[C]This is how a chorus [G]looks
[D]Clean and easy to [G]read`;

interface SongEditorFormProps {
  initialSong?: Song;
}

export function SongEditorForm({ initialSong }: SongEditorFormProps) {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const isEditing = !!initialSong;

  const [title, setTitle] = React.useState(initialSong?.title ?? "");
  const [artist, setArtist] = React.useState(initialSong?.artist ?? "");
  const [key, setKey] = React.useState(initialSong?.key ?? "G");
  const [bpm, setBpm] = React.useState(initialSong?.bpm?.toString() ?? "");
  const [capo, setCapo] = React.useState(initialSong?.capo?.toString() ?? "0");
  const [category, setCategory] = React.useState<SongCategory>(initialSong?.category ?? "Worship");
  const [chordSheet, setChordSheet] = React.useState(initialSong?.chordSheet ?? PLACEHOLDER_SHEET);
  const [notes, setNotes] = React.useState(initialSong?.notes ?? "");
  const [saving, setSaving] = React.useState(false);

  function handleFormat() {
    setChordSheet((prev) => tidyChordSheet(prev));
    toast.success("Chord sheet cleaned up");
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;

    const tidied = tidyChordSheet(pasted);
    if (tidied.trim() === pasted.trim()) return; // nothing to convert — let the normal paste happen

    e.preventDefault();
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const nextValue = chordSheet.slice(0, start) + tidied + chordSheet.slice(end);
    setChordSheet(nextValue);
    toast.success("Pasted chords auto-formatted into chord sheet notation");

    const cursor = start + tidied.length;
    requestAnimationFrame(() => {
      target.selectionStart = target.selectionEnd = cursor;
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Give this song a title first");
      return;
    }
    setSaving(true);

    try {
      const input = {
        title: title.trim(),
        artist: artist.trim(),
        key,
        bpm: bpm ? Number(bpm) : null,
        capo: capo ? Number(capo) : 0,
        category,
        chordSheet,
        notes,
      };

      const slug = isEditing ? await updateSong(initialSong!.id, input) : await createSong(input);

      toast.success(isEditing ? "Song updated" : "Song added to your library");
      router.push(`/songs/${slug}`);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't save this song — try again.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Song title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goodness of God" required />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Artist</Label>
            <Input value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Original artist or writer" />
          </div>
          <div className="space-y-1.5">
            <Label>Key</Label>
            <Select value={key} onValueChange={setKey}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {songKeys.map((k) => (
                  <SelectItem key={k} value={k}>{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as SongCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {songCategories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Tempo (BPM)</Label>
            <Input type="number" min={0} value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="120" />
          </div>
          <div className="space-y-1.5">
            <Label>Capo</Label>
            <Input type="number" min={0} max={11} value={capo} onChange={(e) => setCapo(e.target.value)} placeholder="0" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5">
              <Wand2 className="h-3.5 w-3.5" /> Chords &amp; Lyrics
            </Label>
            <Button type="button" variant="outline" size="sm" className="h-7 gap-1.5 rounded-full text-xs" onClick={handleFormat}>
              <Sparkles className="h-3 w-3" /> Format
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste a chord sheet in the traditional format (chords on their own line above the lyrics) and it&apos;s
            auto-converted. Or type manually — wrap chords in brackets:{" "}
            <code className="rounded bg-secondary px-1 py-0.5">[G]Amazing grace</code>. Use{" "}
            <code className="rounded bg-secondary px-1 py-0.5">## Verse 1</code> for section labels.
          </p>
          <Textarea
            value={chordSheet}
            onChange={(e) => setChordSheet(e.target.value)}
            onPaste={handlePaste}
            className="min-h-[280px] font-mono text-sm"
            spellCheck={false}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Performance notes for the team..."
            className="min-h-[90px]"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving} className="gap-2 rounded-full">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : isEditing ? "Save changes" : "Add song"}
          </Button>
          <Button type="button" variant="ghost" className="rounded-full" onClick={() => router.back()}>
            Cancel
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">
            {isEditing ? `Last updated by ${initialSong?.createdByName}` : `Creating as ${currentUser.name}`}
          </span>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live preview</p>
        <Card>
          <CardContent className="max-h-[70vh] overflow-y-auto p-6">
            <p className="mb-4 font-display text-lg font-semibold">{title || "Untitled song"}</p>
            <ChordRenderer chordSheet={chordSheet} songKey={key} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
