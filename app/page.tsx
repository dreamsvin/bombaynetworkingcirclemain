import Link from "next/link";
import type { Metadata } from "next";
import { AUDIENCE, FORMATS, ROOM_STEPS, SITE, STATS } from "@/content/site";
import { PHOTOS, HOME_GRID } from "@/content/photos";
import { FAQ } from "@/content/faq";
import { getChapters, getSponsors, getTestimonials, getUpcomingEvents } from "@/lib/data";
import { pageMeta, orgJsonLd } from "@/lib/seo";
import { Container, Section, SectionHeader, Eyebrow } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { StatBar } from "@/components/ui/stat-bar";
import { Testimonial } from "@/components/ui/testimonial";
import { CityMap } from "@/components/ui/city-map";
import { Accordion } from "@/components/ui/misc";
import { PrimaryCta } from "@/components/site/primary-cta";
import { CityTracker } from "@/components/site/city-tracker";
import { JsonLd } from "@/components/site/json-ld";
import { NextEvents } from "@/components/home/next-events";
import { ArrowRight } from "@/components/ui/icons";

export const revalidate = 600; // ISR; must be a literal (matches REVALIDATE in lib/data.ts)

export const metadata: Metadata = {
  ...pageMeta({
    title: "Founder networking events in Mumbai and 7 more Indian cities",
    ogTitle: "Meet the people building in your city",
    description: `Free, hosted rooms for founders, operators and freelancers. ${STATS.items[0].value} members across ${STATS.items[1].value} cities as of ${STATS.asOf}. Find your city and come to the next event.`,
    path: "/",
  }),
  title: { absolute: "Bombay Networking Circle — founder networking events in Mumbai and 7 more Indian cities" },
};

const PATH = [
  { n: "01", title: "Find your city", body: "Pick your chapter. Eight cities today; if yours isn't one, start it." },
  { n: "02", title: "Come to a room", body: "RSVP to the next event on Luma. Small, hosted, free." },
  { n: "03", title: "Stay in the circle", body: "After your first RSVP, join the WhatsApp community where every event is announced first." },
];

