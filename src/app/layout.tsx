import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VaultX AI Tools - Discover the Best AI Tools',
    template: '%s | VaultX AI Tools'
  },
  description: 'Find and compare the best AI tools for your needs. From language models to image generators, discover powerful AI solutions.',
  keywords: 'AI tools, artificial intelligence, machine learning, productivity tools',
  authors: [{ name: 'VaultX' }],
  creator: 'VaultX',
  publisher: 'VaultX',
  robots: 'index, follow',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    title: 'VaultX AI Tools - Discover the Best AI Tools',
    description: 'Find and compare the best AI tools for your needs.',
    url: 'https://vaultxaitools.com',
    siteName: 'VaultX AI Tools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VaultX AI Tools - Discover the Best AI Tools',
    description: 'Find and compare the best AI tools for your needs.',
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://eyrjonntxrlykglvskua.supabase.co" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  // Measure Core Web Vitals
                  if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((list) => {
                      for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                          console.log('LCP:', entry.startTime);
                        }
                        if (entry.entryType === 'first-input') {
                          console.log('FID:', entry.processingStart - entry.startTime);
                        }
                      }
                    });
                    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
                  }
                  
                  // Measure FCP
                  const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
                  if (fcpEntry) {
                    console.log('FCP:', fcpEntry.startTime);
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="__className_e8ce0c">
        <ErrorBoundary>
          <Navigation />
        </ErrorBoundary>
        
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
        
        <Analytics />
      </body>
    </html>
  );
}
