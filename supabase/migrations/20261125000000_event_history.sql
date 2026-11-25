-- Event history from Luma (Nov 2026 revamp).
-- BNC runs more than founder mixers: industry rooms, an online Power Hour, wellness resets and career rooms.
-- Most rooms are ticketed (₹399–₹999, paid by UPI after registering on Luma), so the free-only assumption is dropped.

alter type public.event_format add value if not exists 'industry_room';
alter type public.event_format add value if not exists 'power_hour';
alter type public.event_format add value if not exists 'wellness';
alter type public.event_format add value if not exists 'career';

alter table public.events
  add column if not exists price_inr integer check (price_inr is null or price_inr >= 0),
  add column if not exists registrations integer check (registrations is null or registrations >= 0),
  add column if not exists is_online boolean not null default false,
  add column if not exists poster text,
  add column if not exists speakers jsonb,
  add column if not exists partners jsonb,
  add column if not exists gallery jsonb;

comment on column public.events.price_inr is 'Ticket price in rupees as published on the Luma page. null = not published; 0 = free.';
comment on column public.events.registrations is 'Approved registrations on Luma at the time the row was written (not check-ins).';
comment on column public.events.speakers is 'Array of {name, role}. Only people named on the public Luma page.';
comment on column public.events.partners is 'Array of {name, role}. Collaborators named on the public Luma page.';
comment on column public.events.gallery is 'Array of {src, width, height, alt}. BNC''s own photos from the event.';
