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
