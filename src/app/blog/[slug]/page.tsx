import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';
import { blogPosts } from '@/data/blog';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPosts.find(p => p.id === params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - AI Tools Blog`,
    description: post.excerpt,
    keywords: [...post.tags, 'AI tools', 'artificial intelligence', 'blog'],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://vaultxaitools.com/blog/${post.id}`,
      authors: [post.author],
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find(p => p.id === params.slug);
  
  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
} 