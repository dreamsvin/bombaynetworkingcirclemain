import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { CUP } from "@/components/site/logo-paths";

/** Shared OG renderer: 1200×630, logo + one line of positioning. Colours and type follow the BNC brand guidelines (Anchor Black, Cream, Deep Brown, BNC Gold; Playfair Display). */
export const OG_SIZE = { width: 1200, height: 630 };

const font = (w: 400 | 500) => readFile(path.join(process.cwd(), `node_modules/@fontsource/playfair-display/files/playfair-display-latin-${w}-normal.woff`));

export async function ogImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const [regular, medium] = await Promise.all([font(400), font(500)]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F9F5EF", padding: 72, fontFamily: "Playfair Display" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox={CUP.viewBox}>
            <path d={CUP.d} fill="#7C5C38" fillRule="evenodd" />
          </svg>
          <span style={{ fontSize: 34, color: "#1A1612", fontWeight: 500 }}>Bombay Networking Circle</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 26, color: "#665D53", letterSpacing: 3, textTransform: "uppercase" }}>{eyebrow}</span>
          <span style={{ fontSize: 76, lineHeight: 1.05, color: "#1A1612", fontWeight: 500, marginTop: 16, maxWidth: 1000 }}>{title}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #C68536", paddingTop: 24 }}>
          <span style={{ fontSize: 28, color: "#4F473F" }}>{footer}</span>
          <span style={{ fontSize: 28, color: "#FFFFFF", background: "#7C5C38", padding: "12px 28px", borderRadius: 999 }}>Find your circle</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Playfair Display", data: regular, weight: 400, style: "normal" },
        { name: "Playfair Display", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
