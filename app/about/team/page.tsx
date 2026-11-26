import type { Metadata } from "next";
import Link from "next/link";
import { getChapters, getTeam } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs, EmptyState } from "@/components/ui/misc";
import { MemberCard } from "@/components/ui/cards";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Team — the people who run BNC",
  description: "The founder, city leads and volunteers behind Bombay Networking Circle.",
  path: "/about/team",
});

export default async function TeamPage() {
  const [team, chapters] = await Promise.all([getTeam(), getChapters()]);
  const open = chapters.filter((c) => !c.lead_name);
  const led = chapters.filter((c) => c.lead_name);

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "About", href: "/about" }, { label: "Team", href: "/about/team" }]} />}
        eyebrow="Team"
        title="The people behind the rooms."
        lede="Real names, real faces. Everyone here hosts, organises or volunteers."
      />
      <Section labelledBy="team-title">
        <Container>
          <SectionHeader id="team-title" title="Founder and organisers" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <li key={m.id}>
                <MemberCard member={m} showTeamRole />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section tone="raised" labelledBy="leads-title">
        <Container>
          <SectionHeader id="leads-title" title="City leads" lede="Each chapter is run by someone who lives and works in that city." />
          {led.length > 0 && (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {led.map((c) => (
                <li key={c.slug} className="border-2 border-line-strong bg-bg-card p-5">
                  <p className="text-heading-sm text-fg">{c.lead_name}</p>
                  <Link href={`/chapters/${c.slug}`} className="text-body-sm text-accent-text underline underline-offset-4">
                    {c.city}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {open.length > 0 && (
            <EmptyState
              className="mt-8"
              title={`Lead roles open in ${open.length} ${open.length === 1 ? "city" : "cities"}`}
              body={<>Being announced or open: {open.map((c) => c.city).join(", ")}. If you know the founders in one of these cities, apply.</>}
            >
              <ButtonLink href="/start-a-chapter" variant="secondary">
                Apply to lead a chapter
              </ButtonLink>
            </EmptyState>
          )}
        </Container>
      </Section>
      <Section size="sm" labelledBy="volunteer-title">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="volunteer-title" className="text-heading-md text-fg">
                Volunteer, speak or host
              </h2>
              <p className="mt-1 text-body text-fg-muted">Rooms need hosts, venues and speakers. Tell us what you can offer.</p>
            </div>
            <ButtonLink href="/contact" variant="secondary">
              Get in touch
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
