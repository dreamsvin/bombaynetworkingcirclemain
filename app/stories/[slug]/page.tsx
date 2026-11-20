import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapters, getStories, getStory } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { fmtLongDate } from "@/lib/format";
import { Container, Section } from "@/components/ui/layout";
import { Breadcrumbs, Tag } from "@/components/ui/misc";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { PrimaryCta } from "@/components/site/primary-cta";
import { JsonLd } from "@/components/site/json-ld";
import { SITE } from "@/content/site";

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
            {city && (
              <Link href={`/chapters/${city.slug}`}>
                <Tag>{city.city}</Tag>
              </Link>
            )}
            {isPlaceholder(story) && <PlaceholderBadge />}
          </div>
          <h1 className="mt-4 font-display text-display-lg text-fg">{headline}</h1>
          {story.consented_on && <p className="mt-4 text-caption text-fg-subtle">Published with consent, {fmtLongDate(story.consented_on)}.</p>}

          <article className="prose-bnc mt-10">
            {story.problem && (
              <>
                <h2>The problem</h2>
                <p>{story.problem}</p>
              </>
            )}
            {story.connection && (
              <>
                <h2>The connection</h2>
                <p>{story.connection}</p>
              </>
            )}
            {story.body.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {story.outcome && (
              <>
                <h2>The outcome</h2>
                <p>{story.outcome}</p>
              </>
            )}
          </article>

          <div className="mt-14 border-t border-line pt-8">
            <p className="text-heading-sm text-fg">Your story starts with one room.</p>
            <div className="mt-5">
              <PrimaryCta placement="story" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
