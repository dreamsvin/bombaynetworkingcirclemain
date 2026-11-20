import { PRIMARY_CTA } from "@/content/site";
import { buttonClass, type ButtonSize } from "@/components/ui/button";
import { TrackedLink } from "./tracked-link";
import { ArrowRight } from "@/components/ui/icons";

/** The one primary CTA. Same words, same destination, everywhere. */
export function PrimaryCta({ size = "md", placement, className }: { size?: ButtonSize; placement: string; className?: string }) {
  return (
    <TrackedLink href={PRIMARY_CTA.href} event="cta_click" props={{ placement }} className={buttonClass("primary", size, className)}>
      {PRIMARY_CTA.label}
      <ArrowRight width={18} height={18} />
    </TrackedLink>
  );
}
