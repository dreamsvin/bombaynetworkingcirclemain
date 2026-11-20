/**
 * Blog posts. Advice pieces written for BNC (review before launch — CONTENT-TODO). No invented events,
 * members or figures: recaps and interviews get added here only from real events with consent.
 * Body is a list of blocks so posts stay typed and need no markdown parser.
 */
export type Block = { h2: string } | { p: string } | { ul: string[] } | { quote: string };
export type Post = { slug: string; title: string; dek: string; date: string; author: string; tag: "Networking advice" | "Event recap" | "Founder interview"; body: Block[] };

export const POSTS: Post[] = [
  {
    slug: "the-one-line-ask",
    title: "The one-line ask: how to get something out of a networking room",
    dek: "Most people leave a room with ten cards and no next step. The fix takes one sentence, written before you arrive.",
    date: "2026-11-18",
    author: "BNC team",
    tag: "Networking advice",
    body: [
      { p: "Every BNC evening starts the same way: everyone says who they are and one thing they need. It's the single most useful habit we know, and it works anywhere — not just in our rooms." },
      { h2: "Why vague asks fail" },
      { p: "\"I'm open to opportunities\" gives the room nothing to do. Nobody can act on it, so nobody does. \"I'm looking for a backend engineer in Pune who has shipped payments\" is different: three people can immediately think of someone, or someone who knows someone." },
      { h2: "Write it before you arrive" },
      { ul: ["Name the thing: a hire, a client, a co-founder, an investor intro, a piece of advice.", "Add one constraint that narrows it: a city, a stage, a skill, a sector.", "Keep it under fifteen words. If you can't, you have two asks — pick one."] },
      { h2: "Then listen for other people's" },
      { p: "The fastest way to get help in a room is to give it. When someone else says their ask, think for five seconds about who you know. One introduction made is worth more than ten cards collected." },
      { quote: "A specific ask turns a room of strangers into a room of people who can help." },
      { h2: "Follow up within a day" },
      { p: "Send the message while the conversation is fresh. Mention where you met and the ask you discussed. Make it easy to say yes: a short call, a time, a link." },
    ],
  },
  {
    slug: "first-networking-event-as-a-founder",
    title: "Your first founder networking event: what to expect and what to bring",
    dek: "A practical checklist for the evening — from what to wear to what to do when you don't know anyone.",
    date: "2026-11-11",
    author: "BNC team",
    tag: "Networking advice",
    body: [
      { p: "Walking into a room where you know nobody is uncomfortable for almost everyone, including people who look relaxed. Here's how to make the first one count." },
      { h2: "Before" },
      { ul: ["Write your one-line ask (see our guide to the one-line ask).", "Have a two-sentence answer to \"what do you do?\" — what you're building and who it's for.", "Charge your phone. Have a way to share your contact quickly: a LinkedIn QR code works."] },
      { h2: "During" },
      { ul: ["Arrive on time. The start of the evening is when hosts place people and make introductions.", "Ask questions before you talk about yourself. People remember who listened.", "Aim for three good conversations, not thirty short ones.", "Don't pitch your product to people who didn't ask."] },
      { h2: "After" },
      { ul: ["Follow up within 24 hours with the people you promised something to.", "Make the introductions you offered — this is how trust is built.", "Note what worked, and come back. Rooms get more useful the second and third time."] },
    ],
  },
  {
    slug: "why-small-rooms-beat-big-events",
    title: "Why small rooms beat big events for founders",
    dek: "The economics of attention at a networking event, and why BNC keeps its rooms small on purpose.",
    date: "2026-11-04",
    author: "BNC team",
    tag: "Networking advice",
    body: [
      { p: "A founder at an event has a few hours and a limited amount of attention. The question is how much of that turns into a useful conversation." },
      { h2: "Big rooms spread attention thin" },
      { p: "At a large event, most of the evening goes on finding people, queuing to talk to speakers, and conversations cut short. You meet many people briefly and few people properly." },
      { h2: "Small rooms make introductions possible" },
      { p: "In a small, hosted room, the host can hear every ask and knows enough about every person to connect them. That's the job: not filling seats, but making the right two people talk." },
      { h2: "Grouping by stage matters" },
      { p: "A first-time founder and a founder three years in need different conversations. Grouping people by stage keeps the advice relevant and the asks answerable." },
      { quote: "Measure a room by what happens after it, not by how full it was." },
    ],
  },
];
