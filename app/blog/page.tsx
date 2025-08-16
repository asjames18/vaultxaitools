import { Metadata } from 'next';
import BlogClient from './BlogClient';
import JsonLd from '@/components/JsonLd';
import { getAllBlogPosts, getBlogCategories } from '@/lib/blog-service';

export const metadata: Metadata = {
  title: 'Blog - VaultX AI Tools',
  description: 'Discover the latest insights, tutorials, and guides about AI tools and technology. Stay updated with the newest developments in artificial intelligence.',
  keywords: ['AI blog', 'artificial intelligence', 'AI tools', 'technology blog', 'AI tutorials'],
  openGraph: {
    title: 'Blog - VaultX AI Tools',
    description: 'Discover the latest insights, tutorials, and guides about AI tools and technology.',
    type: 'website',
  },
};

export default async function BlogPage() {
  const [blogPosts, categories] = await Promise.all([
    getAllBlogPosts(),
    getBlogCategories()
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'VaultX AI Tools Blog',
    description: 'Insights, tutorials, and guides about AI tools and technology.',
    url: 'https://vaultxaitools.com/blog',
    blogPost: blogPosts.slice(0, 10).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://vaultxaitools.com/blog/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt,
      author: [{ '@type': 'Person', name: p.author }],
    })),
  } as const;

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogClient initialPosts={blogPosts} initialCategories={categories} />
    </>
  );
} 