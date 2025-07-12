import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { generateBlogMetadata } from '@/lib/seo';

export const metadata: Metadata = generateBlogMetadata();

export default function BlogPage() {
  return <BlogClient />;
} 