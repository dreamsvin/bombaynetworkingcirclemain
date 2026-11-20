/**
 * Seed data. Two jobs:
 *   1. The site renders from this when Supabase env vars are absent (local dev, first deploy).
 *   2. scripts/build-seed-sql.ts turns it into supabase/seed.sql, so the DB starts with the same rows.
 *
 * Types are the generated Supabase Row types — never hand-written.
 *
 * Rule: anything not confirmed by BNC carries "[PLACEHOLDER — replace before launch]" in a visible field and
 * is_published = false. Placeholders render only when NEXT_PUBLIC_SHOW_PLACEHOLDERS=true (preview builds), and
 * the DB constraint stops testimonials/stories/members publishing without consented_on.
 */
import type { Tables } from "@/lib/supabase/database.types";

export const PLACEHOLDER = "[PLACEHOLDER — replace before launch]";

const T = "2026-11-20T00:00:00.000Z";
const meta = { created_at: T, updated_at: T };

type Chapter = Tables<"chapters">;
type Event = Tables<"events">;
type Member = Tables<"members">;
type Story = Tables<"stories">;
type Testimonial = Tables<"testimonials">;
type Sponsor = Tables<"sponsors">;

const chapter = (c: Partial<Chapter> & Pick<Chapter, "slug" | "city" | "state" | "latitude" | "longitude" | "intro" | "sort_order">): Chapter => ({
  id: `00000000-0000-4000-8000-0000000000${String(c.sort_order).padStart(2, "0")}`,
  status: "active",
  launched_on: null,
  lead_name: null,
  lead_photo: null,
  member_count: null,
  member_count_as_of: null,
  cover_image: null,
  is_flagship: false,
  is_published: true,
  ...meta,
  ...c,
});

/** The eight chapters, confirmed by BNC on 20 Nov 2026. This is the only city list on the site. */
export const CHAPTERS: Chapter[] = [
  chapter({
    slug: "mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    is_flagship: true,
    latitude: 19.076,
    longitude: 72.8777,
    sort_order: 10,
    cover_image: "/photos/meetup-garden-room.webp",
    intro:
      "Where BNC started. The flagship chapter runs the most rooms in the circle — founder networking, startup conversations and pitch sessions in cafés and studios across the city.",
  }),
  chapter({
    slug: "bangalore",
    city: "Bangalore",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    sort_order: 20,
    intro: "Rooms for Bangalore's product founders, engineers and operators — people who build software and want to meet the people who sell, fund and hire for it.",
  }),
  chapter({
    slug: "delhi-ncr",
    city: "Delhi NCR",
    state: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    sort_order: 30,
    intro: "One chapter across Delhi, Gurugram and Noida, for founders and operators who would rather meet across the table than across a feed.",
  }),
  chapter({
    slug: "pune",
    city: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    sort_order: 40,
    intro: "Pune's founders, freelancers and students in one room — close enough to Mumbai that members move between both chapters.",
  }),
  chapter({
    slug: "hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.385,
    longitude: 78.4867,
    sort_order: 50,
    intro: "Rooms for Hyderabad's builders — first-time founders, tech operators and the freelancers who work with them.",
  }),
  chapter({
    slug: "ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
    sort_order: 60,
    intro: "One of BNC's newer chapters, for Ahmedabad founders and family-business successors building something of their own.",
  }),
  chapter({
    slug: "nashik",
    city: "Nashik",
    state: "Maharashtra",
    latitude: 19.9975,
    longitude: 73.7898,
    sort_order: 70,
    intro: "Proof that founder rooms aren't only for metros. Nashik's builders meet locally and plug into the circle across eight cities.",
  }),
  chapter({
    slug: "surat",
    city: "Surat",
    state: "Gujarat",
    latitude: 21.1702,
    longitude: 72.8311,
    sort_order: 80,
    intro: "For Surat's founders and operators — textile, diamond and D2C businesses alongside new tech startups.",
  }),
];

const byCity = (slug: string) => CHAPTERS.find((c) => c.slug === slug)!.id;

