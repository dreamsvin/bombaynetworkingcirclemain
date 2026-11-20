import Link from "next/link";
import { Container, Section } from "@/components/ui/layout";
import { PrimaryCta } from "@/components/site/primary-cta";

export default function NotFound() {
  return (
    <Section>
      <Container narrow>
        <p className="text-label uppercase text-fg-subtle">404</p>
        <h1 className="mt-4 font-display text-display-lg text-fg">This page isn&apos;t in the circle.</h1>
        <p className="mt-5 text-body-lg text-fg-muted">The link may be old or mistyped. These will get you back on track:</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <PrimaryCta placement="404" />
          <Link href="/" className="text-body-sm font-semibold text-fg underline underline-offset-4">
            Home
          </Link>
          <Link href="/search" className="text-body-sm font-semibold text-fg underline underline-offset-4">
            Search
          </Link>
        </div>
      </Container>
    </Section>
  );
}
