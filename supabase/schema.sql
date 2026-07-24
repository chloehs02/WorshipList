-- ============================================================================
-- WorshipFlow — Supabase / PostgreSQL schema
-- Safe to re-run any time (idempotent): tables, indexes, and policies all
-- guard against "already exists" errors. Run in the Supabase SQL editor (or
-- via `supabase db push`). Assumes the built-in `auth.users` table.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users: app-level profile, 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'member' check (role in ('leader', 'member', 'admin')),
  instrument text,
  avatar_url text,
  team_id uuid,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- teams: worship teams / churches. A user invites teammates into their team.
-- ---------------------------------------------------------------------------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'users_team_id_fkey') then
    alter table public.users
      add constraint users_team_id_fkey foreign key (team_id) references public.teams (id) on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- songs
-- ---------------------------------------------------------------------------
create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  artist text,
  key text,
  bpm integer,
  capo integer not null default 0,
  category text default 'Worship',
  lyrics text,          -- plain lyrics (denormalized for search)
  chords text,          -- ChordPro-style body: "[G]Amazing [C]grace"
  notes text,
  tags text[] default '{}',
  owner_id uuid not null references public.users (id) on delete cascade,
  team_id uuid references public.teams (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists songs_owner_id_idx on public.songs (owner_id);
create index if not exists songs_team_id_idx on public.songs (team_id);
create index if not exists songs_category_idx on public.songs (category);
create index if not exists songs_search_idx on public.songs using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(artist, '') || ' ' || coalesce(lyrics, ''))
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists songs_set_updated_at on public.songs;
create trigger songs_set_updated_at
  before update on public.songs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- setlists
