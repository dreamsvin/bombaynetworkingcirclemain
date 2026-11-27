import type { Metadata } from "next";
import { STATS } from "@/content/site";
import { getChapters } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { RequestAccessForm } from "@/components/request-access/request-access-form";

export const metadata: Metadata = pageMeta({
  title: "Request Access",
  description: `Free to join. Tell us who you are and what you're building, and we'll match you to a room in your city. ${STATS.items[0].value} members across ${STATS.items[1].value} cities.`,
  path: "/request-access",
});

export default async function RequestAccessPage({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const [{ city }, chapters] = await Promise.all([searchParams, getChapters()]);
  const cities = chapters.map((c) => c.city);
  const initialCity = cities.find((c) => c.toLowerCase() === city?.toLowerCase()) ?? chapters.find((c) => c.slug === city)?.city;

  return (
    <section aria-labelledby="ra-title" className="hr-ra">
      <RequestAccessForm cities={cities} initialCity={initialCity} />
    </section>
  );
}
