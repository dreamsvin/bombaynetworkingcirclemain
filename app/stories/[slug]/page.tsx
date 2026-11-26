import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapters, getPastEvents, getStories, getStory } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { fmtLongDate } from "@/lib/format";
import { Container, Section } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { PrimaryCta } from "@/components/site/primary-cta";
import { JsonLd } from "@/components/site/json-ld";
import { SITE, STORY_TYPES } from "@/content/site";
import { Chip, ClosingBand } from "@/components/ui/bnc";

export const revalidate = 600;

export async function generateStaticParams() {
  return (await getStories()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = await getStory(slug);
  if (!s) return {};
  return pageMeta({ title: clean(s.headline), description: s.outcome ?? clean(s.body).slice(0, 155), path: `/stories/${s.slug}`, type: "article", noindex: isPlaceholder(s) });
}

export default async function StoryPage({ params }: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();
  const city = (await getChapters()).find((c) => c.id === story.chapter_id);
  const room = city ? (await getPastEvents({ chapterId: city.id, limit: 1 }))[0] : undefined;
  const type = story.story_type && story.story_type in STORY_TYPES ? STORY_TYPES[story.story_type as keyof typeof STORY_TYPES] : null;
  const headline = clean(story.headline);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline,
          datePublished: story.created_at,
          dateModified: story.updated_at,
          publisher: { "@id": `${SITE.url}/#organization` },
          mainEntityOfPage: `${SITE.url}/stories/${story.slug}`,
        }}
      />
      <Section size="sm">
        <Container narrow>
          <Breadcrumbs items={[{ label: "Stories", href: "/stories" }, { label: headline.length > 36 ? `${headline.slice(0, 36)}…` : headline, href: `/stories/${story.slug}` }]} />
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {type && <Chip>{type}</Chip>}
            {city && (
              <Link href={`/chapters/${city.slug}`} className="inline-flex">
                <Chip variant="outline">{city.city}</Chip>
              </Link>
            )}
            {isPlaceholder(story) && <PlaceholderBadge />}
          </div>
          <h1 className="mt-4 font-display text-display-lg text-fg">{headline}</h1>
          {story.consented_on && <p className="mt-4 text-caption text-fg-subtle">Published with consent, {fmtLongDate(story.consented_on)}.</p>}

          <ol className="mt-10 border-t-2 border-line-strong">
            <li className="border-b-2 border-line-strong py-6">
              <p className="font-mono text-label text-brand-text">01</p>
              <h2 className="mt-2 text-heading-lg text-fg">The people</h2>
              <p className="mt-3 text-body-lg text-fg-muted">{story.problem ?? "—"}</p>
            </li>
            <li className="border-b-2 border-line-strong py-6">
              <p className="font-mono text-label text-brand-text">02</p>
              <h2 className="mt-2 text-heading-lg text-fg">The connection</h2>
              <p className="mt-3 text-body-lg text-fg-muted">{story.connection ?? "—"}</p>
              {room && (
                <Link href={`/rooms/${room.slug}`} className="mt-3 inline-flex min-h-11 items-center font-bold text-accent-text underline underline-offset-4">
                  The room: {clean(room.title)} →
                </Link>
              )}
            </li>
            <li className="border-b-2 border-line-strong py-6">
              <p className="font-mono text-label text-brand-text">03</p>
              <h2 className="mt-2 text-heading-lg text-fg">What happened next</h2>
              <div className="prose-bnc mt-3">
                {story.body.split(/\n{2,}/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {story.outcome && (
                  <p>
                    <strong>{story.outcome}</strong>
                  </p>
                )}
              </div>
            </li>
          </ol>
        </Container>
      </Section>
      <ClosingBand title="Your next connection is in a room.">
        <PrimaryCta size="lg" city={city?.city} placement="story" />
      </ClosingBand>
    </>
  );
}
