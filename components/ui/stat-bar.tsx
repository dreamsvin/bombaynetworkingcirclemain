import { STATS } from "@/content/site";
import { cn } from "@/lib/cn";

/** Stats always render with their as-of line. */
export function StatBar({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={className}>
      <dl className={cn("grid grid-cols-2 gap-y-8 border-t border-line pt-8 md:grid-cols-4", compact && "gap-y-6 pt-6")}>
        {STATS.items.map((s) => (
          <div key={s.label} className="pr-4">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className={cn("block font-display text-fg", compact ? "text-display-md" : "text-display-lg")}>{s.value}</span>
              <span className="mt-1 block text-body-sm text-fg-muted" aria-hidden="true">
                {s.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-caption text-fg-subtle">
        As of {STATS.asOf}. {STATS.source}
      </p>
    </div>
  );
}
