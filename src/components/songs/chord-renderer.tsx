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

function createSmartBlocks(lines: SheetLine[]): SectionBlock[] {
  const blocks: SectionBlock[] = [];
  let currentBlock: SectionBlock = { id: "block-0", lines: [] };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const isHeaderLyric =
      line.kind === "lyric" &&
      line.tokens.length === 1 &&
      line.tokens[0].type === "text" &&
      /^(verse|chorus|intro|outro|bridge|pre-chorus|interlude|tag|ending|hook|coda)\b/i.test(
        line.tokens[0].value.trim()
      );

    if (line.kind === "section" || isHeaderLyric) {
      if (currentBlock.lines.length > 0 || currentBlock.header) {
        blocks.push(currentBlock);
      }
      const label = line.kind === "section" ? line.label : (line as any).tokens[0].value.trim();
      currentBlock = { id: `block-${i}`, header: label, lines: [] };
    } else if (line.kind === "blank") {
      if (currentBlock.lines.length > 0) {
        blocks.push(currentBlock);
        currentBlock = { id: `block-${i}`, lines: [] };
      }
    } else {
      currentBlock.lines.push(line);
      // Fallback chunking: if a single block exceeds 10 lines, start a new block for column splitting
      if (currentBlock.lines.length >= 10) {
        blocks.push(currentBlock);
        currentBlock = { id: `block-${i}`, lines: [] };
      }
    }
  }

  if (currentBlock.lines.length > 0 || currentBlock.header) {
    blocks.push(currentBlock);
  }

  return blocks.filter((b) => b.lines.length > 0 || b.header);
}

function RenderBlock({ block, showChords }: { block: SectionBlock; showChords: boolean }) {
  return (
    <div className="space-y-1">
      {block.header && (
        <div
          className="mb-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-sans font-semibold uppercase tracking-wide text-accent"
          style={{ fontSize: "0.72rem" }}
        >
          {block.header}
        </div>
      )}
      {block.lines.map((line, lineIdx) => {
        if (line.kind === "blank") {
          return <div key={lineIdx} className="h-3" />;
        }

        if (line.kind !== "lyric") return null;

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
  );
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
  const blocks = React.useMemo(() => createSmartBlocks(rawLines), [rawLines]);

  if (columns === 1 || blocks.length <= 1) {
    return (
      <div className={cn("font-mono leading-relaxed space-y-6", className)} style={{ fontSize: `${fontScale}rem` }}>
        {blocks.map((block) => (
          <RenderBlock key={block.id} block={block} showChords={showChords} />
        ))}
      </div>
    );
  }

  const colCount = Math.min(columns, blocks.length);
  const columnGroups: SectionBlock[][] = Array.from({ length: colCount }, () => []);

  const totalWeight = blocks.reduce((acc, b) => acc + b.lines.length + 2, 0);
  const targetWeight = totalWeight / colCount;

  let currentCol = 0;
  let currentAccumulated = 0;

  for (const block of blocks) {
    const blockWeight = block.lines.length + 2;
    if (
      currentCol < colCount - 1 &&
      currentAccumulated > 0 &&
      currentAccumulated + blockWeight / 2 >= targetWeight
    ) {
      currentCol++;
      currentAccumulated = 0;
    }
    columnGroups[currentCol].push(block);
    currentAccumulated += blockWeight;
  }

  const gridClass =
    colCount === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start";

  return (
    <div className={cn("font-mono leading-relaxed", gridClass, className)} style={{ fontSize: `${fontScale}rem` }}>
      {columnGroups.map((colBlocks, colIdx) => (
        <div key={colIdx} className="space-y-6">
          {colBlocks.map((block) => (
            <RenderBlock key={block.id} block={block} showChords={showChords} />
          ))}
        </div>
      ))}
    </div>
  );
}
