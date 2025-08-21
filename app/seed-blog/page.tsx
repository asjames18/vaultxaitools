import Link from 'next/link';
import { createBlogPost } from '@/lib/blog-service';

const samplePosts = [
  {
    title: 'The Future of AI Writing: How ChatGPT is Revolutionizing Content Creation',
    slug: 'future-ai-writing-chatgpt',
    excerpt: 'Discover how AI writing tools are transforming the way we create content, from blog posts to marketing copy.',
    content: 'AI writing tools have fundamentally changed how we approach content creation. From simple text generation to complex content strategies, these tools are reshaping the creative landscape. ChatGPT, in particular, has become a game-changer for writers, marketers, and content creators worldwide.\n\nIn this comprehensive guide, we\'ll explore how AI writing tools are revolutionizing content creation and what this means for the future of writing.',
    author: 'Sarah Johnson',
    category: 'Writing',
    readTime: '5 min read',
    featured: true,
    status: 'published' as const,
    tags: ['AI Writing', 'ChatGPT', 'Content Creation', 'Productivity'],
    seoTitle: 'The Future of AI Writing: How ChatGPT is Revolutionizing Content Creation',
    seoDescription: 'Discover how AI writing tools are transforming content creation. Learn about ChatGPT and other AI writing assistants.',
    seoKeywords: ['AI Writing', 'ChatGPT', 'Content Creation', 'Productivity'],
    publishedAt: new Date().toISOString()
  },
  {
    title: 'Top 10 AI Design Tools Every Designer Should Know in 2024',
    slug: 'top-10-ai-design-tools-2024',
    excerpt: 'From Midjourney to DALL-E, explore the most powerful AI design tools that are reshaping the creative industry.',
    content: 'The design industry is experiencing an AI revolution. Designers now have access to powerful tools that can generate, enhance, and transform their creative work. From image generation to layout optimization, AI is becoming an essential part of the design workflow.\n\nIn this article, we\'ll explore the top 10 AI design tools that every designer should be familiar with in 2024.',
    author: 'Mike Chen',
    category: 'Design',
    readTime: '8 min read',
    featured: true,
    status: 'published' as const,
    tags: ['AI Design', 'Midjourney', 'DALL-E', 'Creative Tools'],
    seoTitle: 'Top 10 AI Design Tools Every Designer Should Know in 2024',
    seoDescription: 'Explore the most powerful AI design tools including Midjourney, DALL-E, and more. Transform your creative workflow.',
    seoKeywords: ['AI Design', 'Midjourney', 'DALL-E', 'Creative Tools'],
    publishedAt: new Date().toISOString()
  },
  {
    title: 'How GitHub Copilot is Changing the Way Developers Code',
    slug: 'github-copilot-changing-development',
    excerpt: 'An in-depth look at how AI-powered coding assistants are boosting developer productivity and code quality.',
    content: 'GitHub Copilot has become an essential tool for developers. This AI-powered coding assistant is transforming how we write, debug, and maintain code. By understanding context and providing intelligent suggestions, Copilot is helping developers work more efficiently than ever before.\n\nLet\'s explore how GitHub Copilot is changing the development landscape and what this means for the future of programming.',
    author: 'David Lee',
    category: 'Development',
    readTime: '6 min read',
    featured: false,
    status: 'published' as const,
    tags: ['GitHub Copilot', 'AI Coding', 'Development', 'Productivity'],
    seoTitle: 'How GitHub Copilot is Changing the Way Developers Code',
    seoDescription: 'Learn how GitHub Copilot is revolutionizing software development with AI-powered code assistance.',
    seoKeywords: ['GitHub Copilot', 'AI Coding', 'Development', 'Productivity'],
    publishedAt: new Date().toISOString()
  }
];

export default async function SeedBlogPage() {
  // Prevent seeding during build time
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Blog Seed Results</h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Blog seeding is disabled during build time to prevent duplicate key errors.</p>
            <p className="mt-2">Visit this page in development mode to seed blog posts.</p>
          </div>
        </div>
      </div>
    );
  }

  const results = [];
  
  for (const post of samplePosts) {
    try {
      const createdPost = await createBlogPost(post);
      results.push({
        title: post.title,
        success: !!createdPost,
        id: createdPost?.id || 'Failed',
        message: createdPost ? 'Created successfully' : 'Failed to create'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      // Check if it's a duplicate key error
      if (errorMessage.includes('duplicate key value violates unique constraint')) {
        results.push({
          title: post.title,
          success: true,
          id: 'Already exists',
          message: 'Post already exists in database'
        });
      } else {
        results.push({
          title: post.title,
          success: false,
          error: errorMessage
        });
      }
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog Seed Results</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Seeding Results</h2>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className={`border rounded p-4 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <h3 className="font-semibold">{result.title}</h3>
                <p className="text-sm">
                  Status: {result.success ? '✅ Success' : '❌ Failed'}
                </p>
                {result.success && <p className="text-sm text-gray-600">ID: {result.id}</p>}
                {result.message && <p className="text-sm text-gray-600">{result.message}</p>}
                {!result.success && <p className="text-sm text-red-600">Error: {result.error}</p>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-center space-x-4">
          <Link 
            href="/debug-blog" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check Debug Page
          </Link>
          <Link 
            href="/blog" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            View Blog
          </Link>
        </div>
      </div>
    </div>
  );
} 