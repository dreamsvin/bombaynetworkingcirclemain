import type { Metadata } from "next";
import Link from "next/link";
import { getChapters, getStories } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader } from "@/components/ui/layout";
import { Breadcrumbs, EmptyState } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { ClosingBand } from "@/components/ui/bnc";
import { PrimaryCta } from "@/components/site/primary-cta";
import { StoryFilter } from "@/components/chapters/story-filter";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "The Circle in Motion — member stories",
  ogTitle: "The Circle in Motion",
  description: "Co-founders, first hires and first clients that started in a Bombay Networking Circle room — told by the members, published with their consent.",
  path: "/stories",
});

export default async function StoriesPage() {
  const [stories, chapters] = await Promise.all([getStories(), getChapters()]);
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Stories", href: "/stories" }]} />}
        eyebrow="Stories"
        title="The Circle in Motion."
        lede="Co-founders, clients, hires and investments that started in a BNC room. Every story names the people, the connection and what happened next — published with both members' consent."
      />
      <Section labelledBy="stories-list">
        <Container>
          <h2 id="stories-list" className="sr-only">
            All stories
          </h2>
          {stories.length ? (
            <StoryFilter stories={stories} cities={chapters.map((c) => ({ id: c.id, city: c.city }))} />
          ) : (
            <EmptyState
              title="The first stories are being collected"
              body={
                <>
                  We publish a story only after the people in it have agreed in writing — so this page fills slowly, and every story on it is true. Did
                  a BNC introduction lead somewhere for you?
                </>
              }
            >
              <ButtonLink href="/contact" variant="secondary">
                Tell us your story
              </ButtonLink>
              <Link href="/rooms" className="text-body-sm font-semibold text-fg underline underline-offset-4">
                Or come to a room and start one
              </Link>
            </EmptyState>
          )}
        </Container>
      </Section>
      <ClosingBand title="Your next connection is in a room.">
        <PrimaryCta size="lg" placement="stories-closing" />
      </ClosingBand>
    </>
  );
}
