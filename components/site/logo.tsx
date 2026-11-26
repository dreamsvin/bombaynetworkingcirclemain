import Link from "next/link";
import { BNC_LOGO } from "./logo-paths";
import { cn } from "@/lib/cn";

/** Main logo: the round "Bombay Networking Circle" seal with the steaming cup, in brand brown. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex min-h-11 items-center text-brand", className)} aria-label="Bombay Networking Circle — home">
      <svg viewBox={BNC_LOGO.viewBox} className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" aria-hidden="true" focusable="false">
        <path d={BNC_LOGO.d} fill="currentColor" fillRule="evenodd" />
      </svg>
    </Link>
  );
}

/** The same logo at any size (footer, about). Colour comes from the text colour. */
export function Seal({ className, title = "Bombay Networking Circle" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={BNC_LOGO.viewBox} className={className} role="img" aria-label={title}>
      <path d={BNC_LOGO.d} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
