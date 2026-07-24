import type { Song } from "@/types";

export const mockSongs: Song[] = [
  {
    id: "s1",
    slug: "amazing-grace",
    title: "Amazing Grace",
    artist: "John Newton",
    key: "G",
    bpm: 72,
    capo: 0,
    category: "Hymn",
    tags: ["classic", "communion", "testimony"],
    createdBy: "u1",
    createdByName: "Samantha Reyes",
    createdAt: "2026-01-04T10:00:00Z",
    updatedAt: "2026-06-12T09:30:00Z",
    isFavorite: true,
    timesPlayed: 18,
    duration: "4:10",
    notes: "Great as a closing song for testimony Sundays. Slow the tempo on the last verse.",
    chordSheet: `## Verse 1
[G]Amazing grace, how [C]sweet the [G]sound
That [Em]saved a [D]soul like [G]me
I [G]once was lost but [C]now am [G]found
Was [Em]blind but [D]now I [G]see

## Verse 2
[G]'Twas grace that [C]taught my [G]heart to fear
And [Em]grace my [D]fears re[G]lieved
How [G]precious did that [C]grace ap[G]pear
The [Em]hour I [D]first be[G]lieved

## Verse 3
[G]Through many [C]dangers, [G]toils and snares
I [Em]have al[D]ready [G]come
'Tis [G]grace hath [C]brought me [G]safe thus far
And [Em]grace will [D]lead me [G]home

## Verse 4
When [G]we've been [C]there ten [G]thousand years
Bright [Em]shining [D]as the [G]sun
We've [G]no less [C]days to [G]sing God's praise
Than [Em]when we [D]first be[G]gun`,
  },
  {
    id: "s2",
    slug: "be-thou-my-vision",
    title: "Be Thou My Vision",
    artist: "Traditional Irish Hymn",
    key: "D",
    bpm: 68,
    capo: 0,
    category: "Hymn",
    tags: ["surrender", "reflective"],
    createdBy: "u2",
    createdByName: "Daniel Cho",
    createdAt: "2026-02-11T14:20:00Z",
    updatedAt: "2026-05-30T11:00:00Z",
    isFavorite: false,
    timesPlayed: 9,
    duration: "3:55",
    notes: "Works well fingerpicked. Daniel usually plays this on piano in Bb.",
    chordSheet: `## Verse 1
[D]Be Thou my [G]vision, O [D]Lord of my [A]heart
[D]Naught be all [G]else to [A]me, save that [D]Thou art
[D]Thou my best [G]thought, by [D]day or by [A]night
[D]Waking or [G]sleeping, Thy [A]presence my [D]light

## Verse 2
[D]Be Thou my [G]wisdom, and [D]Thou my true [A]word
[D]I ever [G]with Thee and [A]Thou with me, [D]Lord
[D]Thou my great [G]Father, I [D]Thy true [A]son
[D]Thou in me [G]dwelling, and [A]I with Thee [D]one

## Verse 3
[D]Riches I [G]heed not, nor [D]man's empty [A]praise
[D]Thou mine in[G]heritance, [A]now and al[D]ways
[D]Thou and Thou [G]only, first [D]in my [A]heart
[D]High King of [G]Heaven, my [A]treasure Thou [D]art`,
  },
  {
    id: "s3",
    slug: "it-is-well-with-my-soul",
    title: "It Is Well With My Soul",
    artist: "Horatio Spafford",
    key: "C",
    bpm: 66,
    capo: 0,
    category: "Hymn",
    tags: ["peace", "trials"],
    createdBy: "u1",
    createdByName: "Samantha Reyes",
    createdAt: "2026-01-20T08:00:00Z",
    updatedAt: "2026-04-02T16:45:00Z",
    isFavorite: true,
    timesPlayed: 12,
    duration: "5:02",
    notes: "",
    chordSheet: `## Verse 1
[C]When peace like a [F]river, attend[C]eth my way
When [G]sorrows like sea [C]billows [G]roll
Whatever my [F]lot, Thou hast [C]taught me to say
It is [G]well, it is [C]well with my [G]soul

## Chorus
It is [C]well [F] [C]
With my [G]soul [C]
It is [C]well, it is [F]well, with my [C]soul [G] [C]

## Verse 2
Though [C]Satan should [F]buffet, though [C]trials should come
Let this [G]blest assurance [C]control [G]
That Christ has re[F]garded my [C]helpless estate
And has [G]shed His own [C]blood for my [G]soul`,
  },
  {
    id: "s4",
    slug: "come-thou-fount",
    title: "Come Thou Fount of Every Blessing",
    artist: "Robert Robinson",
    key: "A",
    bpm: 80,
    capo: 0,
    category: "Hymn",
    tags: ["gratitude"],
    createdBy: "u3",
    createdByName: "Priya Nair",
    createdAt: "2026-03-02T09:00:00Z",
    updatedAt: "2026-06-01T10:15:00Z",
    isFavorite: false,
    timesPlayed: 6,
    duration: "3:40",
    notes: "",
    chordSheet: `## Verse 1
[A]Come Thou Fount of [D]every [A]blessing
[E]Tune my heart to [A]sing Thy grace
[A]Streams of mercy [D]never [A]ceasing
Call for [E]songs of loudest [A]praise

## Verse 2
[A]Here I raise my [D]Ebenez[A]er
[E]Hither by Thy [A]help I'm come
[A]And I hope by [D]Thy good [A]pleasure
Safely to [E]arrive at [A]home`,
  },
  {
    id: "s5",
    slug: "all-hail-the-power",
    title: "All Hail the Power of Jesus' Name",
    artist: "Edward Perronet",
    key: "F",
    bpm: 100,
    capo: 3,
    category: "Praise",
    tags: ["declaration", "upbeat"],
    createdBy: "u4",
    createdByName: "Marcus Bell",
    createdAt: "2026-02-18T12:00:00Z",
    updatedAt: "2026-05-15T13:20:00Z",
    isFavorite: false,
    timesPlayed: 4,
    duration: "3:20",
    notes: "Capo 3, play shapes in D.",
    chordSheet: `## Verse 1
[F]All hail the [Bb]power of [F]Jesus' name
Let [C]angels prostrate [F]fall
[F]Bring forth the [Bb]royal di[F]adem
And [C]crown Him Lord of [F]all

## Chorus
[Bb]Crown Him, crown [F]Him
[Bb]Crown Him, crown [F]Him
Bring [C]forth the royal [F]diadem
And [C]crown Him Lord of [F]all`,
  },
  {
    id: "s6",
    slug: "nothing-but-the-blood",
    title: "Nothing But the Blood",
    artist: "Robert Lowry",
    key: "E",
    bpm: 110,
    capo: 0,
    category: "Communion",
    tags: ["communion", "cross"],
    createdBy: "u5",
    createdByName: "Elena Ruiz",
    createdAt: "2026-01-29T15:30:00Z",
    updatedAt: "2026-03-19T09:10:00Z",
    isFavorite: false,
    timesPlayed: 7,
    duration: "3:15",
    notes: "",
    chordSheet: `## Verse 1
[E]What can wash a[A]way my [E]sin
[B]Nothing but the [E]blood of Jesus
What can [A]make me whole a[E]gain
[B]Nothing but the [E]blood of Jesus

## Chorus
[E]Oh precious is the [A]flow
That [E]makes me white as [B]snow
No other [E]fount I [A]know
[B]Nothing but the blood of [E]Jesus`,
  },
  {
    id: "s7",
    slug: "cornerstone-of-grace",
    title: "Cornerstone of Grace",
    artist: "WorshipFlow Originals",
    key: "G",
    bpm: 128,
    capo: 0,
    category: "Contemporary",
    tags: ["anthem", "declaration"],
    createdBy: "u6",
    createdByName: "Josh Tanaka",
    createdAt: "2026-04-05T10:00:00Z",
    updatedAt: "2026-07-10T08:00:00Z",
    isFavorite: true,
    timesPlayed: 21,
    duration: "4:35",
    notes: "Big room anthem — build from verse to bridge, hold the last chorus.",
    chordSheet: `## Verse 1
[G]You are the [D]ground beneath my [Em]feet
[C]Steady when the [G]waters rise
[G]You are the [D]anchor holding [Em]me
[C]Through every [G]storm You're by my side

## Pre-Chorus
[Em]Unshaken, un[C]moved
[G]I stand on [D]who You are

## Chorus
[G]Cornerstone of [D]grace, foun[Em]dation of my [C]praise
[G]I build my life on [D]You, on [Em]You a[C]lone
[G]Cornerstone of [D]grace, in [Em]every storm You [C]stay
[G]Forever You're my [D]home, my [G]home

## Bridge
[Em]Let the earth give [C]way
[G]Still I will not [D]fear
[Em]You have never [C]failed
[G]And You're [D]still here`,
  },
  {
    id: "s8",
    slug: "waves-of-mercy",
    title: "Waves of Mercy",
    artist: "WorshipFlow Originals",
    key: "C",
    bpm: 74,
    capo: 0,
    category: "Worship",
    tags: ["intimate", "response"],
    createdBy: "u2",
    createdByName: "Daniel Cho",
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: "2026-07-15T14:00:00Z",
    isFavorite: false,
    timesPlayed: 5,
    duration: "5:10",
    notes: "Piano-led, leave space after each chorus for response.",
    chordSheet: `## Verse 1
[C]Mercy like an [G]ocean wide
[Am]Washing over [F]me tonight
[C]Every failure [G]swept away
[Am]In the kindness [F]of Your grace

## Chorus
[F]Waves of [C]mercy, [G]over [Am]me
[F]Nothing greater, [C]nothing [G]less
Than the [F]love You've [C]shown to [G]me
[Am]I am [F]Yours and [C]You are mine`,
  },
  {
    id: "s9",
    slug: "ever-faithful",
    title: "Ever Faithful",
    artist: "WorshipFlow Originals",
    key: "A",
    bpm: 92,
    capo: 2,
    category: "Praise",
    tags: ["faithfulness", "mid-tempo"],
    createdBy: "u3",
    createdByName: "Priya Nair",
    createdAt: "2026-06-02T11:00:00Z",
    updatedAt: "2026-07-18T10:30:00Z",
    isFavorite: true,
    timesPlayed: 14,
    duration: "4:02",
    notes: "Capo 2, shapes in G.",
    chordSheet: `## Verse 1
[A]Every morning [E]mercies new
[F#m]Every evening [D]still it's true
[A]You have never [E]once let go
[F#m]Ever faithful, [D]this I know

## Chorus
[D]Ever faithful, [A]ever true
[E]You are always [F#m]seeing me through
[D]Come what may I'm [A]held by You
[E]Ever faithful, [D]ever [A]true`,
  },
  {
    id: "s10",
    slug: "silent-night",
    title: "Silent Night",
    artist: "Joseph Mohr / Franz Gruber",
    key: "C",
    bpm: 60,
    capo: 0,
    category: "Christmas",
    tags: ["christmas", "candlelight"],
    createdBy: "u1",
    createdByName: "Samantha Reyes",
    createdAt: "2025-12-01T09:00:00Z",
    updatedAt: "2025-12-20T09:00:00Z",
    isFavorite: false,
    timesPlayed: 3,
    duration: "3:30",
    notes: "Candlelight service closer — keep it soft, no drums.",
    chordSheet: `## Verse 1
[C]Silent night, [G]holy [C]night
All is [F]calm, all is [C]bright
[F]Round yon virgin [C]mother and [G]child
[F]Holy infant so [C]tender and [G]mild
[F]Sleep in heavenly [C]peace [G]
[F]Sleep in heavenly [C]peace`,
  },
];

export function getSongBySlug(slug: string) {
  return mockSongs.find((s) => s.slug === slug);
}

export const songCategories = [
  "Praise",
  "Worship",
  "Hymn",
  "Contemporary",
  "Christmas",
  "Communion",
  "Response",
] as const;

export const songKeys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B", "Am", "Em", "Dm"];
