'use client';

import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author = 'VaultX Team',
  section,
  tags = [],
}: SEOHeadProps) {
  const fullTitle = title.includes('VaultX') ? title : `${title} | VaultX AI Tools`;
  const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={`https://vaultxaitools.com${canonical}`} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical ? `https://vaultxaitools.com${canonical}` : 'https://vaultxaitools.com'} />
      <meta property="og:site_name" content="VaultX AI Tools" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={`https://vaultxaitools.com${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vaultxaitools" />
      <meta name="twitter:creator" content="@vaultxaitools" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={`https://vaultxaitools.com${ogImage}`} />
      
      {/* Article specific meta tags */}
      {ogType === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.length > 0 && tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#3b82f6" />
      
      {/* Language and region */}
      <meta httpEquiv="content-language" content="en" />
      <meta name="language" content="en" />
      <meta name="geo.region" content="US" />
      
      {/* Social media verification */}
      <meta name="twitter:site" content="@vaultxaitools" />
      <meta name="twitter:creator" content="@vaultxaitools" />
      
      {/* Structured data hints */}
      <meta name="application-name" content="VaultX AI Tools" />
      <meta name="apple-mobile-web-app-title" content="VaultX AI Tools" />
    </Head>
  );
}
