import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { STATS } from "@/content/site";
import type { EventWithChapter } from "@/lib/data";
import { fmtDate } from "@/lib/format";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { PlaceholderBadge } from "./placeholder-badge";
import { SplitWords } from "@/components/motion/split-words";

/* ───────── Chip: sky/navy (default), outline, or active (navy fill) ───────── */
export function Chip({ children, variant = "sky", className }: { children: ReactNode; variant?: "sky" | "outline" | "active"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center px-3 font-mono text-label uppercase",
        variant === "sky" && "bg-support-tint text-on-support-tint",
        variant === "outline" && "border-2 border-line-strong text-fg",
        variant === "active" && "border-2 border-accent bg-accent text-on-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ───────── Stat line: the verified figures, always with their as-of date ───────── */
export function StatLine({ className, items = STATS.items.slice(0, 2) }: { className?: string; items?: readonly { value: string; label: string }[] }) {
  return (
    <p className={cn("font-mono text-label uppercase text-fg-muted", className)}>
      {items.map((s) => `${s.value} ${s.label}`).join(" · ")} · <span className="text-fg-subtle">as of {STATS.asOf}</span>
    </p>
  );
}

/* ───────── Numbered rows: large serif numerals 01–04, hairline columns ───────── */
export function NumberedRows({
  items,
  className,
  columns = 4,
  headingAs: H = "h3",
}: {
  items: readonly { title: string; body: ReactNode }[];
  className?: string;
  columns?: 2 | 3 | 4;
  headingAs?: "h2" | "h3";
}) {
  return (
    <ol
      className={cn(
        "grid border-t-2 border-line-strong",
        columns === 4 && "md:grid-cols-2 lg:grid-cols-4",
        columns === 3 && "md:grid-cols-3",
        columns === 2 && "md:grid-cols-2",
        className,
      )}
    >
      {items.map((it, i) => (
        <li
          key={it.title}
          data-reveal
          style={{ "--d": `${i * 110}ms` } as React.CSSProperties}
          className="group border-b-2 border-line-strong py-8 md:border-r-2 md:px-6 md:first:pl-0 md:last:border-r-0"
        >
          <span className="block font-display text-display-md leading-none text-brand-text transition-transform duration-moderate ease-out group-hover:-translate-y-1">
            {String(i + 1).padStart(2, "0")}
          </span>
          <H className="mt-6 text-heading-md text-fg">{it.title}</H>
          <div className="mt-2 text-body text-fg-muted">{it.body}</div>
        </li>
      ))}
    </ol>
  );
}

/** "₹1,500" when set; otherwise the honest fallback. */
export const priceLabel = (price: number | null) => (price != null ? `₹${price.toLocaleString("en-IN")}` : "Price on invite");

/* ───────── Room card: brown band, title, date, seats chip, theme · price, Details ───────── */
export function RoomCard({ room, headingAs: H = "h3" }: { room: EventWithChapter; headingAs?: "h2" | "h3" }) {
  return (
    <article className="group relative flex h-full flex-col border-2 border-line-strong bg-bg-card transition-transform duration-moderate ease-out hover:-translate-y-1">
      <div data-tone="brown" className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="font-mono text-label uppercase">{room.chapter.city}</span>
        {room.capacity && <span className="font-mono text-label uppercase">{room.capacity} seats</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {isPlaceholder(room) && <PlaceholderBadge className="mb-2 self-start" />}
        <H className="font-display text-heading-lg font-regular leading-tight text-fg">
          <Link href={`/rooms/${room.slug}`} className="after:absolute after:inset-0">
            {clean(room.title)}
          </Link>
        </H>
        <p className="mt-2 text-body-sm text-fg-muted">
          <time dateTime={room.starts_at}>{fmtDate(room.starts_at)}</time>
        </p>
        <p className="mt-3 text-body-sm text-fg">
          {room.theme ? clean(room.theme) : "Theme to be announced"} · <strong>{priceLabel(room.price_inr)}</strong>
        </p>
        <span className="mt-auto pt-5 text-body-sm font-semibold text-accent-text">
          Details <span className="nudge">→</span>
        </span>
      </div>
    </article>
  );
}

/* ───────── Closing band on brown: every page ends with a path to the CTA ───────── */
export function ClosingBand({ title, body, children, id = "closing" }: { title: ReactNode; body?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section data-tone="brown" aria-labelledby={id} className="relative overflow-hidden border-b-2 border-line-strong py-section">
      <div className="mx-auto w-full max-w-container px-gutter">
        {typeof title === "string" ? (
          <SplitWords id={id} text={title} className="max-w-4xl font-display text-display-xl text-fg" />
        ) : (
          <h2 id={id} className="max-w-4xl font-display text-display-xl text-fg">
            {title}
          </h2>
        )}
        <div data-reveal className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between" style={{ "--d": "300ms" } as React.CSSProperties}>
          {body && <p className="max-w-measure text-body-lg text-fg-muted">{body}</p>}
          <div className="flex flex-wrap items-center gap-4">{children}</div>
        </div>
      </div>
    </section>
  );
}
