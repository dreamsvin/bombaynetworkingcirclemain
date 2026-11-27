#!/usr/bin/env node
/**
 * Real BNC photography from two sources, cropped and graded once with one consistent treatment, and written
 * to public/photos/*.webp (and partner logos to public/partners/*.webp):
 *   1. assets/  — the previous site's own photos and brand logos, kept in this repo as source files.
 *                 (The old AI-generated avatar images and the pharmacy-template logo were removed.)
 *   2. AkshatRathod7/ishawebsite at a pinned commit — founder photos and the BNC event collage.
 *
 * Runs automatically before `next build` (npm "prebuild"). Skips files that already exist unless --force.
 * Why a script instead of committing the JPEGs: the outputs are reproducible from the source, and the
 * crops are documented here (which tile of the collage is which). Swap SOURCES when BNC supplies its own
 * high-resolution event set (see CONTENT-TODO.md).
 *
 * The manifest the site reads (sizes, alt text) is content/photos.ts. Keep the two in sync.
 */
import { mkdir, writeFile, access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "photos");
const COMMIT = "283b5d58ea84936fe933e6ce3ce459b00a2671b0";
const RAW = (file) => `https://raw.githubusercontent.com/AkshatRathod7/ishawebsite/${COMMIT}/${file}`;
const force = process.argv.includes("--force");

/** One grade for every photo, so a mixed set reads as one body of work. */
const grade = (img) => img.modulate({ saturation: 0.84, brightness: 1.02 }).linear(0.96, 6).sharpen({ sigma: 0.6 });

/**
 * The 3×3 BNC collage (bnc.jpeg) used to be cut into ~300px tiles. At that size every tile looked blurred once the
 * page showed it at 300–400 CSS px on a 2× screen, so the tiles are no longer produced; the gallery uses the full-size
 * event photos below instead.
 */
const JOBS = [
  { out: "meetup-garden-room.webp", src: "commuintymeetup.jpeg", crop: { left: 0, top: 100, width: 1600, height: 1067 }, width: 1600, quality: 82 },
  { out: "founder-isha-ostwal.webp", src: "isha.jpeg", crop: { left: 0, top: 380, width: 900, height: 1125 }, width: 720 },
  { out: "founder-isha-keynote.webp", src: "keynote.jpeg", crop: { left: 0, top: 260, width: 816, height: 1020 }, width: 720 },
];

const LEGACY = [
  ["event-garden-talk.webp", "gallery/event1.jpg", 800, "The host speaking to a seated room in a garden venue."],
  ["event-office-group.webp", "gallery/event2.jpg", 1200, "Members standing together around a long table in an office space."],
  ["event-office-audience.webp", "gallery/event3.jpg", 1200, "A seated audience with laptops listening to a session in an office."],
  ["event-panel.webp", "gallery/event4.jpg", 1200, "A three-person panel on stage with speaker slides behind them."],
  ["event-screen-group.webp", "gallery/event5.jpg", 1200, "A group photo in a meeting room in front of a presentation screen."],
  ["event-garden-table.webp", "gallery/event6.jpg", 800, "Members in conversation around a table under a glass canopy."],
  ["event-bougainvillea.webp", "gallery/event7.jpg", 1200, "A group of members outdoors in front of bougainvillea."],
  ["event-stage-night.webp", "gallery/main-photo.jpg", 800, "Members on a stage at an evening event."],
  ["room-a.webp", "mumbai.jpg", 1200, "A large group of members photographed together at a BNC evening."],
  ["room-b.webp", "bangalore.jpg", 1200, "Members standing together in an office event space."],
  ["room-c.webp", "delhi.jpg", 1200, "A large crowd at an evening event under string lights."],
  ["room-d.webp", "pune.jpg", 1200, "Members gathered around a long meeting table."],
  ["room-e.webp", "hyderabad.jpg", 1200, "Members standing together in a café with a slatted wooden ceiling."],
  ["room-f.webp", "ahmedabad.jpg", 1200, "A group outdoors beside bougainvillea and café tables."],
  ["room-g.webp", "nashik.jpg", 1200, "A full café room of members standing behind round tables."],
  ["room-h.webp", "surat.jpg", 1200, "An outdoor group photo of members, some seated in front."],
].map(([out, file, width]) => ({ out, src: `local:${file}`, crop: null, width, quality: 84 }));

const BRANDS = ["brand1.jpg", "brand2.png", "brand3.png", "brand4.png", "brand5.png", "brand6.jpg", "brand7.png", "brand8.jpg", "brand9.jpg", "brand10.jpg"];

const cache = new Map();
async function source(file) {
  if (file.startsWith("local:")) return readFile(path.join(ROOT, "assets", file.slice(6)));
  if (!cache.has(file)) {
    const res = await fetch(RAW(file));
    if (!res.ok) throw new Error(`fetch-photos: ${file} → HTTP ${res.status}`);
    cache.set(file, Buffer.from(await res.arrayBuffer()));
  }
  return cache.get(file);
}

const exists = (p) => access(p).then(() => true, () => false);

await mkdir(OUT, { recursive: true });
let made = 0;
for (const job of [...JOBS, ...LEGACY]) {
  const dest = path.join(OUT, job.out);
  if (!force && (await exists(dest))) continue;
  let img = sharp(await source(job.src)).rotate();
  if (job.crop) img = img.extract(job.crop);
  if (job.width) img = img.resize({ width: job.width, withoutEnlargement: true });
  const buf = await grade(img).webp({ quality: job.quality ?? 78, effort: 5 }).toBuffer();
  await writeFile(dest, buf);
  const meta = await sharp(buf).metadata();
  console.log(`  ${job.out}  ${meta.width}×${meta.height}  ${(buf.length / 1024).toFixed(0)} KB`);
  made++;
}
// Partner/brand logos from the previous site: normalised to 320px wide, no grade (logos keep their colours).
const LOGOS = path.join(ROOT, "public", "partners");
await mkdir(LOGOS, { recursive: true });
for (const file of BRANDS) {
  const dest = path.join(LOGOS, file.replace(/\.(jpg|png)$/, ".webp"));
  if (!force && (await exists(dest))) continue;
  await sharp(path.join(ROOT, "assets", "brands", file)).resize({ width: 320, height: 320, fit: "inside" }).webp({ quality: 85 }).toFile(dest);
  made++;
}
console.log(made ? `fetch-photos: wrote ${made} file(s) to public/photos` : "fetch-photos: up to date");
