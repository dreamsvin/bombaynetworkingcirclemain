import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SITE } from "@/content/site";
import { JsonLd } from "@/components/site/json-ld";

/* ───────── Breadcrumbs (with BreadcrumbList JSON-LD) ───────── */
export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-fg-subtle">
          {all.map((it, i) => {
            const last = i === all.length - 1;
            return (
              <li key={it.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-fg-muted">
                    {it.label}
                  </span>
                ) : (
                  <>
                    <Link href={it.href} className="underline-offset-4 hover:text-fg hover:underline">
                      {it.label}
                    </Link>
                    <span aria-hidden="true">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: `${SITE.url}${it.href === "/" ? "" : it.href}` })),
        }}
      />
    </>
  );
}

/* ───────── Empty state: never a dead end — always a next action ───────── */
export function EmptyState({
  title,
  body,
  children,
  className,
  headingAs: H = "h3",
}: {
  title: string;
  body: ReactNode;
  children?: ReactNode;
  className?: string;
  headingAs?: "h2" | "h3";
}) {
  return (
    <div className={cn("border-2 border-dashed border-line-strong bg-bg-card p-6 sm:p-8", className)}>
      <H className="text-heading-sm text-fg">{title}</H>
      <div className="mt-2 max-w-measure text-body text-fg-muted">{body}</div>
      {children && <div className="mt-5 flex flex-wrap items-center gap-4">{children}</div>}
    </div>
  );
}

/* ───────── Tag ───────── */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center bg-support-tint px-2.5 py-1 font-mono text-label uppercase text-on-support-tint", className)}>{children}</span>;
}

/* ───────── Accordion: native <details>, keyboard and screen-reader accessible with zero JS ───────── */
export function Accordion({ items, className }: { items: { q: string; a: ReactNode }[]; className?: string }) {
  return (
    <div className={cn("divide-y-2 divide-line-strong border-y-2 border-line-strong", className)}>
      {items.map((it) => (
        <details key={it.q} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-heading-sm text-fg [&::-webkit-details-marker]:hidden">
            {it.q}
            <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
              <span className="absolute left-0 top-1/2 h-px w-4 bg-fg" />
              <span className="absolute left-1/2 top-0 h-4 w-px bg-fg transition-transform duration-base ease-out group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <div className="pb-6 pr-10 text-body text-fg-muted">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
