import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Display: Fraunces — a warm, characterful serif for an artisanal feel.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Body: Plus Jakarta Sans — clean, friendly, modern.
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HoneyTerra — Sustainable living, beautifully made",
    template: "%s · HoneyTerra",
  },
  description:
    "Eco-friendly essentials for a cleaner home. Gel Ash Trays and reusable Honey Comb beeswax wraps, thoughtfully designed and made with care.",
  metadataBase: new URL("https://honeyterra.com"),
  openGraph: {
    title: "HoneyTerra",
    description: "Sustainable living, beautifully made.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
