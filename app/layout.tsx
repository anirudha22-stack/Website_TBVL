import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import { lab } from "@/lib/tbvl";
import "./globals.css";

/**
 * Three voices, each with a job.
 *
 * Instrument Sans carries the interface and the headlines. JetBrains
 * Mono is the instrument voice — labels, counts, identifiers, anything
 * the lab would call data. Newsreader is used only for publication
 * titles, because a paper title set in a serif is what a paper title
 * looks like, and that borrowed authority is worth the extra font.
 */
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tbvl.iiserb.ac.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${lab.name} — ${lab.tagline}`,
  description: lab.intro,
  keywords: [
    "Trustworthy AI",
    "Biometrics",
    "Computer Vision",
    "Deepfake Detection",
    "Adversarial Robustness",
    "Explainable AI",
    "IISER Bhopal",
  ],
  openGraph: {
    title: `${lab.name} (${lab.short})`,
    description: lab.intro,
    url: siteUrl,
    siteName: lab.short,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${newsreader.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
