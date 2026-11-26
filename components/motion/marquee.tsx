import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Endless horizontal strip. Content is rendered twice; the copy is hidden from assistive tech. */
export function Marquee({ children, className, duration = 40 }: { children: ReactNode; className?: string; duration?: number }) {
  return (
    <div className={cn("marquee", className)} style={{ "--marquee-dur": `${duration}s` } as React.CSSProperties}>
      <div className="marquee__track">{children}</div>
      <div className="marquee__track" aria-hidden="true" inert>
        {children}
      </div>
    </div>
  );
}
