#!/usr/bin/env node
/**
 * Real BNC photography, pulled from Isha Ostwal's site repo (AkshatRathod7/ishawebsite) at a pinned commit,
 * cropped and graded once with one consistent treatment, and written to public/photos/*.webp.
 *
 * Runs automatically before `next build` (npm "prebuild"). Skips files that already exist unless --force.
 * Why a script instead of committing the JPEGs: the outputs are reproducible from the source, and the
 * crops are documented here (which tile of the collage is which). Swap SOURCES when BNC supplies its own
 * high-resolution event set (see CONTENT-TODO.md).
 *
 * The manifest the site reads (sizes, alt text) is content/photos.ts. Keep the two in sync.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
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
 * bnc.jpeg is a 1080×1350 collage: a 3×3 grid of event photos around the logo tile.
 * Crops are inset to avoid the round ornaments that sit on the tile corners.
 */
const JOBS = [
  { out: "meetup-garden-room.webp", src: "commuintymeetup.jpeg", crop: { left: 0, top: 100, width: 1600, height: 1067 }, width: 1600, quality: 64 },
  { out: "founder-isha-ostwal.webp", src: "isha.jpeg", crop: { left: 0, top: 380, width: 900, height: 1125 }, width: 720 },
  { out: "founder-isha-keynote.webp", src: "keynote.jpeg", crop: { left: 0, top: 260, width: 816, height: 1020 }, width: 720 },
  { out: "tile-group-mono.webp", src: "bnc.jpeg", crop: { left: 0, top: 0, width: 340, height: 400 } },
  { out: "tile-hosts.webp", src: "bnc.jpeg", crop: { left: 370, top: 0, width: 302, height: 395 } },
  { out: "tile-conversation.webp", src: "bnc.jpeg", crop: { left: 768, top: 0, width: 312, height: 441 } },
  { out: "tile-group-cafe.webp", src: "bnc.jpeg", crop: { left: 0, top: 490, width: 352, height: 406 } },
  { out: "tile-group-wide.webp", src: "bnc.jpeg", crop: { left: 728, top: 453, width: 352, height: 395 } },
  { out: "tile-talk-garden.webp", src: "bnc.jpeg", crop: { left: 0, top: 908, width: 352, height: 442 } },
  { out: "tile-room-full.webp", src: "bnc.jpeg", crop: { left: 364, top: 945, width: 352, height: 405 } },
  { out: "tile-group-mono-2.webp", src: "bnc.jpeg", crop: { left: 766, top: 908, width: 314, height: 442 } },
];

const cache = new Map();
async function source(file) {
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
for (const job of JOBS) {
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
console.log(made ? `fetch-photos: wrote ${made} file(s) to public/photos` : "fetch-photos: up to date");
