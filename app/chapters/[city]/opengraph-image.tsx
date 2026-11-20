import { ogImage, OG_SIZE } from "@/lib/og";
import { getChapter, getChapters } from "@/lib/data";

export const alt = "Bombay Networking Circle city chapter";
export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export async function generateStaticParams() {
  return (await getChapters()).map((c) => ({ city: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = await getChapter(city);
  return ogImage({
    eyebrow: `${c?.state ?? "India"} · BNC chapter`,
    title: `Meet founders in ${c?.city ?? "your city"}.`,
    footer: "Free, hosted rooms for founders, operators and freelancers",
  });
}
