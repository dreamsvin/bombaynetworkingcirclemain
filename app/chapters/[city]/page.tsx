import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getChapter, getChapters, getMembers, getNextEventFor, getPastEvents, getStories, getUpcomingEvents } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { fmtDate, fmtLongDate, fmtTime } from "@/lib/format";
import { clean } from "@/lib/is-placeholder";
import { GALLERY } from "@/content/photos";
import { LINKS, PRIMARY_CTA, STATS } from "@/content/site";
import { Container, Section, SectionHeader, Eyebrow } from "@/components/ui/layout";
import { Breadcrumbs, EmptyState } from "@/components/ui/misc";
import { Chip, ClosingBand, RoomCard, priceLabel } from "@/components/ui/bnc";
import { MemberTile } from "@/components/members/member-tile";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { TrackedLink } from "@/components/site/tracked-link";
import { PrimaryCta } from "@/components/site/primary-cta";
import { Photo } from "@/components/ui/photo";
import { StoryCard } from "@/components/ui/cards";
import { ButtonLink } from "@/components/ui/button";
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
    title: `BNC ${c.city} — rooms and members in ${c.city}`,
    ogTitle: `BNC ${c.city}`,
    description: `Small, hosted rooms for founders, operators and creators in ${c.city}, ${c.state}. See the next ${c.city} room, who's in the city, and request access — free to join.`,
    path: `/chapters/${c.slug}`,
  });
}

