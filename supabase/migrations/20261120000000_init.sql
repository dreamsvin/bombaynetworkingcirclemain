-- Bombay Networking Circle — initial schema
-- Rules this file enforces:
--   * RLS on every table. anon/authenticated may read ONLY published rows of content tables.
--   * inquiries and subscribers have NO public policies: nobody but the service role reads or writes them.
--   * All writes go through server actions using the service role key (bypasses RLS by design).
--   * Stories, testimonials and member profiles cannot be published without consented_on (CHECK constraint,
--     not a guideline). A row with is_published = true and consented_on = null is rejected by Postgres.

create extension if not exists citext;

-- ───────── helpers ─────────
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ───────── enums ─────────
create type public.chapter_status as enum ('active', 'launching', 'coming_soon');
create type public.event_format as enum ('founder_networking', 'startup_conversations', 'pitch_session', 'workshop');
create type public.sponsor_tier as enum ('national', 'city_series', 'chapter', 'community');
create type public.inquiry_type as enum ('contact', 'sponsor', 'start_chapter', 'partner', 'speak');

-- ───────── chapters ─────────
create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  city text not null,
  state text not null,
  status public.chapter_status not null default 'active',
  launched_on date,
  lead_name text,
  lead_photo text,
  member_count integer check (member_count is null or member_count >= 0),
  member_count_as_of date,
  cover_image text,
  is_flagship boolean not null default false,
  latitude numeric(8,5),
  longitude numeric(8,5),
  intro text,
  sort_order integer not null default 100,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint member_count_needs_date check (member_count is null or member_count_as_of is not null)
);

-- ───────── events ─────────
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  chapter_id uuid not null references public.chapters(id) on delete restrict,
  title text not null,
  summary text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text,
  venue_address text,
  luma_url text check (luma_url is null or luma_url ~ '^https://(lu\.ma|luma\.com)/'),
  cover_image text,
  format public.event_format not null,
  capacity integer check (capacity is null or capacity > 0),
  who_attends text,
  agenda jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ends_after_start check (ends_at is null or ends_at > starts_at)
);
create index events_starts_at_idx on public.events (starts_at);
create index events_chapter_idx on public.events (chapter_id);

-- ───────── members ─────────
create table public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  city text,
  photo text,
  linkedin text check (linkedin is null or linkedin ~ '^https://(www\.)?linkedin\.com/'),
  is_featured boolean not null default false,
  team_role text, -- set for founder / city leads / volunteers shown on /about/team
  team_order integer,
  consented_on date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint member_publish_needs_consent check (not is_published or consented_on is not null)
);

-- ───────── stories ─────────
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  member_id uuid references public.members(id) on delete set null,
  chapter_id uuid references public.chapters(id) on delete set null,
  headline text not null,
  problem text,
  connection text,
  body text not null,
  outcome text,
  consented_on date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint story_publish_needs_consent check (not is_published or consented_on is not null)
);

-- ───────── testimonials ─────────
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  author_photo text,
  quote text not null check (char_length(quote) between 10 and 600),
  chapter_id uuid references public.chapters(id) on delete set null,
  consented_on date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonial_publish_needs_consent check (not is_published or consented_on is not null)
);

-- ───────── sponsors ─────────
create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  tier public.sponsor_tier not null,
  url text check (url is null or url ~ '^https://'),
  is_partner boolean not null default false, -- true = ecosystem partner (/partners), false = sponsor (/sponsor)
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ───────── inquiries (private) ─────────
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  type public.inquiry_type not null,
  name text not null check (char_length(name) between 2 and 80),
  email citext not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or phone ~ '^\+?[0-9]{10,15}$'),
  city text check (city is null or char_length(city) <= 80),
  organisation text check (organisation is null or char_length(organisation) <= 120),
  message text check (message is null or char_length(message) <= 2000),
  source_path text,
  created_at timestamptz not null default now()
);
create index inquiries_type_created_idx on public.inquiries (type, created_at desc);

-- ───────── subscribers (private, double opt-in) ─────────
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  city text,
  source text not null default 'footer',
  confirm_token uuid not null default gen_random_uuid(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ───────── updated_at triggers ─────────
do $$
declare t text;
begin
  foreach t in array array['chapters','events','members','stories','testimonials','sponsors'] loop
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- ───────── RLS ─────────
alter table public.chapters enable row level security;
alter table public.events enable row level security;
alter table public.members enable row level security;
alter table public.stories enable row level security;
alter table public.testimonials enable row level security;
alter table public.sponsors enable row level security;
alter table public.inquiries enable row level security;
alter table public.subscribers enable row level security;

-- Force RLS even for the table owner, so a misconfigured connection can't bypass it.
alter table public.inquiries force row level security;
alter table public.subscribers force row level security;

create policy "public reads published chapters" on public.chapters
  for select to anon, authenticated using (is_published);
create policy "public reads published events" on public.events
  for select to anon, authenticated using (is_published);
create policy "public reads published consented members" on public.members
  for select to anon, authenticated using (is_published and consented_on is not null);
create policy "public reads published consented stories" on public.stories
  for select to anon, authenticated using (is_published and consented_on is not null);
create policy "public reads published consented testimonials" on public.testimonials
  for select to anon, authenticated using (is_published and consented_on is not null);
create policy "public reads published sponsors" on public.sponsors
  for select to anon, authenticated using (is_published);
-- inquiries, subscribers: intentionally no policies for anon/authenticated → no access at all.

-- Belt and braces: strip table privileges the public roles never need.
revoke all on public.inquiries, public.subscribers from anon, authenticated;
revoke insert, update, delete on public.chapters, public.events, public.members, public.stories,
  public.testimonials, public.sponsors from anon, authenticated;
grant select on public.chapters, public.events, public.members, public.stories,
  public.testimonials, public.sponsors to anon, authenticated;
