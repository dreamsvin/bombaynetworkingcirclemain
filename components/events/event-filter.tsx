"use client";

import { useState } from "react";
import type { EventWithChapter } from "@/lib/data";
import { FORMATS, type FormatKey } from "@/content/site";
import { EventListItem } from "@/components/ui/event-list-item";
import { SelectField } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/misc";
import { track } from "@/lib/analytics";
import Link from "next/link";

/** Upcoming events with city + format filters. City options come from the chapters table. */
export function EventFilter({ events, cities }: { events: EventWithChapter[]; cities: { slug: string; city: string }[] }) {
  const [city, setCity] = useState("all");
  const [format, setFormat] = useState("all");
  const shown = events.filter((e) => (city === "all" || e.chapter.slug === city) && (format === "all" || e.format === format));
  const cityName = cities.find((c) => c.slug === city)?.city;

  if (!events.length) {
    return (
      <EmptyState
        title="No dates listed on this page yet"
        body="New BNC dates go up on the live Luma calendar first — it's embedded below. Pick your city to get notified when its next room opens."
      >
        <Link href="/chapters" className="text-body-sm font-semibold text-accent-text underline underline-offset-4">
          Choose your city
        </Link>
      </EmptyState>
    );
  }

  return (
    <div>
      <div className="grid gap-4 sm:max-w-xl sm:grid-cols-2">
        <SelectField
          label="City"
          name="filter-city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            if (e.target.value !== "all") track("city_select", { city: e.target.value, from: "events-filter" });
          }}
          options={[{ value: "all", label: "All cities" }, ...cities.map((c) => ({ value: c.slug, label: c.city }))]}
        />
        <SelectField
          label="Format"
          name="filter-format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          options={[{ value: "all", label: "All formats" }, ...(Object.keys(FORMATS) as FormatKey[]).map((k) => ({ value: k, label: FORMATS[k].label }))]}
        />
      </div>
      <p className="mt-6 text-body-sm text-fg-muted" aria-live="polite">
        {shown.length} upcoming {shown.length === 1 ? "event" : "events"}
        {cityName ? ` in ${cityName}` : ""}
      </p>
      {shown.length ? (
        <ul className="mt-4 border-t border-line">
          {shown.map((e) => (
            <EventListItem key={e.id} event={e} />
          ))}
        </ul>
      ) : (
        <EmptyState className="mt-4" title={`Nothing listed${cityName ? ` in ${cityName}` : ""} for this filter yet`} body="New dates go up on the Luma calendar below first. You can also get notified from the city page.">
          {city !== "all" && (
            <Link href={`/chapters/${city}`} className="text-body-sm font-semibold text-accent-text underline underline-offset-4">
              Get notified for {cityName}
            </Link>
          )}
        </EmptyState>
      )}
    </div>
  );
}
