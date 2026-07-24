"use client";

/**
 * Splits a ChordPro-style chord sheet into two balanced halves by section
 * boundaries, and renders each half in its own column.
 *
 * Sections are delimited by lines like "Verse 1", "Chorus", "Bridge", etc.
 * We split the sections as evenly as possible by character count so each
 * column has a similar amount of content.
 */

import * as React from "react";
import { ChordRenderer } from "./chord-renderer";
import { transposeChordSheet, shouldPreferFlat } from "@/lib/chords/transpose";

interface TwoColumnChordRendererProps {
  chordSheet: string;
  songKey?: string;
  semitones?: number;
  fontScale?: number;
}

/** Split a chord sheet string into its top-level sections. */
function splitIntoSections(text: string): string[] {
  const lines = text.split("\n");
  const sections: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    // A "section header" line: no inline chord brackets AND title-like content.
    // Heuristic: a blank line followed by a non-blank non-chord line.
    // More reliably: if the line starts a new section label (no [ ] around chords)
    // and the previous buffer is non-empty, flush it.
    const isHeader =
      /^\s*(verse|chorus|bridge|pre.?chorus|intro|outro|tag|interlude|coda|hook|refrain|ending|turn)/i.test(line.trim());

    if (isHeader && current.length > 0) {
      sections.push(current.join("\n"));
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.length > 0) sections.push(current.join("\n"));
  return sections.filter((s) => s.trim().length > 0);
}

export function TwoColumnChordRenderer({
  chordSheet,
  songKey = "C",
  semitones = 0,
  fontScale = 1,
}: TwoColumnChordRendererProps) {
  // Apply transposition once at the top level
  const transposed = React.useMemo(
    () =>
      semitones
        ? transposeChordSheet(chordSheet, semitones, shouldPreferFlat(songKey))
        : chordSheet,
    [chordSheet, semitones, songKey]
  );

  const { left, right } = React.useMemo(() => {
    const sections = splitIntoSections(transposed);

    if (sections.length <= 1) {
      // Can't split meaningfully — put everything on the left
      return { left: transposed, right: "" };
    }

    // Find the split point that balances character count between left and right
    const totalChars = transposed.length;
    const target = totalChars / 2;
    let accumulated = 0;
    let splitAt = Math.ceil(sections.length / 2); // default: half by count

    for (let i = 0; i < sections.length; i++) {
      accumulated += sections[i].length;
      if (accumulated >= target) {
        splitAt = i + 1;
        break;
      }
    }

    return {
      left: sections.slice(0, splitAt).join("\n\n"),
      right: sections.slice(splitAt).join("\n\n"),
    };
  }, [transposed]);

  if (!right) {
    // Only one section — fall back to single column
    return (
      <ChordRenderer
        chordSheet={chordSheet}
        songKey={songKey}
        semitones={semitones}
        fontScale={fontScale}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 divide-x divide-border">
      <ChordRenderer
        chordSheet={left}
        songKey={songKey}
        semitones={0} /* transposition already applied */
        fontScale={fontScale}
      />
      <div className="pl-6">
        <ChordRenderer
          chordSheet={right}
          songKey={songKey}
          semitones={0} /* transposition already applied */
          fontScale={fontScale}
        />
      </div>
    </div>
  );
}
