import { ogImage, OG_SIZE } from "@/lib/og";
import { STATS } from "@/content/site";

export const alt = "Bombay Networking Circle — the right rooms change everything";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    eyebrow: "Free to join · Rooms in 8 cities",
    title: "The right rooms change everything.",
    footer: `${STATS.items[0].value} members · ${STATS.items[1].value} cities · as of ${STATS.asOf}`,
  });
}
