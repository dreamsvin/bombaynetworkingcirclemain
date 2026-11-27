"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { InView } from "./in-view";

export type CityPin = { slug: string; city: string; tag: string; lat: number | null; lng: number | null; flagship: boolean };

// Rough equirectangular projection of peninsular India into a 440-unit circle. Centre ≈ 20.6°N 75.3°E.
const project = (lat: number, lng: number) => ({ x: 220 + (lng - 75.3) * 21, y: 220 - (lat - 20.6) * 21 });

/** Home §8. City list beside a circular map; hovering or focusing a city lights its dot. */
export function CityLights({ cities }: { cities: CityPin[] }) {
  const [active, setActive] = useState<string | null>(null);
  const pinned = cities.filter((c) => c.lat != null && c.lng != null);
  return (
    <>
      <div className="hr-cities-list">
        <h2 id="cities-title" className="hr-d2">
          The circle moves across cities.
        </h2>
        {cities.map((c) => (
          <Link
            key={c.slug}
            href={`/chapters/${c.slug}`}
            className="hr-city-row"
            onMouseEnter={() => setActive(c.slug)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(c.slug)}
            onBlur={() => setActive(null)}
          >
            <span className="hr-city-name">{c.city}</span>
            <span className="hr-city-tag">{c.tag}</span>
          </Link>
        ))}
      </div>
      <InView className="hr-cities-map" ariaHidden>
        <svg viewBox="0 0 440 440">
          <rect className="hr-map-ring" x="10" y="10" width="420" height="420" rx="6" />
          <path d="M10 220H430M220 10V430" stroke="var(--hr-rule)" strokeDasharray="2 6" />
          {pinned.map((c, i) => {
            const { x, y } = project(c.lat!, c.lng!);
            // Labels go left for the west-coast cluster so they don't collide.
            const left = c.lng! < 73.5;
            return (
              <g key={c.slug} data-active={active === c.slug} style={{ "--i": i } as CSSProperties}>
                <circle className="hr-map-glow" cx={x} cy={y} r="16" />
                <circle className="hr-map-dot" cx={x} cy={y} r={c.flagship ? 7 : 4.5} />
                <text x={left ? x - 12 : x + 12} y={y + 4} textAnchor={left ? "end" : "start"}>
                  {c.city}
                </text>
              </g>
            );
          })}
        </svg>
      </InView>
    </>
  );
}
