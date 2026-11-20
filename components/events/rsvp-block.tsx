import { SubscribeForm } from "@/components/forms/subscribe-form";
import { TrackedLink } from "@/components/site/tracked-link";
import { LINKS } from "@/content/site";

/**
 * RSVP intent. Captures an email (owned audience), then continues to Luma — the RSVP system of record.
 * Skippable: the direct Luma link is always there.
 */
export function RsvpBlock({ eventSlug, lumaUrl, id = "rsvp" }: { eventSlug: string; lumaUrl: string | null; id?: string }) {
  const url = lumaUrl ?? LINKS.lumaCalendar;
  return (
    <div>
      <SubscribeForm variant="rsvp" source={`rsvp:${eventSlug}`} rsvpUrl={url} label="Your email for the reminder" id={id} />
      <p className="mt-3 text-caption text-fg-subtle">
        We&apos;ll send the reminder and the community invite. Prefer not to?{" "}
        <TrackedLink href={url} event="rsvp_click" props={{ source: `rsvp:${eventSlug}`, via: "skip" }} newTab className="font-semibold text-fg underline underline-offset-4">
          Go straight to Luma<span className="sr-only"> (opens in a new tab)</span>
        </TrackedLink>
      </p>
    </div>
  );
}
