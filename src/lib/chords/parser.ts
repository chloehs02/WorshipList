export type SheetLineToken =
  | { type: "chord"; value: string }
  | { type: "text"; value: string };

export type SheetLine =
  | { kind: "lyric"; tokens: SheetLineToken[] }
  | { kind: "section"; label: string }
  | { kind: "blank" };

/**
 * Parses a ChordPro-style body where chords are inline like "[G]Amazing [C]grace".
 * Section headers use markdown-style syntax: "## Verse 1", "## Chorus".
 */
export function parseChordSheet(body: string): SheetLine[] {
  const lines = body.split("\n");
  return lines.map((raw) => {
    const line = raw.trimEnd();
    if (line.trim() === "") return { kind: "blank" };

    const sectionMatch = line.match(/^#{1,3}\s*(.+)$/);
    if (sectionMatch) {
      return { kind: "section", label: sectionMatch[1].trim() };
    }

    const tokens: SheetLineToken[] = [];
    const regex = /\[([^\]]+)\]|([^\[]+)/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(line)) !== null) {
      if (m[1] !== undefined) {
        tokens.push({ type: "chord", value: m[1] });
      } else if (m[2] !== undefined) {
        tokens.push({ type: "text", value: m[2] });
      }
    }
    return { kind: "lyric", tokens };
  });
}

/** Strips chord markup, returning plain lyrics only (useful for search indexing / print). */
export function stripChords(body: string): string {
  return body.replace(/\[[^\]]+\]/g, "");
}

/** Extracts the unique set of chords used in a chord sheet, in order of first appearance. */
export function extractChords(body: string): string[] {
  const seen = new Set<string>();
  const regex = /\[([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(body)) !== null) {
    seen.add(m[1]);
  }
  return Array.from(seen);
}
