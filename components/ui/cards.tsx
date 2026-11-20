import Link from "next/link";
import Image from "next/image";
import type { Chapter, Member, Story } from "@/lib/data";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { PlaceholderBadge } from "./placeholder-badge";
import { Tag } from "./misc";
import { ArrowRight } from "./icons";

const STATUS = { active: "Active", launching: "Launching", coming_soon: "Coming soon" } as const;

/* ───────── Chapter card ───────── */
export function ChapterCard({ chapter, nextEvent }: { chapter: Chapter; nextEvent?: string | null }) {
  return (
    <Link
      href={`/chapters/${chapter.slug}`}
      data-city={chapter.slug}
      className="group flex h-full flex-col rounded-lg border border-line bg-bg-card p-6 transition-shadow duration-base ease-out hover:shadow-e2"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-heading-lg text-fg">{chapter.city}</h3>
          <p className="text-caption text-fg-subtle">{chapter.state}</p>
        </div>
        {chapter.is_flagship ? <Tag>Flagship</Tag> : chapter.status !== "active" ? <Tag>{STATUS[chapter.status]}</Tag> : null}
      </div>
      {chapter.intro && <p className="mt-4 line-clamp-3 text-body-sm text-fg-muted">{chapter.intro}</p>}
      <div className="mt-auto pt-6">
        <p className="text-caption text-fg-subtle">{nextEvent ? `Next: ${nextEvent}` : "Next event: see the city page"}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-body-sm font-semibold text-accent-text">
          {chapter.city} chapter <ArrowRight width={16} height={16} className="transition-transform duration-base ease-out group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/* ───────── Story card ───────── */
export function StoryCard({ story, city }: { story: Story; city?: string }) {
  return (
    <Link href={`/stories/${story.slug}`} className="group flex h-full flex-col rounded-lg border border-line bg-bg-card p-6 hover:shadow-e2">
      <div className="flex flex-wrap items-center gap-2">
        {city && <Tag>{city}</Tag>}
        {isPlaceholder(story) && <PlaceholderBadge />}
      </div>
      <h3 className="mt-4 font-display text-heading-md font-medium text-fg group-hover:underline group-hover:underline-offset-4">{clean(story.headline)}</h3>
      {story.outcome && <p className="mt-3 text-body-sm text-fg-muted">{story.outcome}</p>}
      <span className="mt-auto inline-flex items-center gap-1 pt-6 text-body-sm font-semibold text-accent-text">
        Read the story <ArrowRight width={16} height={16} />
      </span>
    </Link>
  );
}

/* ───────── Member card ───────── */
export function MemberCard({ member, showTeamRole = false }: { member: Member; showTeamRole?: boolean }) {
  const name = clean(member.name);
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-bg-card p-5">
      <div className="aspect-portrait overflow-hidden rounded-md bg-bg-overlay">
        {member.photo ? (
          <Image src={member.photo} alt={`${name}`} width={720} height={900} sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw" className="h-full w-full object-cover" />
        ) : (
          // No photo: typographic treatment, never a stock face.
          <div className="flex h-full items-center justify-center font-display text-display-md text-fg-subtle" aria-hidden="true">
            {initials}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {showTeamRole && member.team_role && <Tag>{member.team_role}</Tag>}
        {isPlaceholder(member) && <PlaceholderBadge />}
      </div>
      <h3 className="mt-2 text-heading-sm text-fg">{name}</h3>
      <p className="text-body-sm text-fg-muted">{[member.role, member.company].filter(Boolean).join(" · ")}</p>
      {member.city && <p className="text-caption text-fg-subtle">{member.city}</p>}
      {member.linkedin && (
        <a href={member.linkedin} className="mt-3 text-body-sm font-semibold text-accent-text underline-offset-4 hover:underline" rel="noopener noreferrer" target="_blank">
          LinkedIn<span className="sr-only"> profile of {name} (opens in a new tab)</span>
        </a>
      )}
    </article>
  );
}
