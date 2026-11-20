/**
 * Photo manifest. Files are produced by scripts/fetch-photos.mjs (real BNC photography from Isha Ostwal's
 * site repo, one consistent grade). Sizes are the real output dimensions — next/image needs them.
 * Alt text describes what is in the frame; it does not name people who haven't been identified.
 */
export type Photo = { src: string; width: number; height: number; alt: string };

const p = (file: string, width: number, height: number, alt: string): Photo => ({ src: `/photos/${file}`, width, height, alt });

export const PHOTOS = {
  hero: p(
    "meetup-garden-room.webp",
    1600,
    1067,
    "A BNC meetup in a garden café: members seated on sofas listen as the host speaks under hanging greenery.",
  ),
  founder: p("founder-isha-ostwal.webp", 720, 900, "Isha Ostwal, founder of Bombay Networking Circle, at the World Economic Forum offices."),
  founderSpeaking: p("founder-isha-keynote.webp", 720, 900, "Isha Ostwal speaking into a microphone at a conference."),
  conversation: p("tile-conversation.webp", 312, 441, "Members in conversation around café tables at a BNC evening."),
  talkGarden: p("tile-talk-garden.webp", 352, 442, "The host presenting to a seated room in a garden café."),
  roomFull: p("tile-room-full.webp", 352, 405, "A full room of BNC members standing together after an event."),
  groupWide: p("tile-group-wide.webp", 352, 395, "A group of members photographed together at the end of a meetup."),
  groupCafe: p("tile-group-cafe.webp", 352, 406, "Founders and operators standing together in a café venue."),
  hosts: p("tile-hosts.webp", 302, 395, "Two hosts smiling at a BNC event venue."),
  groupMono: p("tile-group-mono.webp", 340, 400, "Black-and-white photo of six members at a BNC event."),
  groupMono2: p("tile-group-mono-2.webp", 314, 442, "Black-and-white photo of four members at a BNC event."),
} as const;

/** The gallery used on the home page and the Mumbai chapter (the collage these come from is Mumbai — confirm in CONTENT-TODO). */
export const GALLERY: Photo[] = [
  PHOTOS.conversation,
  PHOTOS.talkGarden,
  PHOTOS.roomFull,
  PHOTOS.groupWide,
  PHOTOS.groupCafe,
  PHOTOS.hosts,
  PHOTOS.groupMono,
  PHOTOS.groupMono2,
];
