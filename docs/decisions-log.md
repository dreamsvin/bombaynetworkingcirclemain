# Decisions log

**20 Nov 2026 — build v1**

1. **One primary CTA label: "Find your circle" → /chapters**, including the header button. The brief asked for a header button reading "Join the Circle" *and* a single repeated primary CTA "Find your circle"; one label everywhere won (Akshat's revamp plan: "One CTA label across the whole site"). Change it in one place: `content/site.ts → PRIMARY_CTA`.
2. **WhatsApp is step 4.** It appears only after an RSVP prompt (NextStep blocks on city/event pages, the community page) and in the footer — never in a hero.
3. **City list = chapters table.** Confirmed list: Mumbai, Bangalore, Delhi NCR, Pune, Hyderabad, Ahmedabad, Nashik, Surat. Jaipur and Goa (old FAQ) dropped.
4. **Stats:** 1,000+ members / 8 cities / 50+ events / 150+ collaborations, as of November 2026 (confirmed by BNC; collaborations labelled self-reported).
5. **Palette from the logo.** Accent `#815936` (logo brown) for CTAs only; ink `#1C1915`, paper `#FAF7F2`, clay support. Caramel `#D9A877` is the CTA on dark sections. All pairs AA-checked in `tokens/contrast-matrix.md`.
6. **Type:** Newsreader (display, self-hosted variable) + Public Sans (body). Editorial lane, no gradients/glass.
7. **Map without borders.** Cities plotted by lat/long on a graticule; no country outline (an inaccurate India border is worse than none).
8. **Placeholders never reach production.** Seed rows with `[PLACEHOLDER…]` are unpublished; preview builds show them badged.
9. **Old-site assets:** real event photos and the city-labelled photos are used as general BNC photos (city labels unverified); AI-generated avatar images and the pharmacy-template logo were deleted; ten brand logos kept unpublished until relationships are confirmed.
10. **Sponsor offerings** follow the old sponsor page's three models; percentages withheld until re-confirmed.
11. **No CMS on day one.** Supabase is the CMS for events/people/proof; copy lives in `content/`.
12. **Package lockfile** is not committed (the GitHub connector used to push cannot carry large files). Versions are pinned in `package.json`; run `npm install` locally and commit `package-lock.json` from a normal git checkout.

**25 Nov 2026 — revamp v2: real history and assets**

1. **Sources:** Luma (calendar `bnc`, 17 events with descriptions, prices, speakers, guest counts), Google Drive (BNC brand guidelines, ICP & mission doc, master sheet, Delhi/Masters' Union photo+video folders, posters, recap carousels), Gmail (K's Charcoal logo, Pune breakfast meetup poster context).
2. **Brand follows the official guidelines PDF**, replacing the palette sampled from the logo: Anchor Black #1A1612, Deep Brown #7C5C38 (CTA on cream, 6:1 with white), BNC Gold #C68536 (rules and accents only), Warm Glow #EFBC6F (CTA on black), Cream #F9F5EF; Playfair Display + DM Sans. One gold rule per composition (`.gold-rule`).
3. **Not free.** Most rooms are ticketed (₹399–₹999 via UPI after Luma registration). All "free" claims removed except "joining is free". Events table gains `price_inr` (null = not published, never guessed).
4. **New formats** in the enum: industry_room, power_hour, wellness, career (migration 20261125000000). Online events (`is_online`) are attached to the Pune chapter, where the Power Hour series is listed on Luma.
5. **Stats are recomputed from records**: 1,500+ members (Isha), 8 cities hosted, 20+ rooms, 440+ Luma seats. Old 50+/150+ dropped.
6. **Luma covers are hot-linked** from images.lumacdn.com through next/image (remotePatterns), so the art matches Luma exactly. Cards prefer BNC's own photo when one exists ("faces over illustrations").
7. **Curated media is committed** under `public/media/` (WebP + muted H.264), unlike `public/photos/` which is generated at build. Originals stay in Drive.
8. **Hero is a 6-second muted loop** of the Career Connect room, with a pause control and reduced-motion respected.
9. **New pages/sections:** /gallery; recent rooms, formats-with-counts, speakers, pillars, partner strip on home; journey + values on /about; timeline built from the events table on /about/story; per-event speakers, partners, gallery, poster and ticket.
10. `script.js` (old static site) is excluded from lint; it was the only lint failure on main.
