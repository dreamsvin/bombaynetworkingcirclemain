import type { Metadata } from "next";
import { CONTACT, SITE } from "@/content/site";

/**
 * Per-route metadata. `title` is the <title> (template adds the brand); `ogTitle`/`description` are written
 * as a pitch for WhatsApp/LinkedIn previews, not as a page label.
 */
export function pageMeta({
  title,
  description,
  path,
  ogTitle,
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  type?: "website" | "article";
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, siteName: SITE.name, locale: SITE.locale, url: path, title: ogTitle ?? title, description },
    twitter: { card: "summary_large_image", title: ogTitle ?? title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.short,
  url: SITE.url,
  logo: `${SITE.url}/brand/bnc-seal.svg`,
  description: SITE.description,
  foundingDate: SITE.founded,
  founder: { "@type": "Person", name: SITE.founder },
  areaServed: { "@type": "Country", name: "India" },
  email: CONTACT.email,
});