export default async function HomePage() {
  const [chapters, events, testimonials, sponsors] = await Promise.all([
    getChapters(),
    getUpcomingEvents({ limit: 3 }),
    getTestimonials(),
    getSponsors(),
  ]);
  const flagship = chapters.find((c) => c.is_flagship);

  return (
    <>
      <JsonLd data={orgJsonLd()} />

      {/* ───── Hero: what it is, who it's for, where and how often, how to get in ───── */}
      <section aria-labelledby="hero-title" className="pt-10 sm:pt-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>Founder networking · {chapters.length} cities · Free</Eyebrow>
              <h1 id="hero-title" className="mt-4 font-display text-display-xl text-fg">
                Meet the people building in your city.
              </h1>
              <p className="mt-6 max-w-measure text-body-lg text-fg-muted">
                {SITE.name} runs small, hosted rooms for founders, operators and freelancers — in {flagship?.city ?? "Mumbai"} and{" "}
                {chapters.length - 1} more Indian cities. {STATS.items[2].value} events since {SITE.founded}. Free to join.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <PrimaryCta size="lg" placement="hero" />
                <ButtonLink href="/events" variant="ghost">
                  See upcoming events
                </ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-5">
              <p className="text-body-sm text-fg-muted lg:text-right">
                <span className="font-display text-heading-lg text-fg">{STATS.items[0].value}</span> members ·{" "}
                <span className="font-display text-heading-lg text-fg">{STATS.items[1].value}</span> cities
                <span className="block text-caption text-fg-subtle">As of {STATS.asOf}</span>
              </p>
            </div>
          </div>
        </Container>
        <div className="mx-auto mt-10 max-w-[1440px] sm:px-gutter">
          <figure>
            <Photo photo={PHOTOS.hero} priority sizes="(min-width: 1440px) 1360px, 100vw" ratio="wide" className="sm:rounded-lg" />
            <figcaption className="px-gutter pt-3 text-caption text-fg-subtle sm:px-0">A BNC evening in Mumbai. Real members, real room.</figcaption>
          </figure>
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

      {/* ───── Three-step path ───── */}
      <Section tone="raised" labelledBy="path-title">
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
      <Section labelledBy="who-title">
        <Container>
          <SectionHeader id="who-title" eyebrow="Who it's for" title="Is this your room?" lede="If you're building something — or helping someone else build it — yes." />
          <ul className="mt-12 grid gap-6 md:grid-cols-3" data-reveal>
            {AUDIENCE.map((a) => (
              <li key={a.title} className="rounded-lg border border-line bg-bg-card p-6">
                <h3 className="text-heading-md text-fg">{a.title}</h3>
                <p className="mt-3 text-body text-fg-muted">{a.body}</p>
              </li>
            ))}
          </ul>
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
                title="Hosted, small, and built around one specific ask."
                lede="Strangers don't RSVP to the unknown. Here is how an evening runs."
              />
              <Photo photo={PHOTOS.talkGarden} sizes="(min-width: 1024px) 400px, 90vw" ratio="portrait" className="mt-10 hidden rounded-lg lg:block" />
            </div>
            <ol className="lg:col-span-7" data-reveal>
              {ROOM_STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[48px_1fr] gap-4 border-t border-line py-6">
                  <span className="font-display text-heading-lg text-accent-text">{i + 1}</span>
                  <div>
                    <h3 className="text-heading-sm text-fg">{s.title}</h3>
                    <p className="mt-1 text-body text-fg-muted">{s.body}</p>
                  </div>
                </li>
              ))}
              <li className="border-t border-line pt-6">
                <p className="text-body-sm text-fg-subtle">Formats: {Object.values(FORMATS).map((f) => f.label).join(" · ")}.</p>
              </li>
            </ol>
          </div>
        </Container>
      </Section>

      {/* ───── Chapter map ───── */}
      <Section labelledBy="chapters-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <SectionHeader
                id="chapters-title"
                eyebrow="Chapters"
                title={`${chapters.length} cities. Pick yours.`}
                lede="Every chapter has its own page with its next date, its lead and its photos."
              />
              <CityTracker from="home-list">
                <ul className="mt-10 grid grid-cols-2 gap-x-6 border-t border-line">
                  {chapters.map((c) => (
                    <li key={c.slug} className="border-b border-line">
                      <Link href={`/chapters/${c.slug}`} data-city={c.slug} className="group flex min-h-14 items-center justify-between gap-2 py-3 text-body-lg text-fg">
                        <span className="group-hover:underline group-hover:underline-offset-4">
                          {c.city}
                          {c.is_flagship && <span className="ml-2 text-caption text-fg-subtle">Flagship</span>}
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
      <Section tone="raised" labelledBy="events-title">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader id="events-title" eyebrow="What's on" title="The next three rooms." />
            <Link href="/events" className="inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-fg underline underline-offset-4">
              All events <ArrowRight width={16} height={16} />
            </Link>
          </div>
          <div className="mt-10">
            <NextEvents events={events} source="home" />
          </div>
        </Container>
      </Section>

      {/* ───── Photo grid ───── */}
      <Section labelledBy="photos-title">
        <Container>
          <SectionHeader id="photos-title" eyebrow="In the room" title="This is what it looks like." />
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4" data-reveal>
            {HOME_GRID.map((p) => (
              <li key={p.src}>
                <Photo photo={p} sizes="(min-width: 768px) 25vw, 50vw" ratio="square" className="rounded-md" />
              </li>
            ))}
          </ul>
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
                “Most networking events are contact-swapping. We built rooms where the conversation leads somewhere.”
              </h2>
              <p className="mt-6 text-body-lg text-fg-muted">
                I started BNC in Mumbai after years of working with founders across India and watching the same thing happen: good people, wrong rooms. The
                fix was simple — smaller groups, a host who makes introductions, and everyone saying out loud what they need.
              </p>
              <p className="mt-6 text-body-sm font-semibold text-fg">
                {SITE.founder}, founder
                <span className="block font-regular text-fg-subtle">Also National Convenor, JIIF (JITO Apex) · Global Shaper, World Economic Forum</span>
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
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 id="partners-title" className="text-heading-md text-fg">
                {sponsors.length ? "Supported by" : "Put your brand in the room"}
              </h2>
              <p className="mt-1 text-body text-fg-muted">
                {sponsors.length
                  ? "The organisations that make free events possible."
                  : `${STATS.items[0].value} founders, operators and freelancers across ${STATS.items[1].value} cities. Sponsor an event or a city series.`}
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
        </Container>
      </Section>

      {/* ───── FAQ ───── */}
      <Section labelledBy="faq-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader id="faq-title" eyebrow="Questions" title="Before you RSVP." />
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
            <h2 id="final-title" className="font-display text-display-lg text-fg">
              The next room in your city has a seat for you.
            </h2>
            <p className="mt-5 text-body-lg text-fg-muted">Find your chapter, see its next date, RSVP. It takes a minute and costs nothing.</p>
            <div className="mt-8">
              <PrimaryCta size="lg" placement="final" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
