import type { ReactNode } from "react";
import { Container, Section } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { SHOW_PLACEHOLDERS } from "@/lib/env";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";

/** Policy page shell. The legal-review notice shows on preview builds only; CONTENT-TODO tracks the review. */
export function LegalPage({ title, path, updated, intro, children }: { title: string; path: string; updated: string; intro: ReactNode; children: ReactNode }) {
  return (
    <Section size="sm">
      <Container narrow>
        <Breadcrumbs items={[{ label: title, href: path }]} />
        <h1 className="mt-10 font-display text-display-lg text-fg">{title}</h1>
        <p className="mt-3 text-body-sm text-fg-subtle">Last updated {updated}</p>
        {SHOW_PLACEHOLDERS && (
          <p className="mt-4 flex items-center gap-2 text-body-sm text-danger">
            <PlaceholderBadge /> Drafted for BNC; pending review by a lawyer before launch.
          </p>
        )}
        <div className="prose-bnc mt-8">
          <p className="text-body-lg text-fg-muted">{intro}</p>
          {children}
        </div>
      </Container>
    </Section>
  );
}
