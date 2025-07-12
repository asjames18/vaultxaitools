import { Metadata } from 'next';
import BlogClient from './BlogClient';
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

  return <BlogClient initialPosts={blogPosts} initialCategories={categories} />;
} 