const event = (e: Partial<Event> & Pick<Event, "slug" | "chapter_id" | "title" | "starts_at" | "format">, n: number): Event => ({
  id: `00000000-0000-4000-9000-0000000000${String(n).padStart(2, "0")}`,
  summary: null,
  ends_at: null,
  venue: null,
  venue_address: null,
  luma_url: null,
  cover_image: null,
  capacity: null,
  who_attends: null,
  agenda: null,
  is_published: false,
  ...meta,
  ...e,
});

/**
 * No real event rows yet — Luma is the live source and is embedded on /events and every city page.
 * These placeholders exist so the event templates can be reviewed. Replace with real events (CONTENT-TODO).
 */
export const EVENTS: Event[] = [
  event(
    {
      slug: "placeholder-mumbai-founder-evening",
      chapter_id: byCity("mumbai"),
      title: `Founder evening — Mumbai ${PLACEHOLDER}`,
      summary: "Stage-grouped founder networking. Replace this row with the next real Mumbai event from Luma.",
      starts_at: "2026-12-12T13:30:00.000Z",
      ends_at: "2026-12-12T16:00:00.000Z",
      venue: `Venue ${PLACEHOLDER}`,
      venue_address: "Mumbai, Maharashtra",
      luma_url: "https://luma.com/embed/calendar/cal-vDOs5j3wARFnY6V/events",
      format: "founder_networking",
      capacity: 40,
      who_attends: "Founders from idea stage to post-revenue, plus operators and freelancers who work with startups.",
      agenda: [
        { time: "19:00", item: "Arrive and get placed" },
        { time: "19:20", item: "One-line introductions" },
        { time: "20:00", item: "Hosted conversation" },
        { time: "20:45", item: "Open floor and introductions" },
      ],
    },
    1,
  ),
  event(
    {
      slug: "placeholder-bangalore-startup-conversations",
      chapter_id: byCity("bangalore"),
      title: `Startup conversations: hiring your first five — Bangalore ${PLACEHOLDER}`,
      summary: "A hosted discussion. Replace with a real Bangalore event.",
      starts_at: "2026-12-19T12:30:00.000Z",
      venue: `Venue ${PLACEHOLDER}`,
      venue_address: "Bangalore, Karnataka",
      luma_url: "https://luma.com/embed/calendar/cal-vDOs5j3wARFnY6V/events",
      format: "startup_conversations",
      capacity: 30,
    },
    2,
  ),
  event(
    {
      slug: "placeholder-pune-workshop",
      chapter_id: byCity("pune"),
      title: `Workshop: writing a one-line ask — Pune ${PLACEHOLDER}`,
      summary: "A hands-on workshop. Replace with a real Pune event.",
      starts_at: "2027-01-09T05:30:00.000Z",
      venue: `Venue ${PLACEHOLDER}`,
      venue_address: "Pune, Maharashtra",
      luma_url: "https://luma.com/embed/calendar/cal-vDOs5j3wARFnY6V/events",
      format: "workshop",
      capacity: 25,
    },
    3,
  ),
  event(
    {
      slug: "placeholder-mumbai-past-pitch-night",
      chapter_id: byCity("mumbai"),
      title: `Pitch session — Mumbai ${PLACEHOLDER}`,
      summary: "A past event, here to show the archive layout. Replace with real past events and two photos each.",
      starts_at: "2026-10-17T13:30:00.000Z",
      venue: `Venue ${PLACEHOLDER}`,
      venue_address: "Mumbai, Maharashtra",
      format: "pitch_session",
      cover_image: "/photos/tile-talk-garden.webp",
    },
    4,
  ),
];

const member = (m: Partial<Member> & Pick<Member, "name">, n: number): Member => ({
  id: `00000000-0000-4000-a000-0000000000${String(n).padStart(2, "0")}`,
  role: null,
  company: null,
  city: null,
  photo: null,
  linkedin: null,
  is_featured: false,
  team_role: null,
  team_order: null,
  consented_on: null,
  is_published: false,
  ...meta,
  ...m,
});

