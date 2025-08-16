export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  category: 'ai-news' | 'tool-update' | 'industry';
  tags: string[];
}

// Fallback news data when News API is not available
export const fallbackNews: NewsItem[] = [
  {
    id: 'fallback-1',
    title: 'OpenAI Releases GPT-4 Turbo with Enhanced Capabilities',
    description: 'OpenAI has announced the release of GPT-4 Turbo, featuring improved performance, longer context windows, and more accurate responses. The new model shows significant improvements in reasoning and creative tasks.',
    url: 'https://openai.com/blog/gpt-4-turbo',
    source: 'OpenAI Blog',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    category: 'ai-news',
    tags: ['openai', 'gpt-4', 'turbo', 'ai-model']
  },
  {
    id: 'fallback-2',
    title: 'Google Launches Gemini Pro with Advanced Multimodal Features',
    description: 'Google has unveiled Gemini Pro, their latest AI model that can understand and generate text, images, and code. The model demonstrates impressive capabilities across multiple domains.',
    url: 'https://ai.google.dev/gemini',
    source: 'Google AI',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    category: 'ai-news',
    tags: ['google', 'gemini', 'multimodal', 'ai']
  },
  {
    id: 'fallback-3',
    title: 'Anthropic Releases Claude 3 with Improved Reasoning',
    description: 'Anthropic has released Claude 3, featuring enhanced reasoning capabilities and better performance on complex tasks. The model shows significant improvements in mathematical and logical reasoning.',
    url: 'https://www.anthropic.com/claude-3',
    source: 'Anthropic',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    category: 'ai-news',
    tags: ['anthropic', 'claude', 'reasoning', 'ai']
  },
  {
    id: 'fallback-4',
    title: 'Microsoft Integrates Copilot Across Office Suite',
    description: 'Microsoft has announced the integration of AI Copilot across their entire Office suite, bringing AI assistance to Word, Excel, PowerPoint, and other productivity tools.',
    url: 'https://www.microsoft.com/copilot',
    source: 'Microsoft',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    category: 'industry',
    tags: ['microsoft', 'copilot', 'office', 'productivity']
  },
  {
    id: 'fallback-5',
    title: 'Midjourney V6 Released with Photorealistic Image Generation',
    description: 'Midjourney has released version 6 of their AI image generation model, featuring improved photorealistic capabilities and better understanding of complex prompts.',
    url: 'https://midjourney.com',
    source: 'Midjourney',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    category: 'ai-news',
    tags: ['midjourney', 'image-generation', 'ai-art', 'v6']
  },
  {
    id: 'fallback-6',
    title: 'Stability AI Releases Stable Diffusion XL Turbo',
    description: 'Stability AI has launched Stable Diffusion XL Turbo, offering real-time image generation with improved quality and faster processing speeds.',
    url: 'https://stability.ai',
    source: 'Stability AI',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    category: 'ai-news',
    tags: ['stability-ai', 'stable-diffusion', 'xl-turbo', 'image-generation']
  },
  {
    id: 'fallback-7',
    title: 'Meta Announces Llama 3 with Enhanced Performance',
    description: 'Meta has announced Llama 3, their latest open-source language model with improved performance across various benchmarks and better multilingual capabilities.',
    url: 'https://ai.meta.com/llama',
    source: 'Meta AI',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    category: 'ai-news',
    tags: ['meta', 'llama', 'open-source', 'language-model']
  },
  {
    id: 'fallback-8',
    title: 'AI Regulation Framework Proposed by EU Parliament',
    description: 'The European Union has proposed a comprehensive AI regulation framework aimed at ensuring responsible AI development while fostering innovation in the sector.',
    url: 'https://europa.eu/ai-regulation',
    source: 'EU Parliament',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
    category: 'industry',
    tags: ['eu', 'regulation', 'ai-policy', 'legislation']
  },
  {
    id: 'fallback-9',
    title: 'ChatGPT Enterprise Sees Rapid Adoption',
    description: 'ChatGPT Enterprise has seen rapid adoption among Fortune 500 companies, with over 80% of Fortune 500 companies now using the platform for various business applications.',
    url: 'https://openai.com/enterprise',
    source: 'OpenAI',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    category: 'industry',
    tags: ['chatgpt', 'enterprise', 'adoption', 'business']
  },
  {
    id: 'fallback-10',
    title: 'AI-Powered Code Generation Tools Revolutionize Development',
    description: 'AI-powered code generation tools like GitHub Copilot and Amazon CodeWhisperer are revolutionizing software development, with developers reporting significant productivity improvements.',
    url: 'https://github.com/features/copilot',
    source: 'GitHub',
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
    category: 'industry',
    tags: ['github', 'copilot', 'code-generation', 'development']
  }
];

// Function to get fallback news with realistic timestamps
export const getFallbackNews = (): NewsItem[] => {
  return fallbackNews.map((item, index) => ({
    ...item,
    publishedAt: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000).toISOString() // Stagger timestamps
  }));
}; 