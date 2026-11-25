import Link from "next/link";
import type { Metadata } from "next";
import { AUDIENCE, FORMATS, NOT_FOR, PILLARS, ROOM_STEPS, SITE, STATS, type FormatKey } from "@/content/site";
import { PHOTOS } from "@/content/photos";
import { MEDIA, VIDEOS } from "@/content/media";
import { FAQ } from "@/content/faq";
import { getChapters, getPastEvents, getSpeakers, getSponsors, getTestimonials, getUpcomingEvents, getAllEvents } from "@/lib/data";
import { pageMeta, orgJsonLd } from "@/lib/seo";
import { Container, Section, SectionHeader, Eyebrow } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { StatBar } from "@/components/ui/stat-bar";
import { Testimonial } from "@/components/ui/testimonial";
import { CityMap } from "@/components/ui/city-map";
import { Accordion } from "@/components/ui/misc";
import { LogoTile } from "@/components/ui/logo-tile";
import { PrimaryCta } from "@/components/site/primary-cta";
import { CityTracker } from "@/components/site/city-tracker";
import { JsonLd } from "@/components/site/json-ld";
import { NextEvents } from "@/components/home/next-events";
import { EventCard } from "@/components/events/event-card";
import { VideoLoop } from "@/components/media/video-loop";
import { ArrowRight } from "@/components/ui/icons";

export const revalidate = 600; // ISR; must be a literal (matches REVALIDATE in lib/data.ts)

export const metadata: Metadata = {
  ...pageMeta({
    title: "Curated founder rooms in Mumbai, Pune, Delhi NCR and 5 more Indian cities",
    ogTitle: "Meet the people building in your city",
    description: `Small, hosted rooms for founders, operators and creators: ${STATS.items[0].value} members and ${STATS.items[2].value} rooms across ${STATS.items[1].value} cities since ${SITE.firstRoom}. Find your city and come to the next room.`,
    path: "/",
  }),
  title: { absolute: `Bombay Networking Circle — ${SITE.tagline.toLowerCase()}` },
};

const PATH = [
  { n: "01", title: "Find your city", body: "Pick your chapter. Eight cities so far; if yours isn't one, start it." },
  { n: "02", title: "Get into a room", body: "Register for the next room on Luma. Rooms are small and hosted; most carry a ₹399–₹999 ticket for the venue and coffee." },
  { n: "03", title: "Stay in the circle", body: "Join the WhatsApp community and the weekly Power Hour, where the next rooms are announced first." },
];

