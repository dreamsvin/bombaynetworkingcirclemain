import Link from "next/link";
import type { Metadata } from "next";
import { CHARTER, CURATION, HERO, PILLARS, SECONDARY_CTA, SITE, STATS, WHAT_IS, INDUSTRIES } from "@/content/site";
import { PHOTOS } from "@/content/photos";
import { FAQ } from "@/content/faq";
import { getChapters, getFeaturedMembers, getSponsors, getStories, getUpcomingEvents } from "@/lib/data";
import { pageMeta, orgJsonLd } from "@/lib/seo";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { Container, Section, SectionHeader, Eyebrow } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Accordion, EmptyState } from "@/components/ui/misc";
import { Chip, ClosingBand, NumberedRows, RoomCard } from "@/components/ui/bnc";
import { LogoTile } from "@/components/ui/logo-tile";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { PrimaryCta } from "@/components/site/primary-cta";
import { CityTracker } from "@/components/site/city-tracker";
import { JsonLd } from "@/components/site/json-ld";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { MemberTile } from "@/components/members/member-tile";
import { SplitWords } from "@/components/motion/split-words";
import { Marquee } from "@/components/motion/marquee";
import { CountUp } from "@/components/motion/count-up";
import { Seal } from "@/components/site/logo";

export const revalidate = 600; // ISR; must be a literal (matches REVALIDATE in lib/data.ts)

export const metadata: Metadata = {
  ...pageMeta({
    title: "The right rooms change everything",
    ogTitle: "The right rooms change everything. The right people make it happen.",
    description: `${HERO.lede} ${STATS.items[0].value} members across ${STATS.items[1].value} cities as of ${STATS.asOf}. Free to join; rooms are paid.`,
    path: "/",
  }),
  title: { absolute: "Bombay Networking Circle — the right rooms change everything" },
};

