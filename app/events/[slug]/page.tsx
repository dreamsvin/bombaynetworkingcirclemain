import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEventSlugs, getEvent, getChapter, hasEnded } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { fmtDate, fmtTime } from "@/lib/format";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { FORMATS, LINKS, ROOM_STEPS, SITE } from "@/content/site";
import { Container, Section, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs, Tag } from "@/components/ui/misc";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { EventFeature } from "@/components/events/event-feature";
import { NextStep } from "@/components/events/next-step";
import { JsonLd } from "@/components/site/json-ld";

export const revalidate = 600;

export async function generateStaticParams() {
  return (await getAllEventSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return {};
  const title = clean(e.title);
  return pageMeta({
    title: `${title} — ${fmtDate(e.starts_at)}`,
    ogTitle: `${title} · ${e.chapter.city}, ${fmtDate(e.starts_at)}`,
    description: e.summary ? clean(e.summary) : `${FORMATS[e.format].label} in ${e.chapter.city} on ${fmtDate(e.starts_at)}. Free BNC event — RSVP on Luma.`,
    path: `/events/${e.slug}`,
    noindex: isPlaceholder(e),
  });
}

type AgendaItem = { time: string; item: string };
const isAgenda = (v: unknown): v is AgendaItem[] => Array.isArray(v) && v.every((x) => x && typeof x === "object" && "time" in x && "item" in x);

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();
  const chapter = await getChapter(event.chapter.slug);
  const past = hasEnded(event);
  const title = clean(event.title);
  const agenda = isAgenda(event.agenda) ? event.agenda : null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: title,
          startDate: event.starts_at,
          ...(event.ends_at ? { endDate: event.ends_at } : {}),
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          description: event.summary ? clean(event.summary) : FORMATS[event.format].body,
          location: {
            "@type": "Place",
            name: event.venue ? clean(event.venue) : event.chapter.city,
            address: { "@type": "PostalAddress", streetAddress: event.venue_address ?? undefined, addressLocality: event.chapter.city, addressRegion: chapter?.state, addressCountry: "IN" },
          },
          organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
          ...(event.cover_image ? { image: [`${SITE.url}${event.cover_image}`] } : {}),
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR", availability: "https://schema.org/InStock", url: event.luma_url ?? LINKS.lumaCalendar },
        }}
      />

      <header className="border-b border-line bg-bg-raised pb-section-sm pt-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Events", href: "/events" },
              { label: title.length > 40 ? `${title.slice(0, 40)}…` : title, href: `/events/${event.slug}` },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <Tag>{FORMATS[event.format].label}</Tag>
                <Link href={`/chapters/${event.chapter.slug}`} className="text-caption font-semibold uppercase tracking-wider text-fg-subtle underline-offset-4 hover:underline">
                  {event.chapter.city} chapter
                </Link>
                {past && <Tag>Past event</Tag>}
                {isPlaceholder(event) && <PlaceholderBadge />}
              </div>
              <h1 className="mt-4 font-display text-display-lg text-fg">{title}</h1>
              <p className="mt-4 text-body-lg text-fg-muted">
                {fmtDate(event.starts_at)} · {fmtTime(event.starts_at)} IST · {event.chapter.city}
              </p>
              {event.summary && <p className="mt-6 max-w-measure text-body-lg text-fg-muted">{clean(event.summary)}</p>}
            </div>
            <div className="lg:col-span-5">
              {past ? (
                <div className="rounded-lg border border-line bg-bg-card p-6">
                  <p className="text-body text-fg">This event has happened.</p>
                  <p className="mt-2 text-body-sm text-fg-muted">
                    See what&apos;s next in{" "}
                    <Link href={`/chapters/${event.chapter.slug}`} className="font-semibold text-accent-text underline underline-offset-4">
                      {event.chapter.city}
                    </Link>{" "}
                    or{" "}
                    <Link href="/events" className="font-semibold text-accent-text underline underline-offset-4">
                      all cities
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <EventFeature event={event} headingLevel="h2" />
              )}
            </div>
          </div>
        </Container>
      </header>

      <Section labelledBy="details-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeader id="details-title" title="What to expect" />
              <p className="mt-4 text-body text-fg-muted">{FORMATS[event.format].body}</p>
              {agenda ? (
                <ol className="mt-8 border-t border-line">
                  {agenda.map((a) => (
                    <li key={a.time + a.item} className="grid grid-cols-[72px_1fr] gap-4 border-b border-line py-4">
                      <span className="font-display text-heading-sm text-fg-subtle">{a.time}</span>
                      <span className="text-body text-fg">{a.item}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <ol className="mt-8 border-t border-line">
                  {ROOM_STEPS.map((s, i) => (
                    <li key={s.title} className="grid grid-cols-[40px_1fr] gap-4 border-b border-line py-4">
                      <span className="font-display text-heading-sm text-fg-subtle">{i + 1}</span>
                      <span>
                        <span className="block text-body font-semibold text-fg">{s.title}</span>
                        <span className="text-body-sm text-fg-muted">{s.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <aside className="lg:col-span-5" aria-labelledby="who-title">
              <div className="rounded-lg border border-line bg-bg-raised p-6">
                <h2 id="who-title" className="text-heading-sm text-fg">
                  Who attends
                </h2>
                <p className="mt-2 text-body text-fg-muted">
                  {event.who_attends ?? "Founders at every stage, startup operators, freelancers and creators. Rooms are grouped so you meet people facing similar problems."}
                </p>
                <h2 className="mt-6 text-heading-sm text-fg">Venue</h2>
                <p className="mt-2 text-body text-fg-muted">
                  {[event.venue ? clean(event.venue) : null, event.venue_address].filter(Boolean).join(", ") || `${event.chapter.city} — venue shared on Luma after you RSVP.`}
                </p>
                <h2 className="mt-6 text-heading-sm text-fg">Cost</h2>
                <p className="mt-2 text-body text-fg-muted">Free. Luma shows the final details when you register.</p>
                <p className="mt-6 text-body-sm text-fg-muted">
                  By attending you agree to the{" "}
                  <Link href="/code-of-conduct" className="font-semibold text-accent-text underline underline-offset-4">
                    code of conduct
                  </Link>
                  .
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <NextStep placement={`event-${event.slug}`} rsvpHref={past ? `/chapters/${event.chapter.slug}` : (event.luma_url ?? LINKS.lumaCalendar)} rsvpLabel={past ? `Next ${event.chapter.city} event` : "RSVP on Luma"} />
    </>
  );
}
