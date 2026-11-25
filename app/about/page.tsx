import type { Metadata } from "next";
import Link from "next/link";
import { FORMATS, JOURNEY, MISSION, NOT_LIST, SITE, STATS, VALUES, type FormatKey } from "@/content/site";
import { PHOTOS } from "@/content/photos";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { Photo } from "@/components/ui/photo";
import { StatBar } from "@/components/ui/stat-bar";
import { PrimaryCta } from "@/components/site/primary-cta";
import { ArrowRight } from "@/components/ui/icons";

export const metadata: Metadata = pageMeta({
  title: "About Bombay Networking Circle",
  ogTitle: "Why Bombay Networking Circle exists",
  description: `BNC is a curated, community-led network of hosted founder rooms, started in Mumbai in ${SITE.founded} by ${SITE.founder}. Mission: connect ${MISSION.builders} builders and catalyse ${MISSION.collaborations} collaborations.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "About", href: "/about" }]} />}
        eyebrow="About"
        title="An institution that happens to run events."
        lede={`Bombay Networking Circle has run ${STATS.items[2].value} rooms in ${STATS.items[1].value} cities since ${SITE.firstRoom}, and counts ${STATS.items[0].value} members (as of ${STATS.asOf}). It runs on one idea: the right room beats a bigger one.`}
      />

      <Section labelledBy="origin-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeader id="origin-title" eyebrow="Origin" title="Why I started it" />
              <div className="prose-bnc mt-8">
                <p>
                  I spent years in business development, much of it with JITO, working alongside founders across India. Every month I met people who
                  should have known each other and didn&apos;t — because the events meant to connect them were built for volume. Big halls, business
                  cards, pitches nobody asked for.
                </p>
                <p>
                  So I tried the opposite in Mumbai: a small room, a host, and one rule — say out loud what you need. People left with a co-founder
                  conversation, a client, a hire. They came back and brought others. Other cities asked for the same thing.
                </p>
                <p>
                  That&apos;s BNC. Joining is free, it&apos;s community-led, and it measures itself by what happens after the room — relationships,
                  collaborations, opportunities — not by how full it was.
                </p>
              </div>
              <p className="mt-6 text-body-sm font-semibold text-fg">— {SITE.founder}, founder</p>
              <Link href="/about/story" className="mt-6 inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-accent-text underline underline-offset-4">
                The full story <ArrowRight width={16} height={16} />
              </Link>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Photo photo={PHOTOS.founderSpeaking} sizes="(min-width: 1024px) 360px, 80vw" ratio="portrait" className="max-w-sm rounded-lg" />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="ink" labelledBy="mission-title">
        <Container>
          <p className="text-label uppercase text-fg-subtle">Mission</p>
          <h2 id="mission-title" className="mt-4 max-w-4xl font-display text-display-lg text-fg">
            {MISSION.statement}
          </h2>
          <span className="gold-rule mt-8" aria-hidden="true" />
          <p className="mt-6 max-w-measure text-body-lg text-fg-muted">{MISSION.belief}</p>
          <div className="mt-12">
            <StatBar compact />
          </div>
        </Container>
      </Section>

      <Section labelledBy="formats-title">
        <Container>
          <SectionHeader
            id="formats-title"
            eyebrow="What we run"
            title={`${Object.keys(FORMATS).length} formats.`}
            lede="Every BNC room is one of these. Each event page says which."
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {(Object.keys(FORMATS) as FormatKey[]).map((k, i) => (
              <li key={k} className="rounded-lg border border-line bg-bg-card p-6 sm:p-8">
                <span className="font-display text-heading-md text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-heading-md text-fg">{FORMATS[k].label}</h3>
                <p className="mt-2 text-body text-fg-muted">{FORMATS[k].body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="raised" labelledBy="journey-title">
        <Container>
          <SectionHeader
            id="journey-title"
            eyebrow="How members grow"
            title="From attendee to ecosystem builder."
            lede="Most people come for one room. The ones who stay move through six stages — and the circle is built to help them."
          />
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {JOURNEY.map((j, i) => (
              <li key={j.stage} className="border-t-2 border-gold pt-4">
                <span className="text-label uppercase text-fg-subtle">Stage {i + 1}</span>
                <h3 className="mt-1 text-heading-sm text-fg">{j.stage}</h3>
                <p className="mt-1 text-body-sm text-fg-muted">{j.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section labelledBy="values-title">
        <Container>
          <SectionHeader id="values-title" eyebrow="Values" title="What we expect in every room." />
          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-lg border border-line bg-bg-card p-6">
                <dt className="font-display text-heading-md text-fg">{v.title}</dt>
                <dd className="mt-2 text-body text-fg-muted">{v.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section tone="raised" labelledBy="not-title">
        <Container>
          <SectionHeader id="not-title" eyebrow="To be clear" title="What BNC is not." />
          <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {NOT_LIST.map((n) => (
              <div key={n.title} className="border-t border-line pt-5">
                <dt className="text-heading-sm text-fg">{n.title}</dt>
                <dd className="mt-1 text-body text-fg-muted">{n.body}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section labelledBy="about-next">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h2 id="about-next" className="max-w-measure font-display text-display-md text-fg">
              See it for yourself.
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              <PrimaryCta size="lg" placement="about" />
              <Link href="/about/team" className="text-body-sm font-semibold text-fg underline underline-offset-4">
                Meet the team
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
