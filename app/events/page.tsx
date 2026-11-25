import type { Metadata } from "next";
import { getChapters, getEventTotals, getPastEvents, getUpcomingEvents } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { LINKS } from "@/content/site";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs, EmptyState } from "@/components/ui/misc";
import { EventCard } from "@/components/events/event-card";
import { EventFilter } from "@/components/events/event-filter";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { TrackedLink } from "@/components/site/tracked-link";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Founder and startup networking events — upcoming and past",
  ogTitle: "Every Bombay Networking Circle room",
  description: "Every BNC room since September 2025 — city meetups, the Real Estate Room, Power Hour, ice-bath resets, Let's Talk AI and Career Connect across Pune, Mumbai, Delhi NCR, Bengaluru and more. See what's next and register on Luma.",
  path: "/events",
});

export default async function EventsPage() {
  const [chapters, upcoming, past, totals] = await Promise.all([getChapters(), getUpcomingEvents(), getPastEvents(), getEventTotals()]);

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Events", href: "/events" }]} />}
        eyebrow="Events"
        title="What's on."
        lede={`Every BNC room, every city: ${totals.rooms} so far in ${totals.cities} cities and online, ${totals.seats} seats filled on Luma. Registration runs through Luma; each room also has its own page here.`}
      />

      <Section labelledBy="upcoming-title">
        <Container>
          <SectionHeader id="upcoming-title" title="Upcoming" />
          <div className="mt-8">
            <EventFilter events={upcoming} cities={chapters.map((c) => ({ slug: c.slug, city: c.city }))} />
          </div>
        </Container>
      </Section>

      <Section tone="raised" labelledBy="calendar-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader
                id="calendar-title"
                title="The live calendar"
                lede="Luma is where dates go up first and where you register. Subscribe to the calendar to hear about the next room before anyone else."
              />
              <TrackedLink href={LINKS.lumaCalendar} event="rsvp_click" props={{ source: "events-calendar" }} newTab className="mt-6 inline-flex min-h-11 items-center text-body-sm font-semibold text-accent-text underline underline-offset-4">
                Open the calendar on Luma<span className="sr-only"> (opens in a new tab)</span>
              </TrackedLink>
              <div className="mt-10">
                <SubscribeForm variant="newsletter" source="events" label="Get new dates by email" id="events-subscribe" />
              </div>
            </div>
            <div className="lg:col-span-8">
              <iframe
                src={LINKS.lumaEmbed}
                title="Bombay Networking Circle event calendar on Luma"
                loading="lazy"
                className="h-[640px] w-full rounded-lg border border-line bg-bg-card"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="past-title" id="past">
        <Container>
          <SectionHeader id="past-title" title="Past rooms" lede="The archive, newest first. Each room keeps its page: format, speakers, partners, price and photos." />
          {past.length ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState className="mt-8" title="The archive is being added" body="Past events, with dates and photos, are being moved onto this site. The full history is on the Luma calendar above." />
          )}
        </Container>
      </Section>
    </>
  );
}
