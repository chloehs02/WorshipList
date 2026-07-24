# WorshipFlow

A chord sheet and setlist management app for small worship teams — built with
Next.js 15 (App Router), TypeScript, Tailwind CSS, and Supabase.

**This copy is already wired to a live Supabase project** (see `.env.local`).
Auth, songs, favorites, and setlists all read and write real data — nothing
resets on refresh. `src/lib/data/` still contains the original mock/sample
data, used only by the public marketing pages (landing page preview, `/song/[slug]`
share view) and as reference seed content.

## Status: what's real vs. stubbed

Real (backed by Postgres + RLS):
- Email/password sign up, log in, log out, session-protected routes (`middleware.ts`)
- Song CRUD (create/edit/delete), favoriting
- Setlist CRUD, add/remove songs, drag-and-drop reorder (all persisted)
- Chord sheet auto-formatting (paste traditional format → auto-converts; manual "Format" button)

Stubbed (UI works, not yet connected):
- Team invite emails (share modal shows the flow but doesn't send mail — no email provider configured)
- The public `/song/[slug]` share page — currently reads from mock data, and even once
  connected, real sharing needs a "public" visibility flag since the current RLS
  policy only allows the owner, teammates, or someone explicitly granted access
  in `shared_permissions` to read a song (not fully anonymous public access)

## Stack

- **Framework:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, hand-built shadcn-style UI primitives (Radix UI + CVA)
- **Backend:** Supabase (Postgres, Auth, Storage) — schema in `supabase/schema.sql`
- **Drag & drop:** `@dnd-kit` for setlist reordering
- **Theming:** `next-themes` (light/dark), plus a stage "large text" mode
- **PWA:** manifest + service worker for offline viewing of saved songs

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. You'll land on the marketing page — click
"Get started" to create a real account (stored in your connected Supabase
project), or "Log in" if you already made one. Everything under `/dashboard`
requires a session; the middleware redirects signed-out visitors to `/login`.

**First-time database setup:** run `supabase/schema.sql` once in your
Supabase project's SQL editor (Dashboard → SQL Editor → New query → paste →
Run). It's idempotent, so it's also safe to re-run later if you ever need to.
If you only need to patch RLS policies on an already-provisioned project,
you don't need to re-run the whole file — see `fix-rls-recursion.sql` if
you were given one separately.

If you ever want to point this at a different Supabase project, update
`.env.local` and re-run `supabase/schema.sql` on the new project first.

## Project structure

```
src/
  app/
    page.tsx                  Landing page
    (auth)/login, register    Auth screens
    (app)/dashboard           Dashboard
    (app)/songs               Song library, new/edit, chord viewer
    (app)/setlists            Setlist list + drag-and-drop builder
    (app)/profile             Profile, team, and preferences
    song/[slug]                Public, unauthenticated share view (mock data — see Status)
    actions/                  Server Actions: songs, setlists, auth
  components/
    layout/                   Sidebar, mobile nav, topbar
    songs/                    Song card, chord renderer, transpose controller,
                               search bar, filters, editor form, viewer toolbar
    setlists/                 Drag-and-drop setlist builder
    sharing/                  Share modal (viewer/editor invites, link copy)
    theme/                    Theme provider + toggle
    providers/                UserProvider (real signed-in user, via context)
    ui/                       Reusable primitives (button, card, dialog, etc.)
  lib/
    chords/                   ChordPro-style parser, transpose engine, auto-tidy formatter
    supabase/                 Browser/server clients, middleware helper, typed queries
    data/                     Mock songs, setlists, and team members (landing/demo use)
supabase/
  schema.sql                  Full Postgres schema + RLS policies (idempotent)
  seed.sql                    Starter data template
middleware.ts                 Session refresh + route protection
```

## Chord sheet format

Songs are stored as a lightweight ChordPro-style string — chords are inline
in brackets right before the syllable they fall on, and `##` marks a section
label:

```
## Verse 1
[G]Amazing grace, how [C]sweet the [G]sound
That [Em]saved a [D]soul like [G]me
```

`src/lib/chords/parser.ts` turns this into chord/lyric line pairs,
`src/lib/chords/transpose.ts` shifts every chord by N semitones, and
`src/lib/chords/format.ts` auto-converts pasted "chords above lyrics" text
into this bracket format (or cleans up spacing on an already-tidy sheet).

## PWA / offline

`public/manifest.json` and `public/sw.js` provide an installable app shell
with network-first caching, so songs a user has already opened stay
available with a spotty connection (e.g. inside a sanctuary). Icons live in
`public/icons/`.

## Scripts

```bash
npm run dev     # start local dev server
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```
