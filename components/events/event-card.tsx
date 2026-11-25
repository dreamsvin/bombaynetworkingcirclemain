import Link from "next/link";
import type { EventWithChapter } from "@/lib/data";
import { FORMATS } from "@/content/site";
import { fmtDate, fmtPrice } from "@/lib/format";
import { clean } from "@/lib/is-placeholder";
import { Tag } from "@/components/ui/misc";
import { EventCover } from "./event-cover";

/** Archive card: image, format, city, date, and the two numbers that matter (price and seats filled). */
export function EventCard({ event, headingAs: H = "h3" }: { event: EventWithChapter; headingAs?: "h2" | "h3" }) {
  const price = fmtPrice(event.price_inr);
  const meta = [price, event.registrations ? `${event.registrations} registered` : null].filter(Boolean).join(" · ");
  return (
    <Link href={`/events/${event.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg-card transition-shadow duration-base ease-out hover:shadow-e2">
      <EventCover event={event} sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{FORMATS[event.format].short}</Tag>
          <span className="text-caption font-semibold uppercase tracking-wider text-fg-subtle">{event.is_online ? "Online" : event.chapter.city}</span>
        </div>
        <H className="mt-3 text-heading-sm text-fg group-hover:underline group-hover:underline-offset-4">{clean(event.title)}</H>
        <p className="mt-1 text-body-sm text-fg-muted">{fmtDate(event.starts_at)}</p>
        {meta && <p className="mt-auto pt-4 text-caption text-fg-subtle">{meta}</p>}
      </div>
    </Link>
  );
}
