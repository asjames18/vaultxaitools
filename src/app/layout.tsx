import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { baseMetadata, generateWebsiteStructuredData, generateOrganizationStructuredData } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteStructuredData = generateWebsiteStructuredData();
  const organizationStructuredData = generateOrganizationStructuredData();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        {/* Prevent hydration mismatch from browser extensions */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Remove any theme attributes that might be added by browser extensions
                if (typeof window !== 'undefined') {
                  const html = document.documentElement;
                  if (html.hasAttribute('data-theme')) {
                    html.removeAttribute('data-theme');
                  }
                  if (html.style.colorScheme) {
                    html.style.removeProperty('color-scheme');
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
