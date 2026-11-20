import type { Metadata } from "next";
import { getChapters, getPastEvents, getUpcomingEvents } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { LINKS } from "@/content/site";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs, EmptyState } from "@/components/ui/misc";
import { EventListItem } from "@/components/ui/event-list-item";
import { EventFilter } from "@/components/events/event-filter";
import { SubscribeForm } from "@/components/forms/subscribe-form";
import { TrackedLink } from "@/components/site/tracked-link";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Upcoming founder and startup networking events",
  ogTitle: "What's on at Bombay Networking Circle",
  description: "Upcoming BNC events across Mumbai, Bangalore, Delhi NCR, Pune and more: founder networking, startup conversations, pitch sessions and workshops. Filter by city and RSVP.",
  path: "/events",
});

export default async function EventsPage() {
  const [chapters, upcoming, past] = await Promise.all([getChapters(), getUpcomingEvents(), getPastEvents({ limit: 12 })]);

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Events", href: "/events" }]} />}
        eyebrow="Events"
        title="What's on."
        lede="Every BNC event, every city. RSVPs run through Luma; each event also has its own page here with the full details."
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
                lede="Luma is where dates go up first and where you RSVP. This is the same calendar, embedded."
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
          <SectionHeader id="past-title" title="Past events" lede="The archive. Each past event keeps its page." />
          {past.length ? (
            <ul className="mt-8 border-t border-line">
              {past.map((e) => (
                <EventListItem key={e.id} event={e} past />
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
