import type { Metadata } from "next";
import { MISSION, SITE } from "@/content/site";
import { PHOTOS } from "@/content/photos";
import { pageMeta } from "@/lib/seo";
import { Container, Section } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { Photo } from "@/components/ui/photo";
import { PrimaryCta } from "@/components/site/primary-cta";

export const metadata: Metadata = pageMeta({
  title: "Our story — why founder networking was broken, and what BNC does instead",
  ogTitle: "The system was broken. So we built smaller rooms.",
  description: `${SITE.founder} on why most networking events fail founders, and how Bombay Networking Circle grew from one Mumbai room to eight cities.`,
  path: "/about/story",
  type: "article",
});

export default function StoryPage() {
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
            Bombay Networking Circle started in Mumbai in {SITE.founded} with a few deliberate choices. Keep rooms small. Group people by stage, so a
            first-time founder isn&apos;t lost among people three years ahead. Put a host in the room whose job is introductions. And ask everyone to say,
            in one line, what they need.
          </p>
          <p>
            That last part changes everything. Once an ask is said out loud, the room starts working for you. The host connects you to someone. Someone
            else says &ldquo;I know exactly who you should talk to.&rdquo; The evening ends with introductions instead of business cards.
          </p>
        </article>

        <figure className="my-12">
          <Photo photo={PHOTOS.hero} sizes="(min-width: 768px) 680px, 100vw" ratio="photo" className="rounded-lg" />
          <figcaption className="mt-3 text-caption text-fg-subtle">A BNC evening in Mumbai.</figcaption>
        </figure>

        <article className="prose-bnc">
          <h2>Why joining is free</h2>
          <p>
            Charging for membership changes who comes into the room — and the people who most need a warm introduction are often the ones who can least
            afford a membership fee. Joining BNC stays free. Each room has a price that covers the venue, the host and keeping it small, and sponsors and partners cover the rest — every sponsorship is visible on this site.
          </p>

          <h2>Where it&apos;s going</h2>
          <p>
            Mumbai was the first chapter; other cities asked for the same format, and today there are chapters in eight. The goal is concrete: connect{" "}
            {MISSION.builders} builders across India and catalyse {MISSION.collaborations} collaborations between them. Collaborations, not attendees —
            because that&apos;s the number that means a room did its job.
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