export default async function ChapterPage({ params }: PageProps<"/chapters/[city]">) {
  const { city } = await params;
  const chapter = await getChapter(city);
  if (!chapter) notFound();

  const [next, upcoming, past, stories, members] = await Promise.all([
    getNextEventFor(chapter),
    getUpcomingEvents({ chapterId: chapter.id }),
    getPastEvents({ chapterId: chapter.id, limit: 6 }),
    getStories(),
    getMembers({ city: chapter.city }),
  ]);
  const own = next && !next.nearest ? next.event : null;
  const requestHref = `${PRIMARY_CTA.href}?city=${encodeURIComponent(chapter.city)}`;
  const local = stories.filter((s) => s.chapter_id === chapter.id);
  const later = upcoming.filter((e) => e.id !== next?.event.id);
  const hasPhotos = chapter.slug === "mumbai"; // The only real photo set so far is from Mumbai events.

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

      <header data-tone="sand" className="border-b-2 border-line-strong pb-section-sm pt-10">
        <Container>
          <Breadcrumbs items={[{ label: "Chapters", href: "/chapters" }, { label: chapter.city, href: `/chapters/${chapter.slug}` }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow>{chapter.state}</Eyebrow>
                {chapter.is_flagship && <Chip>Flagship</Chip>}
              </div>
              <h1 className="mt-3 font-display text-display-xl text-fg">BNC {chapter.city}</h1>
              {chapter.intro && <p className="mt-5 max-w-measure text-body-lg text-fg-muted">{chapter.intro}</p>}
              <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 border-t-2 border-line-strong pt-6 text-body-sm">
                <div>
                  <dt className="font-mono text-label uppercase text-brand-text">Members here</dt>
                  <dd className="mt-1 font-bold text-fg">
                    {chapter.member_count && chapter.member_count_as_of
                      ? `${chapter.member_count.toLocaleString("en-IN")} (as of ${fmtLongDate(chapter.member_count_as_of)})`
                      : `Part of ${STATS.items[0].value} across India (as of ${STATS.asOf})`}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-label uppercase text-brand-text">Rooms held</dt>
                  <dd className="mt-1 font-bold text-fg">{past.length ? past.length : "First rooms being scheduled"}</dd>
                </div>
              </dl>
            </div>
            <div className="lg:col-span-6">
              {own ? (
                <article aria-labelledby="next-room-title" className="border-2 border-line-strong bg-bg-card">
                  <div data-tone="brown" className="flex items-center justify-between px-5 py-3">
                    <span className="font-mono text-label uppercase">Next room</span>
                    {own.capacity && <span className="font-mono text-label uppercase">{own.capacity} seats</span>}
                  </div>
                  <div className="p-5 sm:p-6">
                    <h2 id="next-room-title" className="text-heading-lg text-fg">
                      <Link href={`/rooms/${own.slug}`} className="hover:underline hover:underline-offset-4">
                        {clean(own.title)}
                      </Link>
                    </h2>
                    <p className="mt-2 text-body text-fg-muted">
                      {fmtDate(own.starts_at)} · {fmtTime(own.starts_at)} IST
                    </p>
                    <p className="mt-2 text-body text-fg">
                      {own.theme ? clean(own.theme) : "Theme to be announced"} · <strong>{priceLabel(own.price_inr)}</strong>
                    </p>
                    <ButtonLink href={requestHref} size="lg" className="mt-6 w-full sm:w-auto">
                      {PRIMARY_CTA.label}
                    </ButtonLink>
                    <p className="mt-4 text-body-sm text-fg-muted">
                      Already a member?{" "}
                      <TrackedLink href={own.luma_url ?? LINKS.lumaCalendar} event="rsvp_click" props={{ source: `city-${chapter.slug}` }} newTab className="font-bold text-accent-text underline underline-offset-4">
                        RSVP<span className="sr-only"> on Luma (opens in a new tab)</span>
                      </TrackedLink>
                    </p>
                  </div>
                </article>
              ) : (
                <div className="border-2 border-line-strong bg-bg-card p-5 sm:p-6">
                  <p className="font-mono text-label uppercase text-brand-text">Next room</p>
                  <h2 className="mt-2 text-heading-lg text-fg">The next {chapter.city} date is being set.</h2>
                  <p className="mt-2 text-body text-fg-muted">Leave your email and we&rsquo;ll tell you the day it opens.</p>
                  <SubscribeForm variant="city" city={chapter.city} source={`city:${chapter.slug}`} id={`city-${chapter.slug}`} label="Your email" className="mt-5" />
                  {next?.nearest && (
                    <p className="mt-5 text-body-sm text-fg-muted">
                      Nearest open room:{" "}
                      <Link href={`/rooms/${next.event.slug}`} className="font-bold text-accent-text underline underline-offset-4">
                        {clean(next.event.title)}, {next.event.chapter.city}
                      </Link>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </header>

      {later.length > 0 && (
        <Section size="sm" labelledBy="later-title">
          <Container>
            <SectionHeader id="later-title" title={`More ${chapter.city} rooms`} />
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {later.map((e) => (
                <li key={e.id}>
                  <RoomCard room={e} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* City lead */}
      <Section size="sm" labelledBy="lead-title">
        <Container>
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-2">
              {chapter.lead_photo && chapter.lead_name ? (
                <Image src={chapter.lead_photo} alt={chapter.lead_name} width={240} height={300} className="aspect-portrait w-32 object-cover grayscale" />
              ) : (
                <div className="flex aspect-square w-24 items-center justify-center border-2 border-dashed border-line-strong font-display text-heading-lg text-fg-subtle" aria-hidden="true">
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
              <ButtonLink href={chapter.lead_name ? "/contact" : "/start-a-chapter"} variant="secondary">
                {chapter.lead_name ? "Contact the chapter" : "Apply to lead"}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* Members in the city */}
      <Section tone="sand" labelledBy="city-members-title">
        <Container>
          <SectionHeader id="city-members-title" eyebrow="Members" title={`Who's in ${chapter.city}`} />
          {members.length ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {members.slice(0, 8).map((m) => (
                <li key={m.id}>
                  <MemberTile member={m} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-measure text-body text-fg-muted">{chapter.city} profiles are being added, with each member&rsquo;s consent.</p>
          )}
          <Link href={`/members?city=${encodeURIComponent(chapter.city)}`} className="mt-6 inline-flex min-h-11 items-center font-bold text-accent-text underline underline-offset-4">
            Browse {chapter.city} members →
          </Link>
        </Container>
      </Section>

      {/* Past rooms & photos */}
      <Section labelledBy="past-title">
        <Container>
          <SectionHeader id="past-title" eyebrow="Past rooms" title={`What ${chapter.city} rooms look like`} />
          {hasPhotos ? (
            <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {GALLERY.map((p) => (
                <li key={p.src}>
                  <Photo photo={p} sizes="(min-width: 768px) 25vw, 50vw" ratio="square" className="border-2 border-line-strong" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 grid gap-6 border-2 border-line-strong bg-bg-card p-8 md:grid-cols-12 md:items-center">
              {/* Typographic treatment instead of borrowed photos */}
              <p className="font-display text-display-lg text-fg-subtle md:col-span-5" aria-hidden="true">
                {chapter.city}
              </p>
              <p className="text-body text-fg-muted md:col-span-7">
                Photos from {chapter.city} events will appear here. Until then, every BNC room follows the same format — see{" "}
                <Link href="/inside" className="font-semibold text-accent-text underline underline-offset-4">
                  how an evening runs
                </Link>
                .
              </p>
            </div>
          )}
          {past.length > 0 && (
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {past.map((e) => (
                <li key={e.id}>
                  <RoomCard room={e} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {/* Local stories */}
      <Section size="sm" labelledBy="stories-title">
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

      <ClosingBand title={`Find your people in ${chapter.city}.`} body="Joining is free. Request access and we'll match you to a room in the city.">
        <PrimaryCta size="lg" city={chapter.city} placement={`city-${chapter.slug}-closing`} />
      </ClosingBand>
    </>
  );
}
