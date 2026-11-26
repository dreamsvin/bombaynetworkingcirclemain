"use client";

import { useState } from "react";
import type { Story } from "@/lib/data";
import { StoryCard } from "@/components/ui/cards";
import { STORY_TYPES } from "@/content/site";
import { cn } from "@/lib/cn";

type TypeKey = keyof typeof STORY_TYPES;
const TYPES: TypeKey[] = ["co-founder", "client", "hire", "investment"];

/** Stories with type chips (Co-founder, Client, Hire, Investment) and a city filter. */
export function StoryFilter({ stories, cities }: { stories: Story[]; cities: { id: string; city: string }[] }) {
  const [city, setCity] = useState("all");
  const [type, setType] = useState<"all" | TypeKey>("all");
  const used = cities.filter((c) => stories.some((s) => s.chapter_id === c.id));
  const shown = stories.filter((s) => (city === "all" || s.chapter_id === city) && (type === "all" || s.story_type === type));
  const name = (id: string | null) => cities.find((c) => c.id === id)?.city;
  const chip = (on: boolean) =>
    cn("inline-flex min-h-11 items-center border-2 px-4 font-mono text-label uppercase", on ? "border-accent bg-accent text-on-accent" : "border-line-strong text-fg");

  return (
    <div>
      <div className="flex flex-wrap items-end gap-6">
        <div role="group" aria-label="Story type" className="flex flex-wrap gap-2">
          {(["all", ...TYPES] as const).map((t) => (
            <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={chip(type === t)}>
              {t === "all" ? "All" : STORY_TYPES[t]}
            </button>
          ))}
        </div>
        {used.length > 0 && (
          <label className="block">
            <span className="mb-1.5 block font-mono text-label uppercase text-brand-text">City</span>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="block min-h-11 border-2 border-line-control bg-bg-card px-3 text-body text-fg">
              <option value="all">All cities</option>
              {used.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.city}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {shown.length ? (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
            <li key={s.id}>
              <StoryCard story={s} city={name(s.chapter_id)} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-body text-fg-muted" aria-live="polite">
          No stories of this kind published yet.
        </p>
      )}
    </div>
  );
}
