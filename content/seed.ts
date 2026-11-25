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
import { EVENT_GALLERIES, MEDIA } from "@/content/media";

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

/**
 * The eight chapters, confirmed by BNC on 20 Nov 2026. This is the only city list on the site.
 * Intros and launch dates are written from the Luma calendar (first room in each city), Nov 2026.
 */
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
      "The city in the name, and home to BNC's newest format: the Real Estate Room, an invite-only evening at Dextrus, Lower Parel, in October 2026 — 40 developers, investors and advisors around one question: where should we build and invest next?",
  }),
  chapter({
    slug: "bangalore",
    city: "Bangalore",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    sort_order: 20,
    launched_on: "2026-04-20",
    intro: "Opened in April 2026 with the Builder / Founder Mixer at BHIVE HSR: a curated 40-person room for founders, operators and creators who are actively building. 42 registered.",
  }),
  chapter({
    slug: "delhi-ncr",
    city: "Delhi NCR",
    state: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    sort_order: 30,
    launched_on: "2025-12-06",
    cover_image: "/media/events/career-connect-delhi-2026/group.webp",
    intro: "One chapter across Delhi, Gurugram and Noida. Two rooms so far: a café meetup at Fika, Hauz Khas Village (39 registered), and Career Connect at Masters' Union, Gurugram, with Re-Defined and Metvy (55 registered).",
  }),
  chapter({
    slug: "pune",
    city: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    sort_order: 40,
    launched_on: "2025-09-20",
    cover_image: "/media/events/pune-meetup-2025-09/group.webp",
    intro: "BNC's most active chapter, and the first room on its calendar (September 2025). Since then: breakfast meetups, a vision-board morning, ice-bath resets, a pitch-under-pressure challenge, Let's Talk AI and the online Power Hour.",
  }),
  chapter({
    slug: "hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.385,
    longitude: 78.4867,
    sort_order: 50,
    launched_on: "2025-10-05",
    intro: "Opened on 5 October 2025 with a café meetup at Third Wave Coffee, Banjara Hills, presented with Thirdspace. It filled to its last few seats.",
  }),
  chapter({
    slug: "ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
    sort_order: 60,
    launched_on: "2026-03-07",
    intro: "Opened in March 2026 at K's Charcoal, Thaltej, with CA Shubham Maloo and Sumit Sengar. 208 people registered for 30 seats — the most selective BNC room yet.",
  }),
  chapter({
    slug: "nashik",
    city: "Nashik",
    state: "Maharashtra",
    latitude: 19.9975,
    longitude: 73.7898,
    sort_order: 70,
    launched_on: "2025-10-12",
    cover_image: "/media/events/nashik-meetup-2025-10/room.webp",
    intro: "Proof that founder rooms aren't only for metros. Opened in October 2025 at Four Lost Cats, College Road — no panels, just conversations.",
  }),
  chapter({
    slug: "surat",
    city: "Surat",
    state: "Gujarat",
    latitude: 21.1702,
    longitude: 72.8311,
    sort_order: 80,
    launched_on: "2025-11-09",
    intro: "Opened in November 2025 at ELK Espresso, Vesu, with LinkedIn creator CA Meher Kaur. Theme: not your regular networking.",
  }),
];

const byCity = (slug: string) => CHAPTERS.find((c) => c.slug === slug)!.id;

const LUMA = "https://images.lumacdn.com";

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
  price_inr: null,
  registrations: null,
  is_online: false,
  poster: null,
  speakers: null,
  partners: null,
  gallery: null,
  is_published: true,
  ...meta,
  ...e,
});

const people = (...list: [string, string][]) => list.map(([name, role]) => ({ name, role }));
const gallery = (slug: string) => (EVENT_GALLERIES[slug] ?? null) as unknown as Event["gallery"];

/**
 * Every BNC room on record, newest last. Source: the "Bombay Networking Circle Events" calendar on Luma
 * (cal-vDOs5j3wARFnY6V), read on 25 Nov 2026 — names, dates, venues, prices, speakers and collaborators are as published
 * on each event's Luma page; `registrations` is the approved-guest count on that date. One room is not on Luma: the Pune
 * breakfast meetup of 25 Oct 2025 (poster in Drive, "BNC_Pune_Meetup (1).jpg"). Covers are the Luma artwork, served
 * from Luma's CDN. Photos are BNC's own, from Drive (content/media.ts).
 */
