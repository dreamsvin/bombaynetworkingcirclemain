import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, children, narrow = false }: { className?: string; children: ReactNode; narrow?: boolean }) {
  return <div className={cn("mx-auto w-full px-gutter", narrow ? "max-w-prose box-content" : "max-w-container", className)}>{children}</div>;
}

type Tone = "paper" | "raised" | "ink";

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
      className={cn(size === "sm" ? "py-section-sm" : "py-section", className)}
    >
      {children}
    </As>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-label uppercase text-fg-subtle", className)}>{children}</p>;
}

/** Section heading block: eyebrow, h2, optional lede. `id` lets the section use aria-labelledby. */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  id,
  className,
  as: As = "h2",
  align = "start",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
  align?: "start" | "center";
}) {
  return (
    <div className={cn("max-w-measure", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <As id={id} className={cn("font-display text-fg", As === "h1" ? "text-display-lg" : "text-display-md")}>
        {title}
      </As>
      {lede && <p className="mt-4 text-body-lg text-fg-muted">{lede}</p>}
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
    <header className="border-b border-line bg-bg-raised pb-section-sm pt-10">
      <Container>
        {breadcrumbs}
        <div className="mt-8 max-w-measure">
          {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
          <h1 className="font-display text-display-lg text-fg">{title}</h1>
          {lede && <p className="mt-5 text-body-lg text-fg-muted">{lede}</p>}
          {children && <div className="mt-8 flex flex-wrap items-center gap-4">{children}</div>}
        </div>
      </Container>
    </header>
  );
}
