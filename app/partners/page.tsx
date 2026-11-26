import type { Metadata } from "next";
import { getSponsors } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs, EmptyState } from "@/components/ui/misc";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { buttonClass } from "@/components/ui/button";
import { LogoTile } from "@/components/ui/logo-tile";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Partners — tools, venues and programmes for BNC members",
  description: "Ecosystem partners give Bombay Networking Circle members tools, credits, venues and programmes. See what partnership means and get in touch.",
  path: "/partners",
});

const KINDS = [
  { title: "Tools and credits", body: "Software, cloud and service credits offered to members, announced in the community." },
  { title: "Venues", body: "Cafés, studios and offices that host BNC rooms in their city." },
  { title: "Programmes", body: "Incubators, accelerators and communities that co-host sessions with BNC." },
  { title: "Content", body: "Practitioners who lead a startup conversation or a workshop." },
];

export default async function PartnersPage() {
  const partners = (await getSponsors()).filter((s) => s.is_partner);
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Partners", href: "/partners" }]} />}
        eyebrow="Partners"
        title="The organisations that make the rooms better."
        lede="Partners aren't sponsors buying attention. They give members something useful — a tool, a venue, a programme — and BNC makes the introduction."
      >
        <a href="#partner-form" className={buttonClass("secondary", "lg")}>
          Become a partner
        </a>
      </PageHeader>
      <Section labelledBy="kinds-title">
        <Container>
          <SectionHeader id="kinds-title" title="What partnership means" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {KINDS.map((k) => (
              <li key={k.title} className="border-2 border-line-strong bg-bg-card p-6">
                <h3 className="text-heading-sm text-fg">{k.title}</h3>
                <p className="mt-2 text-body-sm text-fg-muted">{k.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section tone="raised" labelledBy="logos-title">
        <Container>
          <SectionHeader id="logos-title" title="Current partners" />
          {partners.length ? (
            <ul className="mt-10 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-5">
              {partners.map((p) => (
                <li key={p.id} className="flex min-h-24 items-center justify-center">
                  <LogoTile name={p.name} logo={p.logo} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-10" title="Partner logos appear here once confirmed" body="We list partners only after both sides have agreed — no borrowed logos." />
          )}
        </Container>
      </Section>
      <Section labelledBy="partner-form-title" id="partner-form">
        <Container>
          <SectionHeader id="partner-form-title" title="Partnership enquiry" />
          <div className="mt-10 max-w-3xl">
            <InquiryForm kind="partner" />
          </div>
        </Container>
      </Section>
    </>
  );
}