-- ---------------------------------------------------------------------------
create table if not exists public.setlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  service_type text,
  notes text,
  created_by uuid not null references public.users (id) on delete cascade,
  team_id uuid references public.teams (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists setlists_created_by_idx on public.setlists (created_by);
create index if not exists setlists_date_idx on public.setlists (date);

-- ---------------------------------------------------------------------------
-- setlist_songs: join table with explicit ordering
-- ---------------------------------------------------------------------------
create table if not exists public.setlist_songs (
  id uuid primary key default gen_random_uuid(),
  setlist_id uuid not null references public.setlists (id) on delete cascade,
  song_id uuid not null references public.songs (id) on delete cascade,
  order_number integer not null,
  key_override text,
  notes text,
  unique (setlist_id, song_id)
);

create index if not exists setlist_songs_setlist_id_idx on public.setlist_songs (setlist_id);
create index if not exists setlist_songs_order_idx on public.setlist_songs (setlist_id, order_number);

-- ---------------------------------------------------------------------------
-- shared_permissions: per-song sharing (viewer / editor)
-- ---------------------------------------------------------------------------
create table if not exists public.shared_permissions (
  id uuid primary key default gen_random_uuid(),
  song_id uuid not null references public.songs (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  permission_type text not null default 'viewer' check (permission_type in ('viewer', 'editor')),
  created_at timestamptz not null default now(),
  unique (song_id, user_id)
);

create index if not exists shared_permissions_song_id_idx on public.shared_permissions (song_id);
create index if not exists shared_permissions_user_id_idx on public.shared_permissions (user_id);

-- ---------------------------------------------------------------------------
-- favorites
-- ---------------------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  song_id uuid not null references public.songs (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, song_id)
);

-- ---------------------------------------------------------------------------
-- Auto-create a public.users row whenever a new auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.users enable row level security;
alter table public.teams enable row level security;
alter table public.songs enable row level security;
alter table public.setlists enable row level security;
alter table public.setlist_songs enable row level security;
alter table public.shared_permissions enable row level security;
alter table public.favorites enable row level security;

-- Helper: looks up the caller's team_id while bypassing RLS (SECURITY DEFINER).
-- Policies on public.users must never query public.users directly inside
-- their own USING clause — that re-triggers the same policy for every row
-- of the subquery and causes "infinite recursion detected in policy for
-- relation users". Routing the lookup through this function avoids it.
create or replace function public.current_team_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select team_id from public.users where id = auth.uid();
$$;

grant execute on function public.current_team_id() to authenticated;

-- Helpers: songs and shared_permissions each have a policy that checks the
-- other table (songs checks "is this shared with me?", shared_permissions
-- checks "do I own this song?"). Querying each other directly creates the
-- same mutual-recursion problem as above, just across two tables instead of
-- one. These SECURITY DEFINER functions break the cycle the same way.
create or replace function public.owns_song(p_song_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.songs where id = p_song_id and owner_id = auth.uid()
  );
$$;

grant execute on function public.owns_song(uuid) to authenticated;

create or replace function public.song_permission(p_song_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select permission_type from public.shared_permissions
  where song_id = p_song_id and user_id = auth.uid()
  limit 1;
$$;

grant execute on function public.song_permission(uuid) to authenticated;

-- users: everyone on a team can see each other; a user can update themself
drop policy if exists "Users can view teammates" on public.users;
create policy "Users can view teammates" on public.users
  for select using (
    auth.uid() = id
    or team_id = public.current_team_id()
  );

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- teams: members can view their own team
drop policy if exists "Members can view their team" on public.teams;
create policy "Members can view their team" on public.teams
  for select using (id = public.current_team_id());

drop policy if exists "Users can create a team" on public.teams;
create policy "Users can create a team" on public.teams
  for insert with check (auth.uid() = created_by);

-- songs: owner, teammates, or anyone with an explicit share can view;
-- only the owner or an editor-permission user can modify
drop policy if exists "View own, team, or shared songs" on public.songs;
create policy "View own, team, or shared songs" on public.songs
  for select using (
    owner_id = auth.uid()
    or team_id = public.current_team_id()
    or public.song_permission(id) is not null
  );

drop policy if exists "Owners can insert songs" on public.songs;
create policy "Owners can insert songs" on public.songs
  for insert with check (owner_id = auth.uid());

drop policy if exists "Owners and editors can update songs" on public.songs;
create policy "Owners and editors can update songs" on public.songs
  for update using (
    owner_id = auth.uid()
    or public.song_permission(id) = 'editor'
  );

drop policy if exists "Owners can delete songs" on public.songs;
create policy "Owners can delete songs" on public.songs
  for delete using (owner_id = auth.uid());

-- setlists
drop policy if exists "View own, team, or created setlists" on public.setlists;
create policy "View own, team, or created setlists" on public.setlists
  for select using (
    created_by = auth.uid()
    or team_id = public.current_team_id()
  );

drop policy if exists "Users can create setlists" on public.setlists;
create policy "Users can create setlists" on public.setlists
  for insert with check (created_by = auth.uid());

drop policy if exists "Creators can update setlists" on public.setlists;
create policy "Creators can update setlists" on public.setlists
  for update using (created_by = auth.uid());

drop policy if exists "Creators can delete setlists" on public.setlists;
create policy "Creators can delete setlists" on public.setlists
  for delete using (created_by = auth.uid());

-- setlist_songs: follow the parent setlist's visibility
drop policy if exists "View setlist songs via parent setlist" on public.setlist_songs;
create policy "View setlist songs via parent setlist" on public.setlist_songs
  for select using (
    setlist_id in (
      select id from public.setlists
      where created_by = auth.uid()
         or team_id = public.current_team_id()
    )
  );

drop policy if exists "Manage setlist songs via parent setlist" on public.setlist_songs;
create policy "Manage setlist songs via parent setlist" on public.setlist_songs
  for all using (
    setlist_id in (select id from public.setlists where created_by = auth.uid())
  );

-- shared_permissions: song owner manages; grantee can see their own grant
drop policy if exists "View own share grants" on public.shared_permissions;
create policy "View own share grants" on public.shared_permissions
  for select using (
    user_id = auth.uid()
    or public.owns_song(song_id)
  );

drop policy if exists "Song owners manage shares" on public.shared_permissions;
create policy "Song owners manage shares" on public.shared_permissions
  for all using (public.owns_song(song_id));

-- favorites: strictly private to the user
drop policy if exists "Users manage own favorites" on public.favorites;
create policy "Users manage own favorites" on public.favorites
  for all using (user_id = auth.uid());
