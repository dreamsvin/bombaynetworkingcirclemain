import Link from "next/link";
import type { EventWithChapter } from "@/lib/data";
import { EventListItem } from "@/components/ui/event-list-item";
import { EmptyState } from "@/components/ui/misc";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { TrackedLink } from "@/components/site/tracked-link";
import { LINKS } from "@/content/site";

/**
 * Upcoming events list. Never an empty state: with no event rows, it points at the live Luma calendar
 * and captures an email.
 */
export function NextEvents({ events, showCity = true, city, source }: { events: EventWithChapter[]; showCity?: boolean; city?: string; source: string }) {
  if (events.length) {
    return (
      <ul className="border-t border-line">
        {events.map((e) => (
          <EventListItem key={e.id} event={e} showCity={showCity} />
        ))}
      </ul>
    );
  }
  return (
    <EmptyState
      title={city ? `The next ${city} date is being set` : "Dates are announced on our Luma calendar"}
      body={
        <>
          <p>
            Every BNC event is listed on the{" "}
            <TrackedLink href={LINKS.lumaCalendar} event="rsvp_click" props={{ source, via: "calendar" }} newTab className="font-semibold text-accent-text underline underline-offset-4">
              live Luma calendar<span className="sr-only"> (opens in a new tab)</span>
            </TrackedLink>
            . Leave your email and we&apos;ll tell you when the next {city ?? "event near you"} is open for RSVPs.
          </p>
        </>
      }
    >
      <SubscribeForm variant="city" source={source} city={city} label="Your email" className="w-full max-w-lg" id={`${source.replace(/[^a-z0-9]/g, "-")}-notify`} />
      <Link href="/events" className="text-body-sm font-semibold text-fg underline underline-offset-4">
        All events
      </Link>
    </EmptyState>
  );
}
