/**
 * Photo manifest. Files are produced by scripts/fetch-photos.mjs (real BNC photography from the previous site's
 * assets/ folder and Isha Ostwal's site repo, one consistent grade). Sizes are the real output dimensions — next/image needs them.
 * Alt text describes what is in the frame; it does not name people who haven't been identified.
 */
import drivePhotos from "./drive-photos.json";

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

/** Home page grid: eight frames, faces visible, a mix of talks and full rooms. Full-size photos only (no collage tiles). */
export const HOME_GRID: Photo[] = [
  PHOTOS.panel,
  PHOTOS.roomC,
  PHOTOS.roomE,
  PHOTOS.officeAudience,
  PHOTOS.gardenTable,
  PHOTOS.roomG,
  PHOTOS.bougainvillea,
  PHOTOS.roomA,
];

/** Chapter-page gallery: full-size group photos. */
export const GALLERY: Photo[] = [
  PHOTOS.officeGroup,
  PHOTOS.roomB,
  PHOTOS.roomH,
  PHOTOS.stageNight,
  PHOTOS.roomC,
  PHOTOS.screenGroup,
  PHOTOS.roomG,
  PHOTOS.panel,
];

/**
 * Photos pulled from BNC's Google Drive event folders (Surat Edition, Masters Union, BNC × Re-Defined Delhi) by
 * scripts/fetch-photos.mjs at build time. The script rewrites drive-photos.json with whatever it could fetch, so an
 * unreachable Drive never breaks a build — the wall just shows fewer frames.
 */
export const DRIVE_PHOTOS: Photo[] = drivePhotos as Photo[];

/** Home photo wall: every event photo we have — the previous site's set first, then Drive. Founder portraits excluded. */
export const ALL_EVENT_PHOTOS: Photo[] = [
  ...Object.entries(PHOTOS)
    .filter(([k]) => !k.startsWith("founder") && k !== "hero")
    .map(([, v]) => v),
  ...DRIVE_PHOTOS,
];
