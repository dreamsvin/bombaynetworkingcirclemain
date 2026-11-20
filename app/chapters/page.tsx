import type { Metadata } from "next";
import Link from "next/link";
import { getChapters, getUpcomingEvents } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { fmtDate } from "@/lib/format";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { CityMap } from "@/components/ui/city-map";
import { ChapterDirectory } from "@/components/chapters/directory";
import { CityTracker } from "@/components/site/city-tracker";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const chapters = await getChapters();
  return pageMeta({
    title: `BNC chapters — founder networking in ${chapters.length} Indian cities`,
    ogTitle: "Find your circle",
    description: `Bombay Networking Circle chapters in ${chapters.map((c) => c.city).join(", ")}. Each city has its own events, lead and community. Find yours.`,
    path: "/chapters",
  });
}

export default async function ChaptersPage() {
  const [chapters, upcoming] = await Promise.all([getChapters(), getUpcomingEvents()]);
  const nextEvents = Object.fromEntries(
    chapters.map((c) => {
      const e = upcoming.find((x) => x.chapter_id === c.id);
      return [c.slug, e ? fmtDate(e.starts_at) : null];
    }),
  );

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Chapters", href: "/chapters" }]} />}
        eyebrow="Chapters"
        title="Find your circle."
        lede={`${chapters.length} cities, one community. Pick your city to see its next event, its lead and what happens there.`}
      />

      <Section labelledBy="directory-title">
        <Container>
          <h2 id="directory-title" className="sr-only">
            Chapter directory
          </h2>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ChapterDirectory chapters={chapters} nextEvents={nextEvents} />
            </div>
            <aside className="lg:col-span-4" aria-label="Chapter map">
              <CityTracker from="directory-map" className="mx-auto max-w-sm lg:sticky lg:top-24">
                <CityMap chapters={chapters} />
              </CityTracker>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tone="raised" labelledBy="soon-title">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <SectionHeader
              className="md:col-span-7"
              id="soon-title"
              eyebrow="Coming soon"
              title="Your city isn't on the list?"
              lede="New chapters start with one person who knows the local founders. If that's you, we'll give you the format, the playbook and the community's attention."
            />
            <div className="flex flex-wrap gap-4 md:col-span-5 md:justify-end">
              <ButtonLink href="/chapters/start" variant="secondary" size="lg">
                Start a chapter
              </ButtonLink>
              <Link href="/events" className="inline-flex min-h-11 items-center text-body-sm font-semibold text-fg underline underline-offset-4">
                Or visit a nearby city&apos;s event
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
