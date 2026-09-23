-- Run this ONCE in the Supabase SQL Editor of the shared project
-- (BabikovaN's Project), for either/both platforms that use it.
--
-- Why this table exists: Supabase Auth users (auth.users) belong to the
-- PROJECT, not to a specific site. If two different platforms share one
-- Supabase project/URL/anon key, a person who exists in auth.users (created
-- via Authentication -> Users -> Add user on either platform) can otherwise
-- sign in successfully on BOTH of them. course_access is the extra layer
-- that says which specific app(s) a given email is actually allowed into.
--
-- Safe to run even if the other platform already created this table (the
-- app_id column is what tells the two platforms' grants apart in the same
-- table) — IF NOT EXISTS makes re-running harmless.

create table if not exists public.course_access (
  email text not null,
  app_id text not null,
  granted_at timestamptz not null default now(),
  primary key (email, app_id)
);

alter table public.course_access enable row level security;

-- A signed-in user may only check THEIR OWN access rows — never anyone
-- else's, and there is deliberately no insert/update/delete policy for
-- regular users: only the project admin (via the Table Editor UI, or SQL,
-- which both run as the privileged postgres role and bypass RLS) can grant
-- access. This is what makes it "invite-only, no self-service registration".
create policy "users can check own course access"
  on public.course_access
  for select
  using (email = auth.jwt() ->> 'email');

-- To grant a person access to THIS platform (00100101) after creating their
-- auth user in Authentication -> Users, either run:
--
--   insert into public.course_access (email, app_id) values ('them@example.com', '00100101');
--
-- or do the same thing from Table Editor -> course_access -> Insert row.
-- The OTHER platform sharing this project grants its own access the same
-- way, just with its own app_id value — the two grants never overlap.
