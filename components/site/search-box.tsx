"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "@/components/ui/icons";

export type SearchItem = { href: string; title: string; summary: string; kind: string };

/** Client-side search over a small index built at render time (pages, chapters, events, posts, stories). */
export function SearchBox({ index }: { index: SearchItem[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return index
      .map((it) => {
        const hay = `${it.title} ${it.summary} ${it.kind}`.toLowerCase();
        const score = terms.reduce((s, t) => s + (it.title.toLowerCase().includes(t) ? 3 : hay.includes(t) ? 1 : -100), 0);
        return { it, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((r) => r.it);
  }, [q, index]);

  return (
    <div role="search">
      <label htmlFor="site-search" className="mb-2 block text-body-sm font-semibold text-fg">
        Search pages, cities, events and posts
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle" />
        <input
          id="site-search"
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try “Pune”, “sponsor” or “pitch”"
          className="block min-h-14 w-full border-2 border-line-control bg-bg-card pl-12 pr-4 text-body-lg text-fg placeholder:text-fg-subtle"
        />
      </div>
      <p className="mt-4 text-body-sm text-fg-muted" aria-live="polite">
        {q.trim() ? `${results.length} ${results.length === 1 ? "result" : "results"}` : ""}
      </p>
      <ul className="mt-2 divide-y divide-line">
        {results.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="group block py-4">
              <span className="text-caption uppercase tracking-wider text-fg-subtle">{r.kind}</span>
              <span className="block text-heading-sm text-fg group-hover:underline group-hover:underline-offset-4">{r.title}</span>
              <span className="block text-body-sm text-fg-muted">{r.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
