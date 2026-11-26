import type { Metadata } from "next";
import { CURATION, PILLARS, ROOM_STEPS } from "@/content/site";
import { PHOTOS } from "@/content/photos";
import { pageMeta } from "@/lib/seo";
import { Container, Section, SectionHeader, PageHeader, Eyebrow } from "@/components/ui/layout";
import { Accordion, Breadcrumbs } from "@/components/ui/misc";
import { Chip, ClosingBand, NumberedRows } from "@/components/ui/bnc";
import { Photo } from "@/components/ui/photo";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { PrimaryCta } from "@/components/site/primary-cta";

export const metadata: Metadata = pageMeta({
  title: "Inside BNC — what actually happens in a room",
  ogTitle: "What actually happens in a room",
  description: "How a BNC room runs: one theme, about 30 seats, planned introductions, a focused conversation and follow-ups after the room ends.",
  path: "/inside",
});

/** Case study — PLACEHOLDER until BNC confirms a real room (CONTENT-TODO). */
const CASE = {
  title: "Scaling beyond your first city",
  theme: "Expanding a profitable business into a second and third city",
  seats: 30,
  who: ["D2C founders", "Ops leads", "Investors", "Supply-chain operators"],
};

const AFTER = [
  { title: "48 h", body: "Hosts send the introductions they promised in the room, by email, to both people." },
  { title: "1 week", body: "A check-in on the asks you shared. If an introduction stalled, the host follows up." },
  { title: "Ongoing", body: "You join the member community and hear about the next rooms in your city first." },
];

export default function InsidePage() {
  return (
    <>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: "Inside BNC", href: "/inside" }]} />} eyebrow="Inside BNC" title="What actually happens in a room." lede="A network you experience, not just a community you join. Here's one evening, start to finish." />

      <Section labelledBy="case-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow>Case study</Eyebrow>
              <PlaceholderBadge className="mt-2" />
              <h2 id="case-title" className="mt-3 font-display text-display-md text-fg">
                {CASE.title}
              </h2>
              <dl className="mt-8 border-t-2 border-line-strong">
                <div className="grid grid-cols-[6rem_1fr] gap-4 border-b-2 border-line-strong py-3">
                  <dt className="font-mono text-label uppercase text-brand-text">Theme</dt>
                  <dd className="text-body text-fg">{CASE.theme}</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-4 border-b-2 border-line-strong py-3">
                  <dt className="font-mono text-label uppercase text-brand-text">Seats</dt>
                  <dd className="text-body text-fg">{CASE.seats}</dd>
                </div>
                <div className="grid grid-cols-[6rem_1fr] gap-4 border-b-2 border-line-strong py-3">
                  <dt className="font-mono text-label uppercase text-brand-text">Who</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {CASE.who.map((w) => (
                        <li key={w}>
                          <Chip>{w}</Chip>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
            <Photo photo={PHOTOS.roomD} sizes="(min-width: 1024px) 480px, 100vw" ratio="photo" className="border-2 border-line-strong lg:col-span-5" />
          </div>
        </Container>
      </Section>

      <Section tone="sand" labelledBy="ran-title">
        <Container>
          <SectionHeader id="ran-title" eyebrow="The evening" title="How the evening ran." />
          <NumberedRows items={ROOM_STEPS} className="mt-10" />
        </Container>
      </Section>

      <section data-tone="brown" aria-labelledby="after-title" className="border-b-2 border-line-strong py-section">
        <Container>
          <Eyebrow>After the room</Eyebrow>
          <h2 id="after-title" className="mt-3 font-display text-display-lg text-fg">
            The room ends. The relationships don&rsquo;t.
          </h2>
          <NumberedRows items={AFTER} columns={3} className="mt-10" />
        </Container>
      </section>

      <Section labelledBy="curation-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader id="curation-title" eyebrow="Curation" title="How a room is curated." />
            </div>
            <Accordion className="lg:col-span-8" items={CURATION.map((c, i) => ({ q: `${String(i + 1).padStart(2, "0")} · ${c.title} — ${c.body}`, a: c.detail }))} />
          </div>
        </Container>
      </Section>

      <Section tone="sand" size="sm" labelledBy="pillars-title">
        <Container>
          <h2 id="pillars-title" className="sr-only">
            What you get
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <li key={p.title} className="border-t-2 border-line-strong pt-4">
                <h3 className="text-heading-sm text-fg">{p.title}</h3>
                <p className="mt-1 text-body-sm text-fg-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ClosingBand title="Want to be in the next one?" body="Joining is free. Request access and we'll match you to a room in your city.">
        <PrimaryCta size="lg" placement="inside-closing" />
      </ClosingBand>
    </>
  );
}
