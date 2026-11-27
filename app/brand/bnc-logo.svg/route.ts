import { BNC_LOGO } from "@/components/site/logo-paths";

export const dynamic = "force-static";

/** The main logo as a standalone SVG file (used by Organization JSON-LD and for downloads). */
export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BNC_LOGO.viewBox}"><path fill="#7A2E22" fill-rule="evenodd" d="${BNC_LOGO.d}"/></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" } });
}