export const MEMBERS: Member[] = [
  member(
    {
      name: "Isha Ostwal",
      role: "Founder",
      company: "Bombay Networking Circle · DreamSVin",
      city: "Mumbai",
      photo: "/photos/founder-isha-ostwal.webp",
      team_role: "Founder",
      team_order: 1,
      // Founder's own photo and bio, from her public site. Confirm in CONTENT-TODO.
      consented_on: "2026-11-20",
      is_published: true,
    },
    1,
  ),
  member({ name: `Featured member ${PLACEHOLDER}`, role: "Founder", company: "Company name", city: "Mumbai", is_featured: true }, 2),
  member({ name: `Featured member ${PLACEHOLDER}`, role: "Operator", company: "Company name", city: "Bangalore", is_featured: true }, 3),
  member({ name: `Featured member ${PLACEHOLDER}`, role: "Freelance designer", company: "Independent", city: "Pune", is_featured: true }, 4),
];

export const STORIES: Story[] = [
  {
    id: "00000000-0000-4000-b000-000000000001",
    slug: "placeholder-cofounder-match",
    member_id: null,
    chapter_id: byCity("mumbai"),
    headline: `How a BNC introduction became a co-founder ${PLACEHOLDER}`,
    problem: "Describe what the member needed before the event, in their words.",
    connection: "Describe who they met, at which event, and who made the introduction.",
    body: "Write the story in three to five short paragraphs. Name real people and companies only with their written consent, and set consented_on in the database before publishing.",
    outcome: "State the outcome as a fact the member has confirmed.",
    consented_on: null,
    is_published: false,
    ...meta,
  },
  {
    id: "00000000-0000-4000-b000-000000000002",
    slug: "placeholder-first-client",
    member_id: null,
    chapter_id: byCity("bangalore"),
    headline: `A freelancer's first retainer client, from one room ${PLACEHOLDER}`,
    problem: "Describe the problem.",
    connection: "Describe the connection.",
    body: "Replace with a real, consented story.",
    outcome: "State the confirmed outcome.",
    consented_on: null,
    is_published: false,
    ...meta,
  },
];

export const TESTIMONIALS: Testimonial[] = [1, 2, 3].map((n) => ({
  id: `00000000-0000-4000-c000-00000000000${n}`,
  author_name: `Member name ${PLACEHOLDER}`,
  author_role: "Role, Company",
  author_photo: null,
  quote: "A real member's words go here, with their written consent recorded in consented_on. Two or three sentences about what changed for them.",
  chapter_id: CHAPTERS[n - 1].id,
  consented_on: null,
  is_published: false,
  ...meta,
}));

/**
 * The previous site showed these ten logos under "Trusted by leading brands & ecosystems" with no stated
 * relationship. Several also appear as DreamSVin clients, so BNC's relationship to each is unconfirmed.
 * They stay unpublished until BNC confirms each one as a sponsor or partner and has permission to show the logo.
 * (The old site's Razorpay mention was unverified and has been dropped entirely.)
 */
const legacyBrand = (n: number, name: string, file: string): Sponsor => ({
  id: `00000000-0000-4000-d000-0000000000${String(n).padStart(2, "0")}`,
  name: `${name} ${PLACEHOLDER}`,
  logo: `/partners/${file}`,
  tier: "community",
  url: null,
  is_partner: true,
  is_published: false,
  ...meta,
});

export const SPONSORS: Sponsor[] = [
  legacyBrand(1, "Eureka Forbes", "brand1.webp"),
  legacyBrand(2, "Willstar Media", "brand2.webp"),
  legacyBrand(3, "Unidentified brand (green mark)", "brand3.webp"),
  legacyBrand(4, "Yog Sadhak", "brand4.webp"),
  legacyBrand(5, "K's Charcoal", "brand5.webp"),
  legacyBrand(6, "Prustlr", "brand6.webp"),
  legacyBrand(7, "BHIVE", "brand7.webp"),
  legacyBrand(8, "Culture", "brand8.webp"),
  legacyBrand(9, "Analogy", "brand9.webp"),
  legacyBrand(10, "Pickle Pakoza Open", "brand10.webp"),
];
