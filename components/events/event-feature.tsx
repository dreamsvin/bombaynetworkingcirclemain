import Link from "next/link";
import type { EventWithChapter } from "@/lib/data";
import { FORMATS } from "@/content/site";
import { fmtDate, fmtTime } from "@/lib/format";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { Tag } from "@/components/ui/misc";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Calendar, Clock, Pin, Users, ArrowRight } from "@/components/ui/icons";
import { RsvpBlock } from "./rsvp-block";

/** A single event, featured: everything needed to decide, plus the RSVP. */
export function EventFeature({ event, note, headingLevel = "h3" }: { event: EventWithChapter; note?: string; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className="rounded-lg border border-line bg-bg-card p-6 shadow-e1 sm:p-8">
      {note && <p className="mb-4 rounded-md bg-support-tint px-3 py-2 text-body-sm text-fg">{note}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <Tag>{FORMATS[event.format].label}</Tag>
        <span className="text-caption font-semibold uppercase tracking-wider text-fg-subtle">{event.chapter.city}</span>
        {isPlaceholder(event) && <PlaceholderBadge />}
      </div>
      <H className="mt-3 font-display text-heading-lg text-fg">
        <Link href={`/events/${event.slug}`} className="hover:underline hover:underline-offset-4">
          {clean(event.title)}
        </Link>
      </H>
      <dl className="mt-5 grid gap-3 text-body-sm text-fg-muted sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Date</dt>
          <Calendar width={18} height={18} className="text-fg-subtle" />
          <dd>{fmtDate(event.starts_at)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Time</dt>
          <Clock width={18} height={18} className="text-fg-subtle" />
          <dd>
            {fmtTime(event.starts_at)}
            {event.ends_at ? ` – ${fmtTime(event.ends_at)}` : ""} IST
          </dd>
        </div>
        {(event.venue || event.venue_address) && (
          <div className="flex items-center gap-2">
            <dt className="sr-only">Venue</dt>
            <Pin width={18} height={18} className="text-fg-subtle" />
            <dd>{[event.venue ? clean(event.venue) : null, event.venue_address].filter(Boolean).join(", ")}</dd>
          </div>
        )}
        {event.capacity && (
          <div className="flex items-center gap-2">
            <dt className="sr-only">Capacity</dt>
            <Users width={18} height={18} className="text-fg-subtle" />
            <dd>{event.capacity} seats</dd>
          </div>
        )}
      </dl>
      <div className="mt-6 border-t border-line pt-6">
        <RsvpBlock eventSlug={event.slug} lumaUrl={event.luma_url} id={`rsvp-${event.slug}`} />
      </div>
      <Link href={`/events/${event.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-fg underline underline-offset-4">
        Event details <ArrowRight width={16} height={16} />
      </Link>
    </article>
  );
}
