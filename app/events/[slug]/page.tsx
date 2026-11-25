import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEventSlugs, getEvent, getChapter, hasEnded, eventGallery, eventPartners, eventSpeakers } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { fmtDate, fmtPrice, fmtTime } from "@/lib/format";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { FORMATS, LINKS, ROOM_STEPS, SITE } from "@/content/site";
import { Container, Section, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs, Tag } from "@/components/ui/misc";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { EventFeature } from "@/components/events/event-feature";
import { NextStep } from "@/components/events/next-step";
import { JsonLd } from "@/components/site/json-ld";
import { EventCover } from "@/components/events/event-cover";
import { Photo } from "@/components/ui/photo";
import { TrackedLink } from "@/components/site/tracked-link";
import { ArrowUpRight } from "@/components/ui/icons";
import { MEDIA } from "@/content/media";

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
    description: e.summary ? clean(e.summary) : `${FORMATS[e.format].label} in ${e.chapter.city} on ${fmtDate(e.starts_at)}. A Bombay Networking Circle room — details and registration on Luma.`,
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
  const speakers = eventSpeakers(event);
  const partners = eventPartners(event);
  const photos = eventGallery(event);
  const price = fmtPrice(event.price_inr);
  const absolute = (src: string) => (src.startsWith("http") ? src : `${SITE.url}${src}`);
  const image = event.cover_image ?? event.poster ?? photos[0]?.src ?? null;
  const poster = event.poster ? (Object.values(MEDIA).find((m) => m.src === event.poster) ?? { src: event.poster, width: 900, height: 1125, alt: `Poster for ${title}` }) : null;

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
          eventAttendanceMode: event.is_online ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
          description: event.summary ? clean(event.summary) : FORMATS[event.format].body,
          location: event.is_online ? { "@type": "VirtualLocation", url: event.luma_url ?? LINKS.lumaCalendar } : {
            "@type": "Place",
            name: event.venue ? clean(event.venue) : event.chapter.city,
            address: { "@type": "PostalAddress", streetAddress: event.venue_address ?? undefined, addressLocality: event.chapter.city, addressRegion: chapter?.state, addressCountry: "IN" },
          },
          organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
          ...(image ? { image: [absolute(image)] } : {}),
          ...(speakers.length ? { performer: speakers.map((p) => ({ "@type": "Person", name: p.name })) } : {}),
          ...(event.price_inr !== null
            ? { offers: { "@type": "Offer", price: String(event.price_inr), priceCurrency: "INR", availability: past ? "https://schema.org/SoldOut" : "https://schema.org/InStock", url: event.luma_url ?? LINKS.lumaCalendar } }
            : {}),
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
                {fmtDate(event.starts_at)} · {fmtTime(event.starts_at)} IST · {event.is_online ? "Online" : event.chapter.city}
              </p>
              {event.summary && <p className="mt-6 max-w-measure text-body-lg text-fg-muted">{clean(event.summary)}</p>}
            </div>
            <div className="lg:col-span-5">
              {past ? (
                <div className="overflow-hidden rounded-lg border border-line bg-bg-card">
                  <EventCover event={event} prefer="artwork" priority sizes="(min-width: 1024px) 420px, 92vw" />
                  <div className="p-6">
                  <p className="text-body text-fg">
                    This room happened{event.registrations ? ` — ${event.registrations} people registered on Luma` : ""}.
                  </p>
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
                  {event.luma_url && (
                    <TrackedLink href={event.luma_url} event="rsvp_click" props={{ source: `event-${event.slug}`, via: "luma-past" }} newTab className="mt-4 inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-accent-text underline underline-offset-4">
                      The original Luma page <ArrowUpRight width={16} height={16} />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </TrackedLink>
                  )}
                  </div>
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
              <SectionHeader id="details-title" title={past ? "How the room ran" : "What to expect"} />
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
              ) : event.format === "founder_networking" ? (
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
              ) : null}
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
                <h2 className="mt-6 text-heading-sm text-fg">Ticket</h2>
                <p className="mt-2 text-body text-fg-muted">
                  {price === null
                    ? "Shown on the Luma page when you register."
                    : price === "No ticket"
                      ? event.format === "industry_room"
                        ? "No ticket — invite only. Request your invite on Luma."
                        : "No ticket. Register on Luma."
                      : `${price} per person, paid by UPI after you register on Luma.`}
                </p>
                {partners.length > 0 && (
                  <>
                    <h2 className="mt-6 text-heading-sm text-fg">With</h2>
                    <ul className="mt-2 text-body text-fg-muted">
                      {partners.map((p) => (
                        <li key={p.name}>
                          <span className="font-semibold text-fg">{p.name}</span> · {p.role}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
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

      {speakers.length > 0 && (
        <Section tone="raised" labelledBy="speakers-title">
          <Container>
            <SectionHeader id="speakers-title" title={past ? "Who led the room" : "Who's leading the room"} />
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {speakers.map((p) => (
                <li key={p.name} className="border-t-2 border-gold pt-4">
                  <p className="text-heading-sm text-fg">{p.name}</p>
                  <p className="mt-1 text-body-sm text-fg-muted">{p.role}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {(photos.length > 0 || poster) && (
        <Section labelledBy="photos-title">
          <Container>
            <SectionHeader id="photos-title" title={photos.length ? "From the room" : "The poster"} />
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {photos.map((p, i) => (
                <li key={p.src} className={i === 0 ? "col-span-2" : undefined}>
                  <Photo photo={p} sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"} ratio={i === 0 ? "photo" : "square"} className="rounded-md" />
                </li>
              ))}
              {poster && (
                <li className="max-w-sm">
                  <Photo photo={poster} sizes="(min-width: 768px) 33vw, 50vw" className="rounded-md" />
                </li>
              )}
            </ul>
          </Container>
        </Section>
      )}

      <NextStep placement={`event-${event.slug}`} rsvpHref={past ? `/chapters/${event.chapter.slug}` : (event.luma_url ?? LINKS.lumaCalendar)} rsvpLabel={past ? `Next ${event.chapter.city} event` : "RSVP on Luma"} />
    </>
  );
}
