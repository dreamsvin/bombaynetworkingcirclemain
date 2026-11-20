import type { Testimonial as T } from "@/lib/data";
import { clean, isPlaceholder } from "@/lib/is-placeholder";
import { PlaceholderBadge } from "./placeholder-badge";

export function Testimonial({ t }: { t: T }) {
  return (
    <figure className="flex h-full flex-col justify-between rounded-lg border border-line bg-bg-card p-6 sm:p-8">
      {isPlaceholder(t) && <PlaceholderBadge className="mb-4 self-start" />}
      <blockquote className="font-display text-heading-md font-regular text-fg">
        <p>“{t.quote}”</p>
      </blockquote>
      <figcaption className="mt-6 border-t border-line pt-4">
        <span className="block text-body-sm font-semibold text-fg">{clean(t.author_name)}</span>
        {t.author_role && <span className="block text-caption text-fg-subtle">{t.author_role}</span>}
      </figcaption>
    </figure>
  );
}
