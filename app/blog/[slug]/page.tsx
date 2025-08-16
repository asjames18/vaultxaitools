import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import JsonLd from '@/components/JsonLd';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog-service';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - VaultX AI Tools',
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current post)
  const allPosts = await getAllBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: [{ '@type': 'Person', name: post.author }],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://vaultxaitools.com/blog/${post.slug}`,
    },
    image: post.featuredImage ? [post.featuredImage] : undefined,
  } as const;

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vaultxaitools.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://vaultxaitools.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://vaultxaitools.com/blog/${post.slug}` },
    ],
  } as const;

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbStructuredData} />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
} 