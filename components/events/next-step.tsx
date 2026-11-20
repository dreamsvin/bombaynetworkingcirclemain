import { Container, Section } from "@/components/ui/layout";
import { TrackedLink } from "@/components/site/tracked-link";
import { buttonClass } from "@/components/ui/button";
import { LINKS } from "@/content/site";
import { ArrowRight } from "@/components/ui/icons";

/**
 * The same closing step on every city page and every event page.
 * Order matters: attend first (step 3), community second (step 4). WhatsApp is never the first ask.
 */
export function NextStep({ rsvpHref, rsvpLabel = "RSVP to the next event", placement }: { rsvpHref: string; rsvpLabel?: string; placement: string }) {
  const external = rsvpHref.startsWith("http");
  return (
    <Section tone="ink" labelledBy={`next-step-${placement}`}>
      <Container>
        <h2 id={`next-step-${placement}`} className="max-w-measure font-display text-display-md text-fg">
          Your next step: come to a room.
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2">
          <li className="border-t border-line pt-6">
            <p className="text-label uppercase text-fg-subtle">Step 1</p>
            <h3 className="mt-2 text-heading-md text-fg">RSVP</h3>
            <p className="mt-2 text-body text-fg-muted">Pick a date and register on Luma. Free, two minutes, and you get a reminder.</p>
            <TrackedLink
              href={rsvpHref}
              event={external ? "rsvp_click" : "cta_click"}
              props={{ placement }}
              newTab={external}
              className={buttonClass("primary", "lg", "mt-6")}
            >
              {rsvpLabel} <ArrowRight width={18} height={18} />
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </TrackedLink>
          </li>
          <li className="border-t border-line pt-6">
            <p className="text-label uppercase text-fg-subtle">Step 2</p>
            <h3 className="mt-2 text-heading-md text-fg">Join the community</h3>
            <p className="mt-2 text-body text-fg-muted">Once you&apos;ve RSVP&apos;d, join the WhatsApp community. Events are announced there first, and members post specific asks.</p>
            <TrackedLink href={LINKS.whatsapp} event="whatsapp_click" props={{ placement }} newTab className={buttonClass("secondary", "lg", "mt-6")}>
              Join on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </TrackedLink>
          </li>
        </ol>
      </Container>
    </Section>
  );
}
