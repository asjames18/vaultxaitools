import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VaultX AI Tools - Discover the Best AI Tools",
  description: "Your curated directory of the most powerful AI tools. Discover, compare, and master the future of technology.",
  keywords: ["AI tools", "artificial intelligence", "machine learning", "productivity", "development", "design"],
  authors: [{ name: "VaultX Team" }],
  openGraph: {
    title: "VaultX AI Tools - Discover the Best AI Tools",
    description: "Your curated directory of the most powerful AI tools. Discover, compare, and master the future of technology.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VaultX AI Tools - Discover the Best AI Tools",
    description: "Your curated directory of the most powerful AI tools. Discover, compare, and master the future of technology.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
