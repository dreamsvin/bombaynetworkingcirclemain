/**
 * Site-wide facts and copy. Every claim here is either confirmed by BNC or listed in CONTENT-TODO.md.
 * Cities do NOT live here — they come from the chapters table (lib/data.ts) so the list is the same everywhere.
 */

export const SITE = {
  name: "Bombay Networking Circle",
  short: "BNC",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bombaynetworkingcircle.com").replace(/\/$/, ""),
  description:
    "Bombay Networking Circle is a growing network of founders, operators and creators across eight Indian cities. Small, hosted rooms with introductions that continue after the room. Free to join.",
  founded: "2025",
  founder: "Isha Ostwal",
  locale: "en_IN",
} as const;

/** The single primary CTA (navy). Same words everywhere. Every page ends with a path to it. */
export const PRIMARY_CTA = { label: "Request access", href: "/request-access" } as const;
/** The only secondary CTA (outline). */
export const SECONDARY_CTA = { label: "Explore BNC", href: "/inside" } as const;

/** Said out loud everywhere the access model matters, so no visitor has to guess it. */
export const ACCESS_LINE = "Free to join. We read every request to match you to the right room.";

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

export const HERO = {
  title: "The right rooms change everything. The right people make it happen.",
  lede: "Bombay Networking Circle is a growing network of people who believe meaningful relationships can change what you build next.",
} as const;

/** Home §2 — readable in ten seconds. */
export const WHAT_IS = [
  { term: "Who", body: "Founders, operators and creators building something." },
  { term: "How", body: "Small, hosted rooms in your city — each with a reason to exist." },
  { term: "You get", body: "Introductions that continue after the room." },
  { term: "Cost", body: "Free to join. Rooms are paid." },
] as const;

/** Home §3 / Inside BNC. */
export const PILLARS = [
  { title: "Curated Rooms", body: "Purposeful gatherings around people, industries, ideas and opportunities." },
  { title: "Meaningful Connections", body: "Introductions that go beyond names and LinkedIn profiles." },
  { title: "Collaborations", body: "Relationships that can lead to shared projects and partnerships." },
  { title: "A Growing Network", body: "Across cities, industries and stages of growth." },
] as const;

/** Home §4 / Inside BNC — the four decisions behind every room. */
export const CURATION = [
  {
    title: "The Intent",
    body: "A theme, a shared interest, a business context.",
    detail: "Every room starts with a reason to exist: one theme, a stage of growth or an industry question. If we can't say who the room is for, we don't run it.",
  },
  {
    title: "The People",
    body: "Invited for relevance and what they bring.",
    detail: "We use what people told us when they requested access — what they're building and what they're looking for — to decide who should be in the same room.",
  },
  {
    title: "The Experience",
    body: "Structured conversation, not small talk.",
    detail: "Seating is planned, introductions are short and specific, and a host runs the conversation so nobody spends the evening looking for a corner.",
  },
  {
    title: "The Continuation",
    body: "Intros and follow-ups after the room ends.",
    detail: "Hosts follow up on the asks they heard and make direct introductions. Members stay in touch through the member community and the next room.",
  },
] as const;

/**
 * The BNC Charter. The standard is how you participate, not what's on your card.
 * DRAFT principles from the approved wireframes — confirm wording with BNC (CONTENT-TODO).
 */
export const CHARTER = [
  { title: "Give before you ask.", body: "Open with what you can offer the room — an introduction, an answer, a lesson learned." },
  { title: "Show up prepared.", body: "Know what you're building and have one specific ask ready." },
  { title: "Make the introduction.", body: "If you hear an ask you can help with, connect the people. Don't wait to be asked twice." },
  { title: "Respect the room.", body: "No hard selling, no pitching services to people who didn't ask. Listen as much as you talk." },
  { title: "Follow up within a week.", body: "A connection made in a room only counts if someone writes the next message." },
  { title: "What's shared stays.", body: "Numbers, plans and problems discussed in a room are not repeated outside it." },
] as const;

