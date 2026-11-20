import "server-only";
import { unstable_cache } from "next/cache";
import type { Tables } from "@/lib/supabase/database.types";
import { readClient } from "@/lib/supabase/server";
import { SHOW_PLACEHOLDERS } from "@/lib/env";
import { CHAPTERS, EVENTS, MEMBERS, PLACEHOLDER, SPONSORS, STORIES, TESTIMONIALS } from "@/content/seed";

export type Chapter = Tables<"chapters">;
export type Event = Tables<"events">;
export type Member = Tables<"members">;
export type Story = Tables<"stories">;
export type Testimonial = Tables<"testimonials">;
export type Sponsor = Tables<"sponsors">;
export type EventWithChapter = Event & { chapter: Pick<Chapter, "slug" | "city"> };

/** Seconds. Supabase-backed pages regenerate at most this often (ISR); `revalidateTag("content")` forces it. */
export const REVALIDATE = 600;

export const isPlaceholder = (row: object) => Object.values(row).some((v) => typeof v === "string" && v.includes(PLACEHOLDER));

/** Seed mode visibility: published rows, plus placeholder rows when previewing. */
const visible = <T extends { is_published: boolean }>(rows: T[]) =>
  rows.filter((r) => r.is_published || (SHOW_PLACEHOLDERS && isPlaceholder(r)));

const cached = <A extends unknown[], R>(key: string, fn: (...args: A) => Promise<R>) =>
  unstable_cache(fn, ["bnc", key], { revalidate: REVALIDATE, tags: ["content", key] });

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
