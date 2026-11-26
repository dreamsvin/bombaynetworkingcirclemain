import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SplitWords } from "@/components/motion/split-words";

export function Container({ className, children, narrow = false }: { className?: string; children: ReactNode; narrow?: boolean }) {
  return <div className={cn("mx-auto px-gutter", narrow ? "max-w-prose box-content" : "w-full max-w-container", className)}>{children}</div>;
}

type Tone = "paper" | "raised" | "sand" | "brown" | "ink";

export function Section({
  tone = "paper",
  size = "md",
  id,
  className,
  children,
  labelledBy,
  as: As = "section",
}: {
  tone?: Tone;
  size?: "sm" | "md";
  id?: string;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  as?: ElementType;
}) {
  return (
    <As
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone === "paper" ? undefined : tone}
      className={cn("border-b-2 border-line-strong", size === "sm" ? "py-section-sm" : "py-section", className)}
    >
      {children}
    </As>
  );
}

/** Kicker: a short rule, then monospace uppercase in brand brown (sand on brown sections). Optional issue-style number. */
export function Eyebrow({ children, className, index }: { children: ReactNode; className?: string; index?: number }) {
  return (
    <p className={cn("flex items-center gap-3 font-mono text-label uppercase text-brand-text", className)}>
      <span aria-hidden="true" className="h-px w-8 bg-current" />
      {index != null && <span>Nº {String(index).padStart(2, "0")}</span>}
      {index != null && <span aria-hidden="true">·</span>}
      <span>{children}</span>
    </p>
  );
}

/**
 * Section heading block: kicker, serif headline, optional lede. String titles animate word by word as they
 * scroll in; wrap a phrase in *asterisks* for the italic accent. `id` lets the section use aria-labelledby.
 */
export function SectionHeader({
  eyebrow,
  index,
  title,
  lede,
  id,
  className,
  as: As = "h2",
  align = "start",
}: {
  eyebrow?: string;
  index?: number;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
  align?: "start" | "center";
}) {
  const size = As === "h1" ? "text-display-lg" : "text-display-md";
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Eyebrow index={index} className={cn("mb-5", align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      {typeof title === "string" ? (
        <SplitWords as={As} id={id} text={title} className={cn("font-display text-fg", size)} />
      ) : (
        <As id={id} className={cn("font-display text-fg", size)}>
          {title}
        </As>
      )}
      {lede && (
        <p data-reveal className="mt-5 max-w-measure text-body-lg text-fg-muted" style={{ "--d": "200ms" } as React.CSSProperties}>
          {lede}
        </p>
      )}
    </div>
  );
}

/** Page hero for inner pages: breadcrumbs slot, h1, lede, actions. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  breadcrumbs?: ReactNode;
}) {
  return (
    <header className="border-b-2 border-line-strong pb-section-sm pt-8">
      <Container>
        {breadcrumbs}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            {eyebrow && <Eyebrow className="mb-6">{eyebrow}</Eyebrow>}
            {typeof title === "string" ? (
              <SplitWords as="h1" onLoad text={title} className="font-display text-display-xl text-fg" />
            ) : (
              <h1 className="font-display text-display-xl text-fg">{title}</h1>
            )}
          </div>
          {(lede || children) && (
            <div data-load className="lg:col-span-4" style={{ "--d": "450ms" } as React.CSSProperties}>
              {lede && <p className="text-body-lg text-fg-muted">{lede}</p>}
              {children && <div className="mt-6 flex flex-wrap items-center gap-4">{children}</div>}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
