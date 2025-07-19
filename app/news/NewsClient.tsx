'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  TrendingUpIcon, 
  ClockIcon, 
  ExternalLinkIcon,
  RefreshCwIcon,
  FilterIcon,
  SearchIcon
} from 'lucide-react';

interface NewsItem {
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

interface ToolUpdate {
  id: string;
  toolName: string;
  update: string;
  date: string;
  impact: 'major' | 'minor' | 'new';
}

export default function NewsClient() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [toolUpdates, setToolUpdates] = useState<ToolUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ai-news' | 'tool-update' | 'industry'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const supabase = createClient();

  // Fetch AI news from multiple sources
  const fetchAINews = async () => {
    try {
      // NewsAPI for general AI news
      const newsApiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      if (newsApiKey) {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=artificial+intelligence+AI&language=en&sortBy=publishedAt&pageSize=20&apiKey=${newsApiKey}`
        );
        const data = await response.json();
        
        if (data.articles) {
          const aiNews: NewsItem[] = data.articles.map((article: any, index: number) => ({
            id: `ai-news-${index}`,
            title: article.title,
            description: article.description || article.content?.substring(0, 200) + '...',
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
            imageUrl: article.urlToImage,
            category: 'ai-news' as const,
            tags: extractTags(article.title + ' ' + article.description)
          }));
          
          setNews(prev => [...prev.filter(item => item.category !== 'ai-news'), ...aiNews]);
        }
      } else {
        // Use fallback news if no API key is available
        const { getFallbackNews } = await import('./fallbackNews');
        const fallbackNews = getFallbackNews().filter(item => item.category === 'ai-news');
        setNews(prev => [...prev.filter(item => item.category !== 'ai-news'), ...fallbackNews]);
      }
    } catch (error) {
      console.error('Error fetching AI news:', error);
      // Use fallback news on error
      const { getFallbackNews } = await import('./fallbackNews');
      const fallbackNews = getFallbackNews().filter(item => item.category === 'ai-news');
      setNews(prev => [...prev.filter(item => item.category !== 'ai-news'), ...fallbackNews]);
    }
  };

  // Fetch tool updates from your database
  const fetchToolUpdates = async () => {
    try {
      // Get recent tool updates from your database
      const { data: tools, error } = await supabase
        .from('tools')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const updates: ToolUpdate[] = tools.map((tool, index) => ({
        id: `tool-update-${tool.id}`,
        toolName: tool.name,
        update: `Updated ${tool.name} with latest information and user reviews`,
        date: tool.updated_at,
        impact: index < 3 ? 'major' : 'minor'
      }));

      setToolUpdates(updates);

      // Convert tool updates to news items
      const toolNews: NewsItem[] = updates.map(update => ({
        id: update.id,
        title: `${update.toolName} - Latest Updates`,
        description: update.update,
        url: `/tool/${update.id}`,
        source: 'VaultX AI Tools',
        publishedAt: update.date,
        category: 'tool-update' as const,
        tags: ['tool-update', 'ai-tools', update.toolName.toLowerCase()]
      }));

      setNews(prev => [...prev.filter(item => item.category !== 'tool-update'), ...toolNews]);
    } catch (error) {
      console.error('Error fetching tool updates:', error);
    }
  };

  // Extract relevant tags from text
  const extractTags = (text: string): string[] => {
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
    
    return tags.slice(0, 5); // Limit to 5 tags
  };

  // Fetch industry news
  const fetchIndustryNews = async () => {
    try {
      const newsApiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      if (newsApiKey) {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=AI+technology+industry&language=en&sortBy=publishedAt&pageSize=10&apiKey=${newsApiKey}`
        );
        const data = await response.json();
        
        if (data.articles) {
          const industryNews: NewsItem[] = data.articles.map((article: any, index: number) => ({
            id: `industry-news-${index}`,
            title: article.title,
            description: article.description || article.content?.substring(0, 200) + '...',
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt,
            imageUrl: article.urlToImage,
            category: 'industry' as const,
            tags: extractTags(article.title + ' ' + article.description)
          }));
          
          setNews(prev => [...prev.filter(item => item.category !== 'industry'), ...industryNews]);
        }
      } else {
        // Use fallback industry news
        const { getFallbackNews } = await import('./fallbackNews');
        const fallbackNews = getFallbackNews().filter(item => item.category === 'industry');
        setNews(prev => [...prev.filter(item => item.category !== 'industry'), ...fallbackNews]);
      }
    } catch (error) {
      console.error('Error fetching industry news:', error);
      // Use fallback news on error
      const { getFallbackNews } = await import('./fallbackNews');
      const fallbackNews = getFallbackNews().filter(item => item.category === 'industry');
      setNews(prev => [...prev.filter(item => item.category !== 'industry'), ...fallbackNews]);
    }
  };

  // Fetch all news
  const fetchAllNews = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchAINews(),
      fetchIndustryNews(),
      fetchToolUpdates()
    ]);
    setRefreshing(false);
    setLastUpdated(new Date());
  };

  // Initial load
  useEffect(() => {
    fetchAllNews().finally(() => setLoading(false));
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllNews();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter news based on selected category and search query
  const filteredNews = news.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai-news': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'tool-update': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'industry': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'major': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'minor': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'new': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading latest AI news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                AI News & Updates
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time updates on AI breakthroughs and tool developments
              </p>
            </div>
            <button
              onClick={fetchAllNews}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'ai-news', 'tool-update', 'industry'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category === 'all' ? 'All' : 
                   category === 'ai-news' ? 'AI News' :
                   category === 'tool-update' ? 'Tool Updates' : 'Industry'}
                </button>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Latest News ({filteredNews.length})
            </h2>
            
            <div className="space-y-6">
              {filteredNews.map((item) => (
                <article key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category === 'ai-news' ? 'AI News' : 
                           item.category === 'tool-update' ? 'Tool Update' : 'Industry'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.source}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Read more
                        <ExternalLinkIcon className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No news found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tool Updates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tool Updates
              </h3>
              <div className="space-y-4">
                {toolUpdates.slice(0, 5).map((update) => (
                  <div key={update.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {update.toolName}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(update.impact)}`}>
                        {update.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {update.update}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(update.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trending Topics
              </h3>
              <div className="space-y-2">
                {['ChatGPT', 'Midjourney', 'Claude', 'Stable Diffusion', 'Copilot', 'Bard'].map((topic) => (
                  <div key={topic} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">#{topic}</span>
                    <TrendingUpIcon className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 