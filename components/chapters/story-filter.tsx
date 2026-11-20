"use client";

import { useState } from "react";
import type { Story } from "@/lib/data";
import { StoryCard } from "@/components/ui/cards";
import { cn } from "@/lib/cn";

export function StoryFilter({ stories, cities }: { stories: Story[]; cities: { id: string; city: string }[] }) {
  const [city, setCity] = useState("all");
  const used = cities.filter((c) => stories.some((s) => s.chapter_id === c.id));
  const shown = stories.filter((s) => city === "all" || s.chapter_id === city);
  const name = (id: string | null) => cities.find((c) => c.id === id)?.city;
  return (
    <div>
      {used.length > 1 && (
        <fieldset>
          <legend className="mb-2 text-body-sm font-semibold text-fg">Filter by city</legend>
          <div className="flex flex-wrap gap-2">
            {[{ id: "all", city: "All cities" }, ...used].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={city === c.id}
                onClick={() => setCity(c.id)}
                className={cn("min-h-11 rounded-full border px-4 text-body-sm", city === c.id ? "border-fg bg-fg text-bg" : "border-line-control text-fg hover:border-fg")}
              >
                {c.city}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => (
          <li key={s.id}>
            <StoryCard story={s} city={name(s.chapter_id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
