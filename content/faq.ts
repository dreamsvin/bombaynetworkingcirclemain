/**
 * FAQ. The city answer is NOT written here — it is built from the chapters table at render time
 * (see app/faq/page.tsx), so it can never contradict the chapter directory again.
 */
export type Faq = { q: string; a: string; group: "joining" | "events" | "chapters" | "partners" };

export const FAQ: Faq[] = [
  {
    group: "joining",
    q: "What is Bombay Networking Circle?",
    a: "A free, in-person community for founders, operators, freelancers and creators. It runs hosted events in eight Indian cities and a WhatsApp community that connects members between events.",
  },
  {
    group: "joining",
    q: "Does it cost anything?",
    a: "No. Joining the community is free. Most events are free; if a specific event has a ticket price — for example to cover a venue — the event page and the Luma RSVP will say so before you register.",
  },
  {
    group: "joining",
    q: "Do I need a startup to join?",
    a: "No. There are rooms for established founders and rooms like Founders in Making 101 for students and people who haven't started yet, plus operators and freelancers. Rooms are grouped by stage so the conversation stays useful.",
  },
  {
    group: "joining",
    q: "How do I join?",
    a: "Find your city, RSVP to the next event there, and come. After you RSVP you'll be invited into the WhatsApp community, where events are announced first. Joining the WhatsApp group without coming to an event is allowed, but the room is where it works.",
  },
  {
    group: "events",
    q: "What happens at an event?",
    a: "You're placed with people at a similar stage, everyone gives a one-line introduction and one specific ask, there's a hosted conversation or pitch, and the evening ends with hosts making introductions based on those asks.",
  },
  {
    group: "events",
    q: "How do I RSVP?",
    a: "Every event has an RSVP button that opens BNC's Luma calendar. Luma handles registration, reminders and check-in.",
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
