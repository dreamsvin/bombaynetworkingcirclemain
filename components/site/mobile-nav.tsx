"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, FOOTER } from "@/content/site";
import { Menu, Close } from "@/components/ui/icons";

/** Mobile menu: a modal sheet with focus trap, Escape to close, and focus returned to the trigger. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const path = usePathname();

  // Close on navigation (state derived during render, not in an effect).
  const [lastPath, setLastPath] = useState(path);
  if (path !== lastPath) {
    setLastPath(path);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => [...(panel.current?.querySelectorAll<HTMLElement>("a, button") ?? [])];
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border-2 border-line-strong px-4 text-body-sm font-bold text-fg"
      >
        {open ? <Close width={18} height={18} /> : <Menu width={18} height={18} />}
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      {open && (
        <div id="mobile-menu" ref={panel} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-x-0 bottom-0 top-nav z-sheet overflow-y-auto border-t-2 border-line-strong bg-bg">
          <nav aria-label="Mobile" className="px-gutter pb-10 pt-6">
            <ul>
              {NAV.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex min-h-14 items-center border-b-2 border-line-strong text-heading-md font-bold text-fg" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-8 grid grid-cols-2 gap-x-4">
              {FOOTER.flatMap((g): readonly { label: string; href: string }[] => g.links).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex min-h-11 items-center text-body-sm text-fg-muted underline underline-offset-4" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
