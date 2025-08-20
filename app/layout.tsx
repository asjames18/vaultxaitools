import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from '@/components/ErrorBoundary'
import JsonLd from '@/components/JsonLd'
import SEOMonitor from '@/components/SEOMonitor'

import PWAInstall from '@/components/PWAInstall'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
    template: '%s | VaultX AI Tools'
  },
  description: 'Access only the best AI tools, hand-picked and tested by our experts. Quality over quantity - every tool is verified for effectiveness and reliability.',
  keywords: [
    'curated AI tools',
    'expert-tested AI',
    'verified AI solutions', 
    'quality AI tools',
    'hand-picked AI',
    'artificial intelligence tools',
    'AI software directory',
    'best AI tools 2024',
    'AI tool reviews',
    'AI tool comparisons'
  ],
  authors: [{ name: 'VaultX' }],
  creator: 'VaultX',
  publisher: 'VaultX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vaultxaitools.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
    description: 'Access only the best AI tools, hand-picked and tested by our experts.',
    url: 'https://vaultxaitools.com',
    siteName: 'VaultX AI Tools',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vaultxaitools',
    creator: '@vaultxaitools',
    title: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
    description: 'Access only the best AI tools, hand-picked and tested by our experts.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Remove the problematic script that causes hydration mismatch */}
      </head>
      <body className={`${inter.className} pt-14`} suppressHydrationWarning>
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'VaultX AI Tools',
          url: 'https://vaultxaitools.com',
          logo: 'https://vaultxaitools.com/logo.png',
          sameAs: [
            'https://twitter.com/vaultxaitools',
            'https://www.linkedin.com/company/vaultxaitools'
          ]
        }} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus-visible:outline-2 focus-visible:outline-blue-500">
          Skip to main content
        </a>
        <Navigation />
        <ErrorBoundary>
          <main id="main-content" role="main">
            {children}
          </main>
        </ErrorBoundary>
        <Footer />
        <Analytics />
        <SEOMonitor />

        <PWAInstall />
      </body>
    </html>
  )
}
