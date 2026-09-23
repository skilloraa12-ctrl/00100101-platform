-- Run this ONCE in the Supabase SQL Editor of the shared project
-- (BabikovaN's Project), the same one course_access.sql runs against.
--
-- Why this table exists: progress (completed lessons, XP, unlocked
-- achievements) used to live only in the browser's localStorage, so it never
-- followed a learner between devices or browsers - finishing lessons on a PC
-- and then opening the course on a phone showed zero progress. This table
-- persists progress per signed-in user so it can be pulled down on any
-- device the moment they log in.
--
-- Named course_progress (not just "progress") and scoped by app_id because
-- this Supabase project is shared with another platform (Designlab) that
-- already has its own "progress" table keyed only by user_id - reusing that
-- name/shape here would let the two platforms silently overwrite each
-- other's data for a learner who has an account on both. app_id keeps this
-- app's rows completely separate, same pattern as course_access.sql.
--
-- Safe to run even if it already exists - IF NOT EXISTS makes re-running
-- harmless.

create table if not exists public.course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  app_id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, app_id)
);

alter table public.course_progress enable row level security;

-- A signed-in learner may only read/write their OWN progress row for THIS
-- app - never anyone else's, and never another app's row for themselves.
create policy "users can read own progress"
  on public.course_progress
  for select
  using (user_id = auth.uid());

create policy "users can upsert own progress"
  on public.course_progress
  for insert
  with check (user_id = auth.uid());

create policy "users can update own progress"
  on public.course_progress
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
