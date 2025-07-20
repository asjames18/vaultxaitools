#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  maxNewsPerRun: 50,
  sources: {
    newsApi: 'https://newsapi.org/v2/everything',
    reddit: 'https://www.reddit.com/r/artificial/hot.json',
    hackerNews: 'https://hacker-news.firebaseio.com/v0/topstories.json',
    techCrunch: 'https://techcrunch.com/wp-json/wp/v2/posts',
    arxiv: 'http://export.arxiv.org/api/query'
  }
};

// Check required environment variables
if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('Please check your .env.local file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

// Helper functions
const helpers = {
  // Categorize news based on title and content
  categorizeNews(title, content) {
    const text = `${title} ${content}`.toLowerCase();
    
    if (text.includes('chatgpt') || text.includes('gpt') || text.includes('llm')) return 'Language Models';
    if (text.includes('image') || text.includes('dall-e') || text.includes('midjourney')) return 'Image Generation';
    if (text.includes('video') || text.includes('sora') || text.includes('generation')) return 'Video Generation';
    if (text.includes('code') || text.includes('copilot') || text.includes('programming')) return 'AI Development';
    if (text.includes('automation') || text.includes('productivity')) return 'AI Productivity';
    if (text.includes('business') || text.includes('enterprise') || text.includes('startup')) return 'AI Business';
    if (text.includes('research') || text.includes('paper') || text.includes('arxiv')) return 'AI Research';
    if (text.includes('ethics') || text.includes('regulation') || text.includes('policy')) return 'AI Ethics';
    if (text.includes('robotics') || text.includes('autonomous')) return 'Robotics';
    if (text.includes('healthcare') || text.includes('medical')) return 'AI Healthcare';
    
    return 'General AI';
  },

  // Generate unique ID
  generateId(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  },

  // Extract sentiment from title and content
  extractSentiment(title, content) {
    const text = `${title} ${content}`.toLowerCase();
    const positiveWords = ['breakthrough', 'revolutionary', 'amazing', 'incredible', 'success', 'advance'];
    const negativeWords = ['concern', 'risk', 'danger', 'threat', 'problem', 'issue', 'controversy'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  },

  // Extract key entities/topics
  extractTopics(title, content) {
    const text = `${title} ${content}`.toLowerCase();
    const topics = [];
    
    const aiModels = ['chatgpt', 'gpt-4', 'claude', 'bard', 'llama', 'gemini'];
    const companies = ['openai', 'google', 'microsoft', 'anthropic', 'meta', 'nvidia'];
    const technologies = ['machine learning', 'deep learning', 'neural networks', 'computer vision', 'nlp'];
    
    aiModels.forEach(model => {
      if (text.includes(model)) topics.push(model.toUpperCase());
    });
    
    companies.forEach(company => {
      if (text.includes(company)) topics.push(company);
    });
    
    technologies.forEach(tech => {
      if (text.includes(tech)) topics.push(tech);
    });
    
    return [...new Set(topics)];
  },

  // Clean and truncate content
  cleanContent(content, maxLength = 500) {
    if (!content) return '';
    return content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, maxLength) + (content.length > maxLength ? '...' : '');
  }
};

// News sources
const newsSources = {
  // News API - AI news articles
  async newsApi() {
    try {
      console.log('🔍 Fetching from News API...');
      if (!process.env.NEWS_API_KEY) {
        console.log('⚠️  NEWS_API_KEY not found, skipping News API');
        return [];
      }

      const response = await axios.get(config.sources.newsApi, {
        params: {
          q: 'artificial intelligence OR AI OR machine learning',
          sortBy: 'popularity',
          pageSize: 20,
          language: 'en',
          apiKey: process.env.NEWS_API_KEY
        }
      });
      
      const news = response.data.articles
        .filter(article => article.title && article.description)
        .map(article => ({
          title: article.title,
          content: helpers.cleanContent(article.description),
          url: article.url,
          source: 'News API',
          author: article.author || 'Unknown',
          publishedAt: article.publishedAt,
          imageUrl: article.urlToImage,
          category: helpers.categorizeNews(article.title, article.description),
          sentiment: helpers.extractSentiment(article.title, article.description),
          topics: helpers.extractTopics(article.title, article.description),
          readTime: Math.ceil((article.title.length + article.description.length) / 200), // Rough estimate
          engagement: Math.floor(Math.random() * 1000) + 100 // Mock engagement
        }));
      
      console.log(`✅ Found ${news.length} articles from News API`);
      return news;
    } catch (error) {
      console.error('❌ Error fetching from News API:', error.message);
      return [];
    }
  },

  // Reddit - AI discussions
  async reddit() {
    try {
      console.log('🔍 Fetching from Reddit...');
      const response = await axios.get(config.sources.reddit, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const news = response.data.data.children
        .filter(post => post.data.title && post.data.selftext)
        .slice(0, 15)
        .map(post => ({
          title: post.data.title,
          content: helpers.cleanContent(post.data.selftext),
          url: `https://reddit.com${post.data.permalink}`,
          source: 'Reddit',
          author: post.data.author,
          publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
          imageUrl: post.data.thumbnail !== 'self' ? post.data.thumbnail : null,
          category: helpers.categorizeNews(post.data.title, post.data.selftext),
          sentiment: helpers.extractSentiment(post.data.title, post.data.selftext),
          topics: helpers.extractTopics(post.data.title, post.data.selftext),
          readTime: Math.ceil((post.data.title.length + post.data.selftext.length) / 200),
          engagement: post.data.score + post.data.num_comments
        }));
      
      console.log(`✅ Found ${news.length} posts from Reddit`);
      return news;
    } catch (error) {
      console.error('❌ Error fetching from Reddit:', error.message);
      return [];
    }
  },

  // Hacker News - AI stories
  async hackerNews() {
    try {
      console.log('🔍 Fetching from Hacker News...');
      const response = await axios.get(config.sources.hackerNews);
      const storyIds = response.data.slice(0, 20);
      
      const news = [];
      for (const id of storyIds) {
        try {
          const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const story = storyResponse.data;
          
          if (story.title && story.title.toLowerCase().includes('ai')) {
            news.push({
              title: story.title,
              content: helpers.cleanContent(story.text || ''),
              url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
              source: 'Hacker News',
              author: story.by,
              publishedAt: new Date(story.time * 1000).toISOString(),
              imageUrl: null,
              category: helpers.categorizeNews(story.title, story.text || ''),
              sentiment: helpers.extractSentiment(story.title, story.text || ''),
              topics: helpers.extractTopics(story.title, story.text || ''),
              readTime: Math.ceil(story.title.length / 200),
              engagement: story.score + (story.descendants || 0)
            });
          }
        } catch (error) {
          console.error(`Error fetching HN story ${id}:`, error.message);
        }
      }
      
      console.log(`✅ Found ${news.length} stories from Hacker News`);
      return news;
    } catch (error) {
      console.error('❌ Error fetching from Hacker News:', error.message);
      return [];
    }
  },

  // TechCrunch - AI articles
  async techCrunch() {
    try {
      console.log('🔍 Fetching from TechCrunch...');
      const response = await axios.get(config.sources.techCrunch, {
        params: {
          per_page: 20,
          search: 'artificial intelligence'
        }
      });
      
      const news = response.data
        .filter(post => post.title && post.excerpt)
        .map(post => ({
          title: post.title.rendered,
          content: helpers.cleanContent(post.excerpt.rendered),
          url: post.link,
          source: 'TechCrunch',
          author: 'TechCrunch',
          publishedAt: post.date,
          imageUrl: null,
          category: helpers.categorizeNews(post.title.rendered, post.excerpt.rendered),
          sentiment: helpers.extractSentiment(post.title.rendered, post.excerpt.rendered),
          topics: helpers.extractTopics(post.title.rendered, post.excerpt.rendered),
          readTime: Math.ceil(post.title.rendered.length / 200),
          engagement: Math.floor(Math.random() * 500) + 50
        }));
      
      console.log(`✅ Found ${news.length} articles from TechCrunch`);
      return news;
    } catch (error) {
      console.error('❌ Error fetching from TechCrunch:', error.message);
      return [];
    }
  },

  // ArXiv - AI research papers
  async arxiv() {
    try {
      console.log('🔍 Fetching from ArXiv...');
      const response = await axios.get(config.sources.arxiv, {
        params: {
          search_query: 'cat:cs.AI OR cat:cs.LG OR cat:cs.CL',
          sortBy: 'submittedDate',
          sortOrder: 'descending',
          max_results: 15
        }
      });
      
      // Parse XML response
      const xml = response.data;
      const papers = [];
      
      // Simple XML parsing (you might want to use a proper XML parser)
      const titleMatches = xml.match(/<title>(.*?)<\/title>/g);
      const summaryMatches = xml.match(/<summary>(.*?)<\/summary>/g);
      const idMatches = xml.match(/<id>(.*?)<\/id>/g);
      
      if (titleMatches && summaryMatches) {
        for (let i = 0; i < Math.min(titleMatches.length, summaryMatches.length); i++) {
          const title = titleMatches[i].replace(/<\/?title>/g, '');
          const summary = summaryMatches[i].replace(/<\/?summary>/g, '');
          const id = idMatches ? idMatches[i].replace(/<\/?id>/g, '') : '';
          
          papers.push({
            title: title,
            content: helpers.cleanContent(summary),
            url: id ? `https://arxiv.org/abs/${id.split('/').pop()}` : '',
            source: 'ArXiv',
            author: 'Research Paper',
            publishedAt: new Date().toISOString(),
            imageUrl: null,
            category: helpers.categorizeNews(title, summary),
            sentiment: helpers.extractSentiment(title, summary),
            topics: helpers.extractTopics(title, summary),
            readTime: Math.ceil((title.length + summary.length) / 200),
            engagement: Math.floor(Math.random() * 100) + 10
          });
        }
      }
      
      console.log(`✅ Found ${papers.length} papers from ArXiv`);
      return papers;
    } catch (error) {
      console.error('❌ Error fetching from ArXiv:', error.message);
      return [];
    }
  }
};

// Main automation function
async function runNewsAutomation() {
  console.log('🚀 Starting AI News Automation...');
  console.log(`📅 ${new Date().toISOString()}`);
  
  try {
    // Fetch news from all sources
    const allNews = [];
    
    for (const [sourceName, sourceFunction] of Object.entries(newsSources)) {
      const news = await sourceFunction();
      allNews.push(...news);
    }
    
    console.log(`📊 Total news items found: ${allNews.length}`);
    
    // Process and deduplicate news
    const processedNews = processNews(allNews);
    console.log(`🔄 Processed news: ${processedNews.length}`);
    
    // Save to database
    await saveNewsToDatabase(processedNews);
    
    // Generate report
    await generateNewsReport(processedNews);
    
    console.log('✅ News automation completed successfully!');
    
  } catch (error) {
    console.error('❌ News automation failed:', error);
    throw error;
  }
}

// Process and deduplicate news
function processNews(news) {
  const seen = new Set();
  const processed = [];
  
  for (const item of news) {
    const id = helpers.generateId(item.title);
    
    if (!seen.has(id) && item.title && item.content) {
      seen.add(id);
      
      processed.push({
        id,
        title: item.title,
        content: item.content,
        url: item.url,
        source: item.source,
        author: item.author,
        publishedAt: item.publishedAt,
        imageUrl: item.imageUrl,
        category: item.category,
        sentiment: item.sentiment,
        topics: item.topics,
        readTime: item.readTime,
        engagement: item.engagement,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }
  
  return processed.slice(0, config.maxNewsPerRun);
}

// Save news to database
async function saveNewsToDatabase(news) {
  console.log('💾 Saving news to database...');
  
  for (const item of news) {
    try {
      // Check if news already exists
      const { data: existing } = await supabase
        .from('ai_news')
        .select('id')
        .eq('id', item.id)
        .single();
      
      if (existing) {
        // Update existing news
        await supabase
          .from('ai_news')
          .update({
            ...item,
            updatedAt: new Date().toISOString()
          })
          .eq('id', item.id);
        console.log(`🔄 Updated: ${item.title}`);
      } else {
        // Insert new news
        await supabase
          .from('ai_news')
          .insert(item);
        console.log(`➕ Added: ${item.title}`);
      }
    } catch (error) {
      console.error(`❌ Error saving ${item.title}:`, error.message);
    }
  }
}

// Generate news automation report
async function generateNewsReport(news) {
  const report = {
    timestamp: new Date().toISOString(),
    totalNews: news.length,
    sources: {},
    categories: {},
    sentiment: {},
    summary: {
      newNews: 0,
      updatedNews: 0,
      errors: 0
    }
  };
  
  // Group by source
  news.forEach(item => {
    report.sources[item.source] = (report.sources[item.source] || 0) + 1;
    report.categories[item.category] = (report.categories[item.category] || 0) + 1;
    report.sentiment[item.sentiment] = (report.sentiment[item.sentiment] || 0) + 1;
  });
  
  // Save report
  const reportPath = path.join(__dirname, '../logs/news-automation-report.json');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log('📋 News report generated:', reportPath);
  return report;
}

// CLI interface
if (require.main === module) {
  runNewsAutomation()
    .then(() => {
      console.log('🎉 News automation script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 News automation script failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runNewsAutomation,
  newsSources,
  helpers,
  config
}; 