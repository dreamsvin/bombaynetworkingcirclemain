import Link from "next/link";
import { CUP, SEAL } from "./logo-paths";
import { cn } from "@/lib/cn";

/** Header lockup: the cup mark from the official seal + the name set in the display face. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex min-h-11 items-center gap-2.5 rounded-md text-fg", className)} aria-label="Bombay Networking Circle — home">
      <svg viewBox={CUP.viewBox} className="h-8 w-8 shrink-0 text-accent-text" aria-hidden="true" focusable="false">
        <path d={CUP.d} fill="currentColor" fillRule="evenodd" />
      </svg>
      <span className="font-display text-heading-sm font-medium leading-none tracking-tight">
        <span className="hidden sm:inline">Bombay Networking Circle</span>
        <span className="sm:hidden" aria-hidden="true">BNC</span>
      </span>
    </Link>
  );
}

/** The full round seal (footer, about). */
export function Seal({ className, title = "Bombay Networking Circle seal" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={SEAL.viewBox} className={className} role="img" aria-label={title}>
      <path d={SEAL.d} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
