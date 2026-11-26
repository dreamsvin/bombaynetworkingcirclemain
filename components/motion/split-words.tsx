import { Fragment, type ElementType } from "react";
import { cn } from "@/lib/cn";

/**
 * Headline whose words rise from behind a mask, one after another.
 * Wrap a word or phrase in *asterisks* to set it in italic brand brown — the editorial accent.
 * `onLoad` plays immediately (above the fold); otherwise it plays when scrolled into view.
 * Screen readers get the plain sentence via aria-label; the animated spans are hidden from them.
 */
export function SplitWords({
  text,
  as: As = "h2",
  className,
  id,
  onLoad = false,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  onLoad?: boolean;
  delay?: number;
}) {
  const plain = text.replace(/\*/g, "");
  const parts = text.split(/(\*[^*]+\*)/).filter(Boolean);
  let i = 0;
  return (
    <As
      id={id}
      aria-label={plain}
      className={cn("split-words", className)}
      data-reveal={onLoad ? undefined : "words"}
      data-on={onLoad ? "load" : undefined}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {parts.map((part, pi) => {
        const em = part.startsWith("*") && part.endsWith("*");
        const words = (em ? part.slice(1, -1) : part).split(/(\s+)/);
        return (
          <Fragment key={pi}>
            {words.map((w, wi) =>
              /^\s+$/.test(w) ? (
                " "
              ) : w ? (
                <span key={wi} className="w" aria-hidden="true">
                  <span style={{ "--i": i++ } as React.CSSProperties} className={em ? "italic text-brand-text" : undefined}>
                    {w}
                  </span>
                </span>
              ) : null,
            )}
          </Fragment>
        );
      })}
    </As>
  );
}
