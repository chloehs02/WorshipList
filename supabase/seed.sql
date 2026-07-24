-- ============================================================================
-- WorshipFlow seed data — mirrors src/lib/data/mock-*.ts for local dev.
-- Run AFTER schema.sql and after at least one real auth user has signed up
-- (the trigger in schema.sql auto-creates their public.users row).
--
-- Replace :owner_id below with a real auth.users.id, e.g.:
--   select id, email from auth.users;
-- ============================================================================

insert into public.songs (slug, title, artist, key, bpm, capo, category, chords, notes, tags, owner_id)
select
  v.slug, v.title, v.artist, v.key, v.bpm, v.capo, v.category, v.chords, v.notes, v.tags, u.id
from (values
  ('amazing-grace', 'Amazing Grace', 'John Newton', 'G', 72, 0, 'Hymn',
   E'## Verse 1\n[G]Amazing grace, how [C]sweet the [G]sound\nThat [Em]saved a [D]soul like [G]me',
   'Great as a closing song for testimony Sundays.', array['classic','communion'], 1),
  ('be-thou-my-vision', 'Be Thou My Vision', 'Traditional Irish Hymn', 'D', 68, 0, 'Hymn',
   E'## Verse 1\n[D]Be Thou my [G]vision, O [D]Lord of my [A]heart',
   'Works well fingerpicked.', array['surrender'], 1),
  ('cornerstone-of-grace', 'Cornerstone of Grace', 'WorshipFlow Originals', 'G', 128, 0, 'Contemporary',
   E'## Chorus\n[G]Cornerstone of [D]grace, foun[Em]dation of my [C]praise',
   'Big room anthem.', array['anthem'], 1)
) as v(slug, title, artist, key, bpm, capo, category, chords, notes, tags, seed_owner)
join public.users u on true
limit 3;

-- Note: in a real seed you'd join to a specific known user id rather than
-- `join ... on true`. This file is a starting template — adjust owner_id
-- assignment to match your actual auth.users rows before running in anything
-- beyond a scratch/dev project.
