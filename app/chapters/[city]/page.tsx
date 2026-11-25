import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { eventGallery, getChapter, getChapters, getNextEventFor, getPastEvents, getStories, getUpcomingEvents } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { fmtLongDate } from "@/lib/format";
import { LINKS, STATS } from "@/content/site";
import { Container, Section, SectionHeader, Eyebrow } from "@/components/ui/layout";
import { Breadcrumbs, EmptyState, Tag } from "@/components/ui/misc";
import { Photo } from "@/components/ui/photo";
import { StoryCard } from "@/components/ui/cards";
import { EventCard } from "@/components/events/event-card";
import { EventListItem } from "@/components/ui/event-list-item";
import { GALLERY } from "@/content/photos";
import { ButtonLink } from "@/components/ui/button";
import { EventFeature } from "@/components/events/event-feature";
import { NextStep } from "@/components/events/next-step";
import { NextEvents } from "@/components/home/next-events";
import { JsonLd } from "@/components/site/json-ld";
import { SITE } from "@/content/site";

export const revalidate = 600;

export async function generateStaticParams() {
  return (await getChapters()).map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chapters/[city]">): Promise<Metadata> {
  const { city } = await params;
  const c = await getChapter(city);
  if (!c) return {};
  return pageMeta({
    title: `Founder networking events in ${c.city}`,
    ogTitle: `Meet founders in ${c.city} — Bombay Networking Circle`,
    description: `Free founder and startup networking events in ${c.city}, ${c.state}. Small, hosted rooms for founders, operators and freelancers. See the next ${c.city} event and RSVP.`,
    path: `/chapters/${c.slug}`,
  });
}

