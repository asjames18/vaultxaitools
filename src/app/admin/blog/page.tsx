import { Metadata } from 'next';
import BlogManagementClient from './BlogManagementClient';
import { generateAdminMetadata } from '@/lib/seo';

export const metadata: Metadata = generateAdminMetadata('Blog Management');

export default function AdminBlogPage() {
  return <BlogManagementClient />;
} 