import Link from "next/link";
import { NAV } from "@/content/site";
import { Logo } from "./logo";
import { PrimaryCta } from "./primary-cta";
import { MobileNav } from "./mobile-nav";
import { Search, Chevron } from "@/components/ui/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-header border-b border-line bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/85">
      <div className="mx-auto flex h-nav max-w-container items-center justify-between gap-4 px-gutter">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((g) => (
              <li key={g.label} className="group relative">
                <Link
                  href={g.href}
                  className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-body-sm font-medium text-fg hover:bg-bg-raised"
                >
                  {g.label}
                  <Chevron width={14} height={14} className="text-fg-subtle transition-transform duration-base group-focus-within:rotate-180 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-opacity duration-fast group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul className="w-56 rounded-lg border border-line bg-bg-card p-2 shadow-e2">
                    {g.items.map((it) => (
                      <li key={it.href}>
                        <Link href={it.href} className="flex min-h-11 items-center rounded-md px-3 text-body-sm text-fg hover:bg-bg-raised">
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/search" className="hidden h-11 w-11 items-center justify-center rounded-full text-fg hover:bg-bg-raised sm:inline-flex" aria-label="Search the site">
            <Search />
          </Link>
          <PrimaryCta placement="header" className="px-4" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
