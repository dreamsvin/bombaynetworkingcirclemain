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
    // Event covers are served from Luma's CDN (the same artwork as each event's Luma page). See content/events-luma.ts.
    remotePatterns: [{ protocol: "https", hostname: "images.lumacdn.com", pathname: "/**" }],
  },
  // OG images read the Playfair Display .woff files at render time; make sure they ship with the functions.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./node_modules/@fontsource/playfair-display/files/playfair-display-latin-*-normal.woff"],
    "/chapters/[city]/opengraph-image": ["./node_modules/@fontsource/playfair-display/files/playfair-display-latin-*-normal.woff"],
  },
  // The old static site's URLs. Anything shared in the past keeps working.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/sponsor.html", destination: "/sponsor", permanent: true },
      { source: "/join", destination: "/community", permanent: true },
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
