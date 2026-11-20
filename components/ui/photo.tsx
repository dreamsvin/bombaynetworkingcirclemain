import Image from "next/image";
import type { Photo as PhotoT } from "@/content/photos";
import { cn } from "@/lib/cn";

const RATIOS = { photo: "aspect-photo", portrait: "aspect-portrait", wide: "aspect-wide", square: "aspect-square" } as const;

/** next/image with the manifest's real dimensions. `sizes` is required thinking, not decoration. */
export function Photo({
  photo,
  sizes,
  priority = false,
  className,
  imgClassName,
  ratio,
}: {
  photo: PhotoT;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  ratio?: "photo" | "portrait" | "wide" | "square";
}) {
  const r = ratio ? RATIOS[ratio] : undefined;
  return (
    <div className={cn("overflow-hidden bg-bg-overlay", r, className)}>
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        sizes={sizes}
        priority={priority}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
