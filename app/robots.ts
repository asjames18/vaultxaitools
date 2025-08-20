import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/AITools',
          '/categories/*',
          '/tool/*',
          '/blog/*',
          '/about',
          '/contact',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/search',
          '/dashboard/',
          '/settings/',
          '/favorites/',
          '/sign-in',
          '/sign-up',
          '/reset-password',
          '/auth/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/search',
          '/dashboard/',
          '/settings/',
          '/favorites/',
          '/sign-in',
          '/sign-up',
          '/reset-password',
          '/auth/',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: 'https://vaultxaitools.com/sitemap.xml',
    host: 'https://vaultxaitools.com',
  };
} 