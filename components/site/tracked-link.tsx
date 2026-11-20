"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track, type FunnelEvent } from "@/lib/analytics";

/** A link that records one funnel event on click. External links open in the same tab unless `newTab`. */
export function TrackedLink({
  event,
  props,
  newTab = false,
  ...rest
}: ComponentProps<typeof Link> & { event: FunnelEvent; props?: Record<string, string | number | boolean | null>; newTab?: boolean }) {
  return (
    <Link
      {...rest}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => {
        track(event, props);
        rest.onClick?.(e);
      }}
    />
  );
}
