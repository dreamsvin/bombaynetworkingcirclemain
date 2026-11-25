import type { Metadata } from "next";
import Link from "next/link";
import { eventGallery, getAllEvents } from "@/lib/data";
import { MEDIA, VIDEOS } from "@/content/media";
import { pageMeta } from "@/lib/seo";
import { fmtLongDate } from "@/lib/format";
import { clean } from "@/lib/is-placeholder";
import { Container, Section, PageHeader, SectionHeader } from "@/components/ui/layout";
import { Breadcrumbs } from "@/components/ui/misc";
import { Photo } from "@/components/ui/photo";
import { VideoLoop } from "@/components/media/video-loop";
import { PrimaryCta } from "@/components/site/primary-cta";
import { ArrowRight } from "@/components/ui/icons";

export const revalidate = 600;

export const metadata: Metadata = pageMeta({
  title: "Gallery — photos and video from BNC rooms",
  ogTitle: "Real people in real rooms",
  description: "Photos and video from Bombay Networking Circle rooms in Gurugram, Pune and Nashik, plus the posters from every city's first edition.",
  path: "/gallery",
});

const POSTERS = [MEDIA.poster_hyderabad, MEDIA.poster_nashik, MEDIA.poster_pune_oct, MEDIA.poster_surat];

export default async function GalleryPage() {
  const events = (await getAllEvents()).filter((e) => eventGallery(e).length).reverse();
  return (
    <>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: "Gallery", href: "/gallery" }]} />}
        eyebrow="Gallery"
        title="Real people in real rooms."
        lede="No stock photos, ever. Every frame here is from a BNC room — candid, warm and mid-conversation. More cities are being added as the team digitises its archive."
      />

      <Section labelledBy="video-title">
        <Container>
          <SectionHeader id="video-title" title="The room, moving" />
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <VideoLoop video={VIDEOS.room} className="rounded-md md:col-span-2" />
            <VideoLoop video={VIDEOS.reel} ratio="reel" className="mx-auto w-full max-w-xs rounded-md md:max-w-none" />
          </div>
          <p className="mt-3 text-caption text-fg-subtle">Career Connect – Delhi, Masters&apos; Union, Gurugram, 10 January 2026. Muted; use the button to pause.</p>
        </Container>
      </Section>

      {events.map((e, i) => {
        const photos = eventGallery(e);
        return (
          <Section key={e.id} tone={i % 2 === 0 ? "raised" : undefined} labelledBy={`g-${e.slug}`}>
            <Container>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-label uppercase text-fg-subtle">
                    {e.chapter.city} · {fmtLongDate(e.starts_at)}
                  </p>
                  <h2 id={`g-${e.slug}`} className="mt-2 font-display text-heading-lg text-fg">
                    {clean(e.title)}
                  </h2>
                </div>
                <Link href={`/events/${e.slug}`} className="inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-fg underline underline-offset-4">
                  About this room <ArrowRight width={16} height={16} />
                </Link>
              </div>
              <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                {photos.map((p, j) => (
                  <li key={p.src} className={j === 0 ? "col-span-2 row-span-2" : undefined}>
                    <a href={p.src} className="block" aria-label={`Open full-size photo: ${p.alt}`}>
                      <Photo photo={p} sizes={j === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} ratio="square" className="rounded-md" />
                    </a>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        );
      })}

      <Section labelledBy="posters-title">
        <Container>
          <SectionHeader id="posters-title" title="First editions" lede="The posters that opened Hyderabad, Nashik and Surat, and a Pune breakfast meetup." />
          <ul className="mt-8 grid grid-cols-2 items-start gap-3 md:grid-cols-4">
            {POSTERS.map((p) => (
              <li key={p.src}>
                <Photo photo={p} sizes="(min-width: 768px) 25vw, 50vw" className="rounded-md" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="ink" labelledBy="gallery-next">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h2 id="gallery-next" className="max-w-measure font-display text-display-md text-fg">
              Be in the next photo.
            </h2>
            <PrimaryCta size="lg" placement="gallery" />
          </div>
        </Container>
      </Section>
    </>
  );
}
