# Deploy: Supabase + Vercel (about 15 minutes)

## 1. Supabase

1. Create a project (region: **Mumbai, ap-south-1**).
2. SQL editor → run `supabase/migrations/20261120000000_init.sql`, then `supabase/seed.sql`.
   (Or with the CLI: `npx supabase link --project-ref <ref> && npx supabase db push && psql "$DB_URL" -f supabase/seed.sql`.)
3. Verify RLS (optional but recommended): run `supabase/tests/rls.sql` in the SQL editor. Every line should say PASS.
   Quick manual check with the anon key — this must return an error or `[]`:
   ```bash
   curl "https://<ref>.supabase.co/rest/v1/inquiries?select=*" -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>"
   ```
4. Regenerate types if you change the schema: `SUPABASE_PROJECT_ID=<ref> npm run db:types`.

## 2. Vercel

1. New Project → import the GitHub repo. Framework: Next.js (auto). Build command: default (`npm run build` runs the photo pipeline first).
2. Environment variables (Production **and** Preview unless noted):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.bombaynetworkingcircle.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key — **never** prefix with NEXT_PUBLIC |
| `NEXT_PUBLIC_SHOW_PLACEHOLDERS` | `true` on **Preview only**; unset on Production |
| `REVALIDATE_SECRET` | any long random string |
| `RESEND_API_KEY`, `MAIL_FROM` | optional, for double opt-in emails |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | optional, shared rate limiting |

3. Analytics → enable Web Analytics (custom events: `cta_click`, `city_select`, `rsvp_click`, `whatsapp_click`, `form_submit`).
4. Domains → add `bombaynetworkingcircle.com` and `www.bombaynetworkingcircle.com`; set www as primary (non-www redirects). Update DNS at the registrar as Vercel shows.

## 3. After the first deploy

- Submit each form once (contact, sponsor, start a chapter, partners, footer newsletter, an RSVP) and check rows in `inquiries` / `subscribers`.
- Lighthouse on the deployed URL (mobile): `npx lighthouse https://www.bombaynetworkingcircle.com --form-factor=mobile`.
- `BASE=https://www.bombaynetworkingcircle.com npm run crawl`.
- Paste the URL into WhatsApp to check the preview card. Submit `/sitemap.xml` in Google Search Console.
- After editing content in Supabase: `curl -X POST https://<domain>/api/revalidate -H "x-revalidate-secret: $REVALIDATE_SECRET"`.
