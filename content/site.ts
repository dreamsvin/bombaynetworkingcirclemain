/**
 * Site-wide facts and copy. Every claim here is either confirmed by BNC or listed in CONTENT-TODO.md.
 * Cities do NOT live here — they come from the chapters table (lib/data.ts) so the list is the same everywhere.
 */

export const SITE = {
  name: "Bombay Networking Circle",
  short: "BNC",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bombaynetworkingcircle.com").replace(/\/$/, ""),
  description:
    "Free, in-person rooms for founders, operators and freelancers in eight Indian cities. Started in Mumbai by Isha Ostwal. Find your city, come to the next event, meet people worth knowing.",
  founded: "2025",
  founder: "Isha Ostwal",
  locale: "en_IN",
} as const;

/** The single primary CTA. Same words everywhere. Points at the chapter directory (step 2 of the funnel). */
export const PRIMARY_CTA = { label: "Find your circle", href: "/chapters" } as const;

/**
 * Stats carry an as-of date, always rendered next to them. A number without a date is a claim without a source.
 * Confirmed by BNC on 20 Nov 2026 (figures from the existing site). Collaborations are self-reported.
 */
export const STATS = {
  asOf: "November 2026",
  source: "Figures supplied by Bombay Networking Circle. Collaborations are self-reported by members.",
  items: [
    { value: "1,000+", label: "members" },
    { value: "8", label: "cities" },
    { value: "50+", label: "events held" },
    { value: "150+", label: "collaborations reported" },
  ],
} as const;

export const MISSION = {
  builders: "100,000",
  collaborations: "10,000",
  line: "Connect 100,000 builders across India and catalyse 10,000 collaborations between them.",
} as const;

export const LINKS = {
  /** Step 4 of the funnel. Never the first ask. */
  whatsapp: "https://chat.whatsapp.com/CNi2Xu2pTWe5SAyMkgVuTU",
  lumaCalendarId: "cal-vDOs5j3wARFnY6V",
  lumaEmbed: "https://luma.com/embed/calendar/cal-vDOs5j3wARFnY6V/events",
  /** Public calendar page for click-outs. Replace with the lu.ma/<handle> URL once confirmed (CONTENT-TODO). */
  lumaCalendar: "https://luma.com/embed/calendar/cal-vDOs5j3wARFnY6V/events",
  /** Not supplied yet. Rendered only when set. */
  instagram: null as string | null,
  linkedin: null as string | null,
} as const;

export const CONTACT = {
  email: "grow@dreamsvin.com",
  city: "Mumbai, Maharashtra",
  responseTime: "We reply within three working days.",
} as const;

/** Event formats. One place; used by /about, home, filters and event cards. */
export const FORMATS = {
  founder_networking: {
    label: "Founder networking",
    short: "Networking",
    body: "Small rooms grouped by stage, so a first-time founder and a Series A founder each meet people facing the same problems.",
  },
  startup_conversations: {
    label: "Startup conversations",
    short: "Conversations",
    body: "Hosted discussions on growth, hiring, fundraising and product, led by people who have done the thing recently.",
  },
  pitch_session: {
    label: "Pitch sessions",
    short: "Pitch",
    body: "Founders pitch to investors and get direct feedback in the room, not a form response weeks later.",
  },
  workshop: {
    label: "Workshops and masterclasses",
    short: "Workshop",
    body: "Hands-on sessions with one practitioner and one skill, sized so everyone actually does the work.",
  },
} as const;

export type FormatKey = keyof typeof FORMATS;

/** Who the rooms are for (home + /community). */
export const AUDIENCE = [
  {
    title: "Founders",
    body: "Pre-idea to post-revenue. You want a co-founder, a first hire, a first client, or someone two steps ahead to ask.",
  },
  {
    title: "Operators",
    body: "You run growth, product, sales or finance inside a startup and want peers who solve the same problems.",
  },
  {
    title: "Freelancers and creators",
    body: "You sell skills — design, engineering, content, marketing — and want warm introductions instead of cold pitches.",
  },
] as const;

/**
 * How an evening runs. Structure confirmed from BNC's formats; exact timings to be confirmed (CONTENT-TODO).
 */
export const ROOM_STEPS = [
  { title: "Arrive and get placed", body: "You're seated with people at a similar stage or in a related field, not left to find a corner." },
  { title: "One-line introductions", body: "Everyone says who they are and one thing they need. Asks are specific: a hire, a client, a partner, advice." },
  { title: "Focused conversation", body: "A hosted discussion or pitch, depending on the format. Questions come from the room." },
  { title: "Open floor", body: "Hosts make direct introductions based on the asks you heard earlier. This is where collaborations start." },
] as const;

/** What BNC is not (/about). */
export const NOT_LIST = [
  { title: "Not a paid membership", body: "Joining is free. There are no tiers to buy." },
  { title: "Not a card-swapping mixer", body: "Rooms are small and hosted. Introductions are made on purpose." },
  { title: "Not a sales channel", body: "Pitching services to the room is against the code of conduct. Help first." },
  { title: "Not only for funded founders", body: "Students, first-time founders and freelancers are welcome. Stage-based rooms keep it useful." },
] as const;

/** What you get (/community). */
export const BENEFITS = [
  { title: "Event access in eight cities", body: "RSVP to any BNC event in any chapter. Travel to Pune for a week and you still have a room." },
  { title: "The WhatsApp community", body: "Event announcements first, plus a place to post specific asks to members across cities." },
  { title: "Warm introductions", body: "Hosts and city leads connect members directly when an ask matches someone they know." },
  { title: "Collaboration matching", body: "Technical partners, agencies and clients — matched on what you said you need, not on who talks loudest." },
  { title: "Partner perks", body: "Startup tools and credits from BNC partners, announced in the community as they become available." },
] as const;

export const NAV = [
  {
    label: "About",
    href: "/about",
    items: [
      { label: "What BNC is", href: "/about" },
      { label: "Our story", href: "/about/story" },
      { label: "Team", href: "/about/team" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    label: "Chapters",
    href: "/chapters",
    items: [
      { label: "All chapters", href: "/chapters" },
      { label: "Start a chapter", href: "/chapters/start" },
    ],
  },
  {
    label: "Events",
    href: "/events",
    items: [
      { label: "Upcoming events", href: "/events" },
      { label: "Past events", href: "/events#past" },
    ],
  },
  {
    label: "Community",
    href: "/community",
    items: [
      { label: "Join the community", href: "/community" },
      { label: "Member stories", href: "/stories" },
      { label: "Blog", href: "/blog" },
      { label: "Code of conduct", href: "/code-of-conduct" },
    ],
  },
] as const;

export const FOOTER = [
  {
    title: "About",
    links: [
      { label: "What BNC is", href: "/about" },
      { label: "Our story", href: "/about/story" },
      { label: "Team", href: "/about/team" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Chapters",
    links: [
      { label: "All chapters", href: "/chapters" },
      // City links are injected from the chapters table by components/site/footer.tsx.
      { label: "Start a chapter", href: "/chapters/start" },
    ],
  },
  {
    title: "Events",
    links: [
      { label: "Upcoming events", href: "/events" },
      { label: "Past events", href: "/events#past" },
      { label: "Sponsor BNC", href: "/sponsor" },
      { label: "Partners", href: "/partners" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Join the community", href: "/community" },
      { label: "Member stories", href: "/stories" },
      { label: "Blog", href: "/blog" },
      { label: "Code of conduct", href: "/code-of-conduct" },
    ],
  },
] as const;

export const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Code of conduct", href: "/code-of-conduct" },
] as const;
