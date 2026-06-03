import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from '@/components/ErrorBoundary'
import JsonLd from '@/components/JsonLd'
import SEOMonitor from '@/components/SEOMonitor'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import PerformanceMonitor from '@/components/PerformanceMonitor'

import PWAInstall from '@/components/PWAInstall'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Melanated In Tech - Learn Tech. Build Skills. Create Opportunities.',
    template: '%s | Melanated In Tech'
  },
  description: 'Melanated In Tech is a technology education platform helping people learn AI, automation, software development, and emerging tech. Build skills, create opportunities, and thrive in the digital economy.',
  keywords: [
    'AI education',
    'learn artificial intelligence',
    'AI tools',
    'AI agents',
    'prompt engineering',
    'automation',
    'software development',
    'tech education',
    'digital transformation',
    'productivity tools',
    'emerging technology',
    'entrepreneurship',
    'melanated in tech'
  ],
  authors: [{ name: 'Melanated In Tech' }],
  creator: 'Melanated In Tech',
  publisher: 'Melanated In Tech',
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
    title: 'Melanated In Tech - Learn Tech. Build Skills. Create Opportunities.',
    description: 'Melanated In Tech helps people learn AI, automation, software development, and emerging technology to build skills, create opportunities, and thrive in the digital economy.',
    url: 'https://vaultxaitools.com',
    siteName: 'Melanated In Tech',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Melanated In Tech - Learn Tech. Build Skills. Create Opportunities.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@melanatedintech',
    creator: '@melanatedintech',
    title: 'Melanated In Tech - Learn Tech. Build Skills. Create Opportunities.',
    description: 'Melanated In Tech helps people learn AI, automation, software development, and emerging technology to build skills and create opportunities.',
    images: ['/opengraph-image'],
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
          name: 'Melanated In Tech',
          url: 'https://vaultxaitools.com',
          logo: 'https://vaultxaitools.com/logo.png',
          image: 'https://vaultxaitools.com/logo.png',
          sameAs: [
            'https://twitter.com/melanatedintech',
            'https://www.linkedin.com/company/melanatedintech'
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
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <PerformanceMonitor />

        <PWAInstall />
      </body>
    </html>
  )
}
