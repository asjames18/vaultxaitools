import type { Metadata } from 'next';
import ConsultingClient from './ConsultingClient';
import JsonLd from '@/components/JsonLd';

// Brand constants
const SITE_NAME = 'Melanated In Tech';
const PRIMARY_CTA_TEXT = 'Send Us a Message';
const CONTACT_EMAIL = 'contact@melanatedintech.com';
const BUSINESS_CITY = 'Highlands County, FL';
const TWITTER_HANDLE = '@melanatedintech';
const LOGO_SRC = '/logo.png';
const OG_IMAGE = '/opengraph-image';
const BASE_URL = 'https://vaultxaitools.com';

export const metadata: Metadata = {
  title: 'Services — Melanated In Tech',
  description:
    'Technology consulting and education services from Melanated In Tech. Expert guidance for AI strategy, automation, software development, digital transformation, and emerging technology adoption.',
  openGraph: {
    title: 'Services — Melanated In Tech',
    description:
      'Technology consulting and education services. Expert guidance for AI strategy, automation, software development, and digital transformation.',
    url: `${BASE_URL}/consulting`,
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services — Melanated In Tech',
    description:
      'Technology consulting and education services. Expert guidance for AI strategy, automation, software development, and digital transformation.',
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


