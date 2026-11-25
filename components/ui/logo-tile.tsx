import Image from "next/image";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { PlaceholderBadge } from "./placeholder-badge";
import { cn } from "@/lib/cn";

/**
 * Sponsor/partner mark at a consistent height. Partners without a supplied logo file render as a name tile — we never
 * redraw or borrow someone's logo. `compact` is the pill used in strips.
 */
export function LogoTile({ name, logo, compact = false }: { name: string; logo: string | null; compact?: boolean }) {
  const label = clean(name);
  if (compact) {
    return (
      <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-bg-card px-4 text-body-sm font-semibold text-fg">
        {logo && <Image src={logo} alt="" width={28} height={28} className="h-7 w-7 object-contain" />}
        {label}
      </span>
    );
  }
  return (
    <figure className="flex flex-col items-center gap-2">
      {logo ? (
        <Image src={logo} alt={label} width={160} height={160} className="h-16 w-auto rounded-md object-contain" />
      ) : (
        <span className={cn("flex min-h-16 items-center rounded-md border border-line bg-bg-card px-4 text-center font-display text-heading-sm text-fg")}>{label}</span>
      )}
      {logo && <figcaption className="text-caption text-fg-subtle">{label}</figcaption>}
      {isPlaceholder({ name }) && (
        <figcaption>
          <PlaceholderBadge />
        </figcaption>
      )}
    </figure>
  );
}