export default async function ChapterPage({ params }: PageProps<"/chapters/[city]">) {
  const { city } = await params;
  const chapter = await getChapter(city);
  if (!chapter) notFound();

  const [next, upcoming, past, stories] = await Promise.all([
    getNextEventFor(chapter),
    getUpcomingEvents({ chapterId: chapter.id }),
    getPastEvents({ chapterId: chapter.id }),
    getStories(),
  ]);
  const local = stories.filter((s) => s.chapter_id === chapter.id);
  const later = upcoming.filter((e) => e.id !== next?.event.id);

  // Event photos first. Mumbai falls back to the BNC collage from Isha's site (labelled Mumbai there; see CONTENT-TODO 5.4).
  const eventPhotos = past.flatMap((e) => eventGallery(e)).slice(0, 8);
  const photos = eventPhotos.length ? eventPhotos : chapter.slug === "mumbai" ? GALLERY : [];
  const seats = past.reduce((n, e) => n + (e.registrations ?? 0), 0);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: `${SITE.name} — ${chapter.city} chapter`,
          url: `${SITE.url}/chapters/${chapter.slug}`,
          parentOrganization: { "@id": `${SITE.url}/#organization` },
          areaServed: { "@type": "City", name: chapter.city },
          address: { "@type": "PostalAddress", addressLocality: chapter.city, addressRegion: chapter.state, addressCountry: "IN" },
        }}
      />

      <header className="border-b border-line bg-bg-raised pb-section-sm pt-10">
        <Container>
          <Breadcrumbs items={[{ label: "Chapters", href: "/chapters" }, { label: chapter.city, href: `/chapters/${chapter.slug}` }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow>{chapter.state}</Eyebrow>
                {chapter.is_flagship && <Tag>Home chapter</Tag>}
              </div>
              <h1 className="mt-3 font-display text-display-xl text-fg">
                Founder networking in {chapter.city}
              </h1>
              {chapter.intro && <p className="mt-5 max-w-measure text-body-lg text-fg-muted">{chapter.intro}</p>}
              <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 border-t border-line pt-6 text-body-sm">
                <div>
                  <dt className="text-fg-subtle">Chapter lead</dt>
                  <dd className="mt-1 font-semibold text-fg">{chapter.lead_name ?? "Being appointed"}</dd>
                </div>
                <div>
                  <dt className="text-fg-subtle">{chapter.member_count && chapter.member_count_as_of ? "Members here" : "Rooms so far"}</dt>
                  <dd className="mt-1 font-semibold text-fg">
                    {chapter.member_count && chapter.member_count_as_of
                      ? `${chapter.member_count.toLocaleString("en-IN")} (as of ${fmtLongDate(chapter.member_count_as_of)})`
                      : past.length
                        ? `${past.length}${seats ? ` · ${seats} registered` : ""}${chapter.launched_on ? ` · since ${fmtLongDate(chapter.launched_on)}` : ""}`
                        : `Part of ${STATS.items[0].value} across India`}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="lg:col-span-6">
              {next ? (
                <EventFeature
                  headingLevel="h2"
                  event={next.event}
                  note={next.nearest ? `No ${chapter.city} date is open yet. The nearest one is in ${next.event.chapter.city}.` : undefined}
                />
              ) : (
                <NextEvents events={[]} city={chapter.city} source={`city:${chapter.slug}`} headingAs="h2" />
              )}
              {next?.nearest && (
                <div className="mt-6">
                  <NextEvents events={[]} city={chapter.city} source={`city:${chapter.slug}`} headingAs="h2" />
                </div>
              )}
            </div>
          </div>
        </Container>
      </header>

      {later.length > 0 && (
        <Section size="sm" labelledBy="later-title">
          <Container>
            <SectionHeader id="later-title" title={`More ${chapter.city} dates`} />
            <ul className="mt-8 border-t border-line">
              {later.map((e) => (
                <EventListItem key={e.id} event={e} showCity={false} />
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* City lead */}
      <Section size="sm" tone="raised" labelledBy="lead-title">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-2">
              {chapter.lead_photo && chapter.lead_name ? (
                <Image src={chapter.lead_photo} alt={chapter.lead_name} width={240} height={300} className="aspect-portrait w-32 rounded-lg object-cover" />
              ) : (
                <div className="flex aspect-square w-24 items-center justify-center rounded-full border border-dashed border-line-strong font-display text-heading-lg text-fg-subtle" aria-hidden="true">
                  {chapter.city.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="md:col-span-7">
              <h2 id="lead-title" className="text-heading-md text-fg">
                {chapter.lead_name ? `${chapter.lead_name} leads ${chapter.city}` : `${chapter.city} needs a chapter lead`}
              </h2>
              <p className="mt-2 text-body text-fg-muted">
                {chapter.lead_name
                  ? "City leads host the rooms, make the introductions and know who in the city you should meet."
                  : "City leads host the rooms and make the introductions. If you know this city's founders, this could be you — BNC provides the format and the playbook."}
              </p>
            </div>
            <div className="md:col-span-3 md:text-right">
              <ButtonLink href={chapter.lead_name ? "/contact" : "/chapters/start"} variant="secondary">
                {chapter.lead_name ? "Contact the chapter" : "Apply to lead"}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* Past events & photos */}
      <Section labelledBy="past-title">
        <Container>
          <SectionHeader id="past-title" eyebrow="Past rooms" title={`What ${chapter.city} rooms look like`} />
          {photos.length > 0 ? (
            <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {photos.map((p) => (
                <li key={p.src}>
                  <Photo photo={p} sizes="(min-width: 768px) 25vw, 50vw" ratio="square" className="rounded-md" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 grid gap-6 rounded-lg border border-line bg-bg-card p-8 md:grid-cols-12 md:items-center">
              {/* Typographic treatment instead of borrowed photos */}
              <p className="font-display text-display-lg text-fg-subtle md:col-span-5" aria-hidden="true">
                {chapter.city}
              </p>
              <p className="text-body text-fg-muted md:col-span-7">
                Photos from {chapter.city} rooms will appear here. Until then, every BNC room follows the same format — see{" "}
                <Link href="/about" className="font-semibold text-accent-text underline underline-offset-4">
                  how an evening runs
                </Link>
                .
              </p>
            </div>
          )}
          {past.length > 0 && (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {/* Local stories */}
      <Section size="sm" tone="raised" labelledBy="stories-title">
        <Container>
          <SectionHeader id="stories-title" eyebrow="Stories" title={`From ${chapter.city} members`} />
          {local.length ? (
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {local.map((s) => (
                <li key={s.id}>
                  <StoryCard story={s} city={chapter.city} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              className="mt-8"
              title={`No ${chapter.city} stories published yet`}
              body="We publish member stories only with written consent. If a BNC introduction changed something for you, tell us."
            >
              <ButtonLink href="/contact" variant="secondary">
                Share your story
              </ButtonLink>
              <Link href="/stories" className="text-body-sm font-semibold text-fg underline underline-offset-4">
                Stories from other cities
              </Link>
            </EmptyState>
          )}
        </Container>
      </Section>

      <NextStep
        placement={`city-${chapter.slug}`}
        rsvpHref={next ? (next.event.luma_url ?? LINKS.lumaCalendar) : LINKS.lumaCalendar}
        rsvpLabel={next && !next.nearest ? `RSVP for ${chapter.city}` : "See dates on Luma"}
      />
    </>
  );
}
