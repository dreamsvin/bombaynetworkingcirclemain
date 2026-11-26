"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Header link with aria-current for the active section. */
export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const path = usePathname();
  const active = path === href || path.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center border-b-2 px-3 text-body-sm font-semibold text-fg hover:border-line-strong",
        active ? "border-line-strong" : "border-transparent",
      )}
    >
      {children}
    </Link>
  );
}
