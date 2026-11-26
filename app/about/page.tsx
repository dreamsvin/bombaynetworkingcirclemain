import type { Metadata } from "next";
import Link from "next/link";
import { CHARTER, FORMATS, MISSION, SITE, STATS, TAGLINE, type FormatKey } from "@/content/site";
import { PHOTOS } from "@/content/photos";
import { pageMeta } from "@/lib/seo";
import { getChapters, getTeam } from "@/lib/data";
import { ClosingBand } from "@/components/ui/bnc";
import { MemberCard } from "@/components/ui/cards";
import { Container, Section, PageHeader, SectionHeader, Eyebrow } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { Photo } from "@/components/ui/photo";
import { PrimaryCta } from "@/components/site/primary-cta";

export const metadata: Metadata = pageMeta({
  title: "About Bombay Networking Circle",
  ogTitle: "Why Bombay Networking Circle exists",
  description: `${TAGLINE} BNC is a growing network of hosted rooms for founders, operators and creators, started in Mumbai in ${SITE.founded} by ${SITE.founder}. Mission: connect ${MISSION.builders} builders and catalyse ${MISSION.collaborations} collaborations.`,
  path: "/about",
});

export default async function AboutPage() {
  const [team, chapters] = await Promise.all([getTeam(), getChapters()]);
  const leads = chapters.filter((c) => c.lead_name);
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "About", href: "/about" }]} />}
        eyebrow="About"
        title={TAGLINE}
        lede={`Bombay Networking Circle started in Mumbai in ${SITE.founded}. Today it's ${STATS.items[0].value} members in ${STATS.items[1].value} cities (as of ${STATS.asOf}), run on one idea: the right room beats a bigger one.`}
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
                <p>That&apos;s BNC. It&apos;s free to join, it&apos;s community-led, and it measures itself by what happens after the room — not by how full it was.</p>
              </div>
              <p className="mt-6 text-body-sm font-semibold text-fg">— {SITE.founder}, founder</p>
              <Link href="/about/story" className="mt-6 inline-flex min-h-11 items-center text-body-sm font-bold text-accent-text underline underline-offset-4">
                The full story →
              </Link>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Photo photo={PHOTOS.founderSpeaking} sizes="(min-width: 1024px) 360px, 80vw" ratio="portrait" className="max-w-sm border-2 border-line-strong" />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="sand" labelledBy="mission-title">
        <Container>
          <Eyebrow>Where we&rsquo;re going</Eyebrow>
          <h2 id="mission-title" className="mt-3 max-w-4xl font-display text-display-md text-fg">
            {MISSION.line}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="border-2 border-line-strong bg-bg-card p-6">
              <p className="font-mono text-label uppercase text-brand-text">Goals</p>
              <dl className="mt-4 grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-body-sm text-fg-muted">Builders connected</dt>
                  <dd className="font-display text-display-md text-fg">{MISSION.builders}</dd>
                </div>
                <div>
                  <dt className="text-body-sm text-fg-muted">Collaborations</dt>
                  <dd className="font-display text-display-md text-fg">{MISSION.collaborations}</dd>
                </div>
              </dl>
              <p className="mt-4 text-caption text-fg-subtle">These are goals, not current figures.</p>
            </div>
            <div className="border-2 border-line-strong bg-bg-card p-6">
              <p className="font-mono text-label uppercase text-brand-text">Today · verified</p>
              <dl className="mt-4 grid grid-cols-2 gap-6">
                {STATS.items.map((it) => (
                  <div key={it.label}>
                    <dt className="text-body-sm text-fg-muted">{it.label}</dt>
                    <dd className="font-display text-display-md text-fg">{it.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-caption text-fg-subtle">
                As of {STATS.asOf}. {STATS.source}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <section id="charter" data-tone="brown" aria-labelledby="charter-title" className="scroll-mt-24 border-b-2 border-line-strong py-section">
        <Container>
          <Eyebrow>The BNC Charter</Eyebrow>
          <h2 id="charter-title" className="mt-3 font-display text-display-lg text-fg">
            How we show up.
          </h2>
          <p className="mt-4 max-w-measure text-body-lg text-fg-muted">Everyone who requests access agrees to it. The standard is how you take part, not what&rsquo;s on your card.</p>
          <ol className="mt-10 border-t-2 border-line-strong">
            {CHARTER.map((c, i) => (
              <li key={c.title} className="grid gap-2 border-b-2 border-line-strong py-5 md:grid-cols-[4rem_18rem_1fr]">
                <span className="font-mono text-label text-brand-text">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-heading-md text-fg">{c.title}</h3>
                <p className="text-body text-fg-muted">{c.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Section labelledBy="formats-title">
        <Container>
          <SectionHeader id="formats-title" eyebrow="What we run" title="Four kinds of room." lede="Every BNC room is one of these. Each room page says which." />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {(Object.keys(FORMATS) as FormatKey[]).map((k, i) => (
              <li key={k} className="border-2 border-line-strong bg-bg-card p-6 sm:p-8">
                <span className="font-mono text-label text-brand-text">0{i + 1}</span>
                <h3 className="mt-2 text-heading-md text-fg">{FORMATS[k].label}</h3>
                <p className="mt-2 text-body text-fg-muted">{FORMATS[k].body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="team-title">
        <Container>
          <SectionHeader id="team-title" eyebrow="People" title="Founder, city leads and team." />
          {team.length > 0 && (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <li key={m.id}>
                  <MemberCard member={m} showTeamRole />
                </li>
              ))}
            </ul>
          )}
          {leads.length > 0 && (
            <ul className="mt-10 border-t-2 border-line-strong">
              {leads.map((c) => (
                <li key={c.id} className="flex min-h-14 items-center justify-between border-b-2 border-line-strong">
                  <span className="text-heading-sm font-bold text-fg">{c.lead_name}</span>
                  <Link href={`/chapters/${c.slug}`} className="font-mono text-label uppercase text-fg-muted underline underline-offset-4">
                    {c.city} lead
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/about/team" className="mt-8 inline-flex min-h-11 items-center font-bold text-accent-text underline underline-offset-4">
            Meet the whole team →
          </Link>
        </Container>
      </Section>

      <ClosingBand title="See it for yourself." body="Joining is free. Request access and we'll match you to a room in your city.">
        <PrimaryCta size="lg" placement="about" />
      </ClosingBand>
    </>
  );
}
