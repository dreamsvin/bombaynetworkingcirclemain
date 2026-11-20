import type { Metadata } from "next";
import Link from "next/link";
import { getChapters, getStories } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader } from "@/components/ui/layout";
import { Breadcrumbs, EmptyState } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { StoryFilter } from "@/components/chapters/story-filter";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Member stories — what happened after the introduction",
  ogTitle: "What happens after a BNC introduction",
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
        title="What happened after the introduction."
        lede="Real members, named with their written consent. Every story says who met whom, where, and what came of it."
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
              <Link href="/events" className="text-body-sm font-semibold text-fg underline underline-offset-4">
                Or come to an event and start one
              </Link>
            </EmptyState>
          )}
        </Container>
      </Section>
    </>
  );
}
