import { PRIMARY_CTA } from "@/content/site";
import { buttonClass, type ButtonSize } from "@/components/ui/button";
import { TrackedLink } from "./tracked-link";

/** The one primary CTA. Same words, same destination, everywhere. `city` pre-fills the request form. */
export function PrimaryCta({ size = "md", placement, className, city }: { size?: ButtonSize; placement: string; className?: string; city?: string }) {
  const href = city ? `${PRIMARY_CTA.href}?city=${encodeURIComponent(city)}` : PRIMARY_CTA.href;
  return (
    <TrackedLink href={href} event="cta_click" props={{ placement }} className={buttonClass("primary", size, className)}>
      {PRIMARY_CTA.label}
    </TrackedLink>
  );
}
