import Link from "next/link";
import type { EventWithChapter } from "@/lib/data";
import { FORMATS } from "@/content/site";
import { fmtDay, fmtTime, fmtDate } from "@/lib/format";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { PlaceholderBadge } from "./placeholder-badge";
import { Tag } from "./misc";
import { ArrowRight, Pin } from "./icons";
import { cn } from "@/lib/cn";

/** One row in an event list. The whole row is one link (to the SEO page), with a clear accessible name. */
export function EventListItem({ event, showCity = true, past = false }: { event: EventWithChapter; showCity?: boolean; past?: boolean }) {
  const { day, month } = fmtDay(event.starts_at);
  const title = clean(event.title);
  return (
    <li>
      <Link
        href={`/events/${event.slug}`}
        className="group grid grid-cols-[64px_1fr] items-start gap-4 border-b border-line py-6 sm:grid-cols-[80px_1fr_auto] sm:gap-6"
      >
        <div className={cn("flex flex-col items-center rounded-lg border border-line py-2", past ? "bg-bg-raised" : "bg-bg-card")} aria-hidden="true">
          <span className="font-display text-heading-lg leading-none text-fg">{day}</span>
          <span className="mt-1 text-label text-fg-subtle">{month}</span>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Tag>{FORMATS[event.format].label}</Tag>
            {showCity && <span className="text-caption font-semibold uppercase tracking-wider text-fg-subtle">{event.chapter.city}</span>}
            {isPlaceholder(event) && <PlaceholderBadge />}
          </div>
          <h3 className="mt-2 text-heading-sm text-fg group-hover:underline group-hover:underline-offset-4">{title}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-fg-muted">
            <span>
              <span className="sr-only">Date: </span>
              {fmtDate(event.starts_at)} · {fmtTime(event.starts_at)}
            </span>
            {event.venue && (
              <span className="inline-flex items-center gap-1">
                <Pin width={16} height={16} />
                {clean(event.venue) || event.venue_address}
              </span>
            )}
          </p>
        </div>
        <span className="col-start-2 inline-flex items-center gap-1 text-body-sm font-semibold text-accent-text sm:col-start-3 sm:self-center">
          {past ? "Recap" : "Details"} <ArrowRight width={16} height={16} />
        </span>
      </Link>
    </li>
  );
}
