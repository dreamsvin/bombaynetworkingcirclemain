"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@/content/media";
import { cn } from "@/lib/cn";

/**
 * A short, muted, looping clip from a real BNC room. Respects reduced motion (starts paused on the poster) and always
 * has a visible pause control (WCAG 2.2.2). The poster is a real frame, so nothing is lost if video never loads.
 */
export function VideoLoop({ video, className, ratio = "wide", priority = false }: { video: Video; className?: string; ratio?: "wide" | "reel"; priority?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Start only when motion is welcome. onPlay/onPause keep the button in sync.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) void el.play().catch(() => {});
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  return (
    <figure className={cn("relative overflow-hidden bg-bg-overlay", ratio === "wide" ? "aspect-wide" : "aspect-reel", className)}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={video.poster}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={video.label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={!playing}
        className="absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-scrim px-4 text-caption font-semibold text-on-accent backdrop-blur-sm"
      >
        <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
        {playing ? "Pause" : "Play"}
        <span className="sr-only"> video</span>
      </button>
    </figure>
  );
}
