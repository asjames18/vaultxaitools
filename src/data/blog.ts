export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  image?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  featuredImage?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI Writing: How ChatGPT is Revolutionizing Content Creation',
    slug: 'future-ai-writing-chatgpt',
    excerpt: 'Discover how AI writing tools are transforming the way we create content, from blog posts to marketing copy.',
    content: 'AI writing tools have fundamentally changed how we approach content creation. From simple text generation to complex content strategies, these tools are reshaping the creative landscape...',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    category: 'Writing',
    readTime: '5 min read',
    featured: true,
    status: 'published',
    tags: ['AI Writing', 'ChatGPT', 'Content Creation', 'Productivity'],
    seoTitle: 'The Future of AI Writing: How ChatGPT is Revolutionizing Content Creation',
    seoDescription: 'Discover how AI writing tools are transforming content creation. Learn about ChatGPT and other AI writing assistants.',
    seoKeywords: ['AI Writing', 'ChatGPT', 'Content Creation', 'Productivity'],
    publishedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Top 10 AI Design Tools Every Designer Should Know in 2024',
    slug: 'top-10-ai-design-tools-2024',
    excerpt: 'From Midjourney to DALL-E, explore the most powerful AI design tools that are reshaping the creative industry.',
    content: 'The design industry is experiencing an AI revolution. Designers now have access to powerful tools that can generate, enhance, and transform their creative work...',
    author: 'Mike Chen',
    date: '2024-01-12',
    category: 'Design',
    readTime: '8 min read',
    featured: true,
    status: 'published',
    tags: ['AI Design', 'Midjourney', 'DALL-E', 'Creative Tools'],
    seoTitle: 'Top 10 AI Design Tools Every Designer Should Know in 2024',
    seoDescription: 'Explore the most powerful AI design tools including Midjourney, DALL-E, and more. Transform your creative workflow.',
    seoKeywords: ['AI Design', 'Midjourney', 'DALL-E', 'Creative Tools'],
    publishedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: '3',
    title: 'How GitHub Copilot is Changing the Way Developers Code',
    slug: 'github-copilot-changing-development',
    excerpt: 'An in-depth look at how AI-powered coding assistants are boosting developer productivity and code quality.',
    content: 'GitHub Copilot has become an essential tool for developers. This AI-powered coding assistant is transforming how we write, debug, and maintain code...',
    author: 'David Lee',
    date: '2024-01-10',
    category: 'Development',
    readTime: '6 min read',
    featured: false,
    status: 'published',
    tags: ['GitHub Copilot', 'AI Coding', 'Development', 'Productivity'],
    seoTitle: 'How GitHub Copilot is Changing the Way Developers Code',
    seoDescription: 'Learn how GitHub Copilot is revolutionizing software development with AI-powered code assistance.',
    seoKeywords: ['GitHub Copilot', 'AI Coding', 'Development', 'Productivity'],
    publishedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '4',
    title: 'AI Marketing Tools: The Complete Guide to Automating Your Marketing',
    slug: 'ai-marketing-tools-complete-guide',
    excerpt: 'Learn how AI marketing tools can help you automate campaigns, analyze data, and boost ROI.',
    content: 'Marketing automation with AI is no longer a luxury. It\'s becoming a necessity for businesses that want to stay competitive...',
    author: 'Emily Rodriguez',
    date: '2024-01-08',
    category: 'Marketing',
    readTime: '7 min read',
    featured: false,
    status: 'published',
    tags: ['AI Marketing', 'Automation', 'ROI', 'Campaigns'],
    seoTitle: 'AI Marketing Tools: The Complete Guide to Automating Your Marketing',
    seoDescription: 'Learn how AI marketing tools can help you automate campaigns, analyze data, and boost ROI.',
    seoKeywords: ['AI Marketing', 'Automation', 'ROI', 'Campaigns'],
    publishedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '5',
    title: 'The Rise of AI Video Generation: What You Need to Know',
    slug: 'rise-ai-video-generation',
    excerpt: 'Explore the latest developments in AI video generation and how it\'s transforming content creation.',
    content: 'Video content is king in today\'s digital landscape. AI video generation tools are making it easier than ever to create professional-quality content...',
    author: 'Alex Thompson',
    date: '2024-01-05',
    category: 'Video',
    readTime: '4 min read',
    featured: false,
    status: 'published',
    tags: ['AI Video', 'Content Creation', 'Synthesia', 'Runway'],
    seoTitle: 'The Rise of AI Video Generation: What You Need to Know',
    seoDescription: 'Explore the latest developments in AI video generation and how it\'s transforming content creation.',
    seoKeywords: ['AI Video', 'Content Creation', 'Synthesia', 'Runway'],
    publishedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    title: 'AI Productivity Tools: Boost Your Workflow in 2024',
    slug: 'ai-productivity-tools-boost-workflow-2024',
    excerpt: 'Discover the best AI productivity tools that can help you work smarter, not harder.',
    content: 'Productivity is the key to success in today\'s fast-paced world. AI productivity tools are helping professionals streamline their workflows...',
    author: 'Lisa Park',
    date: '2024-01-03',
    category: 'Productivity',
    readTime: '5 min read',
    featured: false,
    status: 'published',
    tags: ['Productivity', 'Workflow', 'Automation', 'Efficiency'],
    seoTitle: 'AI Productivity Tools: Boost Your Workflow in 2024',
    seoDescription: 'Discover the best AI productivity tools that can help you work smarter, not harder.',
    seoKeywords: ['Productivity', 'Workflow', 'Automation', 'Efficiency'],
    publishedAt: '2024-01-03T00:00:00Z'
  }
];

export const categories = [
  'All',
  'Writing',
  'Design',
  'Development',
  'Marketing',
  'Video',
  'Productivity',
  'Language'
];

export const blogStatuses = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' }
]; 