import Link from "next/link";
import { FOOTER, LINKS, SITE, TAGLINE } from "@/content/site";
import { Seal } from "./logo";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { TrackedLink } from "./tracked-link";

export function Footer() {
  const socials = [
    { label: "Instagram", href: LINKS.instagram },
    { label: "LinkedIn", href: LINKS.linkedin },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer data-tone="ink" className="pb-10 pt-section-sm">
      <div className="mx-auto max-w-container px-gutter">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Seal className="h-28 w-28 text-brand-text" />
            <p className="mt-6 font-display text-heading-lg text-fg">{TAGLINE}</p>
            <SubscribeForm className="mt-8 max-w-md" id="footer-subscribe" label="Get the next room in your city by email" source="footer" />
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
            {FOOTER.map((col) => (
              <div key={col.title}>
                <h2 className="font-mono text-label uppercase text-brand-text">{col.title}</h2>
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

        <div className="mt-14 flex flex-col gap-6 border-t-2 border-line-strong pt-8 text-body-sm text-fg-muted md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <TrackedLink href={LINKS.whatsapp} event="whatsapp_click" props={{ placement: "footer" }} newTab className="inline-flex min-h-11 items-center text-fg underline underline-offset-4">
                WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </TrackedLink>
            </li>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-fg underline underline-offset-4">
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-caption text-fg-subtle">© {new Date().getFullYear()} {SITE.name}</p>
        </div>
      </div>
    </footer>
  );
}