const HOME_FAQ = [
  "Is it free?",
  "Who can join?",
  "What happens after I request access?",
  "Do I need a startup?",
  "How are rooms curated?",
  "Is there a WhatsApp group?",
];

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default async function HomePage() {
  const [chapters, rooms, members, stories, sponsors] = await Promise.all([
    getChapters(),
    getUpcomingEvents({ limit: 3 }),
    getFeaturedMembers(),
    getStories(),
    getSponsors(),
  ]);
  const cityOf = (id: string | null) => chapters.find((c) => c.id === id)?.city;
  const faq = HOME_FAQ.flatMap((q) => FAQ.filter((f) => f.q === q));

  return (
    <>
      <JsonLd data={orgJsonLd()} />

      {/* ───── 1. Hero: an issue cover ───── */}
      <section aria-labelledby="hero-title" className="overflow-hidden border-b-2 border-line-strong">
        <Container className="pt-8 sm:pt-10">
          <div data-load className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line-strong pb-4 font-mono text-label uppercase text-fg-muted">
            <span>Bombay Networking Circle</span>
            <span className="hidden sm:inline">Est. {SITE.founded} · Mumbai</span>
            <span>
              {chapters.length} cities · {STATS.items[0].value} members
            </span>
          </div>

          <SplitWords
            as="h1"
            id="hero-title"
            onLoad
            text="The right rooms change *everything.*"
            className="mt-10 font-display text-display-2xl text-fg sm:mt-14"
          />

          <div className="mt-10 grid gap-10 pb-12 lg:grid-cols-12 lg:gap-12 lg:pb-16">
            <div className="lg:col-span-4 lg:pt-4">
              <p data-load style={d(500)} className="font-display text-heading-lg font-regular italic leading-snug text-fg">
                The right people make it happen.
              </p>
              <p data-load style={d(600)} className="mt-5 max-w-measure text-body-lg text-fg-muted">
                {HERO.lede}
              </p>
              <div data-load style={d(700)} className="mt-8 flex flex-wrap items-center gap-3">
                <PrimaryCta size="lg" placement="hero" />
                <ButtonLink href={SECONDARY_CTA.href} variant="secondary" size="lg">
                  {SECONDARY_CTA.label}
                </ButtonLink>
              </div>
              <p data-load style={d(800)} className="mt-6 text-caption text-fg-subtle">
                Free to join. Rooms are paid. Figures as of {STATS.asOf}.
              </p>
            </div>

            <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:col-span-8">
              <Photo
                photo={PHOTOS.roomG}
                priority
                quality={60}
                motion="load"
                delay={250}
                sizes="(min-width: 1024px) 520px, 66vw"
                ratio="tall"
                className="col-span-7 row-span-2"
              />
              <Photo photo={PHOTOS.conversation} motion="load" delay={450} sizes="(min-width: 1024px) 300px, 33vw" ratio="square" className="col-span-5" />
              <div data-load style={d(650)} className="col-span-5 flex flex-col justify-between border-2 border-line-strong p-4 sm:p-5">
                <span aria-hidden="true">
                  <Seal className="h-14 w-14 text-brand sm:h-16 sm:w-16" />
                </span>
                <p className="mt-4 font-display text-heading-lg font-regular leading-tight text-fg">
                  Small rooms. <em className="text-brand-text">Real</em> introductions.
                </p>
              </div>
            </div>
          </div>
        </Container>

        {/* City marquee */}
        <div data-tone="brown" className="border-t-2 border-line-strong py-5">
          <Marquee duration={45}>
            {chapters.map((c) => (
              <Link key={c.id} href={`/chapters/${c.slug}`} className="flex items-center gap-8 pr-8 font-display text-display-md leading-none text-fg hover:italic">
                {c.city}
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand-text" />
              </Link>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ───── 2. What is BNC + counters ───── */}
      <Section labelledBy="what-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader id="what-title" eyebrow="What is BNC" index={1} title="A circle, *not* a crowd." />
            </div>
            <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7">
              {WHAT_IS.map((w, i) => (
                <div key={w.term} data-reveal style={d(i * 100)} className="border-t-2 border-line-strong py-6">
                  <dt className="font-mono text-label uppercase text-brand-text">{w.term}</dt>
                  <dd className="mt-3 font-display text-heading-lg font-regular leading-snug text-fg">{w.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <dl className="mt-16 grid grid-cols-2 border-t-2 border-line-strong lg:grid-cols-4">
            {STATS.items.map((s, i) => (
              <div key={s.label} data-reveal style={d(i * 100)} className="border-b-2 border-line-strong py-8 pr-4 lg:border-b-0 lg:border-r-2 lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                <dd className="font-display text-display-lg leading-none text-fg">
                  <CountUp value={s.value} />
                </dd>
                <dt className="mt-3 text-body-sm text-fg-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-caption text-fg-subtle">
            As of {STATS.asOf}. {STATS.source}
          </p>
        </Container>
      </Section>

      {/* ───── 3. Inside BNC ───── */}
      <Section tone="sand" labelledBy="inside-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:sticky lg:top-28 lg:col-span-5">
              <SectionHeader id="inside-title" eyebrow="Inside BNC" index={2} title="A network you *experience.* Not just a community you join." />
              <Link href="/inside" className="link-draw mt-8 inline-flex min-h-11 items-center gap-2 text-body font-semibold text-accent-text">
                See what happens in a room <span className="nudge">→</span>
              </Link>
              <Photo photo={PHOTOS.gardenTalk} motion="reveal" sizes="(min-width: 1024px) 420px, 90vw" ratio="portrait" className="mt-10 hidden max-w-sm lg:block" />
            </div>
            <ol className="lg:col-span-6 lg:col-start-7">
              {PILLARS.map((p, i) => (
                <li key={p.title} data-reveal style={d(i * 80)} className="group grid grid-cols-[4rem_1fr] gap-4 border-t-2 border-line-strong py-8 last:border-b-2">
                  <span className="font-display text-display-md leading-none text-brand-text transition-transform duration-moderate ease-out group-hover:translate-x-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-display-md leading-none text-fg">{p.title}</h3>
                    <p className="mt-3 max-w-measure text-body text-fg-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {/* ───── 4. How a room is curated ───── */}
      <Section labelledBy="curation-title">
        <Container>
          <SectionHeader id="curation-title" eyebrow="How a room is curated" index={3} title="Four decisions behind *every* room." />
          <NumberedRows items={CURATION} className="mt-14" />
        </Container>
      </Section>

      {/* Photo band with parallax */}
      <div className="grid grid-cols-3 gap-1 border-b-2 border-line-strong sm:gap-2" aria-hidden="true">
        <Photo photo={PHOTOS.panel} motion="parallax" sizes="33vw" className="aspect-[4/5] sm:aspect-[4/3]" />
        <Photo photo={PHOTOS.roomC} motion="parallax" sizes="33vw" className="aspect-[4/5] sm:aspect-[4/3]" />
        <Photo photo={PHOTOS.officeAudience} motion="parallax" sizes="33vw" className="aspect-[4/5] sm:aspect-[4/3]" />
      </div>

      {/* ───── 5. Ecosystem ───── */}
      <Section labelledBy="eco-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader id="eco-title" eyebrow="The ecosystem" index={4} title="Who's in the *circle.*" />
            <Link href="/members" className="link-draw inline-flex min-h-11 items-center gap-2 text-body font-semibold text-accent-text">
              Browse members <span className="nudge">→</span>
            </Link>
          </div>
          <ul data-reveal className="mt-10 flex flex-wrap gap-2" aria-label="Industries in the network">
            {INDUSTRIES.filter((i) => i !== "Other").map((i) => (
              <li key={i}>
                <Chip variant="outline" className="transition-colors duration-base hover:bg-fg hover:text-bg">
                  {i}
                </Chip>
              </li>
            ))}
          </ul>
          {members.length ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {members.slice(0, 4).map((m, i) => (
                <li key={m.id} data-reveal style={d(i * 90)}>
                  <MemberTile member={m} />
                </li>
              ))}
            </ul>
          ) : (
            <p data-reveal className="mt-10 max-w-measure text-body text-fg-muted">
              Member profiles are being added with each member&rsquo;s consent.
            </p>
          )}
        </Container>
      </Section>

      {/* ───── 6. The Circle in Motion ───── */}
      <Section tone="sand" labelledBy="stories-title">
        <Container>
          <SectionHeader id="stories-title" eyebrow="Stories" index={5} title="The Circle in *Motion.*" lede="What happened after the introduction." />
          {stories.length ? (
            <ul className="mt-14 grid gap-px bg-line-strong lg:grid-cols-2">
              {stories.slice(0, 2).map((s, i) => (
                <li key={s.id} data-reveal style={d(i * 120)} className="group relative bg-bg p-8 sm:p-10">
                  <div className="flex flex-wrap gap-2">
                    {cityOf(s.chapter_id) && <Chip variant="outline">{cityOf(s.chapter_id)}</Chip>}
                    {isPlaceholder(s) && <PlaceholderBadge />}
                  </div>
                  <h3 className="mt-6 font-display text-display-md leading-tight text-fg">
                    <Link href={`/stories/${s.slug}`} className="after:absolute after:inset-0">
                      {clean(s.headline)}
                    </Link>
                  </h3>
                  <dl className="mt-8 grid gap-5 text-body-sm sm:grid-cols-3">
                    {[
                      ["The people", s.problem],
                      ["The connection", s.connection],
                      ["What happened next", s.outcome],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-mono text-label uppercase text-brand-text">{k}</dt>
                        <dd className="mt-2 text-fg-muted">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="mt-8 inline-flex items-center gap-2 text-body-sm font-semibold text-accent-text">
                    Read the story <span className="nudge">→</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-14" title="Stories are being written" body="We publish a story only when both members have agreed to it. The first ones are on their way." />
          )}
        </Container>
      </Section>

      {/* ───── 7. Charter ───── */}
      <section data-tone="brown" aria-labelledby="charter-title" className="border-b-2 border-line-strong py-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
              <Eyebrow index={6}>The BNC Charter</Eyebrow>
              <SplitWords id="charter-title" text="How we *show up.*" className="mt-5 font-display text-display-xl text-fg" />
              <p data-reveal className="mt-6 max-w-measure text-body-lg text-fg-muted">
                The standard is how you take part, not what&rsquo;s on your card.
              </p>
            </div>
            <ol className="lg:col-span-7 lg:col-start-6">
              {CHARTER.map((c, i) => (
                <li key={c.title} data-reveal style={d(i * 70)} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t-2 border-line-strong py-8 last:border-b-2">
                  <span className="font-mono text-label text-brand-text">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-display-md leading-none text-fg">{c.title}</h3>
                    <p className="mt-3 max-w-measure text-body text-fg-muted">{c.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ───── 8. Chapters: an index of cities ───── */}
      <Section labelledBy="chapters-title">
        <Container>
          <SectionHeader id="chapters-title" eyebrow="Chapters" index={7} title={`${chapters.length} cities. *One* circle.`} />
          <CityTracker from="home-chapters">
            <ul className="mt-12 border-t-2 border-line-strong">
              {chapters.map((c, i) => (
                <li key={c.id} data-reveal style={d(i * 50)}>
                  <Link
                    href={`/chapters/${c.slug}`}
                    data-city={c.slug}
                    className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b-2 border-line-strong py-5 transition-colors duration-base hover:bg-bg-raised sm:grid-cols-[4rem_1fr_12rem_auto] sm:px-2"
                  >
                    <span className="font-mono text-label text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-display-md leading-none text-fg transition-transform duration-moderate ease-out group-hover:translate-x-2 group-hover:italic">
                      {c.city}
                    </span>
                    <span className="hidden font-mono text-label uppercase text-fg-muted sm:block">{c.is_flagship ? "Flagship" : c.state}</span>
                    <span className="nudge text-heading-md text-accent-text" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CityTracker>
        </Container>
      </Section>

      {/* ───── 9. Upcoming rooms ───── */}
      <Section tone="sand" labelledBy="rooms-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader id="rooms-title" eyebrow="Upcoming rooms" index={8} title="Small, hosted, *one* theme." />
            <Link href="/rooms" className="link-draw inline-flex min-h-11 items-center gap-2 text-body font-semibold text-accent-text">
              All rooms <span className="nudge">→</span>
            </Link>
          </div>
          {rooms.length ? (
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {rooms.map((r, i) => (
                <li key={r.id} data-reveal style={d(i * 110)}>
                  <RoomCard room={r} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-12" title="Next dates are being set" body="Request access and we'll invite you to the next room in your city as soon as it's scheduled.">
              <PrimaryCta placement="home-rooms-empty" />
            </EmptyState>
          )}
        </Container>
      </Section>

      {/* ───── 10. Founder note ───── */}
      <Section labelledBy="founder-title">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:items-center">
            <Photo photo={PHOTOS.founder} motion="reveal" sizes="(min-width: 768px) 420px, 90vw" ratio="portrait" className="md:col-span-5" />
            <figure className="md:col-span-7">
              <Eyebrow index={9}>A note from the founder</Eyebrow>
              <blockquote className="mt-6">
                <SplitWords
                  id="founder-title"
                  text="“Good people, wrong rooms. *We built the right ones.*”"
                  className="font-display text-display-lg text-fg"
                />
              </blockquote>
              <p data-reveal className="mt-8 max-w-measure text-body-lg text-fg-muted">
                I started BNC in Mumbai after years of working with founders across India and watching the same thing happen: good people, wrong rooms. The fix
                was simple — smaller rooms with one theme, a host who makes introductions, and everyone saying out loud what they need.
              </p>
              <figcaption data-reveal className="mt-8 border-t-2 border-line-strong pt-5 text-body-sm">
                <span className="block font-semibold text-fg">Isha Vijay Ostwal, founder</span>
                <span className="block text-fg-subtle">National Convenor, JIIF (JITO Apex) · Global Shaper, World Economic Forum</span>
              </figcaption>
              <Link href="/about/story" className="link-draw mt-6 inline-flex min-h-11 items-center gap-2 text-body-sm font-semibold text-accent-text">
                Read the full story <span className="nudge">→</span>
              </Link>
            </figure>
          </div>
        </Container>
      </Section>

      {/* ───── 11. Partners — confirmed logos only ───── */}
      <Section size="sm" tone="sand" labelledBy="partners-title">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <Eyebrow index={10}>Partners</Eyebrow>
              <h2 id="partners-title" className="mt-4 font-display text-display-md text-fg">
                {sponsors.length ? "Supported by" : (
                  <>
                    Put your brand <em className="text-brand-text">in the room.</em>
                  </>
                )}
              </h2>
            </div>
            <ButtonLink href="/sponsor" variant="secondary">
              Sponsor BNC
            </ButtonLink>
          </div>
          {sponsors.length > 0 && (
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {sponsors.map((s) => (
                <li key={s.id}>
                  <LogoTile name={s.name} logo={s.logo} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      {/* ───── 12. FAQ ───── */}
      <Section labelledBy="faq-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader id="faq-title" eyebrow="FAQ" index={11} title="Questions, *answered.*" />
              <Link href="/faq" className="link-draw mt-8 inline-flex min-h-11 items-center gap-2 text-body-sm font-semibold text-accent-text">
                All questions <span className="nudge">→</span>
              </Link>
            </div>
            <Accordion className="lg:col-span-7 lg:col-start-6" items={faq.map((f) => ({ q: f.q, a: f.a }))} />
          </div>
        </Container>
      </Section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      {/* ───── 13. Closing CTA ───── */}
      <ClosingBand title="Explore the circle. *Find your people.*" body={`${SITE.name} is free to join. Request access and we'll match you to a room.`}>
        <PrimaryCta size="lg" placement="home-closing" />
      </ClosingBand>
      <Section size="sm" labelledBy="next-room-title">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <h2 id="next-room-title" className="font-display text-display-md text-fg">
              Not ready yet? <em className="text-brand-text">Get the next room</em> in your city by email.
            </h2>
            <SubscribeForm variant="city" source="home" id="home-next-room" label="Your email" />
          </div>
        </Container>
      </Section>
    </>
  );
}
