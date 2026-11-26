import { NAV } from "@/content/site";
import { Logo } from "./logo";
import { PrimaryCta } from "./primary-cta";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { HeaderShell } from "./header-shell";

/** Flat header: logo · five links · Request access. Hides on scroll down. On mobile the CTA stays visible beside "Menu". */
export function Header() {
  return (
    <HeaderShell>
      <div className="mx-auto flex h-nav max-w-container items-center justify-between gap-4 px-gutter">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((l) => (
              <li key={l.href}>
                <NavLink href={l.href}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <PrimaryCta placement="header" className="px-3 sm:px-4" />
          <MobileNav />
        </div>
      </div>
    </HeaderShell>
  );
}
