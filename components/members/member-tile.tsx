import Image from "next/image";
import type { Member } from "@/lib/data";
import { STAGES, LOOKING_FOR } from "@/content/site";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { cn } from "@/lib/cn";

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const stageLabel = (v: string | null) => STAGES.find((s) => s.value === v)?.label ?? null;
export const lookingLabel = (v: string) => LOOKING_FOR.find((l) => l.value === v)?.label ?? v;

/** Member face: black-and-white photo, or initials on sand. Never a stock face. */
export function MemberFace({ member, className, sizes = "120px" }: { member: Member; className?: string; sizes?: string }) {
  const name = clean(member.name);
  return (
    <div className={cn("aspect-square overflow-hidden bg-support-tint", className)}>
      {member.photo ? (
        <Image src={member.photo} alt="" width={480} height={480} sizes={sizes} className="h-full w-full object-cover grayscale" />
      ) : (
        <div className="flex h-full items-center justify-center font-display text-heading-lg font-extrabold text-on-support-tint" aria-hidden="true">
          {initials(name)}
        </div>
      )}
    </div>
  );
}

/** Directory card. No contact details — introductions go through BNC. */
export function MemberTile({ member }: { member: Member }) {
  return (
    <div className="flex h-full gap-4 border-2 border-line-strong bg-bg-card p-4 text-left">
      <MemberFace member={member} className="w-16 shrink-0" sizes="64px" />
      <div className="min-w-0">
        {isPlaceholder(member) && <PlaceholderBadge className="mb-1" />}
        <p className="text-heading-sm font-bold text-fg">{clean(member.name)}</p>
        <p className="text-body-sm text-fg-muted">{[member.role, member.company].filter(Boolean).join(" · ")}</p>
        <p className="mt-1 font-mono text-label uppercase text-fg-subtle">{[member.city, member.industry].filter(Boolean).join(" · ")}</p>
      </div>
    </div>
  );
}
