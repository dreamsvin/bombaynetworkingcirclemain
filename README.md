# Bombay Networking Circle — website

The site for [Bombay Networking Circle](https://www.bombaynetworkingcircle.com): free, hosted founder rooms in eight Indian cities.
One job: a stranger understands BNC in 30 seconds, sees it's real, finds their city and knows what to do next.

**Funnel:** Discover → *Find your circle* (`/chapters`) → city page → next event → RSVP (Luma, with email capture) → WhatsApp community (second ask, never first) → contribute (lead, speak, sponsor).

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript strict · Tailwind v4 (closed token scales) · Supabase (Postgres + RLS) · Vercel.
Conventions mirror `AkshatRathod7/main-website` (`content/`, `tokens/`, `lib/`, `components/`, `docs/`).

```
app/                routes (Server Components by default; ISR 10 min on data pages)
components/ui/      Button, Section/Container, cards, StatBar, Testimonial, EventListItem, CityMap, Accordion, fields, Breadcrumbs, EmptyState
components/site/    Header, MobileNav, Footer, Logo, PrimaryCta, TrackedLink, search, legal shell
components/forms/   InquiryForm (contact/sponsor/start-chapter/partner), SubscribeForm (newsletter/RSVP/city notify)
content/            site.ts (facts, nav, stats + as-of date), seed.ts (typed fallback data = DB seed), faq, posts, photos
lib/                data.ts (Supabase or seed), supabase/ (typed clients + generated types), schemas (Zod), rate-limit, seo, og
supabase/           migrations (schema + RLS + consent constraints), seed.sql (generated), tests/rls.sql
tokens/             build_tokens.py → design-tokens.json + contrast-matrix.md (fails on any AA miss)
scripts/            fetch-photos (prebuild), build-seed-sql, gen-types, crawl
assets/             previous site's source photos and logos (processed into public/ at build)
```

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000 — renders from content/seed.ts without Supabase
NEXT_PUBLIC_SHOW_PLACEHOLDERS=true npm run dev   # also show [PLACEHOLDER] rows, badged
```

`npm run build` runs `scripts/fetch-photos.mjs` first (pulls/crops/grades photos into `public/photos`, logos into `public/partners`).

## Data

* The city list exists once: the `chapters` table (or `content/seed.ts` before Supabase is connected). Nav, footer, FAQ, map, filters and forms all read it.
* Every stat renders with its as-of date (`content/site.ts → STATS`).
* Testimonials, stories and member profiles **cannot** be published without `consented_on` — enforced by a Postgres CHECK constraint and by RLS.
* Types in `lib/supabase/database.types.ts` are generated (`npm run db:types`), never hand-written.
* Placeholders: rows containing `[PLACEHOLDER — replace before launch]` stay `is_published = false`. They render only when `NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`.

## Verification (run 20 Nov 2026, local production build)

* `npm run build` — 0 TypeScript errors; `npm run lint` — 0 errors, 0 warnings.
* `npm run crawl` — 29 internal URLs (35 in preview mode), 0 × 404, 0 × `#` hrefs; every sitemap URL resolves.
* Screenshots of every page at 360 / 768 / 1440 px; no horizontal overflow; exactly one `<h1>` per page.
* Lighthouse (mobile, local): Accessibility 100, Best Practices 100, SEO 100 on all pages tested; Performance 89–100 (home varies 89–97 between runs on the sandbox CPU). **Re-run on the deployed URL** — see `docs/DEPLOY.md`.
* Keyboard-only funnel: skip link → *Find your circle* → Mumbai → event → email → RSVP continues to Luma; mobile menu traps focus and Escape returns it.
* Forms: empty submits show field errors and keep typed values; valid submits pass validation and reach the DB step; 5th submission in 10 min is rate-limited.
* `supabase/tests/rls.sql` on Postgres 16 with Supabase roles: anon reads only published rows, cannot read or write `inquiries`/`subscribers`, consent constraint rejects unconsented publishing.

See `CONTENT-TODO.md` for everything that must be supplied before launch and `docs/DEPLOY.md` to go live.
