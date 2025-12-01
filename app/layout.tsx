import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Department of Gambling | Quantitative Sports Research",
  description: "Systematic. Transparent. Mathematically Driven. Professional sports betting portfolio management with quantitative analysis.",
  keywords: ["sports betting", "quantitative analysis", "portfolio management", "sports research", "data-driven betting"],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SiteHeader />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
