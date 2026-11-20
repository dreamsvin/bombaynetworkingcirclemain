import Image from "next/image";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { PlaceholderBadge } from "./placeholder-badge";

/** Sponsor/partner logo at a consistent height. Logos are 320px-wide WebP from scripts/fetch-photos.mjs. */
export function LogoTile({ name, logo }: { name: string; logo: string | null }) {
  const label = clean(name);
  return (
    <figure className="flex flex-col items-center gap-2">
      {logo ? (
        <Image src={logo} alt={label} width={160} height={160} className="h-16 w-auto rounded-md object-contain" />
      ) : (
        <span className="text-heading-sm text-fg">{label}</span>
      )}
      {isPlaceholder({ name }) && (
        <figcaption>
          <PlaceholderBadge />
        </figcaption>
      )}
    </figure>
  );
}
