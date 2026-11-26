import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { POSTS } from "@/content/posts";
import { STATIC_ROUTES } from "@/lib/routes";
import { getChapters, getPastEvents, getStories, getUpcomingEvents, isPlaceholder } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [chapters, upcoming, past, stories] = await Promise.all([getChapters(), getUpcomingEvents(), getPastEvents(), getStories()]);
  const u = (p: string) => `${SITE.url}${p === "/" ? "" : p}`;
  return [
    ...STATIC_ROUTES.map((r) => ({ url: u(r.path), priority: r.priority, changeFrequency: "weekly" as const })),
    ...chapters.map((c) => ({ url: u(`/chapters/${c.slug}`), lastModified: c.updated_at, priority: 0.8, changeFrequency: "weekly" as const })),
    ...[...upcoming, ...past].filter((e) => !isPlaceholder(e)).map((e) => ({ url: u(`/rooms/${e.slug}`), lastModified: e.updated_at, priority: 0.7 })),
    ...stories.filter((s) => !isPlaceholder(s)).map((s) => ({ url: u(`/stories/${s.slug}`), lastModified: s.updated_at, priority: 0.5 })),
    ...POSTS.map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: p.date, priority: 0.5 })),
  ];
}
