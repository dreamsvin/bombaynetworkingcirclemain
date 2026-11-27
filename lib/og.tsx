import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { BNC_LOGO } from "@/components/site/logo-paths";

/** Shared OG renderer: 1200×630, logo + one line of positioning. Colours mirror tokens (ink/white/brown/navy). */
export const OG_SIZE = { width: 1200, height: 630 };

const font = (w: 400 | 800) => readFile(path.join(process.cwd(), `node_modules/@fontsource/archivo/files/archivo-latin-${w}-normal.woff`));

export async function ogImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const [regular, heavy] = await Promise.all([font(400), font(800)]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF", padding: 72, fontFamily: "Archivo", borderBottom: "24px solid #7A2E22" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="120" height="118" viewBox={BNC_LOGO.viewBox}>
            <path d={BNC_LOGO.d} fill="#7A2E22" fillRule="evenodd" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 24, color: "#7A2E22", letterSpacing: 3, textTransform: "uppercase" }}>{eyebrow}</span>
          <span style={{ fontSize: 72, lineHeight: 1.05, color: "#1F1F1F", fontWeight: 800, marginTop: 16, maxWidth: 1050, letterSpacing: -1 }}>{title}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #1F1F1F", paddingTop: 24 }}>
          <span style={{ fontSize: 26, color: "#444444" }}>{footer}</span>
          <span style={{ fontSize: 28, color: "#FFFFFF", background: "#1B3A5C", padding: "12px 28px", fontWeight: 800 }}>Request access</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
        { name: "Archivo", data: heavy, weight: 800, style: "normal" },
      ],
    },
  );
}
