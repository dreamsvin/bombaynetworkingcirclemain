import "server-only";
import { unstable_cache } from "next/cache";
import type { Tables } from "@/lib/supabase/database.types";
import { readClient } from "@/lib/supabase/server";
import { HAS_SUPABASE, SHOW_PLACEHOLDERS } from "@/lib/env";
import { CHAPTERS, EVENTS, MEMBERS, SPONSORS, STORIES, TESTIMONIALS } from "@/content/seed";

export type Chapter = Tables<"chapters">;
export type Event = Tables<"events">;
export type Member = Tables<"members">;
export type Story = Tables<"stories">;
export type Testimonial = Tables<"testimonials">;
export type Sponsor = Tables<"sponsors">;
export type EventWithChapter = Event & { chapter: Pick<Chapter, "slug" | "city"> };

/** Seconds. Supabase-backed pages regenerate at most this often (ISR); `revalidateTag("content")` forces it. */
export const REVALIDATE = 600;

export { isPlaceholder } from "@/lib/is-placeholder";
import { isPlaceholder } from "@/lib/is-placeholder";

/** Seed mode visibility: published rows, plus placeholder rows when previewing. */
const visible = <T extends { is_published: boolean }>(rows: T[]) =>
  rows.filter((r) => r.is_published || (SHOW_PLACEHOLDERS && isPlaceholder(r)));

/** Cache key includes the data source and placeholder mode, so switching either never serves stale rows. */
const MODE = `${HAS_SUPABASE ? "db" : "seed"}:${SHOW_PLACEHOLDERS ? "preview" : "live"}`;
const cached = <A extends unknown[], R>(key: string, fn: (...args: A) => Promise<R>) =>
  unstable_cache(fn, ["bnc", MODE, key], { revalidate: REVALIDATE, tags: ["content", key] });

// ───────── chapters ─────────
export const getChapters = cached("chapters", async (): Promise<Chapter[]> => {
  const db = readClient();
  if (!db) return visible(CHAPTERS).sort((a, b) => a.sort_order - b.sort_order);
  const { data, error } = await db.from("chapters").select("*").order("sort_order");
  if (error) throw error;
  return data;
});

export async function getChapter(slug: string) {
  return (await getChapters()).find((c) => c.slug === slug) ?? null;
}

// ───────── events ─────────
const allEvents = cached("events", async (): Promise<Event[]> => {
  const db = readClient();
  if (!db) return visible(EVENTS);
  const { data, error } = await db.from("events").select("*").order("starts_at");
  if (error) throw error;
  return data;
});

async function withChapters(events: Event[]): Promise<EventWithChapter[]> {
  const chapters = await getChapters();
  return events.flatMap((e) => {
    const c = chapters.find((ch) => ch.id === e.chapter_id);
    return c ? [{ ...e, chapter: { slug: c.slug, city: c.city } }] : [];
  });
}

const isUpcoming = (e: Event, now = Date.now()) => new Date(e.ends_at ?? e.starts_at).getTime() >= now;

/** True once an event has finished. */
export const hasEnded = (e: Event) => !isUpcoming(e);

export async function getUpcomingEvents(opts: { chapterId?: string; limit?: number } = {}) {
  const list = (await allEvents())
    .filter((e) => isUpcoming(e) && (!opts.chapterId || e.chapter_id === opts.chapterId))
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  return withChapters(opts.limit ? list.slice(0, opts.limit) : list);
}

export async function getPastEvents(opts: { chapterId?: string; limit?: number } = {}) {
  const list = (await allEvents())
    .filter((e) => !isUpcoming(e) && (!opts.chapterId || e.chapter_id === opts.chapterId))
    .sort((a, b) => b.starts_at.localeCompare(a.starts_at));
  return withChapters(opts.limit ? list.slice(0, opts.limit) : list);
}

export async function getEvent(slug: string) {
  const e = (await allEvents()).find((x) => x.slug === slug);
  return e ? (await withChapters([e]))[0] ?? null : null;
}

export async function getAllEventSlugs() {
  return (await allEvents()).map((e) => e.slug);
}

/**
 * The next event for a city. If the city has none, the next event at the geographically nearest chapter,
 * so a city page never shows an empty state.
 */
