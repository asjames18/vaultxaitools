import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const newsApiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    
    if (!newsApiKey) {
      // Return fallback news if no API key
      const fallbackNews = [
        {
          id: 'fallback-1',
          title: 'OpenAI Releases GPT-4 Turbo with Enhanced Capabilities',
          description: 'OpenAI has announced the release of GPT-4 Turbo, featuring improved performance and longer context windows.',
          url: 'https://openai.com/blog/gpt-4-turbo',
          source: 'OpenAI Blog',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          category: 'ai-news',
          tags: ['openai', 'gpt-4', 'turbo']
        },
        {
          id: 'fallback-2',
          title: 'Google Launches Gemini Pro with Advanced Features',
          description: 'Google has unveiled Gemini Pro, their latest AI model with multimodal capabilities.',
          url: 'https://ai.google.dev/gemini',
          source: 'Google AI',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          category: 'ai-news',
          tags: ['google', 'gemini', 'multimodal']
        }
      ];
      
      return NextResponse.json({ news: fallbackNews });
    }

    // Fetch from News API
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=artificial+intelligence+AI&language=en&sortBy=publishedAt&pageSize=20&apiKey=${newsApiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const data = await response.json();
    
    if (!data.articles) {
      throw new Error('No articles found');
    }
    
    const news = data.articles.map((article: any, index: number) => ({
      id: `news-${index}`,
      title: article.title,
      description: article.description || article.content?.substring(0, 200) + '...',
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage,
      category: 'ai-news',
      tags: extractTags(article.title + ' ' + article.description)
    }));
    
    return NextResponse.json({ news });
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

function extractTags(text: string): string[] {
  const aiKeywords = [
    'artificial intelligence', 'AI', 'machine learning', 'ML', 'deep learning',
    'neural networks', 'chatgpt', 'openai', 'google', 'microsoft', 'anthropic',
    'claude', 'bard', 'midjourney', 'stable diffusion', 'dall-e', 'copilot'
  ];
  
  const tags: string[] = [];
  const lowerText = text.toLowerCase();
  
  aiKeywords.forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      tags.push(keyword.toLowerCase());
    }
  });
  
  return tags.slice(0, 5);
} 