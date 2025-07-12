'use client';

import Link from 'next/link';
import { blogPosts, BlogPost } from '@/data/blog';

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  // Get related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                {post.category}
              </span>
              <span className="text-blue-200 text-sm">
                {post.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{post.author}</div>
                  <div className="text-blue-200 text-sm">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article Body */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {post.content}
            </p>
            
            {/* Extended content for demo purposes */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Artificial intelligence has become an integral part of our daily lives, transforming how we work, create, and interact with technology. The tools we've explored in this article represent just the beginning of what's possible with AI.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
              Key Takeaways
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6">
              <li>AI tools are becoming more accessible and user-friendly</li>
              <li>Integration with existing workflows is crucial for adoption</li>
              <li>Quality and accuracy continue to improve rapidly</li>
              <li>Cost-effectiveness is making AI tools viable for small businesses</li>
            </ul>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              As we look to the future, it's clear that AI will continue to evolve and become even more sophisticated. The key is to stay informed about the latest developments and choose tools that align with your specific needs and goals.
            </p>
            
            <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-700 dark:text-gray-300 my-8">
              "The best way to predict the future is to invent it." - Alan Kay
            </blockquote>
            
            <p className="text-gray-600 dark:text-gray-400">
              Whether you're a developer, designer, marketer, or content creator, there's an AI tool out there that can help you work more efficiently and creatively. The key is to experiment, learn, and find what works best for your unique situation.
            </p>
          </div>

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  About {post.author}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {post.author} is a technology enthusiast and AI tools expert with years of experience in the industry. 
                  They specialize in helping professionals discover and implement the best AI solutions for their needs.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                        {relatedPost.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {relatedPost.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {relatedPost.author}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(relatedPost.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
} 