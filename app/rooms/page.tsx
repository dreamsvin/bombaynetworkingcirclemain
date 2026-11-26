import type { Metadata } from "next";
import { getChapters, getPastEvents, getUpcomingEvents } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { ClosingBand } from "@/components/ui/bnc";
import { RoomsFilter } from "@/components/rooms/rooms-filter";
import { PrimaryCta } from "@/components/site/primary-cta";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Rooms",
  ogTitle: "Rooms at Bombay Networking Circle",
  description: "Small, hosted rooms built around one theme, in eight Indian cities. About 30 seats each. Members get first access.",
  path: "/rooms",
});

export default async function RoomsPage() {
  const [chapters, upcoming, past] = await Promise.all([getChapters(), getUpcomingEvents(), getPastEvents({ limit: 24 })]);

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Rooms", href: "/rooms" }]} />}
        eyebrow="Rooms"
        title="Small, hosted, built around one theme."
        lede="Members get first access. Each room has about 30 seats, a host and a price shown up front."
      />
      <Section labelledBy="rooms-list-title">
        <Container>
          <h2 id="rooms-list-title" className="sr-only">
            All rooms
          </h2>
          <RoomsFilter upcoming={upcoming} past={past} cities={chapters.map((c) => ({ slug: c.slug, city: c.city }))} />
        </Container>
      </Section>
      <ClosingBand title="Want to be in the next one?" body="Request access and we'll match you to a room in your city.">
        <PrimaryCta size="lg" placement="rooms-closing" />
      </ClosingBand>
    </>
  );
}
