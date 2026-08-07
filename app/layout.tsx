import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-var",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Une invitation — pour Sokhna",
    template: "%s | Une invitation",
  },
  description:
    "Une invitation élégante et respectueuse : choisir un lieu, une activité, une date, et se retrouver autour d'un bon moment.",
  applicationName: "Une invitation",
  keywords: ["invitation", "rencontre", "élégant", "respectueux"],
  authors: [{ name: "Une invitation" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Une invitation",
    title: "Une invitation — pour Sokhna",
    description: "Une proposition simple et élégante : un moment agréable, à ton rythme.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Une invitation — pour Sokhna",
    description: "Une proposition simple et élégante : un moment agréable, à ton rythme.",
  },
  robots: { index: false, follow: false },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#faf8f3",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
