import Link from "next/link";
import type { EventWithChapter } from "@/lib/data";
import { FORMATS } from "@/content/site";
import { fmtMonthYear } from "@/lib/format";
import { clean } from "@/lib/is-placeholder";

/**
 * The journey so far, built from the event table — so it can never drift from the archive. Marks the first room in each
 * city and each new format, which is what "growth" actually looked like.
 */
export function Timeline({ events }: { events: EventWithChapter[] }) {
  const seenCity = new Set<string>();
  const seenFormat = new Set<string>();
  return (
    <ol className="relative border-l-2 border-gold pl-6 sm:pl-8">
      {events.map((e) => {
        const firstCity = !e.is_online && !seenCity.has(e.chapter.slug);
        const firstFormat = !seenFormat.has(e.format);
        if (!e.is_online) seenCity.add(e.chapter.slug);
        seenFormat.add(e.format);
        const marks = [firstCity ? `First room in ${e.chapter.city}` : null, firstFormat && seenFormat.size > 1 ? `New format: ${FORMATS[e.format].label}` : null].filter(Boolean);
        return (
          <li key={e.id} className="relative pb-8 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[33px] top-2 h-3 w-3 rounded-full border-2 border-gold bg-bg sm:-left-[41px]" />
            <p className="text-label uppercase text-fg-subtle">
              {fmtMonthYear(e.starts_at)} · {e.is_online ? "Online" : e.chapter.city}
            </p>
            <Link href={`/events/${e.slug}`} className="mt-1 inline-block text-heading-sm text-fg underline-offset-4 hover:underline">
              {clean(e.title)}
            </Link>
            {marks.length > 0 && <p className="mt-1 text-body-sm font-semibold text-accent-text">{marks.join(" · ")}</p>}
          </li>
        );
      })}
    </ol>
  );
}
