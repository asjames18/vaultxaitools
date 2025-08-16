import { Tool, Category } from '@/data/tools';

interface StructuredDataProps {
  type: 'tool' | 'category' | 'website' | 'organization';
  data: Tool | Category | any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'tool':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: data.name,
          description: data.description,
          url: data.website,
          applicationCategory: data.category,
          operatingSystem: 'Web, Mobile, Desktop',
          offers: {
            '@type': 'Offer',
            price: data.pricing === 'Free' ? '0' : data.pricing,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          },
          aggregateRating: data.rating ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviewCount || 0,
            bestRating: 5,
            worstRating: 1
          } : undefined,
          author: {
            '@type': 'Organization',
            name: 'VaultX AI Tools',
            url: 'https://vaultxaitools.com'
          },
          datePublished: data.created_at,
          dateModified: data.updated_at
        };

      case 'category':
        return {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${data.name} AI Tools`,
          description: `Best ${data.name} AI tools and applications`,
          url: `https://vaultxaitools.com/AITools?category=${data.slug}`,
          numberOfItems: data.toolCount || 0,
          itemListElement: data.tools?.map((tool: Tool, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'SoftwareApplication',
              name: tool.name,
              url: `https://vaultxaitools.com/tool/${tool.id}`,
              description: tool.description
            }
          })) || []
        };

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'VaultX AI Tools',
          description: 'Expert-curated AI tools directory. Discover, compare, and choose the best AI applications for your needs.',
          url: 'https://vaultxaitools.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://vaultxaitools.com/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          },
          publisher: {
            '@type': 'Organization',
            name: 'VaultX AI Tools',
            url: 'https://vaultxaitools.com'
          }
        };

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'VaultX AI Tools',
          description: 'Expert-curated AI tools directory and discovery platform',
          url: 'https://vaultxaitools.com',
          logo: 'https://vaultxaitools.com/logo.png',
          sameAs: [
            'https://twitter.com/vaultxaitools',
            'https://linkedin.com/company/vaultxaitools'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'contact@vaultxaitools.com'
          }
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();
  
  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}
