"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

/** Records `city_select` for any click on an element with data-city inside it (cards, map dots, filters). */
export function CityTracker({ children, from, className }: { children: ReactNode; from: string; className?: string }) {
  return (
    <div
      className={className}
      onClickCapture={(e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>("[data-city]");
        if (el?.dataset.city) track("city_select", { city: el.dataset.city, from });
      }}
    >
      {children}
    </div>
  );
}
