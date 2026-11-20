import { cn } from "@/lib/cn";

/** Shown on any row that still contains placeholder content (preview builds only). */
export function PlaceholderBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-sm border border-danger px-2 py-0.5 text-label uppercase text-danger", className)}>
      Placeholder
    </span>
  );
}
