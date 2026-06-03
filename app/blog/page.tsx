import { Metadata } from 'next';
import BlogClient from './BlogClient';
import JsonLd from '@/components/JsonLd';
import { getAllBlogPosts, getBlogCategories } from '@/lib/blog-service';

export const metadata: Metadata = {
  title: 'Tutorials & Blog - Melanated In Tech',
  description: 'Practical tutorials, guides, and insights on AI, automation, prompt engineering, software development, and emerging technology. Learn at your own pace and build real skills.',
  keywords: ['AI tutorials', 'tech education blog', 'prompt engineering guide', 'automation tutorials', 'software development tips', 'AI agents explained', 'digital transformation', 'tech for beginners'],
  openGraph: {
    title: 'Tutorials & Blog - Melanated In Tech',
    description: 'Practical tutorials and insights on AI, automation, prompt engineering, and software development. Learn and build real skills.',
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
    name: 'Melanated In Tech — Tutorials & Blog',
    description: 'Practical tutorials, guides, and insights on AI, automation, software development, and emerging technology.',
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