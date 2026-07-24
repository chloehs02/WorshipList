"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { parseChordSheet } from "@/lib/chords/parser";
import { transposeChordSheet, shouldPreferFlat } from "@/lib/chords/transpose";

interface ChordRendererProps {
  chordSheet: string;
  songKey?: string;
  semitones?: number;
  fontScale?: number;
  showChords?: boolean;
  className?: string;
}

export function ChordRenderer({
  chordSheet,
  songKey = "C",
  semitones = 0,
  fontScale = 1,
  showChords = true,
  className,
}: ChordRendererProps) {
  const transposed = React.useMemo(
    () => (semitones ? transposeChordSheet(chordSheet, semitones, shouldPreferFlat(songKey)) : chordSheet),
    [chordSheet, semitones, songKey]
  );
  const lines = React.useMemo(() => parseChordSheet(transposed), [transposed]);

  return (
    <div className={cn("font-mono leading-relaxed", className)} style={{ fontSize: `${fontScale}rem` }}>
      {lines.map((line, i) => {
        if (line.kind === "blank") return <div key={i} className="h-4" />;

        if (line.kind === "section") {
          return (
            <div
              key={i}
              className="mt-6 mb-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-sans font-semibold uppercase tracking-wide text-accent first:mt-0"
              style={{ fontSize: "0.72rem" }}
            >
              {line.label}
            </div>
          );
        }

        // Build chord+text segments so chords sit directly above the syllable they precede.
        const segments: { chord?: string; text: string }[] = [];
        let current: { chord?: string; text: string } | null = null;

        for (const token of line.tokens) {
          if (token.type === "chord") {
            current = { chord: token.value, text: "" };
            segments.push(current);
          } else {
            if (!current) {
              current = { text: token.value };
              segments.push(current);
            } else {
              current.text += token.value;
            }
          }
        }

        if (segments.length === 0) return <div key={i} className="h-4" />;

        return (
          <div key={i} className="lyric-line flex flex-wrap items-start whitespace-pre">
            {segments.map((seg, j) => (
              <span key={j} className="inline-flex flex-col items-start">
                {showChords && (
                  <span className="chord-token select-none text-[0.85em] font-bold leading-tight text-chord">
                    {seg.chord ?? " "}
                  </span>
                )}
                <span className="font-sans leading-snug text-foreground">{seg.text || " "}</span>
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
