import { ogImage, OG_SIZE } from "@/lib/og";
import { STATS } from "@/content/site";

export const alt = "Bombay Networking Circle — meet the people building in your city";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return ogImage({
    eyebrow: "Curated founder rooms · 8 cities",
    title: "Meet the people building in your city.",
    footer: `${STATS.items[0].value} members · ${STATS.items[1].value} cities · as of ${STATS.asOf}`,
  });
}
