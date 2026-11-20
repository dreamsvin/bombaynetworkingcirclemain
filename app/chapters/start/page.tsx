import type { Metadata } from "next";
import { getChapters } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Check } from "@/components/ui/icons";

export const metadata: Metadata = pageMeta({
  title: "Start a BNC chapter in your city",
  ogTitle: "Bring Bombay Networking Circle to your city",
  description: "Lead a Bombay Networking Circle chapter: host small founder rooms in your city with BNC's format, playbook and community behind you. Apply here.",
  path: "/chapters/start",
});

const WHO = [
  "You already know founders, operators or freelancers in the city — and they'd show up if you asked.",
  "You can give a few hours a month to plan and host one room.",
  "You'd rather make introductions than collect followers.",
  "You'll keep the room free of sales pitches and run it by the code of conduct.",
];

const PROVIDE = [
  { title: "The format", body: "How to run an evening: placement, one-line asks, a hosted conversation and an open floor with introductions." },
  { title: "Listing and promotion", body: "A chapter page on this site, your events on the BNC Luma calendar, and announcements to the community." },
  { title: "Founder support", body: "Onboarding with Isha and the existing city leads, and a channel to ask them anything." },
  { title: "Partners", body: "Introductions to venue and sponsor partners as the chapter grows." },
];

export default async function StartChapterPage() {
  const chapters = await getChapters();
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Chapters", href: "/chapters" }, { label: "Start a chapter", href: "/chapters/start" }]} />}
        eyebrow="Expansion"
        title="Start a chapter in your city."
        lede={`BNC is in ${chapters.length} cities because someone in each one decided their city needed better rooms. Here's who that should be, and what you get.`}
      />
      <Section labelledBy="who-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader id="who-title" title="Who should start one" />
              <ul className="mt-8 space-y-4">
                {WHO.map((w) => (
                  <li key={w} className="flex gap-3 text-body text-fg-muted">
                    <Check className="mt-1 shrink-0 text-accent-text" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeader title="What BNC provides" />
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {PROVIDE.map((p) => (
                  <div key={p.title} className="py-5">
                    <dt className="text-heading-sm text-fg">{p.title}</dt>
                    <dd className="mt-1 text-body text-fg-muted">{p.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>
      <Section tone="raised" labelledBy="apply-title">
        <Container>
          <SectionHeader id="apply-title" title="Apply" lede="Tell us about you and the city. We reply to every application." />
          <div className="mt-10 max-w-3xl">
            <InquiryForm kind="start_chapter" cities={chapters.map((c) => c.city)} />
          </div>
        </Container>
      </Section>
    </>
  );
}
