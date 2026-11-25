import Link from "next/link";
import { CONTACT, FOOTER, LEGAL, LINKS, SITE } from "@/content/site";
import { getChapters } from "@/lib/data";
import { Seal } from "./logo";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { TrackedLink } from "./tracked-link";

export async function Footer() {
  const chapters = await getChapters();
  const cityLinks = chapters.slice(0, 4).map((c) => ({ label: c.city, href: `/chapters/${c.slug}` }));
  const columns = FOOTER.map((col) =>
    col.title === "Chapters" ? { ...col, links: [col.links[0], ...cityLinks, ...col.links.slice(1)] } : col,
  );
  const socials = [
    { label: "Instagram", href: LINKS.instagram },
    { label: "LinkedIn", href: LINKS.linkedin },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer data-tone="ink" className="border-t border-line pb-10 pt-section-sm">
      <div className="mx-auto max-w-container px-gutter">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Seal className="h-24 w-24 text-accent-text" />
            <p className="mt-6 max-w-measure text-body-sm text-fg-muted">
              Curated, in-person rooms for founders, operators and creators in {chapters.length} Indian cities. Started by {SITE.founder}. {SITE.tagline}.
            </p>
            <SubscribeForm className="mt-8 max-w-md" id="footer-subscribe" label="Event updates by email" source="footer" />
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-label uppercase text-fg-subtle">{col.title}</h2>
                <ul className="mt-4 space-y-1">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex min-h-11 items-center text-body-sm text-fg-muted hover:text-fg hover:underline hover:underline-offset-4 sm:min-h-0 sm:py-1.5">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 grid gap-6 border-t border-line pt-8 text-body-sm text-fg-muted md:grid-cols-3">
          <div>
            <h2 className="text-label uppercase text-fg-subtle">Contact</h2>
            <p className="mt-3">
              <a href={`mailto:${CONTACT.email}`} className="text-fg underline underline-offset-4">
                {CONTACT.email}
              </a>
            </p>
            <p className="mt-1">{CONTACT.city}</p>
          </div>
          <div>
            <h2 className="text-label uppercase text-fg-subtle">Community</h2>
            <ul className="mt-3 space-y-1">
              <li>
                <TrackedLink href={LINKS.whatsapp} event="whatsapp_click" props={{ placement: "footer" }} newTab className="text-fg underline underline-offset-4">
                  WhatsApp community<span className="sr-only"> (opens in a new tab)</span>
                </TrackedLink>
              </li>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:text-right">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-fg hover:underline hover:underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-caption text-fg-subtle">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
