import type { Metadata } from "next";
import Link from "next/link";
import { AUDIENCE, BENEFITS, LINKS, STATS } from "@/content/site";
import { PHOTOS } from "@/content/photos";
import { getFeaturedMembers } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { MemberCard } from "@/components/ui/cards";
import { Photo } from "@/components/ui/photo";
import { PrimaryCta } from "@/components/site/primary-cta";
import { TrackedLink } from "@/components/site/tracked-link";
import { buttonClass } from "@/components/ui/button";
import { StatBar } from "@/components/ui/stat-bar";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Join the community — a founder network across India",
  ogTitle: "Join Bombay Networking Circle",
  description: `What you get as a BNC member: events in ${STATS.items[1].value} cities, a WhatsApp community, warm introductions and collaboration matching. Joining is free.`,
  path: "/community",
});

const CONDUCT = [
  "Help before you ask.",
  "No pitching services to the room.",
  "Introductions are made with both people's agreement.",
  "Respect everyone's time, data and boundaries.",
];

export default async function CommunityPage() {
  const featured = await getFeaturedMembers();
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Community", href: "/community" }]} />}
        eyebrow="Membership"
        title="Free to join. Worth showing up for."
        lede="There's no fee, no tier and no application form. You join by coming to a room — then the community keeps the conversation going between events."
      >
        <PrimaryCta size="lg" placement="community-hero" />
      </PageHeader>

      <Section labelledBy="get-title">
        <Container>
          <SectionHeader id="get-title" eyebrow="What you get" title="Five things members use." />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <li key={b.title} className="rounded-lg border border-line bg-bg-card p-6">
                <h3 className="text-heading-sm text-fg">{b.title}</h3>
                <p className="mt-2 text-body text-fg-muted">{b.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="raised" labelledBy="for-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeader id="for-title" eyebrow="Who it's for" title="Builders, and the people who help them build." />
              <Photo photo={PHOTOS.conversation} sizes="(min-width: 1024px) 380px, 90vw" ratio="portrait" className="mt-10 max-w-sm rounded-lg" />
            </div>
            <ul className="divide-y divide-line border-y border-line lg:col-span-7">
              {AUDIENCE.map((a) => (
                <li key={a.title} className="py-6">
                  <h3 className="text-heading-md text-fg">{a.title}</h3>
                  <p className="mt-2 text-body text-fg-muted">{a.body}</p>
                </li>
              ))}
              <li className="py-6">
                <h3 className="text-heading-md text-fg">Students and the curious</h3>
                <p className="mt-2 text-body text-fg-muted">Not building yet? There are rooms for that too. Come to learn how it works before you start.</p>
              </li>
            </ul>
          </div>
        </Container>
      </Section>

      <Section labelledBy="whatsapp-title">
        <Container>
          <div className="grid gap-10 rounded-lg border border-line bg-bg-card p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <SectionHeader
                id="whatsapp-title"
                eyebrow="The WhatsApp community"
                title="Where the circle lives between events."
                lede="Events are announced here first. Members post specific asks — a hire, a client, a co-founder — and get answers from people across all eight cities. Join after your first RSVP, so you've met the room."
              />
            </div>
            <div className="flex flex-col gap-4 lg:col-span-4 lg:items-end">
              <TrackedLink href={LINKS.whatsapp} event="whatsapp_click" props={{ placement: "community" }} newTab className={buttonClass("secondary", "lg")}>
                Join on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </TrackedLink>
              <Link href="/events" className="text-body-sm font-semibold text-fg underline underline-offset-4">
                RSVP to an event first
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {featured.length > 0 && (
        <Section tone="raised" labelledBy="faces-title">
          <Container>
            <SectionHeader id="faces-title" eyebrow="Members" title="Some of the people in the room." />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((m) => (
                <li key={m.id}>
                  <MemberCard member={m} />
                </li>
              ))}
            </ul>
            <p className="mt-6 text-caption text-fg-subtle">Members appear here only with their consent.</p>
          </Container>
        </Section>
      )}

      <Section labelledBy="conduct-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <SectionHeader className="lg:col-span-5" id="conduct-title" eyebrow="Code of conduct" title="Four rules, enforced." />
            <div className="lg:col-span-7">
              <ol className="divide-y divide-line border-y border-line">
                {CONDUCT.map((c, i) => (
                  <li key={c} className="flex gap-4 py-4 text-heading-sm text-fg">
                    <span className="font-display text-fg-subtle">{i + 1}</span>
                    {c}
                  </li>
                ))}
              </ol>
              <Link href="/code-of-conduct" className="mt-6 inline-flex min-h-11 items-center text-body-sm font-semibold text-accent-text underline underline-offset-4">
                Read the full code of conduct
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="ink" labelledBy="community-cta">
        <Container>
          <h2 id="community-cta" className="max-w-measure font-display text-display-md text-fg">
            Start with one room.
          </h2>
          <div className="mt-8">
            <PrimaryCta size="lg" placement="community-final" />
          </div>
          <div className="mt-12">
            <StatBar compact />
          </div>
        </Container>
      </Section>
    </>
  );
}
