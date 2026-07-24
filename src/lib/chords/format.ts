// Auto-tidy for pasted/typed chord sheets.
//
// Handles the two most common "messy" inputs worship teams paste in:
//  1. Traditional two-line format — a line of chords floating above a line
//     of lyrics (what most chord sites show) — gets merged into inline
//     [Chord]lyric bracket notation, aligned by column position.
//  2. Already-bracketed or plain text — left alone, just whitespace-cleaned.

const CHORD_TOKEN_RE =
  /^[A-G](#|b)?(maj7|maj9|maj|min7|min9|min|m7|m9|m6|sus2|sus4|sus|dim7|dim|aug|add9|add11|add2|6|7|9|11|13|m)?(\/[A-G](#|b)?)?$/i;

function isSectionHeader(line: string): boolean {
  return /^#{1,3}\s*\S/.test(line.trim());
}

function hasChordBrackets(line: string): boolean {
  return /\[[^\]]+\]/.test(line);
}

function isChordLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const tokens = trimmed.split(/\s+/);
  return tokens.every((t) => CHORD_TOKEN_RE.test(t));
}

/** Merges a chord line and its lyric line into inline [Chord]lyric notation, preserving column alignment. */
function mergeChordLyricLines(chordLine: string, lyricLine: string): string {
  const tokens: { chord: string; col: number }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(chordLine)) !== null) {
    tokens.push({ chord: m[0], col: m.index });
  }
  if (tokens.length === 0) return lyricLine;

  let result = "";
  let lyricIndex = 0;
  const trailing: string[] = [];

  for (const { chord, col } of tokens) {
    if (col > lyricLine.length) {
      trailing.push(chord);
      continue;
    }
    if (col > lyricIndex) {
      result += lyricLine.slice(lyricIndex, col);
      lyricIndex = col;
    }
    result += `[${chord}]`;
  }
  result += lyricLine.slice(lyricIndex);
  if (trailing.length) result += trailing.map((c) => `[${c}]`).join("");

  return result;
}

/**
 * Cleans up a raw chord sheet: converts traditional chords-above-lyrics pairs
 * into inline bracket notation, normalizes whitespace, and collapses extra
 * blank lines. Safe to run repeatedly (idempotent on already-tidy sheets).
 */
export function tidyChordSheet(raw: string): string {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const output: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].replace(/\s+$/, "");

    if (line.trim() === "") {
      output.push("");
      i++;
      continue;
    }

    if (isSectionHeader(line)) {
      output.push(line.trim());
      i++;
      continue;
    }

    if (hasChordBrackets(line)) {
      output.push(line);
      i++;
      continue;
    }

    if (isChordLine(line)) {
      const next = lines[i + 1]?.replace(/\s+$/, "");
      const nextIsUsableLyric =
        next !== undefined &&
        next.trim() !== "" &&
        !isSectionHeader(next) &&
        !isChordLine(next) &&
        !hasChordBrackets(next);

      if (nextIsUsableLyric) {
        output.push(mergeChordLyricLines(line, next as string));
        i += 2;
      } else {
        const tokens = line.trim().split(/\s+/);
        output.push(tokens.map((t) => `[${t}]`).join(" "));
        i++;
      }
      continue;
    }

    output.push(line);
    i++;
  }

  const collapsed: string[] = [];
  let blankRun = 0;
  for (const l of output) {
    if (l === "") {
      blankRun++;
      if (blankRun <= 1) collapsed.push(l);
    } else {
      blankRun = 0;
      collapsed.push(l);
    }
  }
  while (collapsed.length && collapsed[0] === "") collapsed.shift();
  while (collapsed.length && collapsed[collapsed.length - 1] === "") collapsed.pop();

  return collapsed.join("\n");
}
