-- Run this in Supabase Dashboard → SQL Editor
-- Creates the share_links table and updates RLS policies for public sharing.

-- ---------------------------------------------------------------------------
-- share_links: UUID token → setlist for public (anonymous) sharing
-- ---------------------------------------------------------------------------
create table if not exists public.share_links (
  token uuid primary key default gen_random_uuid(),
  setlist_id uuid not null references public.setlists (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (setlist_id)  -- one share link per setlist
);

create index if not exists share_links_setlist_id_idx on public.share_links (setlist_id);

alter table public.share_links enable row level security;

-- Anyone (including anon) can look up a share link by token
drop policy if exists "Anyone can read share links" on public.share_links;
create policy "Anyone can read share links" on public.share_links
  for select using (true);

-- Only the creator of the linked setlist can create a share link
drop policy if exists "Setlist creator can create share links" on public.share_links;
create policy "Setlist creator can create share links" on public.share_links
  for insert with check (
    setlist_id in (select id from public.setlists where created_by = auth.uid())
  );

-- Only the creator of the linked setlist can delete a share link
drop policy if exists "Setlist creator can delete share links" on public.share_links;
create policy "Setlist creator can delete share links" on public.share_links
  for delete using (
    setlist_id in (select id from public.setlists where created_by = auth.uid())
  );
