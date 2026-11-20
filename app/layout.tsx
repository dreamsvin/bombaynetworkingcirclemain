import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE } from "@/content/site";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { RevealObserver } from "@/components/site/reveal";

// Self-hosted (fontsource files, served from our origin), font-display: swap.
const newsreader = localFont({
  src: "../node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2",
  variable: "--font-newsreader",
  weight: "200 800",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const publicSans = localFont({
  src: "../node_modules/@fontsource-variable/public-sans/files/public-sans-latin-wght-normal.woff2",
  variable: "--font-public-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Bombay Networking Circle — founder networking events in 8 Indian cities",
    template: "%s · Bombay Networking Circle",
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    title: "Meet the people building in your city",
    description: "Free, hosted rooms for founders, operators and freelancers. 1,000+ members across 8 cities (Nov 2026). Find your circle.",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  // eslint-disable-next-line no-restricted-syntax -- browser chrome colour must be a literal; mirrors --c-paper
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${newsreader.variable} ${publicSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables scroll reveals only when JS runs. Without JS everything is visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-skip rounded-md bg-fg px-4 py-3 text-body-sm font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
