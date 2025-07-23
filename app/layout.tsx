import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VaultX AI Tools - Discover the Best AI Tools',
  description: 'Find and compare the best AI tools for your needs. From language models to image generators, discover powerful AI solutions.',
  keywords: 'AI tools, artificial intelligence, machine learning, productivity tools',
  authors: [{ name: 'VaultX' }],
  creator: 'VaultX',
  publisher: 'VaultX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vaultxaitools.com'),
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-14`}>
        <Navigation />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
