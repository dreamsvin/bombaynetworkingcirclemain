"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Sticky header that slides away while scrolling down and returns on the way up. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Never hide near the top, and ignore tiny jitters.
      if (y < 120) setHidden(false);
      else if (Math.abs(y - last.current) > 8) setHidden(y > last.current && !document.getElementById("mobile-menu"));
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      data-hidden={hidden}
      onFocusCapture={() => setHidden(false)}
      className="site-header sticky top-0 z-header border-b-2 border-line-strong bg-bg/90 backdrop-blur-md supports-[backdrop-filter]:bg-bg/80"
    >
      {children}
    </header>
  );
}
