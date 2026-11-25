/**
 * Site-wide facts and copy. Every claim here is either confirmed by BNC or listed in CONTENT-TODO.md.
 * Cities do NOT live here — they come from the chapters table (lib/data.ts) so the list is the same everywhere.
 */

export const SITE = {
  name: "Bombay Networking Circle",
  short: "BNC",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bombaynetworkingcircle.com").replace(/\/$/, ""),
  description:
    "Curated, in-person rooms for founders, operators and creators. 20+ rooms across eight Indian cities since September 2025, started by Isha Ostwal. Find your city, come to the next room, meet people worth knowing.",
  /** Brand line, from the BNC brand guidelines (2026). */
  tagline: "Where your circle becomes your currency",
  founded: "2025",
  /** First room on the Luma calendar: Pune, 20 September 2025. */
  firstRoom: "September 2025",
  founder: "Isha Ostwal",
  locale: "en_IN",
} as const;

/** The single primary CTA. Same words everywhere. Points at the chapter directory (step 2 of the funnel). */
export const PRIMARY_CTA = { label: "Find your circle", href: "/chapters" } as const;

/**
 * Stats carry an as-of date, always rendered next to them. A number without a date is a claim without a source.
 * Order matters (pages read items[0] = members, items[1] = cities, items[2] = rooms).
 *  - Members: Isha Ostwal, Nov 2026 ("1,500 members across 10 cities"); the Luma profile says 1,400+.
 *  - Host cities and rooms: counted from the Luma calendar (17 events, Sep 2025 – Oct 2026) plus the Pune breakfast
 *    meetup (25 Oct 2025, poster in Drive) and three March–April 2026 Power Hours (BNC master sheet). See content/seed.ts.
 *  - Seats: sum of approved registrations on those 17 Luma events, read on 25 Nov 2026.
 * The old "50+ events" and "150+ collaborations" figures could not be traced to a source and were dropped.
 */
export const STATS = {
  asOf: "November 2026",
  source: "Members: BNC's own count. Rooms and seats: BNC's Luma calendar (approved registrations) and event records since September 2025.",
  items: [
    { value: "1,500+", label: "members across 10 cities" },
    { value: "8", label: "cities hosted" },
    { value: "20+", label: "curated rooms since Sept 2025" },
    { value: "440+", label: "seats filled on Luma" },
  ],
} as const;

export const MISSION = {
  builders: "100,000",
  collaborations: "10,000",
  line: "Connect 100,000 builders across India and catalyse 10,000 collaborations between them.",
  /** From "BNC ICP and mission" (Drive, June 2026). */
  statement: "To help ambitious people grow faster through relationships, collaboration and community.",
  vision: "The most valuable ecosystem of growth-minded builders, founders, creators, operators, investors and community leaders — a place where opportunities, partnerships, businesses and friendships are made.",
  belief: "Most people believe that if they work harder, they will grow. BNC believes effort combined with the right relationships grows you faster.",
} as const;

/** The three pillars (BNC ICP and mission doc). */
export const PILLARS = [
  { title: "Connect", body: "Meet the right people. City meetups, industry rooms and introductions made on purpose." },
  { title: "Collaborate", body: "Turn relationships into work: partnerships, referrals, hires, co-founders and joint projects." },
  { title: "Compound", body: "Grow over years, not evenings — through personal brand, contribution and becoming the connector others call." },
] as const;

/** How members grow inside the circle (BNC ICP and mission doc). */
export const JOURNEY = [
  { stage: "Attendee", body: "Comes for the room." },
  { stage: "Contributor", body: "Starts helping people in it." },
  { stage: "Connector", body: "Introduces others and creates value." },
  { stage: "Collaborator", body: "Builds projects and partnerships." },
  { stage: "Community leader", body: "Is known across the ecosystem." },
  { stage: "Ecosystem builder", body: "Creates opportunities at scale." },
] as const;

export const VALUES = [
  { title: "Give first", body: "Create value before you ask for it." },
  { title: "Think long term", body: "Relationships compound over years." },
  { title: "Build trust", body: "Trust is the currency of the circle." },
  { title: "Collaborate over compete", body: "The biggest opportunities are made together." },
  { title: "Create opportunities", body: "Don't wait for them." },
  { title: "Raise the room", body: "Every interaction should leave the community better." },
] as const;

/** Who the rooms are not for (BNC ICP doc). Said plainly so the right people self-select. */
export const NOT_FOR = [
  "Transactional networkers and aggressive sellers",
  "People looking for quick wins or instant ROI",
  "People who only consume and never contribute",
  "Anyone who thinks networking means pitching",
] as const;

