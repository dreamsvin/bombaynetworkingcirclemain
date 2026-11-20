import type { Chapter } from "@/lib/data";

/**
 * Schematic chapter map: cities plotted by latitude/longitude on a plain graticule.
 * Deliberately no country outline — an inaccurate border is worse than none, and the dots alone show the spread.
 * Every dot is a real link to its chapter page, so the map is keyboard- and screen-reader-navigable.
 */
const BOUNDS = { west: 70.5, east: 80.5, south: 11.5, north: 30 };
const W = 440;
const H = 720;

const x = (lon: number) => ((lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
const y = (lat: number) => ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;

/** Label side per city, to keep the west-coast cluster legible. Unknown cities default to the right. */
const LEFT = new Set(["mumbai", "surat", "hyderabad", "bangalore"]);

export function CityMap({ chapters, className }: { chapters: Chapter[]; className?: string }) {
  const plotted = chapters.filter((c) => c.latitude != null && c.longitude != null);
  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-labelledby="city-map-title" className="h-auto w-full">
        <title id="city-map-title">Map of Bombay Networking Circle chapters</title>
        {/* graticule */}
        <g stroke="var(--line)" strokeWidth="1" aria-hidden="true">
          {[72, 74, 76, 78, 80].map((lon) => (
            <line key={`lon${lon}`} x1={x(lon)} x2={x(lon)} y1={0} y2={H} />
          ))}
          {[12, 16, 20, 24, 28].map((lat) => (
            <line key={`lat${lat}`} y1={y(lat)} y2={y(lat)} x1={0} x2={W} />
          ))}
        </g>
        <g fill="var(--fg-subtle)" fontSize="11" aria-hidden="true">
          {[12, 16, 20, 24, 28].map((lat) => (
            <text key={`t${lat}`} x={4} y={y(lat) - 4}>
              {lat}°N
            </text>
          ))}
        </g>
        {plotted.map((c) => {
          const cx = x(Number(c.longitude));
          const cy = y(Number(c.latitude));
          const left = LEFT.has(c.slug);
          const gap = c.is_flagship ? 24 : 14;
          return (
            <a key={c.slug} href={`/chapters/${c.slug}`} data-city={c.slug} className="group outline-none">
              <title>{`${c.city} chapter${c.is_flagship ? " (flagship)" : ""}`}</title>
              {/* generous invisible hit area */}
              <circle cx={cx} cy={cy} r={22} fill="transparent" />
              <circle cx={cx} cy={cy} r={c.is_flagship ? 9 : 6} fill={c.is_flagship ? "var(--accent)" : "var(--fg)"} className="transition-[r] duration-base group-hover:opacity-80" />
              {c.is_flagship && <circle cx={cx} cy={cy} r={16} fill="none" stroke="var(--accent)" strokeWidth="1.5" />}
              <circle cx={cx} cy={cy} r={20} fill="none" stroke="var(--focus)" strokeWidth="2" className="opacity-0 group-focus-visible:opacity-100" />
              <text
                x={left ? cx - gap : cx + gap}
                y={cy + 5}
                textAnchor={left ? "end" : "start"}
                fontSize="16"
                fontWeight={c.is_flagship ? 700 : 500}
                fill="var(--fg)"
                className="group-hover:underline"
              >
                {c.city}
              </text>
            </a>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-caption text-fg-subtle">
        {plotted.length} chapters. Positions are plotted by latitude and longitude; the larger ring marks Mumbai, the flagship.
      </figcaption>
    </figure>
  );
}
