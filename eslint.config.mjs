import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Raw <img> is banned site-wide: next/image with real width/height only.
      "@next/next/no-img-element": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{6}\\b/]",
          message: "No hex values in components. Use a semantic token from tailwind.config.ts.",
        },
      ],
    },
  },
  {
    // Token sources, OG image renderers and generated files are where values legitimately live.
    files: ["app/**/opengraph-image.tsx", "app/icon.tsx", "app/apple-icon.tsx", "lib/og.tsx", "app/manifest.ts", "scripts/**", "tokens/**"],
    rules: { "no-restricted-syntax": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "lib/supabase/database.types.ts", ".pgdata/**"]),
]);
