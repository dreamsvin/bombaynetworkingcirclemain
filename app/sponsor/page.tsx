import type { Metadata } from "next";
import { STATS } from "@/content/site";
import { getChapters, getSponsors } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs, EmptyState } from "@/components/ui/misc";
import { StatBar } from "@/components/ui/stat-bar";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { buttonClass } from "@/components/ui/button";
import { LogoTile } from "@/components/ui/logo-tile";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Sponsor BNC — reach founders in 8 Indian cities",
  ogTitle: "Put your brand in the room with India's founders",
  description: `Sponsor Bombay Networking Circle events: ${STATS.items[0].value} founders, operators and freelancers across ${STATS.items[1].value} cities (as of ${STATS.asOf}). Single events, city series or the national calendar.`,
  path: "/sponsor",
});

/** The three sponsorship models BNC offered on its previous sponsor page, rewritten without the hype. */
const TIERS = [
  {
    name: "Event sponsorship",
    fit: "One chapter event — for example a Mumbai, Bangalore or Pune room.",
    gets: ["Banner placement at the venue", "A short presentation slot in the room", "Your offer or swag handed directly to attendees"],
  },
  {
    name: "Community sponsorship",
    fit: "A presence across BNC between events.",
    gets: ["Sponsor slot in the BNC newsletter", "A pinned announcement in the WhatsApp community", "Warm introductions from BNC hosts to members who fit"],
  },
  {
    name: "Brand activation",
    fit: "A format built around your product.",
    gets: ["A hackathon, pitch session or operator workshop", "BNC sources the founders or student builders", "They test, adopt or build on your product or SDK"],
  },
];

/** Audience segments from the previous sponsor page. Percentages withheld until BNC re-confirms them (CONTENT-TODO). */
const AUDIENCE_MIX = [
  { name: "Startup founders", body: "Bootstrapped, pre-seed and seed founders looking for talent, advisors, co-founders and growth help." },
  { name: "Tech operators and professionals", body: "Product managers, engineers, marketers and growth operators working in tech companies." },
  { name: "Student builders", body: "Student engineers, coders and designers who want to build and intern." },
  { name: "Creators and agency owners", body: "Independent creators, agency owners and freelancers looking for brand partners and clients." },
];

export default async function SponsorPage() {
  const [sponsors, chapters] = await Promise.all([getSponsors(), getChapters()]);
  const wall = sponsors.filter((s) => !s.is_partner);
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Sponsor", href: "/sponsor" }]} />}
        eyebrow="Sponsorship"
        title="Sponsor the rooms where India's founders meet."
        lede="BNC is free for members. Sponsors make that possible — and get in front of founders when they're actively looking for tools, partners and services."
      >
        <a href="#sponsor-form" className={buttonClass("secondary", "lg")}>
          Enquire about sponsoring
        </a>
      </PageHeader>

      <Section labelledBy="audience-title">
        <Container>
          <SectionHeader id="audience-title" eyebrow="Audience" title="Who's in the room." lede={`Founders, startup operators, freelancers and creators in ${chapters.map((c) => c.city).join(", ")}.`} />
          <div className="mt-10">
            <StatBar />
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {AUDIENCE_MIX.map((a) => (
              <li key={a.name} className="border-t border-line pt-5">
                <h3 className="text-heading-sm text-fg">{a.name}</h3>
                <p className="mt-1 text-body text-fg-muted">{a.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-measure text-body-sm text-fg-muted">A breakdown by segment, stage and city is shared with sponsors on request.</p>
        </Container>
      </Section>

      <Section tone="raised" labelledBy="tiers-title">
        <Container>
          <SectionHeader id="tiers-title" eyebrow="Opportunities" title="Three ways in." lede="Pricing depends on city and format; we'll send a proposal after a short call." />
          <ul className="mt-10 grid gap-6 lg:grid-cols-3">
            {TIERS.map((t) => (
              <li key={t.name} className="flex flex-col rounded-lg border border-line bg-bg-card p-6 sm:p-8">
                <h3 className="font-display text-heading-lg text-fg">{t.name}</h3>
                <p className="mt-1 text-body-sm text-fg-muted">{t.fit}</p>
                <ul className="mt-6 space-y-3 border-t border-line pt-6 text-body-sm text-fg">
                  {t.gets.map((g) => (
                    <li key={g} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-support" />
                      {g}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-caption text-fg-subtle">Every sponsor is listed publicly. Sponsors don&apos;t get member contact data.</p>
        </Container>
      </Section>

      <Section labelledBy="past-sponsors-title">
        <Container>
          <SectionHeader id="past-sponsors-title" eyebrow="Sponsors" title="Who has backed BNC" />
          {wall.length ? (
            <ul className="mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-5">
              {wall.map((s) => (
                <li key={s.id} className="flex min-h-24 items-center justify-center">
                  <LogoTile name={s.name} logo={s.logo} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-10" title="The sponsor wall is open" body="Sponsors are listed here once confirmed, with their permission." />
          )}
        </Container>
      </Section>

      <Section tone="raised" labelledBy="sponsor-form-title" id="sponsor-form">
        <Container>
          <SectionHeader id="sponsor-form-title" title="Sponsorship enquiry" lede="Tell us what you'd like to reach and roughly when. We'll come back with options." />
          <div className="mt-10 max-w-3xl">
            <InquiryForm kind="sponsor" />
          </div>
        </Container>
      </Section>
    </>
  );
}
