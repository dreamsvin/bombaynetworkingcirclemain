import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/content/site";
import { getChapters } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Mail } from "@/components/ui/icons";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Contact Bombay Networking Circle",
  description: `Questions, press, speaking or hosting a BNC event? Write to ${CONTACT.email} or use the form. Based in Mumbai.`,
  path: "/contact",
});

export default async function ContactPage() {
  const chapters = await getChapters();
  return (
    <>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />} eyebrow="Contact" title="Talk to a person." lede={CONTACT.responseTime} />
      <Section labelledBy="contact-form-title">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="contact-form-title" className="sr-only">
                Contact form
              </h2>
              <InquiryForm kind="contact" />
            </div>
            <aside className="space-y-10 lg:col-span-4 lg:col-start-9" aria-label="Other ways to reach us">
              <div>
                <h2 className="text-heading-sm text-fg">Email</h2>
                <a href={`mailto:${CONTACT.email}`} className="mt-2 inline-flex min-h-11 items-center gap-2 text-body text-accent-text underline underline-offset-4">
                  <Mail width={18} height={18} /> {CONTACT.email}
                </a>
                <p className="text-body-sm text-fg-muted">{CONTACT.city}</p>
              </div>
              <div>
                <h2 className="text-heading-sm text-fg">By city</h2>
                <p className="mt-2 text-body-sm text-fg-muted">City-specific questions go to the same inbox and are forwarded to that chapter&apos;s lead.</p>
                <ul className="mt-3 grid grid-cols-2 gap-x-4">
                  {chapters.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/chapters/${c.slug}`} className="inline-flex min-h-11 items-center text-body-sm text-fg underline-offset-4 hover:underline">
                        {c.city}
                        {c.lead_name ? ` — ${c.lead_name}` : ""}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-heading-sm text-fg">Something else?</h2>
                <ul className="mt-2 space-y-1 text-body-sm">
                  <li>
                    <Link href="/sponsor" className="inline-flex min-h-11 items-center text-accent-text underline underline-offset-4">Sponsorship enquiries</Link>
                  </li>
                  <li>
                    <Link href="/partners" className="inline-flex min-h-11 items-center text-accent-text underline underline-offset-4">Partnerships</Link>
                  </li>
                  <li>
                    <Link href="/chapters/start" className="inline-flex min-h-11 items-center text-accent-text underline underline-offset-4">Start a chapter</Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
