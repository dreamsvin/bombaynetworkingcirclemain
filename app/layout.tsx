import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./house.css";
import "./network.css";
import { SITE } from "@/content/site";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { RevealObserver } from "@/components/site/reveal";

// Display serif: Fraunces (variable: weight, optical size, softness). Self-hosted, normal + italic.
const serif = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2", style: "normal", weight: "100 900" },
    { path: "../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

// UI and body: Instrument Sans (variable weight), self-hosted. Variable name kept so every existing class still resolves.
const archivo = localFont({
  src: "../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2",
  variable: "--font-archivo",
  weight: "400 700",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Bombay Networking Circle | The Right Rooms, The Right People",
    template: "%s · Bombay Networking Circle",
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: "The right rooms change everything. The right people make it happen.",
    description: "Discover Bombay Networking Circle, a growing network connecting people across cities, industries and experiences.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  // eslint-disable-next-line no-restricted-syntax -- browser chrome colour must be a literal; mirrors --c-paper
  themeColor: "#F5EFE6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${archivo.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables scroll reveals only when JS runs. Without JS everything is visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-skip bg-fg px-4 py-3 text-body-sm font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        {/* Vercel Analytics only exists on Vercel; elsewhere its script would 404. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
