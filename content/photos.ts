/**
 * Photo manifest. Files are produced by scripts/fetch-photos.mjs (real BNC photography from the previous site's
 * assets/ folder and Isha Ostwal's site repo, one consistent grade). Sizes are the real output dimensions — next/image needs them.
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
  // From the previous site (assets/). It labelled the room-* photos by city; those labels are unconfirmed
  // (two show the same venues as the Mumbai collage), so they are used as general BNC photos. See CONTENT-TODO.
  panel: p("event-panel.webp", 1024, 768, "A three-person panel on stage with speaker slides behind them."),
  officeAudience: p("event-office-audience.webp", 1024, 768, "A seated audience with laptops listening to a session in an office."),
  officeGroup: p("event-office-group.webp", 1024, 768, "Members standing together around a long table in an office space."),
  screenGroup: p("event-screen-group.webp", 1024, 768, "A group photo in a meeting room in front of a presentation screen."),
  gardenTalk: p("event-garden-talk.webp", 768, 1024, "The host speaking to a seated room in a garden venue."),
  gardenTable: p("event-garden-table.webp", 576, 1024, "Members in conversation around a table under a glass canopy."),
  bougainvillea: p("event-bougainvillea.webp", 1024, 548, "A group of members outdoors in front of bougainvillea."),
  stageNight: p("event-stage-night.webp", 768, 1024, "Members on a stage at an evening event."),
  roomA: p("room-a.webp", 1024, 768, "A large group of members photographed together at a BNC evening."),
  roomB: p("room-b.webp", 1024, 576, "Members standing together in an office event space."),
  roomC: p("room-c.webp", 1024, 768, "A large crowd at an evening event under string lights."),
  roomD: p("room-d.webp", 1024, 768, "Members gathered around a long meeting table."),
  roomE: p("room-e.webp", 1024, 768, "Members standing together in a café with a slatted wooden ceiling."),
  roomF: p("room-f.webp", 1024, 548, "A group outdoors beside bougainvillea and café tables."),
  roomG: p("room-g.webp", 1024, 768, "A full café room of members standing behind round tables."),
  roomH: p("room-h.webp", 1024, 768, "An outdoor group photo of members, some seated in front."),
} as const;

/** Home page grid: eight frames, faces visible, a mix of talks and full rooms. */
export const HOME_GRID: Photo[] = [
  PHOTOS.panel,
  PHOTOS.roomC,
  PHOTOS.conversation,
  PHOTOS.officeAudience,
  PHOTOS.gardenTable,
  PHOTOS.roomG,
  PHOTOS.bougainvillea,
  PHOTOS.roomA,
];

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
