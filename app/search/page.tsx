import type { Metadata } from "next";
import { getChapters, getStories, getUpcomingEvents, getPastEvents } from "@/lib/data";
import { POSTS } from "@/content/posts";
import { STATIC_ROUTES } from "@/lib/routes";
import { pageMeta } from "@/lib/seo";
import { clean } from "@/lib/is-placeholder";
import { fmtDate } from "@/lib/format";
import { Container, Section } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { SearchBox, type SearchItem } from "@/components/site/search-box";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({ title: "Search", description: "Search the Bombay Networking Circle site.", path: "/search", noindex: true });

export default async function SearchPage() {
  const [chapters, upcoming, past, stories] = await Promise.all([getChapters(), getUpcomingEvents(), getPastEvents(), getStories()]);
  const index: SearchItem[] = [
    ...STATIC_ROUTES.map((r) => ({ href: r.path, title: r.title, summary: r.summary, kind: "Page" })),
    ...chapters.map((c) => ({ href: `/chapters/${c.slug}`, title: `${c.city} chapter`, summary: c.intro ?? `${c.city}, ${c.state}`, kind: "Chapter" })),
    ...[...upcoming, ...past].map((e) => ({ href: `/events/${e.slug}`, title: clean(e.title), summary: `${e.chapter.city} · ${fmtDate(e.starts_at)}`, kind: "Event" })),
    ...stories.map((s) => ({ href: `/stories/${s.slug}`, title: clean(s.headline), summary: s.outcome ?? "", kind: "Story" })),
    ...POSTS.map((p) => ({ href: `/blog/${p.slug}`, title: p.title, summary: p.dek, kind: "Blog" })),
  ];
  return (
    <Section size="sm">
      <Container narrow>
        <Breadcrumbs items={[{ label: "Search", href: "/search" }]} />
        <h1 className="mb-8 mt-10 font-display text-display-lg text-fg">Search</h1>
        <SearchBox index={index} />
      </Container>
    </Section>
  );
}
