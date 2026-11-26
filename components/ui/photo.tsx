import Image from "next/image";
import type { Photo as PhotoT } from "@/content/photos";
import { cn } from "@/lib/cn";

const RATIOS = { photo: "aspect-photo", portrait: "aspect-portrait", wide: "aspect-wide", square: "aspect-square", tall: "aspect-tall" } as const;

/**
 * next/image with the manifest's real dimensions. `sizes` is required thinking, not decoration.
 * motion: "reveal" uncovers on scroll, "load" uncovers on page load (above the fold), "parallax" drifts with scroll.
 */
export function Photo({
  photo,
  sizes,
  priority = false,
  quality,
  className,
  imgClassName,
  ratio,
  motion,
  delay = 0,
}: {
  photo: PhotoT;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  ratio?: keyof typeof RATIOS;
  quality?: 60 | 75;
  motion?: "reveal" | "load" | "parallax";
  delay?: number;
}) {
  const r = ratio ? RATIOS[ratio] : undefined;
  return (
    <div
      className={cn("overflow-hidden bg-bg-overlay", motion === "parallax" && "parallax", r, className)}
      data-reveal={motion === "reveal" ? "img" : undefined}
      data-load={motion === "load" ? "img" : undefined}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        sizes={sizes}
        preload={priority}
        quality={quality}
        className={cn("h-full w-full object-cover grayscale", imgClassName)}
      />
    </div>
  );
}
