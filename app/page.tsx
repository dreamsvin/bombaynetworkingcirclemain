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
import { CityMap } from "@/components/ui/city-map";
import { Accordion, EmptyState } from "@/components/ui/misc";
import { Chip, ClosingBand, NumberedRows, RoomCard, StatLine } from "@/components/ui/bnc";
import { LogoTile } from "@/components/ui/logo-tile";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { PrimaryCta } from "@/components/site/primary-cta";
import { CityTracker } from "@/components/site/city-tracker";
import { JsonLd } from "@/components/site/json-ld";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { MemberTile } from "@/components/members/member-tile";

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

      {/* ───── 1. Hero (direction 1g, photo-led) ───── */}
      <section aria-labelledby="hero-title" className="border-b-2 border-line-strong">
        <Container className="grid gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Bombay Networking Circle</Eyebrow>
            <h1 id="hero-title" className="mt-4 font-display text-display-xl text-fg">
              {HERO.title}
            </h1>
            <p className="mt-6 max-w-measure text-body-lg text-fg-muted">{HERO.lede}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryCta size="lg" placement="hero" />
              <ButtonLink href={SECONDARY_CTA.href} variant="secondary" size="lg">
                {SECONDARY_CTA.label}
              </ButtonLink>
            </div>
            <StatLine className="mt-8" />
          </div>
          <div className="lg:col-span-5">
            <Photo photo={PHOTOS.roomG} priority quality={60} sizes="(min-width: 1024px) 560px, 100vw" ratio="photo" className="border-2 border-line-strong" />
          </div>
        </Container>
      </section>

      {/* ───── 2. What is BNC ───── */}
      <Section size="sm" labelledBy="what-title">
        <Container>
          <h2 id="what-title" className="sr-only">
            What is BNC
          </h2>
          <dl className="grid border-t-2 border-line-strong sm:grid-cols-2 lg:grid-cols-4">
            {WHAT_IS.map((w) => (
              <div key={w.term} className="border-b-2 border-line-strong py-5 sm:pr-6">
                <dt className="font-mono text-label uppercase text-brand-text">{w.term}</dt>
                <dd className="mt-2 text-heading-sm font-bold text-fg">{w.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* ───── 3. Inside BNC ───── */}
      <Section tone="sand" labelledBy="inside-title">
        <Container>
          <SectionHeader id="inside-title" eyebrow="Inside BNC" title="A network you experience. Not just a community you join." />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <li key={p.title} className="border-t-2 border-line-strong pt-4">
                <h3 className="text-heading-md text-fg">{p.title}</h3>
                <p className="mt-2 text-body text-fg-muted">{p.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/inside" className="mt-10 inline-flex min-h-11 items-center text-body font-bold text-accent-text underline underline-offset-4">
            See what happens in a room →
          </Link>
        </Container>
      </Section>

      {/* ───── 4. How a room is curated ───── */}
      <Section labelledBy="curation-title">
        <Container>
          <SectionHeader id="curation-title" eyebrow="How a room is curated" title="Four decisions behind every room." />
          <NumberedRows items={CURATION} className="mt-10" />
        </Container>
      </Section>

      {/* ───── 5. Ecosystem ───── */}
      <Section tone="sand" labelledBy="eco-title">
        <Container>
          <SectionHeader id="eco-title" eyebrow="The ecosystem" title="Who's in the circle." />
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Industries in the network">
            {INDUSTRIES.filter((i) => i !== "Other").map((i) => (
              <li key={i}>
                <Chip>{i}</Chip>
              </li>
            ))}
          </ul>
          {members.length ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {members.slice(0, 4).map((m) => (
                <li key={m.id}>
                  <MemberTile member={m} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 max-w-measure text-body text-fg-muted">Member profiles are being added with each member&rsquo;s consent.</p>
          )}
          <Link href="/members" className="mt-8 inline-flex min-h-11 items-center text-body font-bold text-accent-text underline underline-offset-4">
            Browse members →
          </Link>
        </Container>
      </Section>

      {/* ───── 6. The Circle in Motion ───── */}
      <Section labelledBy="stories-title">
        <Container>
          <SectionHeader id="stories-title" eyebrow="Stories" title="The Circle in Motion." lede="What happened after the introduction." />
          {stories.length ? (
            <ul className="mt-10 grid gap-6 lg:grid-cols-2">
              {stories.slice(0, 2).map((s) => (
                <li key={s.id} className="relative border-2 border-line-strong bg-bg-card p-6">
                  <div className="flex flex-wrap gap-2">
                    {cityOf(s.chapter_id) && <Chip variant="outline">{cityOf(s.chapter_id)}</Chip>}
                    {isPlaceholder(s) && <PlaceholderBadge />}
                  </div>
                  <h3 className="mt-4 text-heading-md text-fg">
                    <Link href={`/stories/${s.slug}`} className="after:absolute after:inset-0 hover:underline hover:underline-offset-4">
                      {clean(s.headline)}
                    </Link>
                  </h3>
                  <dl className="mt-5 space-y-3 text-body-sm">
                    {[
                      ["The people", s.problem],
                      ["The connection", s.connection],
                      ["What happened next", s.outcome],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-mono text-label uppercase text-brand-text">{k}</dt>
                        <dd className="mt-1 text-fg-muted">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-10" title="Stories are being written" body="We publish a story only when both members have agreed to it. The first ones are on their way." />
          )}
        </Container>
      </Section>

      {/* ───── 7. Charter ───── */}
      <section data-tone="brown" aria-labelledby="charter-title" className="border-b-2 border-line-strong py-section">
        <Container>
          <Eyebrow>The BNC Charter</Eyebrow>
          <h2 id="charter-title" className="mt-3 font-display text-display-lg text-fg">
            How we show up.
          </h2>
          <p className="mt-4 max-w-measure text-body-lg text-fg-muted">The standard is how you take part, not what&rsquo;s on your card.</p>
          <ol className="mt-10 grid border-t-2 border-line-strong sm:grid-cols-2 lg:grid-cols-3">
            {CHARTER.map((c, i) => (
              <li key={c.title} className="border-b-2 border-line-strong py-5 sm:pr-6">
                <span className="font-mono text-label text-brand-text">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-heading-md text-fg">{c.title}</h3>
                <p className="mt-1 text-body-sm text-fg-muted">{c.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ───── 8. Chapters ───── */}
      <Section labelledBy="chapters-title">
        <Container>
          <CityTracker from="home-chapters" className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeader id="chapters-title" eyebrow="Chapters" title={`${chapters.length} cities. One circle.`} />
              <ul className="mt-8 border-t-2 border-line-strong">
                {chapters.map((c) => (
                  <li key={c.id}>
                    <Link href={`/chapters/${c.slug}`} data-city={c.slug} className="flex min-h-14 items-center justify-between border-b-2 border-line-strong text-heading-sm font-bold text-fg hover:underline hover:underline-offset-4">
                      {c.city}
                      <span className="font-mono text-label uppercase text-fg-subtle">{c.is_flagship ? "Flagship" : c.state}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <CityMap chapters={chapters} className="hidden lg:col-span-5 lg:col-start-8 lg:block" />
          </CityTracker>
        </Container>
      </Section>

      {/* ───── 9. Upcoming rooms ───── */}
      <Section tone="sand" labelledBy="rooms-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader id="rooms-title" eyebrow="Upcoming rooms" title="Small, hosted, one theme." />
            <Link href="/rooms" className="inline-flex min-h-11 items-center text-body font-bold text-accent-text underline underline-offset-4">
              All rooms →
            </Link>
          </div>
          {rooms.length ? (
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {rooms.map((r) => (
                <li key={r.id}>
                  <RoomCard room={r} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-10" title="Next dates are being set" body="Request access and we'll invite you to the next room in your city as soon as it's scheduled.">
              <PrimaryCta placement="home-rooms-empty" />
            </EmptyState>
          )}
        </Container>
      </Section>

      {/* ───── 10. Founder note ───── */}
      <Section labelledBy="founder-title">
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <Photo photo={PHOTOS.founder} sizes="(min-width: 768px) 360px, 80vw" ratio="portrait" className="max-w-sm border-2 border-line-strong md:col-span-4" />
            <div className="md:col-span-7 md:col-start-6">
              <Eyebrow>A note from the founder</Eyebrow>
              <h2 id="founder-title" className="mt-3 font-display text-display-md text-fg">
                &ldquo;Good people, wrong rooms. We built the right ones.&rdquo;
              </h2>
              <p className="mt-6 text-body-lg text-fg-muted">
                I started BNC in Mumbai after years of working with founders across India and watching the same thing happen: good people, wrong rooms. The fix
                was simple — smaller rooms with one theme, a host who makes introductions, and everyone saying out loud what they need.
              </p>
              <p className="mt-6 text-body-sm font-bold text-fg">
                Isha Vijay Ostwal, founder
                <span className="block font-regular text-fg-subtle">National Convenor, JIIF (JITO Apex) · Global Shaper, World Economic Forum</span>
              </p>
              <Link href="/about/story" className="mt-6 inline-flex min-h-11 items-center text-body-sm font-bold text-accent-text underline underline-offset-4">
                Read the full story →
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* ───── 11. Partners — confirmed logos only ───── */}
      <Section size="sm" tone="sand" labelledBy="partners-title">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <Eyebrow>Partners</Eyebrow>
              <h2 id="partners-title" className="mt-2 text-heading-lg text-fg">
                {sponsors.length ? "Supported by" : "Put your brand in the room"}
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
              <SectionHeader id="faq-title" eyebrow="FAQ" title="Questions, answered." />
              <Link href="/faq" className="mt-6 inline-flex min-h-11 items-center text-body-sm font-bold text-accent-text underline underline-offset-4">
                All questions →
              </Link>
            </div>
            <Accordion className="lg:col-span-8" items={faq.map((f) => ({ q: f.q, a: f.a }))} />
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
      <ClosingBand title="Explore the circle. Find your people." body={`${SITE.name} is free to join. Request access and we'll match you to a room.`}>
        <PrimaryCta size="lg" placement="home-closing" />
      </ClosingBand>
      <Section size="sm" labelledBy="next-room-title">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <h2 id="next-room-title" className="text-heading-lg text-fg">
              Not ready yet? Get the next room in your city by email.
            </h2>
            <SubscribeForm variant="city" source="home" id="home-next-room" label="Your email" />
          </div>
        </Container>
      </Section>
    </>
  );
}
