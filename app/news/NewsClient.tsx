'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase';
import './news.css';
import { 
  TrendingUpIcon, 
  ClockIcon, 
  ExternalLinkIcon,
  RefreshCwIcon,
  FilterIcon,
  SearchIcon,
  SparklesIcon,
  ZapIcon,
  GlobeIcon,
  BookOpenIcon,
  BriefcaseIcon
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
  const [selectedNews, setSelectedNews] = useState<string | null>(null);

  const supabase = createClient();

  // Subscribe to automation updates for real-time news sync
  useEffect(() => {
    const automationChannel = supabase
      .channel('automation-updates')
      .on('broadcast', { event: 'automation-completed' }, (payload) => {
        console.log('🔄 Automation completed, refreshing news...', payload);
        setLastUpdated(new Date());
        
        // Show a notification that new content is available
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 16px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 1000; animation: slideInRight 0.3s ease-out;">
            <div style="font-weight: bold; margin-bottom: 4px;">🎉 Fresh AI News Available!</div>
            <div style="font-size: 14px; opacity: 0.9;">New articles have been discovered and added</div>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Auto-refresh news after a short delay
        setTimeout(() => {
          fetchAllNews();
        }, 2000);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
          if (notification && notification.parentNode) {
            notification.remove();
          }
        }, 5000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(automationChannel);
    };
  }, []);

  // Memoized filtered news for better performance
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesFilter = filter === 'all' || item.category === filter;
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });
  }, [news, filter, searchQuery]);

  // Fetch AI news from multiple sources
  const fetchAINews = async () => {
    try {
      // Fetch AI news from our automation-synced database
      console.log('🔍 Fetching AI news from database...');
      const { data: aiNewsData, error } = await supabase
        .from('ai_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching AI news:', error);
        // Use fallback news if database fails
        const { getFallbackNews } = await import('./fallbackNews');
        const fallbackNews = getFallbackNews().filter(item => item.category === 'ai-news');
        setNews(prev => [...prev.filter(item => item.category !== 'ai-news'), ...fallbackNews]);
      } else if (aiNewsData) {
        const aiNews: NewsItem[] = aiNewsData.map((article: any) => ({
          id: article.id,
          title: article.title,
          description: article.content || 'No description available',
          url: article.url,
          source: article.source,
          publishedAt: article.published_at,
          imageUrl: article.image_url,
          category: 'ai-news' as const,
          tags: article.topics || []
        }));
        
        console.log(`✅ Loaded ${aiNews.length} AI news articles from database`);
        setNews(prev => [...prev.filter(item => item.category !== 'ai-news'), ...aiNews]);
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
      // Fetch industry/business AI news from our database
      console.log('🔍 Fetching industry AI news from database...');
      const { data: industryNewsData, error } = await supabase
        .from('ai_news')
        .select('*')
        .in('category', ['AI Business', 'AI Ethics', 'AI Productivity'])
        .order('published_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching industry news:', error);
        // Use fallback industry news
        const { getFallbackNews } = await import('./fallbackNews');
        const fallbackNews = getFallbackNews().filter(item => item.category === 'industry');
        setNews(prev => [...prev.filter(item => item.category !== 'industry'), ...fallbackNews]);
      } else if (industryNewsData) {
        const industryNews: NewsItem[] = industryNewsData.map((article: any) => ({
          id: article.id,
          title: article.title,
          description: article.content || 'No description available',
          url: article.url,
          source: article.source,
          publishedAt: article.published_at,
          imageUrl: article.image_url,
          category: 'industry' as const,
          tags: article.topics || []
        }));
        
        console.log(`✅ Loaded ${industryNews.length} industry news articles from database`);
        setNews(prev => [...prev.filter(item => item.category !== 'industry'), ...industryNews]);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return 'Invalid date';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai-news': return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white';
      case 'tool-update': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'industry': return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai-news': return <SparklesIcon className="w-4 h-4" />;
      case 'tool-update': return <ZapIcon className="w-4 h-4" />;
      case 'industry': return <BriefcaseIcon className="w-4 h-4" />;
      default: return <GlobeIcon className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'major': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'minor': return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
      case 'new': return 'bg-gradient-to-r from-green-500 to-teal-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-600 animate-spin" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading AI News</h2>
          <p className="text-gray-600 dark:text-gray-400">Fetching the latest updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 custom-scrollbar">
      {/* Header */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8 header-content">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover-lift">
                <BookOpenIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">
                  AI News & Updates
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Real-time updates on AI breakthroughs and tool developments
                </p>
              </div>
            </div>
            <button
              onClick={fetchAllNews}
              disabled={refreshing}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 focus-visible:focus"
            >
              <RefreshCwIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative group">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search news, tools, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 backdrop-blur-sm transition-all duration-300 focus-visible:focus"
              />
            </div>
            <div className="flex gap-3">
              {(['all', 'ai-news', 'tool-update', 'industry'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 focus-visible:focus ${
                    filter === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-600/80 border-2 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {getCategoryIcon(category)}
                  {category === 'all' ? 'All' : 
                   category === 'ai-news' ? 'AI News' :
                   category === 'tool-update' ? 'Tool Updates' : 'Industry'}
                </button>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-3 mt-6 text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Latest News
              </h2>
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                {filteredNews.length} articles
              </span>
            </div>
            
            <div className="space-y-6">
              {filteredNews.map((item, index) => (
                <article 
                  key={item.id} 
                  className="news-article group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-gray-800/90 hover-lift"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}>
                          {getCategoryIcon(item.category)}
                          {item.category === 'ai-news' ? 'AI News' : 
                           item.category === 'tool-update' ? 'Tool Update' : 'Industry'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {item.source}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-lg leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold group/link focus-visible:focus"
                      >
                        Read more
                        <ExternalLinkIcon className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {filteredNews.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No news found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tool Updates */}
            <div className="sidebar-item bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <ZapIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tool Updates
                </h3>
              </div>
              <div className="space-y-4">
                {toolUpdates.slice(0, 5).map((update) => (
                  <div key={update.id} className="group border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-3 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {update.toolName}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getImpactColor(update.impact)}`}>
                        {update.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">
                      {update.update}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {formatDate(update.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="sidebar-item bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover-lift">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <TrendingUpIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Trending Topics
                </h3>
              </div>
              <div className="space-y-3">
                {['ChatGPT', 'Midjourney', 'Claude', 'Stable Diffusion', 'Copilot', 'Bard'].map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">#{topic}</span>
                    <div className="flex items-center gap-1">
                      <TrendingUpIcon className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">+{Math.floor(Math.random() * 50) + 10}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="sidebar-item bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white hover-lift">
              <h3 className="text-xl font-bold mb-4">News Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Total Articles</span>
                  <span className="font-bold text-2xl">{news.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">AI News</span>
                  <span className="font-bold">{news.filter(item => item.category === 'ai-news').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Tool Updates</span>
                  <span className="font-bold">{news.filter(item => item.category === 'tool-update').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Industry</span>
                  <span className="font-bold">{news.filter(item => item.category === 'industry').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 