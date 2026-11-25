import type { Metadata } from "next";
import { MISSION, SITE, STATS } from "@/content/site";
import { MEDIA } from "@/content/media";
import { getAllEvents } from "@/lib/data";
import { Timeline } from "@/components/events/timeline";
import { pageMeta } from "@/lib/seo";
import { Container, Section } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { Photo } from "@/components/ui/photo";
import { PrimaryCta } from "@/components/site/primary-cta";

export const metadata: Metadata = pageMeta({
  title: "Our story — why founder networking was broken, and what BNC does instead",
  ogTitle: "The system was broken. So we built smaller rooms.",
  description: `${SITE.founder} on why most networking events fail founders, and how Bombay Networking Circle grew to 20+ rooms in eight cities.`,
  path: "/about/story",
  type: "article",
});

export default async function StoryPage() {
  const events = await getAllEvents();
  return (
    <Section size="sm">
      <Container narrow>
        <Breadcrumbs items={[{ label: "About", href: "/about" }, { label: "Our story", href: "/about/story" }]} />
        <p className="mt-10 text-label uppercase text-fg-subtle">Our story · by {SITE.founder}</p>
        <h1 className="mt-4 font-display text-display-lg text-fg">The system was broken. So we built smaller rooms.</h1>

        <article className="prose-bnc mt-10">
          <p>
            After graduating I assumed I&apos;d go into pharmacy, or help run my father&apos;s surgical business. Instead I ended up in business
            development, working closely with JITO — one of the largest business foundations in the Jain community — and eventually serving as National
            Convenor of JIIF, its incubation and innovation initiative, across more than 80 chapters.
          </p>
          <p>That work put me in front of hundreds of founders, creators and business owners every month. And I kept seeing the same thing.</p>

          <h2>What was broken</h2>
          <p>
            Networking, as most events practise it, is built for volume. The measure of success is how many people came, how many cards changed hands,
            how many logos were on the banner. None of that is what a founder actually needs.
          </p>
          <p>
            A founder needs one specific person: the engineer who&apos;ll co-found, the first enterprise client, the operator who solved this problem last
            year. In a hall of three hundred, the odds of finding that person are close to zero — and the format actively works against it. Everyone is
            pitching. Nobody is listening for the ask.
          </p>
          <blockquote>
            <p>The problem wasn&apos;t that people didn&apos;t want to help each other. It was that the room made it impossible.</p>
          </blockquote>

          <h2>What we do instead</h2>
          <p>
            Bombay Networking Circle started in {SITE.founded} with a few deliberate choices. Keep rooms small. Group people by stage, so a
            first-time founder isn&apos;t lost among people three years ahead. Put a host in the room whose job is introductions. And ask everyone to say,
            in one line, what they need.
          </p>
          <p>
            That last part changes everything. Once an ask is said out loud, the room starts working for you. The host connects you to someone. Someone
            else says &ldquo;I know exactly who you should talk to.&rdquo; The evening ends with introductions instead of business cards.
          </p>
        </article>

        <figure className="my-12">
          <Photo photo={MEDIA.delhi_room} sizes="(min-width: 768px) 680px, 100vw" ratio="photo" className="rounded-lg" />
          <figcaption className="mt-3 text-caption text-fg-subtle">Career Connect – Delhi, Masters&apos; Union, Gurugram, January 2026.</figcaption>
        </figure>

        <article className="prose-bnc">
          <h2>Why there&apos;s no membership fee</h2>
          <p>
            Charging for membership changes who comes into the room — and the people who most need a warm introduction are often the ones who can least
            afford a membership fee. Joining BNC costs nothing. Individual rooms carry a small ticket, usually ₹399–₹999, that pays for the venue, the
            coffee and the curation; partners host and co-promote, and every partner is named on this site.
          </p>

          <h2>The journey so far</h2>
          <p>
            The first room on the calendar was a café in Pune in September 2025. Within three months there were rooms in Hyderabad, Nashik, Surat and
            Delhi; by spring 2026, Ahmedabad and Bengaluru. Along the way BNC tried new formats — a weekly Power Hour, ice-bath resets, a pitch
            competition in an ice bath, an AI meetup, and an invite-only Real Estate Room in Lower Parel. That&apos;s {STATS.items[2].value} rooms and{" "}
            {STATS.items[3].value} seats filled on Luma, as of {STATS.asOf}.
          </p>
        </article>

        <div className="my-10">
          <Timeline events={events} />
        </div>

        <article className="prose-bnc">
          <h2>Where it&apos;s going</h2>
          <p>
            The goal is concrete: connect {MISSION.builders} builders across India and catalyse {MISSION.collaborations} collaborations between them.
            Collaborations, not attendees — because that&apos;s the number that means a room did its job. {MISSION.vision}
          </p>
          <p>If that sounds like the kind of room you&apos;ve been looking for, come to one.</p>
        </article>

        <div className="mt-12 border-t border-line pt-8">
          <PrimaryCta size="lg" placement="story-page" />
        </div>
      </Container>
    </Section>
  );
}
