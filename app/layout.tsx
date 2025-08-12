import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/react'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
  description: 'Access only the best AI tools, hand-picked and tested by our experts. Quality over quantity - every tool is verified for effectiveness and reliability.',
  keywords: 'curated AI tools, expert-tested AI, verified AI solutions, quality AI tools, hand-picked AI',
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
    title: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
    description: 'Access only the best AI tools, hand-picked and tested by our experts.',
    url: 'https://vaultxaitools.com',
    siteName: 'VaultX AI Tools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VaultX AI Tools - Expert-Curated AI Tool Directory',
    description: 'Access only the best AI tools, hand-picked and tested by our experts.',
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
