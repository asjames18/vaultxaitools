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
    default: 'VaultX Tech - Church & Ministry Media Consultant',
    template: '%s | VaultX Tech'
  },
  description: 'Church and ministry media consultant providing tools, resources, and guidance for effective media production. Expert advice for video editing, graphics design, social media, live streaming, and audio production.',
  keywords: [
    'church media consultant',
    'ministry media tools',
    'church video production',
    'ministry graphics design',
    'church social media',
    'ministry live streaming',
    'church audio production',
    'ministry media resources',
    'church media guidance',
    'ministry media consulting'
  ],
  authors: [{ name: 'VaultX Tech' }],
  creator: 'VaultX Tech',
  publisher: 'VaultX Tech',
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
    title: 'VaultX Tech - Church & Ministry Media Consultant',
    description: 'Church and ministry media consultant providing tools, resources, and guidance for effective media production.',
    url: 'https://vaultxaitools.com',
    siteName: 'VaultX Tech',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VaultX Tech - Church & Ministry Media Consultant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vaultxaitools',
    creator: '@vaultxaitools',
    title: 'VaultX Tech - Church & Ministry Media Consultant',
    description: 'Church and ministry media consultant providing tools, resources, and guidance for effective media production.',
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
          name: 'VaultX Tech',
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
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <PerformanceMonitor />

        <PWAInstall />
      </body>
    </html>
  )
}