export const LINKS = {
  /** Step 4 of the funnel. Never the first ask. */
  whatsapp: "https://chat.whatsapp.com/CNi2Xu2pTWe5SAyMkgVuTU",
  lumaCalendarId: "cal-vDOs5j3wARFnY6V",
  lumaEmbed: "https://luma.com/embed/calendar/cal-vDOs5j3wARFnY6V/events",
  /** Public calendar page (Luma calendar slug "bnc"). Subscribing here is how people hear about new rooms first. */
  lumaCalendar: "https://luma.com/bnc",
  /** Handle from the Luma calendar profile and every BNC poster. LinkedIn is from the previous site's footer — confirm it. */
  instagram: "https://www.instagram.com/bombaynetworkingcircle/" as string | null,
  linkedin: "https://www.linkedin.com/company/bombay-networking-circle" as string | null,
} as const;

export const CONTACT = {
  email: "grow@dreamsvin.com",
  city: "Mumbai, Maharashtra",
  responseTime: "We reply within three working days.",
} as const;

/** Event formats. One place; used by /about, home, filters and event cards. */
export const FORMATS = {
  founder_networking: {
    label: "City meetup",
    short: "Meetup",
    body: "The core BNC room: 30–40 founders, operators and creators in a café for two hours — a short insights session, guided introductions, then an open collaboration round.",
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
  industry_room: {
    label: "Industry room",
    short: "Industry",
    body: "Closed-door, invite-only rooms for one industry: a short panel, one hard question for the whole room, then curated connections. The first was the Real Estate Room in Mumbai.",
  },
  power_hour: {
    label: "Power Hour",
    short: "Power Hour",
    body: "A one-hour online session on one practical topic — cash flow, personal brand, AI, how to network — led by someone who does it for a living, with time for your questions.",
  },
  wellness: {
    label: "Reset morning",
    short: "Reset",
    body: "Ice baths, yoga, pilates and breathwork with founders and creators, followed by good food and real conversation. Health and ambition in the same room.",
  },
  career: {
    label: "Career room",
    short: "Career",
    body: "Rooms for students and early-career professionals to meet founders and operators and ask honest questions about startup careers.",
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
    title: "Creators, consultants and freelancers",
    body: "You sell skills or an audience — design, content, finance, marketing — and want warm introductions instead of cold pitches.",
  },
] as const;

/**
 * How a two-hour city meetup runs — the published run-of-show of the Ahmedabad edition (Luma, 7 Mar 2026).
 */
export const ROOM_STEPS = [
  { title: "Arrive over coffee", body: "Curated introductions from the door. Structured prompts replace the awkward small talk.", time: "First 15 min" },
  { title: "Strategic insights session", body: "Frameworks you can use the next day: relationships that turn into opportunities, LinkedIn and offline visibility, positioning yourself in the right ecosystems.", time: "45–60 min" },
  { title: "Guided networking", body: "Small-group exchanges and curated introductions, so you meet the people you came to meet.", time: "30–40 min" },
  { title: "Open collaboration round", body: "Share what you're building and what you need. Partnerships, referrals and collaborations start here.", time: "30–40 min" },
] as const;

/** What BNC is not (/about). */
export const NOT_LIST = [
  { title: "Not a paid membership", body: "Joining the community costs nothing. Most rooms carry a small ticket (₹399–₹999) that covers the venue, the coffee and the curation." },
  { title: "Not a card-swapping mixer", body: "Rooms are small and hosted. Introductions are made on purpose." },
  { title: "Not a sales channel", body: "Pitching services to the room is against the code of conduct. Help first." },
  { title: "Not only for funded founders", body: "Students, first-time founders and freelancers are welcome. Stage-based rooms keep it useful." },
] as const;

/** What you get (/community). */
export const BENEFITS = [
  { title: "Rooms in eight cities", body: "Register for any BNC room in any chapter. Travel to Pune for a week and you still have a room." },
  { title: "The WhatsApp community", body: "Event announcements first, plus a place to post specific asks to members across cities." },
  { title: "Warm introductions", body: "Hosts and city leads connect members directly when an ask matches someone they know." },
  { title: "Collaboration matching", body: "Technical partners, agencies and clients — matched on what you said you need, not on who talks loudest." },
  { title: "Power Hour", body: "One-hour online sessions on one practical topic — finance, personal brand, AI, networking — with practitioners who do it daily." },
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
      { label: "Gallery", href: "/gallery" },
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
      { label: "Gallery", href: "/gallery" },
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
