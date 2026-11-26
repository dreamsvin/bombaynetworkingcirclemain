"use client";

import { useState } from "react";
import type { EventWithChapter } from "@/lib/data";
import { RoomCard } from "@/components/ui/bnc";
import { EmptyState } from "@/components/ui/misc";
import { PRIMARY_CTA } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/** Rooms list with Upcoming/Past and City filters. City options come from the chapters table. */
export function RoomsFilter({ upcoming, past, cities }: { upcoming: EventWithChapter[]; past: EventWithChapter[]; cities: { slug: string; city: string }[] }) {
  const [when, setWhen] = useState<"upcoming" | "past">("upcoming");
  const [city, setCity] = useState("all");
  const list = (when === "upcoming" ? upcoming : past).filter((r) => city === "all" || r.chapter.slug === city);
  const cityName = cities.find((c) => c.slug === city)?.city;

  const chip = (on: boolean) =>
    cn("inline-flex min-h-11 items-center border-2 px-4 font-mono text-label uppercase", on ? "border-accent bg-accent text-on-accent" : "border-line-strong text-fg");

  return (
    <div>
      <div className="flex flex-wrap items-end gap-6">
        <div role="group" aria-label="When" className="flex gap-2">
          {(["upcoming", "past"] as const).map((w) => (
            <button key={w} type="button" aria-pressed={when === w} onClick={() => setWhen(w)} className={chip(when === w)}>
              {w === "upcoming" ? "Upcoming" : "Past"}
            </button>
          ))}
        </div>
        <label className="block">
          <span className="mb-1.5 block font-mono text-label uppercase text-brand-text">City</span>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (e.target.value !== "all") track("city_select", { city: e.target.value, from: "rooms-filter" });
            }}
            className="block min-h-11 border-2 border-line-control bg-bg-card px-3 text-body text-fg"
          >
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.city}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-6 text-body-sm text-fg-muted" aria-live="polite">
        {list.length} {when} {list.length === 1 ? "room" : "rooms"}
        {cityName ? ` in ${cityName}` : ""}
      </p>
      {list.length ? (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <li key={r.id}>
              <RoomCard room={r} headingAs="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-4"
          headingAs="h2"
          title={when === "upcoming" ? `Next dates${cityName ? ` in ${cityName}` : ""} are being set` : "The archive is being added"}
          body={when === "upcoming" ? "Request access and tell us your city. Members hear about new rooms first." : "Past rooms are being moved onto this site."}
        >
          {when === "upcoming" && (
            <ButtonLink href={cityName ? `${PRIMARY_CTA.href}?city=${encodeURIComponent(cityName)}` : PRIMARY_CTA.href}>{PRIMARY_CTA.label}</ButtonLink>
          )}
        </EmptyState>
      )}
    </div>
  );
}