export const EVENTS: Event[] = [
  event(
    {
      slug: "pune-meetup-2025-09",
      chapter_id: byCity("pune"),
      title: "Bombay Networking Circle — Pune",
      summary:
        "The first room on BNC's calendar: an intimate, high-energy café meetup on networking, LinkedIn and personal brand, with practical strategies you can use the same week.",
      starts_at: "2025-09-20T10:30:00.000Z",
      ends_at: "2025-09-20T12:30:00.000Z",
      venue: "Mauji — The Time Cafe",
      venue_address: "Sahajeevan Society, ICS Colony, Bhoslenagar, Pune",
      luma_url: "https://luma.com/roc1c6gy",
      format: "founder_networking",
      cover_image: `${LUMA}/event-covers/3g/52c9eabc-d26a-4648-a702-d9be916c9aa0.jpg`,
      capacity: 40,
      price_inr: 499,
      registrations: 36,
      who_attends: "Entrepreneurs, freelancers, creators and professionals who want to grow their network and personal brand.",
      speakers: people(["Isha Ostwal", "Founder & CEO, DreamSVin · Networking strategist"], ["Yogesh Agarwal", "CEO, Revamp Tribe · LinkedIn and personal-branding strategist"]),
      gallery: gallery("pune-meetup-2025-09"),
    },
    1,
  ),
  event(
    {
      slug: "hyderabad-meetup-2025-10",
      chapter_id: byCity("hyderabad"),
      title: "Bombay Networking Circle — Hyderabad",
      summary: "BNC's first Hyderabad room: a café meetup in Banjara Hills, presented with Thirdspace. It filled to its last few seats.",
      starts_at: "2025-10-05T10:30:00.000Z",
      ends_at: "2025-10-05T12:30:00.000Z",
      venue: "Third Wave Coffee",
      venue_address: "Road No. 12, Banjara Hills, Hyderabad",
      luma_url: "https://luma.com/doricbbp",
      format: "founder_networking",
      cover_image: `${LUMA}/event-covers/7r/ce4c8a85-cd54-40c5-931e-a2b9ba83da68.jpg`,
      poster: MEDIA.poster_hyderabad.src,
      registrations: 19,
      partners: people(["Thirdspace", "Presenting partner"]),
    },
    2,
  ),
  event(
    {
      slug: "nashik-meetup-2025-10",
      chapter_id: byCity("nashik"),
      title: "Bombay Networking Circle — Nashik",
      summary: "No panels, just conversations. A café room on College Road for Nashik's founders and builders — scale faster, together.",
      starts_at: "2025-10-12T10:30:00.000Z",
      ends_at: "2025-10-12T12:30:00.000Z",
      venue: "Four Lost Cats",
      venue_address: "Gangapur Road, D. K. Nagar, Nashik",
      luma_url: "https://luma.com/5kdf69xg",
      format: "founder_networking",
      cover_image: `${LUMA}/event-covers/8l/8c7fac4d-40e8-4761-99a4-204ddc91901a.jpg`,
      poster: MEDIA.poster_nashik.src,
      capacity: 40,
      price_inr: 499,
      registrations: 21,
      gallery: gallery("nashik-meetup-2025-10"),
    },
    3,
  ),
  event(
    {
      slug: "pune-breakfast-meetup-2025-10",
      chapter_id: byCity("pune"),
      title: "Networking & conversations over coffee and breakfast — Pune",
      summary: "A Saturday-morning Pune meetup over coffee and breakfast on Law College Road.",
      starts_at: "2025-10-25T05:30:00.000Z",
      venue: "Crazy Cheesy",
      venue_address: "Law College Road, Pune",
      format: "founder_networking",
      poster: MEDIA.poster_pune_oct.src,
    },
    4,
  ),
  event(
    {
      slug: "surat-edition-2025-11",
      chapter_id: byCity("surat"),
      title: "Bombay Networking Circle — Surat Edition",
      summary: "Theme: not your regular networking. Surat's first BNC room, with LinkedIn creator CA Meher Kaur.",
      starts_at: "2025-11-09T10:30:00.000Z",
      ends_at: "2025-11-09T12:30:00.000Z",
      venue: "ELK Espresso",
      venue_address: "Homeland City, Vesu, Surat",
      luma_url: "https://luma.com/d5mdgz69",
      format: "founder_networking",
      cover_image: `${LUMA}/event-covers/3v/8fc01abc-4246-42bd-bbee-bcbe2bcb08c2.jpg`,
      poster: MEDIA.poster_surat.src,
      capacity: 35,
      price_inr: 499,
      registrations: 10,
      speakers: people(["Isha Ostwal", "Founder & CEO, DreamSVin · Networking strategist"], ["CA Meher Kaur", "Founder, CreateUS.club · LinkedIn creator"]),
    },
    5,
  ),
  event(
    {
      slug: "delhi-meetup-2025-12",
      chapter_id: byCity("delhi-ncr"),
      title: "Bombay Networking Circle — Delhi",
      summary: "An intimate, casual but high-energy café meetup in Hauz Khas Village. Real conversations, practical networking strategies, a curated room.",
      starts_at: "2025-12-06T10:30:00.000Z",
      ends_at: "2025-12-06T12:30:00.000Z",
      venue: "Fika Coffee Co.",
      venue_address: "Hauz Khas Village, New Delhi",
      luma_url: "https://luma.com/s9435s05",
      format: "founder_networking",
      cover_image: `${LUMA}/event-covers/j4/8edff0e5-9e4d-4635-8416-210bd93b8061.jpg`,
      capacity: 40,
      price_inr: 499,
      registrations: 39,
      speakers: people(["Isha Ostwal", "Founder & CEO, DreamSVin · Networking strategist"]),
    },
    6,
  ),
  event(
    {
      slug: "pune-vision-board-2025-12",
      chapter_id: byCity("pune"),
      title: "Vision Board Over Coffee — Pune",
      summary: "A cosy morning to design your 2026: a guided goal-setting reflection, vision-board materials, coffee and 20–30 people worth knowing.",
      starts_at: "2025-12-28T04:30:00.000Z",
      ends_at: "2025-12-28T06:00:00.000Z",
      venue: "Zariya Mind & Body Studio",
      venue_address: "NIBM Road, Undri, Pune",
      luma_url: "https://luma.com/38vbsg3d",
      format: "workshop",
      cover_image: `${LUMA}/event-covers/tf/02d2165c-a0eb-4ed0-aecc-149400fd3ced.jpg`,
      capacity: 40,
      price_inr: 699,
      registrations: 9,
      speakers: people(["Isha Ostwal", "Host"], ["Raksha Agarwal", "Host"]),
    },
    7,
  ),
  event(
    {
      slug: "career-connect-delhi-2026",
      chapter_id: byCity("delhi-ncr"),
      title: "Career Connect — Delhi",
      summary:
        "Cracking roles in startups and careers in entrepreneurship. Part of Ritika Saraswat's Own Your Path India Tour 2026, hosted by BNC with Re-Defined and Metvy at Masters' Union.",
      starts_at: "2026-01-10T05:30:00.000Z",
      ends_at: "2026-01-10T07:30:00.000Z",
      venue: "Masters' Union School of Business",
      venue_address: "Udyog Vihar Phase II, Sector 20, Gurugram",
      luma_url: "https://luma.com/6yr6h85q",
      format: "career",
      cover_image: `${LUMA}/event-covers/dz/17f24f22-76ab-4105-92c6-d7541974a18c.jpg`,
      registrations: 55,
      who_attends: "Students, early-career professionals, founders, freelancers and creators navigating startup careers.",
      speakers: people(
        ["Isha Ostwal", "Host · Founder, DreamSVin & BNC"],
        ["Ritika Saraswat", "Founder, Re-Defined"],
        ["Shawrya", "Co-founder & COO, Metvy"],
      ),
      partners: people(["Re-Defined", "Collaborator"], ["Metvy", "Collaborator"], ["Masters' Union", "Venue"]),
      gallery: gallery("career-connect-delhi-2026"),
    },
    8,
  ),
  event(
    {
      slug: "ahmedabad-edition-2026-03",
      chapter_id: byCity("ahmedabad"),
      title: "Bombay Networking Circle — Ahmedabad Edition",
      summary:
        "A structured, outcome-focused two hours: a strategic insights session, guided networking and an open collaboration round. 208 people registered for 30 seats.",
      starts_at: "2026-03-07T10:30:00.000Z",
      ends_at: "2026-03-07T12:30:00.000Z",
      venue: "K's Charcoal",
      venue_address: "Sindhu Bhavan Marg, Thaltej, Ahmedabad",
      luma_url: "https://luma.com/6gjk0sdv",
      format: "founder_networking",
      cover_image: `${LUMA}/event-covers/mm/a0038997-c3ba-4ab8-b96b-c8ddad5885c1.png`,
      price_inr: 499,
      registrations: 30,
      who_attends: "Founders, creators, consultants and growth-driven professionals.",
      speakers: people(
        ["Isha Ostwal", "Founder & CEO, DreamSVin · Networking strategist"],
        ["Shubham Maloo", "CA · Startup and GST consultant"],
        ["Sumit Sengar", "Founder, AUM Trading Institute"],
      ),
      partners: people(["K's Charcoal", "Venue partner"]),
      agenda: [
        { time: "45–60 min", item: "Strategic insights: relationships that convert, LinkedIn and offline visibility, positioning" },
        { time: "30–40 min", item: "Guided networking: curated introductions, small-group exchanges" },
        { time: "30–40 min", item: "Open collaboration round: what you're building, partnerships, Q&A" },
      ],
    },
    9,
  ),
  event(
    {
      slug: "bengaluru-builder-mixer-2026-04",
      chapter_id: byCity("bangalore"),
      title: "Bengaluru Builder / Founder Mixer",
      summary:
        "A curated 40-person builders' room for founders, operators and creators who are actively building. Partnerships, hiring, distribution and strategic introductions.",
      starts_at: "2026-04-20T13:00:00.000Z",
      ends_at: "2026-04-20T15:30:00.000Z",
      venue: "BHIVE HSR Lounge",
      venue_address: "22nd A Main Road, HSR Layout Sector 2, Bengaluru",
      luma_url: "https://luma.com/efophlhn",
      format: "founder_networking",
      cover_image: `${LUMA}/event-covers/ls/407bc72c-fa70-472f-a2a8-87ad84aefcaa.png`,
      capacity: 40,
      price_inr: 799,
      registrations: 42,
      who_attends:
        "Founders building or scaling a startup, product, agency or business; operators in growth-stage companies; creators monetising an audience.",
      partners: people(["BHIVE Workspace", "Venue partner"]),
    },
    10,
  ),
  event(
    {
      slug: "pune-sunday-reset-2026-05",
      chapter_id: byCity("pune"),
      title: "Sunday Reset with BNC",
      summary: "A curated wellness and networking morning: yoga and breathwork, a facilitated ice bath, then protein and real conversation. Limited to 20–25 people.",
      starts_at: "2026-05-10T02:30:00.000Z",
      ends_at: "2026-05-10T05:30:00.000Z",
      venue: "Padel Haus Arena",
      venue_address: "Salunkhe Vihar, Wanwadi, Pune",
      luma_url: "https://luma.com/s5aexdki",
      format: "wellness",
      cover_image: `${LUMA}/event-covers/2r/a9375f78-29f3-419f-8b7b-118cc3a91694.png`,
      price_inr: 999,
      registrations: 35,
      who_attends: "Founders building seriously, long-term creators, and operators who care about health and ambition.",
      speakers: people(["Bhoomi Thakkar", "Sync Studio · Fitness partner"]),
      partners: people(["Pickle Haus", "Venue partner"], ["Sync Studio", "Fitness partner"]),
      agenda: [
        { time: "45 min", item: "Yoga and guided breathwork" },
        { time: "45–60 min", item: "Ice bath, in small facilitated groups" },
        { time: "60 min", item: "Protein networking" },
      ],
    },
    11,
  ),
  event(
    {
      slug: "pune-wellness-weekend-reset-2026-06",
      chapter_id: byCity("pune"),
      title: "Wellness Weekend Reset",
      summary: "A slow Saturday morning for women building ambitious lives: matcha, pilates, breathwork, reflection and networking.",
      starts_at: "2026-06-13T03:00:00.000Z",
      ends_at: "2026-06-13T05:00:00.000Z",
      venue: "Ekoham Holistic Wellness",
      venue_address: "Veerbhadra Nagar, Baner, Pune",
      luma_url: "https://luma.com/aljbwmuj",
      format: "wellness",
      cover_image: `${LUMA}/uploads/dg/73753f96-1c3c-419f-a3b1-2abae2f06f9a.png`,
      price_inr: 999,
      registrations: 31,
      who_attends: "Women founders, working professionals, creators and entrepreneurs.",
      partners: people(["Ekoham Holistic Wellness", "Venue"]),
    },
    12,
  ),
  event(
    {
      slug: "power-hour-cash-flow-2026-06",
      chapter_id: byCity("pune"),
      title: "BNC Power Hour: cash flow for founders",
      summary: "Understanding cash flow, the financial metrics that matter, warning signs to catch early, and making growth decisions with confidence.",
      starts_at: "2026-06-24T13:00:00.000Z",
      ends_at: "2026-06-24T14:00:00.000Z",
      venue: "Online (Zoom)",
      luma_url: "https://luma.com/6n64826q",
      format: "power_hour",
      is_online: true,
      cover_image: `${LUMA}/uploads/ws/43d27114-6367-45ea-9fad-aadbcaaeb708.jpg`,
      price_inr: 0,
      registrations: 14,
      speakers: people(["Hooshang Bakht", "COO, Brego Business"]),
    },
    13,
  ),
  event(
    {
      slug: "founders-in-making-pitch-ice-bath-2026-06",
      chapter_id: byCity("pune"),
      title: "Founders in Making — Pitch & Ice Bath",
      summary:
        "Can you pitch under pressure? Founders pitched their startups from inside an ice bath, in front of entrepreneurs, investors and mentors, for a ₹1,00,000 prize.",
      starts_at: "2026-06-27T05:30:00.000Z",
      ends_at: "2026-06-27T07:30:00.000Z",
      venue: "Ekoham Holistic Wellness",
      venue_address: "Veerbhadra Nagar, Baner, Pune",
      luma_url: "https://luma.com/xtuiyzyb",
      format: "pitch_session",
      cover_image: `${LUMA}/uploads/8a/37bae4b6-1d71-4770-9daf-7ac93f41b111.png`,
      capacity: 40,
      price_inr: 999,
      registrations: 23,
      who_attends: "Founders, aspiring entrepreneurs and innovators with a startup idea.",
      partners: people(["Ekoham Holistic Wellness", "Venue"]),
    },
    14,
  ),
  event(
    {
      slug: "power-hour-beyond-the-grid-2026-07",
      chapter_id: byCity("pune"),
      title: "BNC Power Hour: Beyond the Grid",
      summary: "Building a personal brand that feels true to you and still earns trust — frameworks for finding your visual voice and showing up with credibility.",
      starts_at: "2026-07-09T13:00:00.000Z",
      ends_at: "2026-07-09T14:00:00.000Z",
      venue: "Online",
      luma_url: "https://luma.com/3e755mkj",
      format: "power_hour",
      is_online: true,
      cover_image: `${LUMA}/uploads/6w/03b00d38-dea5-4332-9c41-ac92d04b7ffb.png`,
      price_inr: 0,
      registrations: 8,
      speakers: people(["Sakina Jalal", "Founder, Mojo Creatives"]),
    },
    15,
  ),
  event(
    {
      slug: "icebath-breathwork-palmonas-2026-07",
      chapter_id: byCity("pune"),
      title: "Ice Bath & Breathwork with Palmonas",
      summary: "A morning of guided breathwork, an ice bath and mindful recovery in Koregaon Park, with Ekoham and HS.",
      starts_at: "2026-07-26T04:30:00.000Z",
      ends_at: "2026-07-26T06:30:00.000Z",
      venue: "Palmonas",
      venue_address: "Lane No. 8, Koregaon Park, Pune",
      luma_url: "https://luma.com/1plpxprq",
      format: "wellness",
      cover_image: `${LUMA}/uploads/e9/74281aef-36fa-4ebd-ba61-42e26e04239b.jpg`,
      registrations: 5,
      partners: people(["Palmonas", "Host venue"], ["Ekoham", "Collaborator"], ["HS", "Collaborator"]),
    },
    16,
  ),
  event(
    {
      slug: "lets-talk-ai-pune-2026-08",
      chapter_id: byCity("pune"),
      title: "Let's Talk AI — not your regular AI meetup",
      summary:
        "Less hype, more implementation: lightning talks on how people use AI every day, an open discussion, and AI speed networking for founders, creators and freelancers.",
      starts_at: "2026-08-01T10:30:00.000Z",
      ends_at: "2026-08-01T13:30:00.000Z",
      venue: "CC&Co — CoCreators And Company",
      venue_address: "Gokhale Business Bay, Kothrud, Pune",
      luma_url: "https://luma.com/73lo0ax5",
      format: "workshop",
      cover_image: `${LUMA}/uploads/0l/ee30d92f-c0e0-4130-adbc-c8cda99b812c.png`,
      price_inr: 399,
      registrations: 23,
      who_attends: "Founders, creators, freelancers, professionals, students and AI enthusiasts.",
      speakers: people(
        ["Isha Ostwal", "Founder & CEO, DreamSVin & BNC"],
        ["Mangesh Shinde", "Founder, WillStar Media"],
        ["Omkar Amble", "AI mentor for freelancers"],
      ),
      partners: people(["CC&Co", "Venue"]),
      agenda: [
        { time: "4:00 PM", item: "Networking over coffee" },
        { time: "4:30 PM", item: "Lightning talks — How I use AI every day" },
        { time: "5:00 PM", item: "Open discussion: AI for business, creators, freelancers; automation; tools" },
        { time: "6:00 PM", item: "AI speed networking: one tool, one problem, one collaboration you want" },
        { time: "6:45 PM", item: "Community photo and open networking" },
      ],
    },
    17,
  ),
  event(
    {
      slug: "real-estate-room-mumbai-2026-10",
      chapter_id: byCity("mumbai"),
      title: "BNC Real Estate Room — Mumbai Edition",
      summary:
        "Where are the next real estate opportunities? A closed-door room for developers, investors and advisors — asset classes, geography and the ₹10 crore question.",
      starts_at: "2026-10-06T11:30:00.000Z",
      ends_at: "2026-10-06T14:00:00.000Z",
      venue: "Dextrus — Peninsula Corporate Park",
      venue_address: "Lower Parel, Mumbai",
      luma_url: "https://luma.com/2ltwf46h",
      format: "industry_room",
      cover_image: `${LUMA}/uploads/z2/b8f262a9-d5d0-43d0-a4ba-0181ae01cdf9.png`,
      price_inr: 0,
      registrations: 40,
      who_attends: "Developers, investors, real estate entrepreneurs, PropTech founders, advisors and ecosystem partners. Invite only.",
      speakers: people(
        ["Dr. Adv. Harshul Savla", "Managing Partner, M Realty"],
        ["Dhaval Upendrakumar", "Founder, Nagarsheth Group"],
        ["Chintan Vasani", "Founder Partner, WibesRealty"],
        ["Isha Ostwal", "Moderator · Founder, DreamSVin & BNC"],
      ),
      partners: people(["Dextrus", "Venue"]),
      agenda: [
        { time: "5:00 PM", item: "Arrival and curated networking" },
        { time: "5:25 PM", item: "Opening by Isha Ostwal" },
        { time: "5:35 PM", item: "Panel: asset classes × geography × investment opportunities" },
        { time: "6:20 PM", item: "The ₹10 crore question" },
        { time: "6:35 PM", item: "Open table discussion" },
        { time: "6:55 PM", item: "Who's building what + curated connections" },
      ],
    },
    18,
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
 * The previous site showed ten logos under "Trusted by leading brands & ecosystems" with no stated relationship. Several
 * also appear as DreamSVin clients, so they stay unpublished until BNC confirms each one and has permission.
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

/**
 * Venue and collaboration partners named on BNC's own public Luma pages (Sep 2025 – Oct 2026). Publishing the name of a
 * partner that co-promoted a public event is a statement of fact; logos are shown only where the partner sent theirs for
 * the collaboration (K's Charcoal, Gmail, 9 Feb 2026). Names only for the rest until logo files are supplied.
 */
const partner = (n: number, name: string, url: string | null = null, logo: string | null = null): Sponsor => ({
  id: `00000000-0000-4000-d000-0000000001${String(n).padStart(2, "0")}`,
  name,
  logo,
  tier: "community",
  url,
  is_partner: true,
  is_published: true,
  ...meta,
});

export const SPONSORS: Sponsor[] = [
  partner(1, "K's Charcoal", null, "/media/partners/ks-charcoal.webp"),
  partner(2, "BHIVE Workspace", "https://bhiveworkspace.com"),
  partner(3, "Masters' Union", "https://mastersunion.org"),
  partner(4, "Re-Defined"),
  partner(5, "Metvy", "https://www.metvy.com"),
  partner(6, "Ekoham Holistic Wellness"),
  partner(7, "Palmonas", "https://palmonas.com"),
  partner(8, "Pickle Haus"),
  partner(9, "Sync Studio"),
  partner(10, "CC&Co — CoCreators And Company"),
  partner(11, "Dextrus"),
  partner(12, "Thirdspace"),
  legacyBrand(1, "Eureka Forbes", "brand1.webp"),
  legacyBrand(2, "Willstar Media", "brand2.webp"),
  legacyBrand(3, "Unidentified brand (green mark)", "brand3.webp"),
  legacyBrand(4, "Yog Sadhak", "brand4.webp"),
  legacyBrand(6, "Prustlr", "brand6.webp"),
  legacyBrand(8, "Culture", "brand8.webp"),
  legacyBrand(9, "Analogy", "brand9.webp"),
  legacyBrand(10, "Pickle Pakoza Open", "brand10.webp"),
];
