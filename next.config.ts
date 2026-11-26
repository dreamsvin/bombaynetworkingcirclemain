import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600, 1920],
  },
  // OG images read the Archivo .woff files at render time; make sure they ship with the functions.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./node_modules/@fontsource/archivo/files/archivo-latin-{400,800}-normal.woff"],
    "/chapters/[city]/opengraph-image": ["./node_modules/@fontsource/archivo/files/archivo-latin-{400,800}-normal.woff"],
  },
  // The old static site's URLs. Anything shared in the past keeps working.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/sponsor.html", destination: "/sponsor", permanent: true },
      { source: "/join", destination: "/request-access", permanent: true },
      // Redesign (Nov 2026): events became rooms, the community page became the member directory.
      { source: "/events", destination: "/rooms", permanent: true },
      { source: "/events/:slug", destination: "/rooms/:slug", permanent: true },
      { source: "/community", destination: "/members", permanent: true },
      { source: "/chapters/start", destination: "/start-a-chapter", permanent: true },
      { source: "/cities", destination: "/chapters", permanent: true },
      { source: "/cities/:city", destination: "/chapters/:city", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