export async function getNextEventFor(chapter: Chapter) {
  const own = await getUpcomingEvents({ chapterId: chapter.id, limit: 1 });
  if (own[0]) return { event: own[0], nearest: false as const };
  const chapters = await getChapters();
  const upcoming = await getUpcomingEvents();
  const dist = (c: Chapter) =>
    Math.hypot(Number(c.latitude ?? 0) - Number(chapter.latitude ?? 0), Number(c.longitude ?? 0) - Number(chapter.longitude ?? 0));
  const ranked = upcoming
    .map((e) => ({ e, d: dist(chapters.find((c) => c.id === e.chapter_id)!) }))
    .sort((a, b) => a.d - b.d || a.e.starts_at.localeCompare(b.e.starts_at));
  return ranked[0] ? { event: ranked[0].e, nearest: true as const } : null;
}

// ───────── people & proof ─────────
const allMembers = cached("members", async (): Promise<Member[]> => {
  const db = readClient();
  if (!db) return visible(MEMBERS);
  const { data, error } = await db.from("members").select("*");
  if (error) throw error;
  return data;
});

export async function getTeam() {
  return (await allMembers()).filter((m) => m.team_role).sort((a, b) => (a.team_order ?? 99) - (b.team_order ?? 99));
}

export async function getFeaturedMembers() {
  return (await allMembers()).filter((m) => m.is_featured);
}

export const getTestimonials = cached("testimonials", async (): Promise<Testimonial[]> => {
  const db = readClient();
  if (!db) return visible(TESTIMONIALS);
  const { data, error } = await db.from("testimonials").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
});

export const getStories = cached("stories", async (): Promise<Story[]> => {
  const db = readClient();
  if (!db) return visible(STORIES);
  const { data, error } = await db.from("stories").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
});

export async function getStory(slug: string) {
  return (await getStories()).find((s) => s.slug === slug) ?? null;
}

export const getSponsors = cached("sponsors", async (): Promise<Sponsor[]> => {
  const db = readClient();
  if (!db) return visible(SPONSORS);
  const { data, error } = await db.from("sponsors").select("*").order("tier");
  if (error) throw error;
  return data;
});

// ───────── history, people and proof derived from events ─────────
export type Person = { name: string; role: string };
export type GalleryPhoto = { src: string; width: number; height: number; alt: string };

const isPeople = (v: unknown): v is Person[] =>
  Array.isArray(v) && v.every((x) => x && typeof x === "object" && "name" in x && "role" in x);
const isGallery = (v: unknown): v is GalleryPhoto[] =>
  Array.isArray(v) && v.every((x) => x && typeof x === "object" && "src" in x && "width" in x && "height" in x);

export const eventSpeakers = (e: Event): Person[] => (isPeople(e.speakers) ? e.speakers : []);
export const eventPartners = (e: Event): Person[] => (isPeople(e.partners) ? e.partners : []);
export const eventGallery = (e: Event): GalleryPhoto[] => (isGallery(e.gallery) ? e.gallery : []);

/** Every event, oldest first, with its chapter. Used by the timeline, gallery and archive. */
export async function getAllEvents() {
  const list = [...(await allEvents())].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  return withChapters(list);
}

/** Speakers and hosts named on public event pages, de-duplicated, with the rooms they appeared in. Host listed last. */
export async function getSpeakers() {
  const events = await getAllEvents();
  const map = new Map<string, Person & { events: { slug: string; title: string; city: string }[] }>();
  for (const e of events) {
    for (const p of eventSpeakers(e)) {
      const cur = map.get(p.name) ?? { ...p, events: [] };
      cur.events.push({ slug: e.slug, title: e.title, city: e.chapter.city });
      map.set(p.name, cur);
    }
  }
  return [...map.values()].sort((a, b) => Number(a.name === "Isha Ostwal") - Number(b.name === "Isha Ostwal"));
}

/** Simple, sourced counts from the event table (shown with the archive). */
export async function getEventTotals() {
  const events = (await getAllEvents()).filter((e) => !isUpcoming(e));
  const cities = new Set(events.filter((e) => !e.is_online).map((e) => e.chapter.slug));
  const seats = events.reduce((n, e) => n + (e.registrations ?? 0), 0);
  return { rooms: events.length, cities: cities.size, seats };
}
