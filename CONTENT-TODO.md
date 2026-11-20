# CONTENT-TODO — everything to supply, confirm or replace before launch

Status as of **20 November 2026**. Nothing on this list is invented on the live site: unconfirmed rows are stored
unpublished and only appear on preview builds (`NEXT_PUBLIC_SHOW_PLACEHOLDERS=true`) with a red **Placeholder** badge.
Find them in code with: `grep -rn "PLACEHOLDER" content/`.

Legend: 🔴 blocks launch · 🟠 should fix before launch · 🟢 can follow after launch

---

## 1. Facts and numbers to confirm

| # | Item | Where it shows | Current value | Status |
|---|---|---|---|---|
| 1.1 | Member count + date | Hero, stat bar, OG image, sponsor page | **1,000+ as of November 2026** | Confirmed by BNC 20 Nov 2026 (note: an earlier conversation mentioned 1,500 / 10 cities — pick one and update `content/site.ts → STATS`) 🟠 |
| 1.2 | Events held | Stat bar, hero ("50+ events since 2025") | 50+ | Carried from old site; confirm count + dates of the last six events 🟠 |
| 1.3 | Collaborations | Stat bar | 150+ (labelled "self-reported") | Carried from old site; confirm how it's counted 🟠 |
| 1.4 | Cities | Everywhere (from `chapters` table) | 8: Mumbai, Bangalore, Delhi NCR, Pune, Hyderabad, Ahmedabad, Nashik, Surat | Confirmed 20 Nov 2026. Jaipur & Goa removed from FAQ. ✅ |
| 1.5 | Founding year | Hero, about, JSON-LD | 2025 (from Isha's site timeline) | Confirm 🟠 |
| 1.6 | Event frequency | Hero 20-second test | Not stated (only "50+ events since 2025") | Supply a true cadence, e.g. "every month in Mumbai" 🟠 |
| 1.7 | Chapter status per city | Chapter cards / directory | All "active" | Confirm which are active vs launching (old site called Ahmedabad "New chapter", Bangalore "Fastest growing", Mumbai "20+ events") 🟠 |
| 1.8 | Chapter launch dates | `chapters.launched_on` | empty | Supply 🟢 |
| 1.9 | Members per chapter + as-of date | City pages ("Members here") | empty → shows "Part of 1,000+ across India" | Supply (DB enforces a date with every count) 🟢 |
| 1.10 | Is every event free? | FAQ "Does it cost anything?", event pages ("Cost: Free"), Event JSON-LD price 0 | "Free; Luma shows final details" | Confirm. If some events are ticketed, add a price column 🔴 |
| 1.11 | Old sponsor page audience mix | `/sponsor` | Segments shown **without** the old 45/25/20/10 % split | Re-confirm the percentages before showing them 🟢 |
| 1.12 | Room format timings | Home "What happens in a room", event agenda fallback | Steps only, no times | Confirm the real run-of-show and times 🟠 |

## 2. People, testimonials, stories — consent required

The database **rejects** publishing any testimonial, story or member profile without `consented_on` (CHECK constraint).

| # | Item | Current state | Needed |
|---|---|---|---|
| 2.1 | Testimonials (3 rows) | `[PLACEHOLDER]` rows, unpublished. Old site's Aarav Shah, Ananya Joshi, Vikram Malhotra, Riya Sen **removed** (unverifiable; their avatars were AI-generated stock faces). | 5 real quotes: name, role, company, headshot, written consent date 🔴 |
| 2.2 | Success stories (2 rows) | `[PLACEHOLDER]` rows, unpublished. Old site's DevFlow AI, Zyra Health, Razorpay internship, Creative Catalyst ₹5 Lakh retainer, FitLife & HealthyBites **removed**. | Real stories with problem / connection / outcome + consent 🟠 |
| 2.3 | Featured members (3 rows) | `[PLACEHOLDER]` rows, unpublished. Old site's "Meet the community" profiles (Devanshu Sen, Aniketh Roy, Kiara Patel, Sahil Gupta, Meera Nair, Arjun Kapoor) **removed**. | Real members + consent + photos 🟢 |
| 2.4 | Isha Ostwal profile | Published, `consented_on` 2026-11-20, photo from her own site | Isha to confirm photo choice and bio line 🟠 |
| 2.5 | City leads | All 8 `lead_name` empty → pages say "Being appointed" + "Apply to lead" | Name + photo + LinkedIn for each lead 🟠 |
| 2.6 | Team / volunteers | Only Isha listed | 3–5 people: name, role, headshot, LinkedIn (add as `members` rows with `team_role`) 🟢 |

## 3. Copy to review (written for this build — approve or edit)

| # | Page | What to check |
|---|---|---|
| 3.1 | `/about` "Why I started it" | First-person draft in Isha's voice, built from her public bio. **Isha must approve** 🔴 |
| 3.2 | `/about/story` | Long-form founder narrative ("the system was broken"). Facts used: pharmacy grad, JITO, JIIF National Convenor (80+ chapters), BNC founded 2025. Claims to confirm: "other cities asked for the same format", "Sponsors and partners cover what costs money" 🔴 |
| 3.3 | Home founder note | Quote "Most networking events are contact-swapping…" is a paraphrase of the old site — Isha to approve wording 🔴 |
| 3.4 | Chapter intros (8) | One-paragraph city descriptions in `content/seed.ts` — check each for accuracy (e.g. Delhi NCR covering Gurugram & Noida; Surat's sector mix) 🟠 |
| 3.5 | `/chapters/start` | "What BNC provides" (onboarding with Isha, promotion, partner intros) and "We reply to every application" — confirm BNC can commit to these 🟠 |
| 3.6 | `/sponsor` | Three offerings taken from the old sponsor page (event, community, brand activation) — confirm still offered; confirm "Sponsors don't get member contact data" 🟠 |
| 3.7 | `/community` benefits | "Partner perks: startup tools and credits" — confirm there are live perks 🟠 |
| 3.8 | Blog (3 posts) | Advice pieces by "BNC team" — review voice; replace author with a person if preferred 🟢 |
| 3.9 | FAQ | Mentions "Founders in Making 101" (from the old site) — confirm this room still runs 🟢 |

## 4. Policies — legal review

| # | Item | Status |
|---|---|---|
| 4.1 | `/privacy` | Full draft for India's DPDP Act 2023: data collected, processors (Supabase, Vercel, Luma, email provider, WhatsApp), retention, rights, grievance officer. **Needs a lawyer's review**, and a named grievance officer 🔴 |
| 4.2 | `/terms` | Full draft (events, photography, introductions, liability, Mumbai jurisdiction). **Legal review** 🔴 |
| 4.3 | `/code-of-conduct` | Full draft with reporting + enforcement. BNC to confirm it's what hosts will enforce 🟠 |
| 4.4 | Legal entity | Policies say "Bombay Networking Circle". If BNC is run through a company (e.g. DreamSVin) or trust, the policies must name it 🔴 |

## 5. Assets to supply

| # | Asset | Current state | Needed |
|---|---|---|---|
| 5.1 | Logo | Traced to SVG from the round coffee-cup seal you sent (`public/brand/bnc-seal.svg`, `bnc-mark.svg`, light version). Pharmacy-template logo deleted. | Original vector files from the designer (SVG/AI), to replace the trace 🟠 |
| 5.2 | Brand colours | Accent `#815936` sampled from the logo; rest of palette derived (see `tokens/`) | Confirm or supply official values 🟢 |
| 5.3 | Event photos | 11 frames from Isha's site + 16 from the old site's `assets/` | 15–20 high-res landscape shots, people mid-conversation 🟠 |
| 5.4 | Which city each photo is from | Old site labelled 8 photos by city (mumbai.jpg … surat.jpg) but at least `hyderabad.jpg` and `nashik.jpg` appear to be the same venues as the Mumbai collage, so they are used as **general** photos. Only Mumbai shows a city gallery. | Tell us the true city of each photo; then set `chapters.cover_image` and city galleries 🟠 |
| 5.5 | Sponsor / partner logos | 10 logos from the old site (Eureka Forbes, Willstar Media, an unidentified green mark, Yog Sadhak, K's Charcoal, Prustlr, BHIVE, Culture, Analogy, Pickle Pakoza Open) stored **unpublished**. Several are also DreamSVin clients. | For each: is it a BNC sponsor, partner, or neither? Permission to show the logo? Name of the green-mark brand? 🔴 before showing any |
| 5.6 | OG image | Generated (`app/opengraph-image.tsx`) from the logo + positioning line | Optional: a designed 1200×630 with a real photo 🟢 |
| 5.7 | Isha headshot | `founder-isha-ostwal.webp` (WEF office photo) | Optional: a dedicated portrait 🟢 |

## 6. Links, contact and accounts

| # | Item | Current value | Status |
|---|---|---|---|
| 6.1 | Contact email | grow@dreamsvin.com (DreamSVin inbox) | Swap for a BNC address (e.g. hello@bombaynetworkingcircle.com) when it exists 🟠 |
| 6.2 | Phone | none shown | Optional 🟢 |
| 6.3 | WhatsApp invite | https://chat.whatsapp.com/CNi2Xu2pTWe5SAyMkgVuTU (tracking params removed) | Confirm still valid ✅ |
| 6.4 | Luma calendar | `cal-vDOs5j3wARFnY6V` (embed works). Click-outs use the embed URL. | Supply the public calendar URL (`lu.ma/<handle>`) for nicer click-outs → `content/site.ts LINKS.lumaCalendar` 🟠 |
| 6.5 | Per-event Luma URLs | none (no real event rows yet) | Add real events to the `events` table with `luma_url` 🔴 |
| 6.6 | LinkedIn | https://www.linkedin.com/company/bombay-networking-circle (from old site footer) | Confirm the page exists 🟠 |
| 6.7 | Instagram | none | Supply handle → `LINKS.instagram` 🟠 |
| 6.8 | Twitter/X | old site linked `twitter.com/bnc_hq` — **not used** (unverified) | Supply if real 🟢 |
| 6.9 | LinkedIn Insight tag | Old site had one; not carried over (needs cookie-consent decision) | Decide 🟢 |
| 6.10 | Email delivery (double opt-in) | Code ready (Resend). Without `RESEND_API_KEY`, sign-ups stay unconfirmed. | Create Resend account + verify sending domain 🟠 |
| 6.11 | Domain + DNS | bombaynetworkingcircle.com | Point to Vercel (see `docs/DEPLOY.md`) 🔴 |

## 7. Data to load into Supabase

- Real **events** (next 3 per city + last 6 past events with 2 photos each) 🔴
- Real **testimonials** / **stories** with `consented_on` set 🔴
- City **lead** names and photos 🟠
- Confirmed **sponsors / partners** (`is_published = true` only after permission) 🟠
- After editing rows: `POST /api/revalidate` with `x-revalidate-secret`, or wait ≤10 minutes (ISR).

## 8. Launch switches

- [ ] `NEXT_PUBLIC_SHOW_PLACEHOLDERS` unset/false on Production (true on Preview only)
- [ ] Supabase env vars set on Vercel; one test submission per form lands in `inquiries` / `subscribers`
- [ ] Lighthouse ≥ 95 on the **deployed** URL (local runs: see README "Verification")
- [ ] Old URLs redirect (`/index.html`, `/sponsor.html` already handled in `next.config.ts`)
- [ ] Paste the URL in WhatsApp to check the preview card
- [ ] Google Search Console: verify domain, submit `/sitemap.xml`
