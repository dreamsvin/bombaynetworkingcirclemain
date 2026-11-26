/**
 * FAQ. The city answer is NOT written here — it is built from the chapters table at render time
 * (see app/faq/page.tsx), so it can never contradict the chapter directory again.
 */
export type Faq = { q: string; a: string; group: "joining" | "events" | "chapters" | "partners" };

export const FAQ: Faq[] = [
  {
    group: "joining",
    q: "Is it free?",
    a: "Joining BNC is free. Rooms are paid: each room page shows its price before you commit, and the invite email repeats it. The price covers the venue, the host and keeping the room small.",
  },
  {
    group: "joining",
    q: "Who can join?",
    a: "Founders, operators, creators, freelancers and investors who are building something and willing to give as much as they take. The standard is how you take part — the BNC Charter — not your title or funding.",
  },
  {
    group: "joining",
    q: "What happens after I request access?",
    a: "A person on the BNC team reads your request, then matches you to a room in your city whose theme and people fit what you told us. Your invite arrives by email. After your first room you join the member community.",
  },
  {
    group: "joining",
    q: "Do I need a startup?",
    a: "No. Rooms are grouped by stage, from people who haven't started yet to established founders, and operators and freelancers are part of every city. Tell us where you are in the request and we'll match accordingly.",
  },
  {
    group: "events",
    q: "How are rooms curated?",
    a: "Every room has one theme and about 30 seats. We choose who is in it from what people told us in their requests — what they're building and what they're looking for — so the people in the room have a reason to meet.",
  },
  {
    group: "joining",
    q: "Is there a WhatsApp group?",
    a: "Yes. The member community runs on WhatsApp, and the link is shared after you request access. It's where new rooms are announced first. The rooms are still where the introductions happen.",
  },
  {
    group: "events",
    q: "What happens in a room?",
    a: "You're placed with people chosen for you, hosts make one-on-one introductions around a specific ask, there's a focused conversation on the room's theme, and the evening ends with an open floor. Hosts follow up within 48 hours.",
  },
  {
    group: "events",
    q: "Can I pitch my services in a room?",
    a: "Not to the room. Say what you do in your introduction and let people come to you. Respecting the room is part of the Charter.",
  },
  {
    group: "chapters",
    q: "There's no chapter in my city. What now?",
    a: "Request access anyway and tell us your city — demand decides where the next chapter opens. You can also apply to start one; BNC gives new city leads the format, the playbook and promotion to the existing network.",
  },
  {
    group: "partners",
    q: "How do sponsorships and partnerships work?",
    a: "Brands can sponsor a single room, a city series or the national calendar, and ecosystem partners can offer tools or perks to members. Use the sponsor or partner forms and we'll send details.",
  },
];