export default async function HomePage() {
  const [chapters, upcoming, recent, testimonials, sponsors, speakers, all] = await Promise.all([
    getChapters(),
    getUpcomingEvents({ limit: 3 }),
    getPastEvents({ limit: 6 }),
    getTestimonials(),
    getSponsors(),
    getSpeakers(),
    getAllEvents(),
  ]);
  const partners = sponsors.filter((s) => s.is_partner);
  const formatCounts = all.reduce<Record<string, number>>((acc, e) => ((acc[e.format] = (acc[e.format] ?? 0) + 1), acc), {});
  const formats = (Object.keys(FORMATS) as FormatKey[]).filter((k) => formatCounts[k]).sort((a, b) => (formatCounts[b] ?? 0) - (formatCounts[a] ?? 0));
  const guests = speakers.filter((s) => s.name !== SITE.founder);

  return (
    <>
      <JsonLd data={orgJsonLd()} />

      {/* ───── Hero: what it is, who it's for, where and how often, how to get in ───── */}
      <section aria-labelledby="hero-title" className="pt-10 sm:pt-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Curated rooms · {chapters.length} cities · Since {SITE.firstRoom}</Eyebrow>
              <h1 id="hero-title" className="mt-4 font-display text-display-xl text-fg">
                Meet the people building in your city.
              </h1>
              <p className="mt-6 max-w-measure text-body-lg text-fg-muted">
                {SITE.name} curates small, hosted rooms for founders, operators and creators — {STATS.items[2].value} so far across{" "}
                {STATS.items[1].value} cities, from café meetups in Pune and Nashik to an invite-only real estate room in Lower Parel.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <PrimaryCta size="lg" placement="hero" />
                <ButtonLink href="/events#past" variant="ghost">
                  See the rooms so far
                </ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-5">
              <p className="font-display text-heading-lg italic text-fg lg:text-right">&ldquo;{SITE.tagline}.&rdquo;</p>
              <span className="gold-rule mt-4 lg:ml-auto" aria-hidden="true" />
              <p className="mt-4 text-body-sm text-fg-muted lg:text-right">
                <span className="font-display text-heading-lg text-fg">{STATS.items[0].value}</span> members across 10 cities
                <span className="block text-caption text-fg-subtle">As of {STATS.asOf}</span>
              </p>
            </div>
          </div>
        </Container>
        <div className="mx-auto mt-10 max-w-[1440px] sm:px-gutter">
          <VideoLoop video={VIDEOS.room} priority className="sm:rounded-lg" />
          <p className="px-gutter pt-3 text-caption text-fg-subtle sm:px-0">{VIDEOS.room.label} Real members, real room.</p>
        </div>
      </section>

      {/* ───── Stats ───── */}
      <Section size="sm" labelledBy="stats-title">
        <Container>
          <h2 id="stats-title" className="sr-only">
            BNC in numbers
          </h2>
          <StatBar />
        </Container>
      </Section>

      {/* ───── Recent rooms (from Luma) ───── */}
      <Section tone="raised" labelledBy="recent-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              id="recent-title"
              eyebrow="The track record"
              title="Not a networking event. A room with a track record."
              lede="The latest rooms, straight from our Luma calendar. Every one has its own page with the speakers, the format and the photos."
            />
            <Link href="/events#past" className="inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-fg underline underline-offset-4">
              All {all.length} rooms <ArrowRight width={16} height={16} />
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {recent.map((e) => (
              <li key={e.id}>
                <EventCard event={e} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ───── Three-step path ───── */}
      <Section labelledBy="path-title">
        <Container>
          <SectionHeader id="path-title" eyebrow="How it works" title="Three steps from stranger to member." />
          <ol className="mt-12 grid gap-8 md:grid-cols-3" data-reveal>
            {PATH.map((s) => (
              <li key={s.n} className="border-t-2 border-fg pt-6">
                <span className="font-display text-heading-md text-fg-subtle">{s.n}</span>
                <h3 className="mt-2 text-heading-md text-fg">{s.title}</h3>
                <p className="mt-2 text-body text-fg-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <PrimaryCta placement="path" />
          </div>
        </Container>
      </Section>

      {/* ───── Who it's for ───── */}
      <Section tone="raised" labelledBy="who-title">
        <Container>
          <SectionHeader
            id="who-title"
            eyebrow="Who it's for"
            title="Is this your room?"
            lede="The common thread isn't a job title. It's ambition — and a habit of giving before asking."
          />
          <ul className="mt-12 grid gap-6 md:grid-cols-3" data-reveal>
            {AUDIENCE.map((a) => (
              <li key={a.title} className="rounded-lg border border-line bg-bg-card p-6">
                <h3 className="text-heading-md text-fg">{a.title}</h3>
                <p className="mt-3 text-body text-fg-muted">{a.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-lg border border-line p-6">
            <h3 className="text-heading-sm text-fg">Probably not your room if you are…</h3>
            <ul className="mt-3 grid gap-x-8 gap-y-2 text-body text-fg-muted sm:grid-cols-2">
              {NOT_FOR.map((n) => (
                <li key={n}>— {n.charAt(0).toLowerCase() + n.slice(1)}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ───── What happens in a room ───── */}
      <Section tone="ink" labelledBy="room-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader
                id="room-title"
                eyebrow="What happens in a room"
                title="Two hours, built so you leave with something."
                lede="The run-of-show of a BNC city meetup, as published for the Ahmedabad edition."
              />
              <Photo photo={MEDIA.delhi_host} sizes="(min-width: 1024px) 400px, 90vw" ratio="portrait" className="mt-10 hidden rounded-lg lg:block" />
            </div>
            <ol className="lg:col-span-7" data-reveal>
              {ROOM_STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[48px_1fr] gap-4 border-t border-line py-6">
                  <span className="font-display text-heading-lg text-accent-text">{i + 1}</span>
                  <div>
                    <h3 className="text-heading-sm text-fg">
                      {s.title} <span className="ml-2 text-caption font-regular text-fg-subtle">{s.time}</span>
                    </h3>
                    <p className="mt-1 text-body text-fg-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* ───── Formats (counted from the archive) ───── */}
      <Section labelledBy="formats-title">
        <Container>
          <SectionHeader
            id="formats-title"
            eyebrow="More than meetups"
            title={`${formats.length} kinds of room, and counting.`}
            lede="City meetups are the core. Around them, BNC has tried formats that make ambitious people meet differently — and kept the ones that worked."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
            {formats.map((k) => (
              <li key={k} className="flex flex-col rounded-lg border border-line bg-bg-card p-6">
                <span className="font-display text-display-md text-fg">{formatCounts[k]}</span>
                <span className="text-caption text-fg-subtle">{formatCounts[k] === 1 ? "room" : "rooms"} so far</span>
                <h3 className="mt-4 text-heading-sm text-fg">{FORMATS[k].label}</h3>
                <p className="mt-2 text-body-sm text-fg-muted">{FORMATS[k].body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ───── Chapter map ───── */}
      <Section tone="raised" labelledBy="chapters-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <SectionHeader
                id="chapters-title"
                eyebrow="Chapters"
                title={`${chapters.length} cities. Pick yours.`}
                lede="Every chapter has its own page with its rooms so far, its photos and its next date."
              />
              <CityTracker from="home-list">
                <ul className="mt-10 grid grid-cols-2 gap-x-6 border-t border-line">
                  {chapters.map((c) => (
                    <li key={c.slug} className="border-b border-line">
                      <Link href={`/chapters/${c.slug}`} data-city={c.slug} className="group flex min-h-14 items-center justify-between gap-2 py-3 text-body-lg text-fg">
                        <span className="group-hover:underline group-hover:underline-offset-4">
                          {c.city}
                          {c.is_flagship && <span className="ml-2 text-caption text-fg-subtle">Home</span>}
                        </span>
                        <ArrowRight width={16} height={16} className="text-fg-subtle" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CityTracker>
              <p className="mt-6 text-body-sm text-fg-muted">
                Not listed?{" "}
                <Link href="/chapters/start" className="font-semibold text-accent-text underline underline-offset-4">
                  Start a chapter in your city
                </Link>
                .
              </p>
            </div>
            <CityTracker from="home-map" className="mx-auto w-full max-w-sm lg:col-span-6 lg:max-w-md">
              <CityMap chapters={chapters} />
            </CityTracker>
          </div>
        </Container>
      </Section>

      {/* ───── Next events ───── */}
      <Section labelledBy="events-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader id="events-title" eyebrow="What's on" title="The next rooms." />
            <Link href="/events" className="inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-fg underline underline-offset-4">
              All events <ArrowRight width={16} height={16} />
            </Link>
          </div>
          <div className="mt-10">
            <NextEvents events={upcoming} source="home" />
          </div>
        </Container>
      </Section>

      {/* ───── Photos + reel ───── */}
      <Section tone="raised" labelledBy="photos-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader id="photos-title" eyebrow="In the room" title="This is what it looks like." lede="Real members, real rooms — Gurugram, Pune and Nashik." />
            <Link href="/gallery" className="inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-fg underline underline-offset-4">
              Full gallery <ArrowRight width={16} height={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-4" data-reveal>
            <VideoLoop video={VIDEOS.reel} ratio="reel" className="rounded-md md:row-span-2" />
            <Photo photo={MEDIA.delhi_group} sizes="(min-width: 768px) 25vw, 100vw" ratio="square" className="rounded-md" />
            <Photo photo={MEDIA.pune_group} sizes="(min-width: 768px) 25vw, 100vw" ratio="square" className="rounded-md" />
            <Photo photo={MEDIA.nashik_room} sizes="(min-width: 768px) 25vw, 100vw" ratio="square" className="rounded-md" />
            <Photo photo={MEDIA.delhi_panel} sizes="(min-width: 768px) 25vw, 100vw" ratio="square" className="rounded-md" />
            <Photo photo={MEDIA.pune_circle} sizes="(min-width: 768px) 25vw, 100vw" ratio="square" className="rounded-md" />
            <Photo photo={MEDIA.delhi_circle} sizes="(min-width: 768px) 25vw, 100vw" ratio="square" className="rounded-md" />
          </div>
        </Container>
      </Section>

      {/* ───── Voices: who has led a room ───── */}
      {guests.length > 0 && (
        <Section labelledBy="voices-title">
          <Container>
            <SectionHeader
              id="voices-title"
              eyebrow="Who has led a room"
              title="Practitioners, not hype men."
              lede="Speakers and co-hosts named on BNC's public event pages."
            />
            <ul className="mt-10 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {guests.map((p) => (
                <li key={p.name}>
                  <p className="text-heading-sm text-fg">{p.name}</p>
                  <p className="text-body-sm text-fg-muted">{p.role}</p>
                  <Link href={`/events/${p.events[0].slug}`} className="mt-1 inline-block text-caption text-fg-subtle underline underline-offset-4">
                    {p.events[0].title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* ───── Pillars ───── */}
      <Section tone="ink" labelledBy="pillars-title">
        <Container>
          <SectionHeader id="pillars-title" eyebrow="What we're building" title="Not an events company. A growth ecosystem for builders." />
          <ol className="mt-12 grid gap-8 md:grid-cols-3" data-reveal>
            {PILLARS.map((p, i) => (
              <li key={p.title} className="border-t border-line pt-6">
                <span className="font-display text-heading-lg text-accent-text">0{i + 1}</span>
                <h3 className="mt-2 font-display text-heading-lg text-fg">{p.title}</h3>
                <p className="mt-2 text-body text-fg-muted">{p.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ───── Proof strip: only consented quotes (placeholders in preview) ───── */}
      {testimonials.length > 0 && (
        <Section tone="raised" labelledBy="proof-title">
          <Container>
            <SectionHeader id="proof-title" eyebrow="From members" title="In their words." />
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <li key={t.id}>
                  <Testimonial t={t} />
                </li>
              ))}
            </ul>
            <p className="mt-6 text-caption text-fg-subtle">Quotes are published only with the member&apos;s written consent.</p>
          </Container>
        </Section>
      )}

      {/* ───── Founder note ───── */}
      <Section labelledBy="founder-title">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <Photo photo={PHOTOS.founder} sizes="(min-width: 768px) 360px, 80vw" ratio="portrait" className="max-w-sm rounded-lg md:col-span-4" />
            <div className="md:col-span-7 md:col-start-6">
              <Eyebrow>A note from the founder</Eyebrow>
              <h2 id="founder-title" className="mt-3 font-display text-display-md text-fg">
                “Growth is engineered. Networks compound. Execution decides outcomes.”
              </h2>
              <p className="mt-6 text-body-lg text-fg-muted">
                I started BNC after years of working with founders across India and watching the same thing happen: good people, wrong rooms. So we
                built the opposite — small, curated rooms with a host whose job is introductions, and everyone saying out loud what they&apos;re
                building and what they need.
              </p>
              <p className="mt-6 text-body-sm font-semibold text-fg">
                {SITE.founder}, founder
                <span className="block font-regular text-fg-subtle">Founder & CEO, DreamSVin · National Co-Convenor, JITO JIIF · Global Shaper, World Economic Forum</span>
              </p>
              <Link href="/about/story" className="mt-6 inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-accent-text underline underline-offset-4">
                Read the full story <ArrowRight width={16} height={16} />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* ───── Partners ───── */}
      <Section size="sm" tone="raised" labelledBy="partners-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 id="partners-title" className="text-heading-md text-fg">
                {partners.length ? "Rooms made with" : "Put your brand in the room"}
              </h2>
              <p className="mt-1 text-body text-fg-muted">
                {partners.length
                  ? "Venues and collaborators named on our event pages."
                  : `${STATS.items[0].value} founders, operators and creators across ${STATS.items[1].value} cities. Sponsor a room or a city series.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="/sponsor" variant="secondary">
                Sponsor BNC
              </ButtonLink>
              <ButtonLink href="/partners" variant="ghost">
                Partner with us
              </ButtonLink>
            </div>
          </div>
          {partners.length > 0 && (
            <ul className="mt-10 flex flex-wrap items-center gap-3">
              {partners.map((p) => (
                <li key={p.id}>
                  <LogoTile name={p.name} logo={p.logo} compact />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {/* ───── FAQ ───── */}
      <Section labelledBy="faq-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader id="faq-title" eyebrow="Questions" title="Before you register." />
              <Link href="/faq" className="mt-6 inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-fg underline underline-offset-4">
                All questions <ArrowRight width={16} height={16} />
              </Link>
            </div>
            <Accordion className="lg:col-span-8" items={FAQ.filter((f) => f.group !== "partners").slice(0, 6).map((f) => ({ q: f.q, a: f.a }))} />
          </div>
        </Container>
      </Section>

      {/* ───── Final CTA ───── */}
      <Section tone="ink" labelledBy="final-title">
        <Container>
          <div className="max-w-measure">
            <span className="gold-rule" aria-hidden="true" />
            <h2 id="final-title" className="mt-6 font-display text-display-lg text-fg">
              The next room in your city has a seat for you.
            </h2>
            <p className="mt-5 text-body-lg text-fg-muted">Find your chapter, see what it has run, and get on the list for the next date.</p>
            <div className="mt-8">
              <PrimaryCta size="lg" placement="final" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
