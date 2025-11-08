import { Metadata } from 'next';
import BlogClient from './BlogClient';
import JsonLd from '@/components/JsonLd';
import { getAllBlogPosts, getBlogCategories } from '@/lib/blog-service';

export const metadata: Metadata = {
  title: 'Blog - VaultX Tech',
  description: 'Discover the latest insights, tutorials, best practices, and case studies about church and ministry media production. Stay updated with media tools, techniques, and strategies.',
  keywords: ['church media blog', 'ministry media resources', 'church video tutorials', 'ministry graphics guides', 'church social media tips', 'ministry live streaming', 'church audio production'],
  openGraph: {
    title: 'Blog - VaultX Tech',
    description: 'Discover the latest insights, tutorials, best practices, and case studies about church and ministry media production.',
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
    name: 'VaultX Tech Blog',
    description: 'Insights, tutorials, best practices, and case studies about church and ministry media production.',
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