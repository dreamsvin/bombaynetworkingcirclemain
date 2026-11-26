/**
 * Bombay Networking Circle — Tailwind config.
 *
 * Tailwind v4: loaded from app/globals.css via `@config "../tailwind.config.ts"`.
 * Every value points at a CSS variable defined in globals.css (values come from tokens/build_tokens.py),
 * so `data-tone="ink"` re-themes a whole section without new classes.
 *
 * Scales are CLOSED: colours, spacing, radius, font sizes, shadows and z-index replace Tailwind's
 * defaults. If `bg-zinc-900` or `p-7` doesn't exist, that is the system working. Add to the scale here.
 */
import type { Config } from "tailwindcss";

const v = (name: string) => `var(--${name})`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.ts"],
  theme: {
    screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      bg: v("bg"),
      "bg-raised": v("bg-raised"),
      "bg-card": v("bg-card"),
      "bg-overlay": v("bg-overlay"),
      fg: v("fg"),
      "fg-muted": v("fg-muted"),
      "fg-subtle": v("fg-subtle"),
      accent: v("accent"),
      "accent-hover": v("accent-hover"),
      "accent-press": v("accent-press"),
      "on-accent": v("on-accent"),
      "accent-text": v("accent-text"),
      brand: v("brand"),
      "brand-text": v("brand-text"),
      support: v("support"),
      "support-tint": v("support-tint"),
      "on-support-tint": v("on-support-tint"),
      line: v("line"),
      "line-strong": v("line-strong"),
      "line-control": v("line-control"),
      focus: v("focus"),
      danger: v("danger"),
      success: v("success"),
      scrim: v("scrim"),
    },
    // 4px base. Section rhythm uses the fluid tokens.
    spacing: {
      0: "0px",
      px: "1px",
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      10: "40px",
      11: "44px", // minimum hit target
      12: "48px",
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      gutter: v("gutter"),
      "section-sm": v("section-sm"),
      section: v("section"),
      nav: v("nav-height"),
    },
    // Modernist structure: square corners everywhere. Only `full` (the round logo seal, avatars) is curved.
    borderRadius: { none: "0", sm: "0", md: "0", lg: "0", xl: "0", full: "9999px" },
    // Editorial hairlines: `border-2` renders 1px (class name kept so every rule on the site changes in one place).
    borderWidth: { DEFAULT: "1px", 0: "0", 2: "1px", 3: "2px" },
    fontFamily: { display: v("font-display"), serif: v("font-display"), sans: v("font-sans"), mono: v("font-mono") },
    fontSize: {
      // Display sizes are set in the editorial serif (regular weight only).
      "display-2xl": [v("text-display-2xl"), { lineHeight: "0.92", letterSpacing: "-0.025em", fontWeight: "400" }],
      "display-xl": [v("text-display-xl"), { lineHeight: "0.98", letterSpacing: "-0.02em", fontWeight: "400" }],
      "display-lg": [v("text-display-lg"), { lineHeight: "1.02", letterSpacing: "-0.015em", fontWeight: "400" }],
      "display-md": [v("text-display-md"), { lineHeight: "1.06", letterSpacing: "-0.01em", fontWeight: "400" }],
      "heading-lg": [v("text-heading-lg"), { lineHeight: "1.18", letterSpacing: "-0.01em", fontWeight: "800" }],
      "heading-md": [v("text-heading-md"), { lineHeight: "1.2", fontWeight: "700" }],
      "heading-sm": [v("text-heading-sm"), { lineHeight: "1.25", fontWeight: "700" }],
      "body-lg": [v("text-body-lg"), { lineHeight: "1.6" }],
      body: [v("text-body"), { lineHeight: "1.65" }],
      "body-sm": [v("text-body-sm"), { lineHeight: "1.6" }],
      caption: [v("text-caption"), { lineHeight: "1.5" }],
      label: [v("text-label"), { lineHeight: "1.2", letterSpacing: "0.1em", fontWeight: "600" }],
    },
    fontWeight: { regular: "400", medium: "500", semibold: "600", bold: "700", extrabold: "800" },
    maxWidth: {
      wide: "1440px",
      container: "1200px",
      prose: "680px",
      measure: "60ch",
      none: "none",
      full: "100%",
    },
    boxShadow: { none: "none", e1: v("shadow-e1"), e2: v("shadow-e2") },
    zIndex: { base: "0", raised: "10", header: "200", overlay: "300", sheet: "310", skip: "500" },
    transitionDuration: { fast: v("dur-fast"), base: v("dur-base"), moderate: v("dur-moderate") },
    transitionTimingFunction: { out: v("ease-out"), "in-out": v("ease-in-out") },
    extend: {
      gridTemplateColumns: { 12: "repeat(12, minmax(0, 1fr))" },
      aspectRatio: { photo: "3 / 2", portrait: "4 / 5", wide: "16 / 9", tall: "3 / 4" },
    },
  },
};

export default config;
