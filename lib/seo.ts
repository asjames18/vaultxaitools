import { Metadata } from 'next';
import { Tool, Category } from '@/data';

// Base metadata for the site
export const baseMetadata: Metadata = {
  metadataBase: new URL('https://vaultxaitools.com'),
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vaultxaitools.com',
    siteName: 'VaultX Tech',
    title: 'VaultX Tech - Church & Ministry Media Consultant',
    description: 'Church and ministry media consultant providing tools, resources, and guidance for effective media production.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VaultX AI Tools - Discover the Best AI Tools',
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
};

// Generate metadata for tool pages
export function generateToolMetadata(tool: Tool): Metadata {
  const title = `${tool.name} - AI Tool Review & Alternatives`;
  const description = `${tool.description} Discover pricing, features, pros & cons, and alternatives to ${tool.name}.`;
  
  return {
    title,
    description,
    keywords: [
      tool.name,
      'AI tool',
      tool.category.toLowerCase(),
      'artificial intelligence',
      'machine learning',
      ...tool.tags || [],
      'review',
      'alternatives',
      'pricing'
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://vaultxaitools.com/tool/${tool.id}`,
      images: [
        {
          url: tool.logo || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${tool.name} - AI Tool`,
        },
      ],
      publishedTime: tool.createdAt,
      modifiedTime: tool.updatedAt,
      authors: ['VaultX Tech'],
      section: tool.category,
      tags: tool.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [tool.logo || '/og-image.jpg'],
    },
    alternates: {
      canonical: `/tool/${tool.id}`,
    },
  };
}

// Generate metadata for category pages
export function generateCategoryMetadata(category: Category): Metadata {
  const title = `${category.name} AI Tools - Best ${category.name} Tools`;
  const description = `Discover the best ${category.name.toLowerCase()} AI tools. Compare features, pricing, and reviews of top ${category.name.toLowerCase()} artificial intelligence software.`;
  
  return {
    title,
    description,
    keywords: [
      category.name.toLowerCase(),
      'AI tools',
      'artificial intelligence',
      'machine learning',
      category.name.toLowerCase() + ' software',
      'automation',
      'productivity'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://vaultxaitools.com/categories/${category.name.toLowerCase()}`,
      images: [
        {
          url: `/categories/${category.name.toLowerCase()}.jpg`,
          width: 1200,
          height: 630,
          alt: `${category.name} AI Tools`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/categories/${category.name.toLowerCase()}.jpg`],
    },
    alternates: {
      canonical: `/categories/${category.name.toLowerCase()}`,
    },
  };
}

// Generate metadata for search pages
export function generateSearchMetadata(query: string): Metadata {
  const title = `Search Results for "${query}" - AI Tools`;
  const description = `Find the best AI tools for "${query}". Discover, compare, and choose from curated artificial intelligence software.`;
  
  return {
    title,
    description,
    keywords: [query, 'AI tools', 'artificial intelligence', 'search results'],
    robots: {
      index: false, // Don't index search results
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://vaultxaitools.com/search?q=${encodeURIComponent(query)}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}



// Generate metadata for about page
export function generateAboutMetadata(): Metadata {
  const title = 'About VaultX Tech - Church & Ministry Media Consultant';
  const description = 'Learn about VaultX Tech, your trusted church and ministry media consultant providing tools, resources, and guidance for effective media production.';
  
  return {
    title,
    description,
    keywords: ['about', 'VaultX Tech', 'church media consultant', 'ministry media tools'],
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://vaultxaitools.com/about',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: '/about',
    },
  };
}

// Generate metadata for blog page
export function generateBlogMetadata(): Metadata {
  return {
    title: 'Blog - Church & Ministry Media Resources',
    description: 'Stay updated with the latest church and ministry media tools, tutorials, best practices, and case studies. Learn how to effectively produce media for your ministry.',
    keywords: [
      'church media blog',
      'ministry media resources',
      'church video tutorials',
      'ministry graphics guides',
      'church social media tips',
      'ministry live streaming',
      'church audio production',
      'ministry media case studies'
    ],
    openGraph: {
      title: 'Blog - Church & Ministry Media Resources',
      description: 'Stay updated with the latest church and ministry media tools, tutorials, best practices, and case studies.',
      type: 'website',
      url: 'https://vaultxaitools.com/blog',
      images: [
        {
          url: '/og-blog.jpg',
          width: 1200,
          height: 630,
          alt: 'AI Tools Blog - Insights & Reviews',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog - Church & Ministry Media Resources',
      description: 'Stay updated with the latest church and ministry media tools, tutorials, best practices, and case studies.',
      images: ['/og-blog.jpg'],
    },
  };
}

// Generate structured data for tools
export function generateToolStructuredData(tool: Tool) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: tool.website,
    applicationCategory: tool.category,
    operatingSystem: 'Web, Mobile, Desktop',
    offers: {
      '@type': 'Offer',
      price: tool.pricing === 'Free' ? '0' : tool.pricing,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: tool.rating ? {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      reviewCount: tool.reviewCount || 0,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    author: {
      '@type': 'Organization',
      name: 'VaultX Tech',
      url: 'https://vaultxaitools.com'
    },
    datePublished: tool.createdAt,
    dateModified: tool.updatedAt,
    image: tool.logo,
    featureList: tool.features,
    softwareVersion: '1.0',
    downloadUrl: tool.website,
    installUrl: tool.website,
    keywords: tool.tags?.join(', ') || tool.category,
    applicationSubCategory: tool.category,
    screenshot: tool.logo,
    softwareRequirements: 'Modern web browser',
    permissions: 'None required',
    releaseNotes: `Latest version of ${tool.name}`,
  };

  return structuredData;
}

// Generate structured data for the website
export function generateWebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VaultX Tech',
    description: 'Church and ministry media consultant providing tools, resources, and guidance for effective media production',
    url: 'https://vaultxaitools.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://vaultxaitools.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VaultX Tech',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vaultxaitools.com/logo.png',
      },
    },
  };

  return structuredData;
}

// Generate structured data for breadcrumbs
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `https://vaultxaitools.com${crumb.url}`,
    })),
  };

  return structuredData;
}

// Generate structured data for organization
export function generateOrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VaultX Tech',
    url: 'https://vaultxaitools.com',
    logo: 'https://vaultxaitools.com/logo.png',
    description: 'Church and ministry media consultant providing tools, resources, and guidance for effective media production',
    sameAs: [
      'https://twitter.com/vaultxaitools',
      'https://linkedin.com/company/vaultxaitools',
      'https://github.com/vaultxaitools',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@vaultxaitools.com',
    },
  };

  return structuredData;
} 

// Generate metadata for admin pages
export function generateAdminMetadata(pageTitle: string): Metadata {
  return {
    title: `${pageTitle} - Admin Dashboard`,
    description: 'Admin dashboard for managing VaultX Tech content and settings.',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${pageTitle} - Admin Dashboard`,
      description: 'Admin dashboard for managing VaultX Tech content and settings.',
      type: 'website',
    },
  };
} 