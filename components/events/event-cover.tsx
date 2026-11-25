import Image from "next/image";
import type { Event } from "@/lib/data";
import { eventGallery } from "@/lib/data";
import { FORMATS } from "@/content/site";
import { Seal } from "@/components/site/logo";
import { cn } from "@/lib/cn";

/**
 * The image for an event, in brand order: BNC's own photo from the room ("faces over illustrations"), then the Luma
 * cover artwork, then the event poster, then a branded tile. Square, because Luma covers are square.
 */
export function eventImage(event: Event): { src: string; alt: string } | null {
  const photo = eventGallery(event)[0];
  if (photo) return { src: photo.src, alt: photo.alt };
  if (event.cover_image) return { src: event.cover_image, alt: `Cover artwork for ${event.title}` };
  if (event.poster) return { src: event.poster, alt: `Poster for ${event.title}` };
  return null;
}

export function EventCover({
  event,
  sizes,
  className,
  priority = false,
  prefer = "photo",
}: {
  event: Event;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** "artwork" shows the Luma cover/poster first — used on the event page, where the photos appear in the gallery below. */
  prefer?: "photo" | "artwork";
}) {
  const art = event.cover_image ?? event.poster;
  const img = prefer === "artwork" && art ? { src: art, alt: `Cover artwork for ${event.title}` } : eventImage(event);
  return (
    <div className={cn("relative aspect-square overflow-hidden bg-bg-overlay", className)}>
      {img ? (
        <Image src={img.src} alt={img.alt} fill sizes={sizes} preload={priority} quality={75} className="object-cover" />
      ) : (
        <div data-tone="ink" className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
          <span aria-hidden="true">
            <Seal className="h-16 w-16 text-accent-text" />
          </span>
          <span className="text-label uppercase text-fg-subtle">{FORMATS[event.format].label}</span>
        </div>
      )}
    </div>
  );
}
