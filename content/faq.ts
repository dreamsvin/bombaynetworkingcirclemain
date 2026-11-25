/**
 * FAQ. The city answer is NOT written here — it is built from the chapters table at render time
 * (see app/faq/page.tsx), so it can never contradict the chapter directory again.
 */
export type Faq = { q: string; a: string; group: "joining" | "events" | "chapters" | "partners" };

export const FAQ: Faq[] = [
  {
    group: "joining",
    q: "What is Bombay Networking Circle?",
    a: "A curated, in-person community for founders, operators, creators and professionals who are building something. Since September 2025 it has run 20+ rooms in eight Indian cities, a weekly online Power Hour, and a WhatsApp community that connects members between rooms.",
  },
  {
    group: "joining",
    q: "Does it cost anything?",
    a: "Joining the community is free. Most in-person rooms have a small ticket — ₹399 to ₹999 so far — that covers the venue, coffee and curation; a few, like Power Hour and invite-only industry rooms, have had no ticket. Every event page here and on Luma shows the price before you register.",
  },
  {
    group: "joining",
    q: "Do I need a startup to join?",
    a: "No. Rooms are for people actively building — founders, operators, creators, consultants and professionals growing their influence. Some formats, like Career Connect, are made for students and early-career professionals. What matters is ambition and a willingness to contribute, not a job title.",
  },
  {
    group: "joining",
    q: "How do I join?",
    a: "Find your city, RSVP to the next event there, and come. After you RSVP you'll be invited into the WhatsApp community, where events are announced first. Joining the WhatsApp group without coming to an event is allowed, but the room is where it works.",
  },
  {
    group: "events",
    q: "What happens at an event?",
    a: "A city meetup runs about two hours: curated introductions over coffee, a 45–60 minute insights session, guided small-group networking, and an open collaboration round where everyone shares what they're building and what they need. Industry rooms add a short panel; reset mornings start with an ice bath or yoga.",
  },
  {
    group: "events",
    q: "How do I RSVP?",
    a: "Every event has a button that opens its Luma page. Luma handles registration and reminders; paid rooms are confirmed once the UPI payment shown on the Luma page is received. Some rooms are curated — you apply, and the team confirms within 24–48 hours.",
  },
  {
    group: "events",
    q: "Why do some rooms ask me to apply?",
    a: "Because the people in the room are the product. For curated rooms the team reads every application so the mix works — for the Ahmedabad edition, 208 people registered for 30 seats.",
  },
  {
    group: "events",
    q: "Can I pitch my services at an event?",
    a: "Not to the room. Say what you do in your introduction and let people come to you. Repeated selling is a code of conduct issue.",
  },
  {
    group: "chapters",
    q: "There's no chapter in my city. What now?",
    a: "Two options: come to the nearest chapter's events, or apply to start one. BNC gives new city leads the format, the playbook and promotion to the existing community.",
  },
  {
    group: "partners",
    q: "How do sponsorships and partnerships work?",
    a: "Brands can sponsor a single event, a city series or the national calendar, and ecosystem partners can offer tools or perks to members. Use the sponsor or partner forms and we'll send details.",
  },
];
