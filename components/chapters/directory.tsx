"use client";

import { useMemo, useState } from "react";
import type { Chapter } from "@/lib/data";
import { ChapterCard } from "@/components/ui/cards";
import { EmptyState } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { Search } from "@/components/ui/icons";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/** Searchable, filterable chapter directory. Cards are server-provided data; filtering is client-side. */
export function ChapterDirectory({ chapters, nextEvents }: { chapters: Chapter[]; nextEvents: Record<string, string | null> }) {
  const [q, setQ] = useState("");
  const [state, setState] = useState<string>("All");
  const states = useMemo(() => ["All", ...Array.from(new Set(chapters.map((c) => c.state))).sort()], [chapters]);

  const shown = chapters.filter(
    (c) => (state === "All" || c.state === state) && (!q.trim() || `${c.city} ${c.state}`.toLowerCase().includes(q.trim().toLowerCase())),
  );

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="w-full md:max-w-sm">
          <label htmlFor="chapter-search" className="mb-1.5 block text-body-sm font-semibold text-fg">
            Search cities
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle" />
            <input
              id="chapter-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. Pune"
              autoComplete="off"
              className="block min-h-11 w-full rounded-full border border-line-control bg-bg-card pl-10 pr-4 text-body text-fg placeholder:text-fg-subtle"
            />
          </div>
        </div>
        <fieldset>
          <legend className="mb-1.5 text-body-sm font-semibold text-fg">State</legend>
          <div className="flex flex-wrap gap-2">
            {states.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={state === s}
                onClick={() => setState(s)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-body-sm transition-colors duration-fast",
                  state === s ? "border-fg bg-fg text-bg" : "border-line-control text-fg hover:border-fg",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="mt-6 text-body-sm text-fg-muted" aria-live="polite">
        {shown.length} of {chapters.length} chapters
      </p>

      {shown.length ? (
        <ul
          className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          onClickCapture={(e) => {
            const el = (e.target as HTMLElement).closest<HTMLElement>("[data-city]");
            if (el?.dataset.city) track("city_select", { city: el.dataset.city, from: "directory" });
          }}
        >
          {shown.map((c) => (
            <li key={c.slug}>
              <ChapterCard chapter={c} nextEvent={nextEvents[c.slug]} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-4"
          title={q ? `No chapter in “${q}” yet` : "No chapters match"}
          body="Come to the nearest chapter's events in the meantime — or bring BNC to your city."
        >
          <ButtonLink href="/chapters/start" variant="secondary">
            Start a chapter{q ? ` in ${q}` : ""}
          </ButtonLink>
        </EmptyState>
      )}
    </div>
  );
}
