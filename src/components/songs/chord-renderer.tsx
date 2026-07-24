"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { parseChordSheet, type SheetLine } from "@/lib/chords/parser";
import { transposeChordSheet, shouldPreferFlat } from "@/lib/chords/transpose";

interface ChordRendererProps {
  chordSheet: string;
  songKey?: string;
  semitones?: number;
  fontScale?: number;
  showChords?: boolean;
  columns?: 1 | 2 | 3;
  className?: string;
}

type SectionBlock = {
  id: string;
  header?: string;
  lines: SheetLine[];
};

function groupLinesIntoBlocks(lines: SheetLine[]): SectionBlock[] {
  const blocks: SectionBlock[] = [];
  let currentBlock: SectionBlock = { id: "block-0", lines: [] };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.kind === "section") {
      if (currentBlock.lines.length > 0 || currentBlock.header) {
        blocks.push(currentBlock);
      }
      currentBlock = { id: `block-${i}`, header: line.label, lines: [] };
    } else {
      currentBlock.lines.push(line);
    }
  }

  if (currentBlock.lines.length > 0 || currentBlock.header) {
    blocks.push(currentBlock);
  }

  return blocks;
}

export function ChordRenderer({
  chordSheet,
  songKey = "C",
  semitones = 0,
  fontScale = 1,
  showChords = true,
  columns = 1,
  className,
}: ChordRendererProps) {
  const transposed = React.useMemo(
    () => (semitones ? transposeChordSheet(chordSheet, semitones, shouldPreferFlat(songKey)) : chordSheet),
    [chordSheet, semitones, songKey]
  );

  const rawLines = React.useMemo(() => parseChordSheet(transposed), [transposed]);
  const blocks = React.useMemo(() => groupLinesIntoBlocks(rawLines), [rawLines]);

  const columnLayoutClass = React.useMemo(() => {
    if (columns === 2) return "columns-1 md:columns-2 gap-8 space-y-6 md:space-y-0";
    if (columns === 3) return "columns-1 md:columns-2 lg:columns-3 gap-8 space-y-6 lg:space-y-0";
    return "columns-1 space-y-6";
  }, [columns]);

  return (
    <div
      className={cn("font-mono leading-relaxed transition-all", columnLayoutClass, className)}
      style={{ fontSize: `${fontScale}rem` }}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          className="break-inside-avoid-column inline-block w-full align-top mb-6"
          style={{ breakInside: "avoid-column" }}
        >
          {block.header && (
            <div
              className="mb-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-sans font-semibold uppercase tracking-wide text-accent"
              style={{ fontSize: "0.72rem" }}
            >
              {block.header}
            </div>
          )}

          <div className="space-y-1">
            {block.lines.map((line, lineIdx) => {
              if (line.kind === "blank") {
                return <div key={lineIdx} className="h-3" />;
              }

              if (line.kind === "section") {
                return (
                  <div
                    key={lineIdx}
                    className="mt-4 mb-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-sans font-semibold uppercase tracking-wide text-accent"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {line.label}
                  </div>
                );
              }

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

              if (segments.length === 0) {
                return <div key={lineIdx} className="h-3" />;
              }

              return (
                <div key={lineIdx} className="lyric-line flex flex-wrap items-start leading-relaxed my-1">
                  {segments.map((seg, segIdx) => {
                    const chordStr = seg.chord ?? "";
                    const textStr = seg.text ?? "";
                    const chordLen = chordStr.length;
                    const textLen = textStr.length;
                    const minCh = showChords && chordLen > 0 ? Math.max(chordLen, textLen) : undefined;

                    return (
                      <span
                        key={segIdx}
                        className="inline-flex flex-col items-start min-w-[0.2em]"
                        style={{ minWidth: minCh ? `${minCh}ch` : undefined }}
                      >
                        {showChords && (
                          <span className="chord-token select-none font-bold text-emerald-500 dark:text-lime-400 text-[0.85em] leading-tight pr-1 whitespace-pre">
                            {seg.chord || "\u00A0"}
                          </span>
                        )}
                        <span className="font-sans leading-snug text-foreground whitespace-pre-wrap">
                          {seg.text || (seg.chord ? "\u00A0" : "")}
                        </span>
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
