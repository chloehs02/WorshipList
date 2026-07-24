const SHARP_SCALE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_SCALE = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

// Keys that conventionally use flats
const FLAT_KEYS = new Set(["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb", "Dm", "Gm", "Cm", "Fm", "Bbm", "Ebm"]);

const NOTE_REGEX = /^([A-G])(#|b)?/;

function noteIndex(note: string): number {
  const idx = SHARP_SCALE.indexOf(note);
  if (idx !== -1) return idx;
  return FLAT_SCALE.indexOf(note);
}

export function getAllKeys(): string[] {
  return ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
}

/**
 * Transpose a single chord symbol (e.g. "G", "Am7", "D/F#", "Bb maj7") by a number of semitones.
 */
export function transposeChord(chord: string, semitones: number, preferFlat = false): string {
  if (!chord) return chord;
  // handle slash chords e.g. D/F#
  if (chord.includes("/")) {
    const [main, bass] = chord.split("/");
    return `${transposeChord(main, semitones, preferFlat)}/${transposeChord(bass, semitones, preferFlat)}`;
  }

  const match = chord.match(NOTE_REGEX);
  if (!match) return chord;

  const root = match[1] + (match[2] ?? "");
  const rest = chord.slice(match[0].length);

  const idx = noteIndex(root);
  if (idx === -1) return chord;

  const newIdx = ((idx + semitones) % 12 + 12) % 12;
  const scale = preferFlat ? FLAT_SCALE : SHARP_SCALE;
  return scale[newIdx] + rest;
}

/**
 * Transpose an entire ChordPro-style body (chords wrapped in [brackets]) by N semitones.
 */
export function transposeChordSheet(body: string, semitones: number, preferFlat = false): string {
  if (semitones === 0) return body;
  return body.replace(/\[([^\]]+)\]/g, (_, chord) => `[${transposeChord(chord, semitones, preferFlat)}]`);
}

export function semitoneDistance(fromKey: string, toKey: string): number {
  const from = normalizeKeyRoot(fromKey);
  const to = normalizeKeyRoot(toKey);
  const fromIdx = noteIndex(from);
  const toIdx = noteIndex(to);
  if (fromIdx === -1 || toIdx === -1) return 0;
  return toIdx - fromIdx;
}

export function normalizeKeyRoot(key: string): string {
  const match = key.match(NOTE_REGEX);
  return match ? match[1] + (match[2] ?? "") : key;
}

export function shouldPreferFlat(key: string): boolean {
  return FLAT_KEYS.has(key);
}

/** Returns the chromatic key name N semitones above the given key (keeps major/minor suffix). */
export function transposeKeyLabel(key: string, semitones: number): string {
  if (semitones === 0) return key;
  const minorMatch = key.match(/^([A-G][#b]?)m$/);
  const isMinor = !!minorMatch;
  const root = normalizeKeyRoot(key);
  const idx = noteIndex(root);
  if (idx === -1) return key;
  const newIdx = ((idx + semitones) % 12 + 12) % 12;
  const preferFlat = shouldPreferFlat(key);
  const scale = preferFlat ? FLAT_SCALE : SHARP_SCALE;
  return scale[newIdx] + (isMinor ? "m" : "");
}