/** Review time for access requests. [PLACEHOLDER] — confirm with BNC (CONTENT-TODO). */
export const REVIEW_DAYS = "[X]";

/** Request access — what happens after you submit. */
export const NEXT_STEPS = [
  { title: `We read your request within ${REVIEW_DAYS} days`, body: "A person on the BNC team reads every request. You'll get a confirmation email straight away." },
  { title: "You're matched to a room in your city", body: "Your invite arrives by email with the date, the theme and the price." },
  { title: "After your first room", body: "You join the member community and hear about the next rooms first." },
] as const;

export const ROLES = ["Founder", "Co-founder", "Operator", "Investor", "Freelancer", "Creator", "Student", "Other"] as const;
export const INDUSTRIES = ["D2C", "Fintech", "SaaS", "Creators", "Healthcare", "Education", "Climate", "Services", "Other"] as const;
export const STAGES = [
  { value: "idea", label: "Idea" },
  { value: "early", label: "Early" },
  { value: "seed", label: "Seed" },
  { value: "growth", label: "Growth" },
  { value: "established", label: "Established" },
] as const;
export const LOOKING_FOR = [
  { value: "co-founder", label: "Co-founder" },
  { value: "clients", label: "Clients" },
  { value: "hires", label: "Hires" },
  { value: "investors", label: "Investors" },
  { value: "partners", label: "Partners" },
  { value: "peers", label: "Peers" },
  { value: "learning", label: "Learning" },
] as const;
export const HEARD_FROM = ["A friend or member", "Instagram", "LinkedIn", "WhatsApp", "An event", "Search", "Other"] as const;

export const STORY_TYPES = {
  "co-founder": "Co-founder",
  client: "Client",
  hire: "Hire",
  investment: "Investment",
  partnership: "Partnership",
} as const;

export const LINKS = {
  /** Step 4 of the funnel. Never the first ask. */
  whatsapp: "https://chat.whatsapp.com/CNi2Xu2pTWe5SAyMkgVuTU",
  lumaCalendarId: "cal-vDOs5j3wARFnY6V",
  lumaEmbed: "https://luma.com/embed/calendar/cal-vDOs5j3wARFnY6V/events",
  /** Public calendar page for click-outs. Replace with the lu.ma/<handle> URL once confirmed (CONTENT-TODO). */
  lumaCalendar: "https://luma.com/embed/calendar/cal-vDOs5j3wARFnY6V/events",
  /** Rendered only when set. LinkedIn is from the previous site's footer — confirm it (CONTENT-TODO). */
  instagram: null as string | null,
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

/** Who the rooms are for. */
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
  { title: "One-on-one introductions", body: "Hosts pair you with two or three people chosen for you. Everyone shares one specific ask: a hire, a client, a partner, advice." },
  { title: "Focused conversation", body: "A hosted discussion or pitch, depending on the format. Questions come from the room." },
  { title: "Open floor", body: "Hosts make direct introductions based on the asks you heard earlier. This is where collaborations start." },
] as const;

/** Header: flat, five links + the CTA. */
export const NAV = [
  { label: "Inside BNC", href: "/inside" },
  { label: "Members", href: "/members" },
  { label: "Chapters", href: "/chapters" },
  { label: "Rooms", href: "/rooms" },
  { label: "Stories", href: "/stories" },
] as const;

export const TAGLINE = "Less networking. More net-worthing." as const;

/** Footer groups, from the approved wireframe. */
export const FOOTER = [
  {
    title: "About",
    links: [
      { label: "About BNC", href: "/about" },
      { label: "The Charter", href: "/about#charter" },
      { label: "Our story", href: "/about/story" },
      { label: "Team", href: "/about/team" },
    ],
  },
  {
    title: "Work with us",
    links: [
      { label: "Sponsor", href: "/sponsor" },
      { label: "Partners", href: "/partners" },
      { label: "Start a chapter", href: "/start-a-chapter" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Code of conduct", href: "/code-of-conduct" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

export const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Code of conduct", href: "/code-of-conduct" },
] as const;
