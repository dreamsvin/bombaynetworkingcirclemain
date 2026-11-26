-- Redesign (approved wireframes, 26 Nov 2026).
--   * Rooms are paid: events get a price and a theme. The table keeps the name `events`; the site calls them rooms.
--   * The member directory needs filterable fields: industry, stage, what they're building, what they're looking for.
--   * Stories carry a type (co-founder, client, hire...) and an optional second member.
--   * access_requests is the Request access form. Private like inquiries: no public policies at all.

-- ───────── rooms (events) ─────────
alter table public.events
  add column price_inr integer check (price_inr is null or price_inr >= 0),
  add column theme text check (theme is null or char_length(theme) <= 160);

-- ───────── members ─────────
alter table public.members
  add column industry text check (industry is null or char_length(industry) <= 60),
  add column stage text check (stage is null or stage in ('idea', 'early', 'seed', 'growth', 'established')),
  add column building text check (building is null or char_length(building) <= 200),
  add column looking_for text[] not null default '{}',
  add column rooms_attended integer check (rooms_attended is null or rooms_attended >= 0);

-- ───────── stories ─────────
alter table public.stories
  add column story_type text check (story_type is null or story_type in ('co-founder', 'client', 'hire', 'investment', 'partnership')),
  add column second_member_id uuid references public.members(id) on delete set null;

-- ───────── access requests (private) ─────────
create table public.access_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email citext not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or phone ~ '^\+?[0-9]{10,15}$'),
  city text not null check (char_length(city) between 2 and 80),
  role text not null check (char_length(role) <= 60),
  company text check (company is null or char_length(company) <= 120),
  industry text check (industry is null or char_length(industry) <= 60),
  linkedin text check (linkedin is null or linkedin ~ '^https://(www\.|[a-z]{2}\.)?linkedin\.com/'),
  building text check (building is null or char_length(building) <= 600),
  looking_for text[] not null default '{}',
  heard_from text check (heard_from is null or char_length(heard_from) <= 60),
  charter_agreed_at timestamptz not null,
  status text not null default 'new' check (status in ('new', 'matched', 'invited', 'declined')),
  source_path text,
  created_at timestamptz not null default now()
);
create index access_requests_created_idx on public.access_requests (created_at desc);
create index access_requests_city_idx on public.access_requests (city, status);

alter table public.access_requests enable row level security;
alter table public.access_requests force row level security;
-- No policies for anon/authenticated → no access. Only the service role (server action) writes.
revoke all on public.access_requests from anon, authenticated;
