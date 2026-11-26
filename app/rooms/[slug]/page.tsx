import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllEventSlugs, getEvent, getChapter, hasEnded } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { fmtDate, fmtTime } from "@/lib/format";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { FORMATS, LINKS, PRIMARY_CTA, ROOM_STEPS, SITE } from "@/content/site";
import { Container, Section } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { ClosingBand, NumberedRows, priceLabel } from "@/components/ui/bnc";
import { ButtonLink } from "@/components/ui/button";
import { PrimaryCta } from "@/components/site/primary-cta";
import { TrackedLink } from "@/components/site/tracked-link";
import { JsonLd } from "@/components/site/json-ld";

export const revalidate = 600;

export async function generateStaticParams() {
  return (await getAllEventSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/rooms/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEvent(slug);
  if (!e) return {};
  const title = clean(e.title);
  return pageMeta({
    title: `${title} — ${fmtDate(e.starts_at)}`,
    ogTitle: `${title} · ${e.chapter.city}, ${fmtDate(e.starts_at)}`,
    description: e.summary ? clean(e.summary) : `A BNC room in ${e.chapter.city} on ${fmtDate(e.starts_at)}. ${e.capacity ? `${e.capacity} seats. ` : ""}${priceLabel(e.price_inr)}.`,
    path: `/rooms/${e.slug}`,
    noindex: isPlaceholder(e),
  });
}

type AgendaItem = { time: string; item: string };
const isAgenda = (v: unknown): v is AgendaItem[] => Array.isArray(v) && v.every((x) => x && typeof x === "object" && "time" in x && "item" in x);

export default async function RoomPage({ params }: PageProps<"/rooms/[slug]">) {
  const { slug } = await params;
  const room = await getEvent(slug);
  if (!room) notFound();
  const chapter = await getChapter(room.chapter.slug);
  const past = hasEnded(room);
  const title = clean(room.title);
  const agenda = isAgenda(room.agenda) ? room.agenda : null;
  const requestHref = `${PRIMARY_CTA.href}?city=${encodeURIComponent(room.chapter.city)}`;

  const facts: [string, string][] = [
    ["Theme", room.theme ? clean(room.theme) : "To be announced"],
    ["For", room.who_attends ?? "Founders, operators and creators matched to the theme."],
    ["When", `${fmtDate(room.starts_at)} · ${fmtTime(room.starts_at)} IST`],
    ["Where", `${room.venue ? clean(room.venue) : room.chapter.city} — address sent on confirmation`],
    ["Price", priceLabel(room.price_inr)],
    ["Host", chapter?.lead_name ? `${chapter.lead_name}, ${room.chapter.city} lead` : `The ${SITE.short} ${room.chapter.city} team`],
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: title,
          startDate: room.starts_at,
          ...(room.ends_at ? { endDate: room.ends_at } : {}),
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          description: room.summary ? clean(room.summary) : FORMATS[room.format].body,
          ...(room.capacity ? { maximumAttendeeCapacity: room.capacity } : {}),
          location: {
            "@type": "Place",
            name: room.venue ? clean(room.venue) : room.chapter.city,
            address: { "@type": "PostalAddress", addressLocality: room.chapter.city, addressRegion: chapter?.state, addressCountry: "IN" },
          },
          organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
          ...(room.price_inr != null
            ? { isAccessibleForFree: false, offers: { "@type": "Offer", price: String(room.price_inr), priceCurrency: "INR", url: `${SITE.url}/rooms/${room.slug}` } }
            : {}),
        }}
      />

      <header className="border-b-2 border-line-strong">
        <div data-tone="brown" className="border-b-2 border-line-strong">
          <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
            <Link href={`/chapters/${room.chapter.slug}`} className="font-mono text-label uppercase underline-offset-4 hover:underline">
              BNC {room.chapter.city}
            </Link>
            <span className="font-mono text-label uppercase">
              {past ? "Past room" : room.capacity ? `${room.capacity} seats` : "Seats limited"}
            </span>
          </Container>
        </div>
        <Container className="py-10">
          <Breadcrumbs
            items={[
              { label: "Rooms", href: "/rooms" },
              { label: title.length > 40 ? `${title.slice(0, 40)}…` : title, href: `/rooms/${room.slug}` },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {isPlaceholder(room) && <PlaceholderBadge className="mb-3" />}
              <h1 className="font-display text-display-lg text-fg">{title}</h1>
              {room.summary && <p className="mt-5 max-w-measure text-body-lg text-fg-muted">{clean(room.summary)}</p>}
              <dl className="mt-8 border-t-2 border-line-strong">
                {facts.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6rem_1fr] gap-4 border-b-2 border-line-strong py-3">
                    <dt className="font-mono text-label uppercase text-brand-text">{k}</dt>
                    <dd className="text-body text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <aside className="lg:col-span-5" aria-label="Book a seat">
              <div className="border-2 border-line-strong bg-bg-card p-6">
                {past ? (
                  <>
                    <p className="text-heading-sm font-bold text-fg">This room has happened.</p>
                    <p className="mt-2 text-body-sm text-fg-muted">Request access to be matched to the next one in {room.chapter.city}.</p>
                    <ButtonLink href={requestHref} size="lg" className="mt-6 w-full">
                      {PRIMARY_CTA.label}
                    </ButtonLink>
                  </>
                ) : (
                  <>
                    <p className="font-display text-display-md text-fg">{priceLabel(room.price_inr)}</p>
                    <p className="mt-1 text-body-sm text-fg-muted">{room.capacity ? `${room.capacity} seats · ` : ""}Members get first access.</p>
                    <ButtonLink href={requestHref} size="lg" className="mt-6 w-full">
                      {PRIMARY_CTA.label}
                    </ButtonLink>
                    <p className="mt-4 text-center text-body-sm text-fg-muted">
                      Already a member?{" "}
                      <TrackedLink href={room.luma_url ?? LINKS.lumaCalendar} event="rsvp_click" props={{ source: `room-${room.slug}` }} newTab className="font-bold text-accent-text underline underline-offset-4">
                        RSVP<span className="sr-only"> on Luma (opens in a new tab)</span>
                      </TrackedLink>
                    </p>
                  </>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </header>

      <Section labelledBy="format-title">
        <Container>
          <h2 id="format-title" className="font-display text-display-md text-fg">
            Format
          </h2>
          {agenda ? (
            <ol className="mt-8 border-t-2 border-line-strong">
              {agenda.map((a) => (
                <li key={a.time + a.item} className="grid grid-cols-[5rem_1fr] gap-4 border-b-2 border-line-strong py-4">
                  <span className="font-mono text-label text-brand-text">{a.time}</span>
                  <span className="text-body text-fg">{a.item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <NumberedRows items={ROOM_STEPS} className="mt-8" />
          )}
          <p className="mt-8 text-body-sm text-fg-muted">
            By attending you agree to the{" "}
            <Link href="/about#charter" className="font-bold text-accent-text underline underline-offset-4">
              BNC Charter
            </Link>{" "}
            and the{" "}
            <Link href="/code-of-conduct" className="font-bold text-accent-text underline underline-offset-4">
              code of conduct
            </Link>
            .
          </p>
        </Container>
      </Section>

      <ClosingBand title="Want to be in the next one?" body={`Request access and we'll match you to a room in ${room.chapter.city}.`}>
        <PrimaryCta size="lg" city={room.chapter.city} placement={`room-${room.slug}`} />
      </ClosingBand>
    </>
  );
}
