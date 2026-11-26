import type { Metadata } from "next";
import { getChapters, getFeaturedMembers, getMembers } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { Container, Section, PageHeader } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { ClosingBand, StatLine } from "@/components/ui/bnc";
import { MemberDirectory } from "@/components/members/directory";
import { PrimaryCta } from "@/components/site/primary-cta";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Members",
  ogTitle: "Who's in the circle",
  description: "Browse founders, operators and creators in the Bombay Networking Circle by city, industry, role and stage. Introductions are made by BNC.",
  path: "/members",
});

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const [{ city }, chapters, members, featured] = await Promise.all([searchParams, getChapters(), getMembers(), getFeaturedMembers()]);
  const cities = chapters.map((c) => c.city);
  const initialCity = cities.find((c) => c.toLowerCase() === city?.toLowerCase());

  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Members", href: "/members" }]} />}
        eyebrow="Members"
        title="Who's in the circle."
        lede="Members who have agreed to be listed. Filter by city, industry, role or stage. Contact details stay private — BNC makes the introduction."
      >
        <StatLine />
      </PageHeader>
      <Section labelledBy="directory-title">
        <Container>
          <h2 id="directory-title" className="sr-only">
            Member directory
          </h2>
          {members.length ? (
            <MemberDirectory members={members} featured={featured} cities={cities} initialCity={initialCity} />
          ) : (
            <div className="border-2 border-dashed border-line-strong p-6 sm:p-8">
              <p className="text-heading-sm font-bold text-fg">Profiles are being added.</p>
              <p className="mt-2 max-w-measure text-body text-fg-muted">
                We list a member only after they&rsquo;ve agreed to it. Until then, request access and tell us who you&rsquo;d like to meet — we&rsquo;ll make the introduction.
              </p>
              <div className="mt-5">
                <PrimaryCta placement="members-empty" />
              </div>
            </div>
          )}
        </Container>
      </Section>
      <ClosingBand title="Want an introduction?" body="Request access and tell us who you're looking for. Introductions happen in rooms and through your host.">
        <PrimaryCta size="lg" placement="members-closing" />
      </ClosingBand>
    </>
  );
}
