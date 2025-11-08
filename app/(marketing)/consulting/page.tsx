import type { Metadata } from 'next';
import ConsultingClient from './ConsultingClient';
import JsonLd from '@/components/JsonLd';

// Brand constants
const SITE_NAME = 'VaultX Tech';
const PRIMARY_CTA_TEXT = 'Send Us a Message';
const CONTACT_EMAIL = 'contact@vaultxiatools.com';
const BUSINESS_CITY = 'Highlands County, FL';
const TWITTER_HANDLE = '#';
const LOGO_SRC = '/logo-vaultx.svg';
const OG_IMAGE = '/og-vaultx-ai.jpg'; // TODO replace
const BASE_URL = 'https://vaultxaitools.com'; // TODO replace

export const metadata: Metadata = {
  title: 'VaultX Tech Consulting — Church & Ministry Media Services',
  description:
    'Church and ministry media consulting services. Expert guidance for video production, graphics design, social media, live streaming, and audio production. Faith-rooted, ministry-focused. Send us a message to get started.',
  openGraph: {
    title: 'VaultX Tech Consulting — Church & Ministry Media Services',
    description:
      'Church and ministry media consulting services. Expert guidance for video production, graphics design, social media, live streaming, and audio production.',
    url: `${BASE_URL}/consulting`,
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VaultX Tech Consulting — Church & Ministry Media Services',
    description:
      'Church and ministry media consulting services. Expert guidance for video production, graphics design, social media, live streaming, and audio production.',
    images: [OG_IMAGE],
    creator: TWITTER_HANDLE,
  },
  metadataBase: new URL(BASE_URL),
};

function professionalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: `${BASE_URL}/consulting`,
    image: `${BASE_URL}${OG_IMAGE}`,
    logo: `${BASE_URL}${LOGO_SRC}`,
    email: CONTACT_EMAIL,
    areaServed: 'US',
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS_CITY,
      addressCountry: 'US',
    },
    sameAs: [TWITTER_HANDLE],
  } as const;
}

export default function ConsultingPage() {
  const jsonLd = professionalServiceJsonLd();
  return (
    <>
      <JsonLd data={jsonLd} />
      <ConsultingClient
        constants={{
          SITE_NAME,
          PRIMARY_CTA_TEXT,
          CONTACT_EMAIL,
          BUSINESS_CITY,
          TWITTER_HANDLE,
          LOGO_SRC,
          OG_IMAGE,
          BASE_URL,
        }}
      />
    </>
  );
}


