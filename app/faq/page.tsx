import type { Metadata } from "next";
import Link from "next/link";
import { FAQ, type Faq } from "@/content/faq";
import { getChapters } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Accordion, Breadcrumbs } from "@/components/ui/misc";
import { JsonLd } from "@/components/site/json-ld";
import { CONTACT } from "@/content/site";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "FAQ — joining, rooms, chapters and cost",
  description: "Answers to common questions about Bombay Networking Circle: what it is, whether it's free, who can join, what happens after you request access and how rooms are curated.",
  path: "/faq",
});

const GROUPS: { key: Faq["group"]; title: string }[] = [
  { key: "joining", title: "Joining" },
  { key: "events", title: "Rooms" },
  { key: "chapters", title: "Chapters" },
  { key: "partners", title: "Sponsors and partners" },
];

const list = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);

export default async function FaqPage() {
  const chapters = await getChapters();
  // The city answer is generated from the chapters table — the single source of truth.
  const cityFaq: Faq = {
    group: "chapters",
    q: "Which cities do you operate in?",
    a: `${list(chapters.map((c) => c.city))} — ${chapters.length} chapters, with ${chapters.find((c) => c.is_flagship)?.city ?? "Mumbai"} as the flagship. New cities open when someone local applies to lead one.`,
  };
  const all = [...FAQ.slice(0, 7), cityFaq, ...FAQ.slice(7)];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: all.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: "FAQ", href: "/faq" }]} />} eyebrow="FAQ" title="Questions, answered." lede="If yours isn't here, ask us." />
      <Section>
        <Container>
          <div className="space-y-16">
            {GROUPS.map((g) => (
              <section key={g.key} aria-labelledby={`faq-${g.key}`} className="grid gap-6 lg:grid-cols-12">
                <SectionHeader className="lg:col-span-4" id={`faq-${g.key}`} title={g.title} />
                <Accordion className="lg:col-span-8" items={all.filter((f) => f.group === g.key).map((f) => ({ q: f.q, a: f.a }))} />
              </section>
            ))}
          </div>
          <p className="mt-16 text-body text-fg-muted">
            Still unsure?{" "}
            <Link href="/contact" className="font-semibold text-accent-text underline underline-offset-4">
              Contact us
            </Link>{" "}
            or write to {CONTACT.email}.
          </p>
        </Container>
      </Section>
    </>
  );
}
