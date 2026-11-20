import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/content/posts";
import { pageMeta } from "@/lib/seo";
import { fmtLongDate } from "@/lib/format";
import { Container, Section, PageHeader } from "@/components/ui/layout";
import { Breadcrumbs, Tag } from "@/components/ui/misc";
import { SubscribeForm } from "@/components/forms/subscribe-form";

export const metadata: Metadata = pageMeta({
  title: "Blog — networking advice, event recaps and founder interviews",
  description: "Practical networking advice for founders, operators and freelancers in India, plus recaps from Bombay Networking Circle events.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />} eyebrow="Blog" title="Notes from the room." lede="How to network without the awkwardness, what works in our rooms, and what founders are learning." />
      <Section>
        <Container>
          <ul className="divide-y divide-line border-y border-line">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group grid gap-3 py-8 md:grid-cols-12">
                  <div className="md:col-span-3">
                    <Tag>{p.tag}</Tag>
                    <p className="mt-2 text-caption text-fg-subtle">
                      <time dateTime={p.date}>{fmtLongDate(p.date)}</time>
                    </p>
                  </div>
                  <div className="md:col-span-8">
                    <h2 className="font-display text-heading-lg text-fg group-hover:underline group-hover:underline-offset-4">{p.title}</h2>
                    <p className="mt-2 text-body text-fg-muted">{p.dek}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-16 max-w-lg">
            <SubscribeForm source="blog" label="New posts and event dates by email" id="blog-subscribe" />
          </div>
        </Container>
      </Section>
    </>
  );
}
