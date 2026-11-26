import type { Metadata } from "next";
import { NEXT_STEPS, STATS } from "@/content/site";
import { getChapters } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Eyebrow } from "@/components/ui/layout";
import { StatLine } from "@/components/ui/bnc";
import { RequestAccessForm } from "@/components/request-access/request-access-form";

export const metadata: Metadata = pageMeta({
  title: "Request access",
  description: `Free to join. Tell us who you are and what you're building, and we'll match you to a room in your city. ${STATS.items[0].value} members across ${STATS.items[1].value} cities.`,
  path: "/request-access",
});

export default async function RequestAccessPage({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const [{ city }, chapters] = await Promise.all([searchParams, getChapters()]);
  const cities = chapters.map((c) => c.city);
  const initialCity = cities.find((c) => c.toLowerCase() === city?.toLowerCase()) ?? chapters.find((c) => c.slug === city)?.city;

  return (
    <section aria-labelledby="ra-title" data-tone="sand" className="border-b-2 border-line-strong py-10 sm:py-14">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>Request access</Eyebrow>
          <h1 id="ra-title" className="mt-3 font-display text-display-lg text-fg">
            Tell us who you are. We&rsquo;ll find your room.
          </h1>
          <p className="mt-5 text-body-lg text-fg-muted">
            Joining BNC is free. Your answers let us match you to a room in your city with the right people in it. Rooms are paid, and every invite shows the price.
          </p>
          <ul className="mt-8 border-t-2 border-line-strong">
            {[
              "Takes about three minutes.",
              "A person reads every request.",
              "Your details are never shown publicly or shared.",
              ...NEXT_STEPS.slice(1, 2).map((s) => s.body),
            ].map((t) => (
              <li key={t} className="border-b-2 border-line-strong py-3 text-body-sm text-fg">
                {t}
              </li>
            ))}
          </ul>
          <StatLine className="mt-6" />
        </div>
        <div className="lg:col-span-7">
          <RequestAccessForm cities={cities} initialCity={initialCity} />
        </div>
      </Container>
    </section>
  );
}
