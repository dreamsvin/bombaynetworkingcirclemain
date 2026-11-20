import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, type Block } from "@/content/posts";
import { SITE } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { fmtLongDate } from "@/lib/format";
import { Container, Section } from "@/components/ui/layout";
import { Breadcrumbs, Tag } from "@/components/ui/misc";
import { PrimaryCta } from "@/components/site/primary-cta";
import { JsonLd } from "@/components/site/json-ld";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  return p ? pageMeta({ title: p.title, description: p.dek, path: `/blog/${p.slug}`, type: "article" }) : {};
}

function render(b: Block, i: number) {
  if ("h2" in b) return <h2 key={i}>{b.h2}</h2>;
  if ("ul" in b)
    return (
      <ul key={i}>
        {b.ul.map((li) => (
          <li key={li}>{li}</li>
        ))}
      </ul>
    );
  if ("quote" in b)
    return (
      <blockquote key={i}>
        <p>{b.quote}</p>
      </blockquote>
    );
  return <p key={i}>{b.p}</p>;
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  const more = POSTS.filter((p) => p.slug !== slug).slice(0, 2);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.dek,
          datePublished: post.date,
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@id": `${SITE.url}/#organization` },
          mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
        }}
      />
      <Section size="sm">
        <Container narrow>
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title.length > 36 ? `${post.title.slice(0, 36)}…` : post.title, href: `/blog/${post.slug}` }]} />
          <div className="mt-10">
            <Tag>{post.tag}</Tag>
          </div>
          <h1 className="mt-4 font-display text-display-lg text-fg">{post.title}</h1>
          <p className="mt-4 text-body-lg text-fg-muted">{post.dek}</p>
          <p className="mt-4 text-caption text-fg-subtle">
            {post.author} · <time dateTime={post.date}>{fmtLongDate(post.date)}</time>
          </p>
          <article className="prose-bnc mt-10">{post.body.map(render)}</article>
          <div className="mt-14 border-t border-line pt-8">
            <p className="text-heading-sm text-fg">Try it in a real room.</p>
            <div className="mt-5">
              <PrimaryCta placement="blog-post" />
            </div>
          </div>
          {more.length > 0 && (
            <aside className="mt-14" aria-labelledby="more-title">
              <h2 id="more-title" className="text-label uppercase text-fg-subtle">
                More from the blog
              </h2>
              <ul className="mt-4 space-y-3">
                {more.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/blog/${m.slug}`} className="text-body-lg text-fg underline-offset-4 hover:underline">
                      {m.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </Container>
      </Section>
    </>
  );
}
