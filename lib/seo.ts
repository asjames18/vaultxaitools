import { Metadata } from 'next';
import { Tool, Category } from '@/data';

// Base metadata for the site
export const baseMetadata: Metadata = {
  metadataBase: new URL('https://vaultxaitools.com'),
  title: {
    default: 'VaultX AI Tools - Discover the Best AI Tools',
    template: '%s | VaultX AI Tools'
  },
  description: 'Your curated directory of the most powerful AI tools. Discover, compare, and master the future of technology.',
  keywords: [
    'AI tools',
    'artificial intelligence',
    'machine learning',
    'productivity',
    'development',
    'design',
    'automation',
    'chatgpt',
    'openai',
    'ai software'
  ],
  authors: [{ name: 'VaultX Team' }],
  creator: 'VaultX Team',
  publisher: 'VaultX AI Tools',
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
    siteName: 'VaultX AI Tools',
    title: 'VaultX AI Tools - Discover the Best AI Tools',
    description: 'Your curated directory of the most powerful AI tools. Discover, compare, and master the future of technology.',
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
    title: 'VaultX AI Tools - Discover the Best AI Tools',
    description: 'Your curated directory of the most powerful AI tools. Discover, compare, and master the future of technology.',
    images: ['/og-image.jpg'],
  },
};

// Generate metadata for tool pages
export function generateToolMetadata(tool: Tool): Metadata {
  const title = `${tool.name} - AI Tool Review & Alternatives`;
  const description = `${tool.description} Discover pricing, features, pros & cons, and alternatives to ${tool.name}. Rated ${tool.rating}/5 by ${tool.reviewCount} users.`;
  
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
      authors: ['VaultX Team'],
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
  const title = 'About VaultX AI Tools - Your AI Tool Directory';
  const description = 'Learn about VaultX AI Tools, your trusted directory for discovering and comparing the best artificial intelligence software and tools.';
  
  return {
    title,
    description,
    keywords: ['about', 'VaultX AI Tools', 'AI directory', 'artificial intelligence tools'],
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
    title: 'Blog - AI Tools Insights & Reviews',
    description: 'Stay updated with the latest AI tools, industry insights, and expert reviews. Discover how AI is transforming various industries.',
    keywords: [
      'AI tools blog',
      'artificial intelligence',
      'AI reviews',
      'tech insights',
      'AI industry news',
      'AI writing tools',
      'AI design tools',
      'AI development tools'
    ],
    openGraph: {
      title: 'Blog - AI Tools Insights & Reviews',
      description: 'Stay updated with the latest AI tools, industry insights, and expert reviews.',
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
      title: 'Blog - AI Tools Insights & Reviews',
      description: 'Stay updated with the latest AI tools, industry insights, and expert reviews.',
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
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: tool.pricing,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating,
      ratingCount: tool.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Organization',
      name: tool.name,
      url: tool.website,
    },
    datePublished: tool.createdAt,
    dateModified: tool.updatedAt,
    image: tool.logo,
    featureList: tool.features,
    softwareVersion: '1.0',
    downloadUrl: tool.website,
    installUrl: tool.website,
  };

  return structuredData;
}

// Generate structured data for the website
export function generateWebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VaultX AI Tools',
    description: 'Your curated directory of the most powerful AI tools',
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
      name: 'VaultX AI Tools',
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
    name: 'VaultX AI Tools',
    url: 'https://vaultxaitools.com',
    logo: 'https://vaultxaitools.com/logo.png',
    description: 'Your curated directory of the most powerful AI tools',
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
    description: 'Admin dashboard for managing VaultX AI Tools content and settings.',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${pageTitle} - Admin Dashboard`,
      description: 'Admin dashboard for managing VaultX AI Tools content and settings.',
      type: 'website',
    },
  };
} 