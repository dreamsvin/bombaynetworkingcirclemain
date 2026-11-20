import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never be indexed.
  const isProd = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : true;
  return isProd
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/search"] }], sitemap: `${SITE.url}/sitemap.xml`, host: SITE.url }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
