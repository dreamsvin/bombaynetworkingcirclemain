"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Marks its wrapper data-in="true" the first time it is a third on screen. CSS does the rest. */
export function InView({ children, className, ariaHidden }: { children: ReactNode; className?: string; ariaHidden?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.setAttribute("data-in", "true");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return show();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} data-in="false" aria-hidden={ariaHidden || undefined}>
      {children}
    </div>
  );
}
