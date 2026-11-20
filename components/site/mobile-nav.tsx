"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, PRIMARY_CTA } from "@/content/site";
import { Menu, Close, ArrowRight } from "@/components/ui/icons";
import { buttonClass } from "@/components/ui/button";
import { track } from "@/lib/analytics";

/** Mobile menu: a modal sheet with focus trap, Escape to close, and focus returned to the trigger. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);

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
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-fg hover:bg-bg-raised"
      >
        {open ? <Close /> : <Menu />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      {open && (
        <div id="mobile-menu" ref={panel} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-x-0 bottom-0 top-nav z-sheet overflow-y-auto border-t border-line bg-bg">
          <nav aria-label="Mobile" className="px-gutter pb-10 pt-6">
            <ul className="space-y-8">
              {NAV.map((g) => (
                <li key={g.label}>
                  <p className="text-label uppercase text-fg-subtle">{g.label}</p>
                  <ul className="mt-2">
                    {g.items.map((it) => (
                      <li key={it.href}>
                        <Link href={it.href} className="flex min-h-11 items-center border-b border-line text-body-lg text-fg" onClick={() => setOpen(false)}>
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <Link
              href={PRIMARY_CTA.href}
              className={buttonClass("primary", "lg", "mt-10 w-full")}
              onClick={() => {
                track("cta_click", { placement: "mobile-menu" });
                setOpen(false);
              }}
            >
              {PRIMARY_CTA.label} <ArrowRight width={18} height={18} />
            </Link>
            <Link href="/search" className="mt-4 flex min-h-11 items-center justify-center text-body-sm text-fg-muted underline underline-offset-4" onClick={() => setOpen(false)}>
              Search
            </Link>
            <Link href="/contact" className="mt-1 flex min-h-11 items-center justify-center text-body-sm text-fg-muted underline underline-offset-4" onClick={() => setOpen(false)}>
              Contact
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
