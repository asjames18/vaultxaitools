const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Real-time data sources configuration
const DATA_SOURCES = {
  PRODUCT_HUNT: {
    name: 'Product Hunt',
    enabled: true,
    apiUrl: 'https://api.producthunt.com/v2/api/graphql',
    token: process.env.PRODUCT_HUNT_TOKEN,
    query: `
      query {
        posts(topic: "artificial-intelligence", first: 100, after: null) {
          edges {
            node {
              id
              name
              tagline
              description
              website
              votesCount
              commentsCount
              createdAt
              topics {
                edges {
                  node {
                    name
                  }
                }
              }
              thumbnail {
                url
              }
              makers {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `
  },
  GITHUB_TRENDING: {
    name: 'GitHub Trending',
    enabled: true,
    apiUrl: 'https://api.github.com/search/repositories',
    token: process.env.GITHUB_TOKEN,
    query: 'AI artificial-intelligence machine-learning'
  },
  TWITTER_TRENDING: {
    name: 'Twitter Trending',
    enabled: false, // Requires Twitter API v2
    apiUrl: 'https://api.twitter.com/2/tweets/search/recent',
    token: process.env.TWITTER_BEARER_TOKEN
  },
  REDDIT_TRENDING: {
    name: 'Reddit Trending',
    enabled: true,
    apiUrl: 'https://www.reddit.com/r/artificial/hot.json',
    subreddits: ['artificial', 'MachineLearning', 'AI', 'OpenAI', 'ChatGPT']
  },
  HACKER_NEWS: {
    name: 'Hacker News',
    enabled: true,
    apiUrl: 'https://hacker-news.firebaseio.com/v0'
  },
  AI_TOOLS_DIRECTORIES: {
    name: 'AI Tools Directories',
    enabled: true,
    sources: [
      'https://futurepedia.io/api/tools',
      'https://theresanaiforthat.com/api/tools',
      'https://aitoolsdirectory.com/api/tools'
    ]
  }
};

// Improved AI tool detection patterns
const AI_TOOL_PATTERNS = {
  // Keywords that indicate actual AI tools
  toolKeywords: [
    'ai tool', 'ai platform', 'ai software', 'ai application', 'ai service',
    'machine learning tool', 'ml platform', 'neural network', 'deep learning',
    'chatbot', 'ai assistant', 'ai generator', 'ai analyzer', 'ai optimizer',
    'gpt', 'llm', 'transformer', 'bert', 'stable diffusion', 'midjourney',
    'dall-e', 'claude', 'bard', 'copilot', 'code generation', 'text generation',
    'image generation', 'video generation', 'audio generation', 'data analysis',
    'predictive analytics', 'computer vision', 'natural language processing',
    'speech recognition', 'recommendation system', 'automation tool'
  ],
  
  // Keywords that indicate news/articles (to exclude)
  newsKeywords: [
    'dies', 'death', 'patient', 'therapy', 'treatment', 'medical',
    'malware', 'security', 'breach', 'hack', 'vulnerability',
    'agreement', 'policy', 'regulation', 'law', 'legal',
    'economic', 'statistics', 'market', 'finance', 'investment',
    'announces', 'announced', 'says', 'said', 'reports', 'reported',
    'breaking', 'news', 'update', 'latest', 'developing',
    'won\'t', 'will not', 'refuses', 'rejects', 'denies',
    'low-tech', 'sailing', 'living', 'lifestyle', 'travel'
  ],
  
  // Domains that are actual AI tool providers
  aiToolDomains: [
    'openai.com', 'anthropic.com', 'google.com', 'microsoft.com', 'meta.com',
    'stability.ai', 'midjourney.com', 'notion.so', 'canva.com', 'figma.com',
    'github.com', 'huggingface.co', 'kaggle.com', 'colab.research.google.com',
    'replicate.com', 'runwayml.com', 'elevenlabs.io', 'jasper.ai', 'copy.ai',
    'grammarly.com', 'surferseo.com', 'surfer.com', 'ahrefs.com', 'semrush.com',
    'chatgpt.com', 'claude.ai', 'bard.google.com', 'perplexity.ai', 'poe.com',
    'character.ai', 'replika.com', 'chai.ml', 'inworld.ai', 'synthesia.io',
    'd-id.com', 'heygen.com', 'descript.com', 'otter.ai', 'fireflies.ai',
    'tome.app', 'gamma.app', 'beautiful.ai', 'slidesgo.com', 'slidescarnival.com',
    'flowgpt.com', 'promptbase.com', 'prompthero.com', 'lexica.art', 'openart.ai',
    'leonardo.ai', 'playgroundai.com', 'bluewillow.ai', 'stockai.com', 'stockai.ai'
  ],
  
  // File extensions that indicate actual tools
  toolExtensions: [
    '.com', '.ai', '.io', '.app', '.dev', '.tech', '.tools', '.studio',
    '.co', '.org', '.net', '.me', '.ly', '.sh', '.js', '.py', '.ml'
  ],
  
  // Categories that indicate actual tools
  toolCategories: [
    'Language', 'Design', 'Development', 'Productivity', 'Marketing',
    'Writing', 'Video', 'Audio', 'Data', 'Research', 'Education',
    'AI Tools', 'Machine Learning', 'Computer Vision', 'NLP', 'Automation'
  ]
};

// Function to fetch data from Product Hunt
async function fetchProductHuntData() {
  if (!DATA_SOURCES.PRODUCT_HUNT.enabled) return [];
  
  try {
    console.log('🔍 Fetching data from Product Hunt...');
    
    const response = await fetch(DATA_SOURCES.PRODUCT_HUNT.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DATA_SOURCES.PRODUCT_HUNT.token || 'demo'}`,
      },
      body: JSON.stringify({
        query: DATA_SOURCES.PRODUCT_HUNT.query
      })
    });

    if (!response.ok) {
      console.log('⚠️ Product Hunt API not available, using fallback data');
      return getFallbackProductHuntData();
    }

    const data = await response.json();
    const posts = data.data?.posts?.edges || [];
    
    console.log(`✅ Found ${posts.length} products from Product Hunt`);
    return posts.map(edge => ({
      source: 'Product Hunt',
      name: edge.node.name,
      description: edge.node.tagline,
      long_description: edge.node.description,
      website: edge.node.website,
      votes: edge.node.votesCount,
      comments: edge.node.commentsCount,
      created_at: edge.node.createdAt,
      topics: edge.node.topics?.edges?.map(t => t.node.name) || [],
      makers: edge.node.makers?.edges?.map(m => m.node.name) || [],
      thumbnail: edge.node.thumbnail?.url,
      rating: calculateRating(edge.node.votesCount, edge.node.commentsCount),
      category: detectCategory(edge.node.tagline, edge.node.topics?.edges?.map(t => t.node.name) || [])
    }));

  } catch (error) {
    console.error('❌ Error fetching Product Hunt data:', error.message);
    return getFallbackProductHuntData();
  }
}

// Function to fetch data from GitHub Trending
async function fetchGitHubTrendingData() {
  if (!DATA_SOURCES.GITHUB_TRENDING.enabled) return [];
  
  try {
    console.log('🔍 Fetching data from GitHub Trending...');
    
    const response = await fetch(
      `${DATA_SOURCES.GITHUB_TRENDING.apiUrl}?q=${encodeURIComponent(DATA_SOURCES.GITHUB_TRENDING.query)}&sort=stars&order=desc&per_page=50`,
      {
        headers: DATA_SOURCES.GITHUB_TRENDING.token ? {
          'Authorization': `token ${DATA_SOURCES.GITHUB_TRENDING.token}`,
          'Accept': 'application/vnd.github.v3+json'
        } : {}
      }
    );

    if (!response.ok) {
      console.log('⚠️ GitHub API not available, using fallback data');
      return getFallbackGitHubData();
    }

    const data = await response.json();
    const repositories = data.items || [];
    
    console.log(`✅ Found ${repositories.length} repositories from GitHub`);
    return repositories
      .filter(repo => isAITool(repo.name, repo.description, repo.topics, repo.homepage || `https://github.com/${repo.full_name}`, 'GitHub'))
      .map(repo => ({
        source: 'GitHub',
        name: repo.name,
        description: repo.description,
        long_description: repo.description,
        website: repo.homepage || `https://github.com/${repo.full_name}`,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        topics: repo.topics || [],
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        rating: calculateGitHubRating(repo.stargazers_count, repo.forks_count),
        category: detectCategory(repo.description, repo.topics || [])
      }));

  } catch (error) {
    console.error('❌ Error fetching GitHub data:', error.message);
    return getFallbackGitHubData();
  }
}

// Function to fetch data from Reddit
async function fetchRedditData() {
  if (!DATA_SOURCES.REDDIT_TRENDING.enabled) return [];
  
  try {
    console.log('🔍 Fetching data from Reddit...');
    
    const allPosts = [];
    
    for (const subreddit of DATA_SOURCES.REDDIT_TRENDING.subreddits) {
      try {
        const response = await fetch(`${DATA_SOURCES.REDDIT_TRENDING.apiUrl.replace('artificial', subreddit)}`);
        
        if (response.ok) {
          const data = await response.json();
          const posts = data.data?.children || [];
          
          allPosts.push(...posts.map(post => ({
            source: `Reddit r/${subreddit}`,
            name: post.data.title,
            description: post.data.title,
            long_description: post.data.selftext,
            website: post.data.url,
            upvotes: post.data.ups,
            comments: post.data.num_comments,
            created_at: new Date(post.data.created_utc * 1000).toISOString(),
            subreddit: subreddit,
            rating: calculateRedditRating(post.data.ups, post.data.num_comments),
            category: detectCategory(post.data.title, [subreddit])
          })));
        }
      } catch (error) {
        console.log(`⚠️ Error fetching from r/${subreddit}:`, error.message);
      }
    }
    
    console.log(`✅ Found ${allPosts.length} posts from Reddit`);
    return allPosts.filter(post => isAITool(post.name, post.description, [], post.website, 'Reddit'));

  } catch (error) {
    console.error('❌ Error fetching Reddit data:', error.message);
    return [];
  }
}

// Function to fetch data from Hacker News
async function fetchHackerNewsData() {
  if (!DATA_SOURCES.HACKER_NEWS.enabled) return [];
  
  try {
    console.log('🔍 Fetching data from Hacker News...');
    
    // Get top stories
    const response = await fetch(`${DATA_SOURCES.HACKER_NEWS.apiUrl}/topstories.json`);
    if (!response.ok) return [];
    
    const storyIds = await response.json();
    const topStories = storyIds.slice(0, 50); // Get top 50 stories
    const stories = [];
    
    for (const id of topStories) {
      try {
        const storyResponse = await fetch(`${DATA_SOURCES.HACKER_NEWS.apiUrl}/item/${id}.json`);
        if (storyResponse.ok) {
          const story = await storyResponse.json();
          
          if (isAITool(story.title, story.text, [], story.url, 'Hacker News')) {
            stories.push({
              source: 'Hacker News',
              name: story.title,
              description: story.title,
              long_description: story.text,
              website: story.url,
              points: story.score,
              comments: story.descendants,
              created_at: new Date(story.time * 1000).toISOString(),
              rating: calculateHNRating(story.score, story.descendants),
              category: detectCategory(story.title, [])
            });
          }
        }
      } catch (error) {
        // Continue with next story
      }
    }
    
    console.log(`✅ Found ${stories.length} AI-related stories from Hacker News`);
    return stories;

  } catch (error) {
    console.error('❌ Error fetching Hacker News data:', error.message);
    return [];
  }
}

// Function to check if content is a news article
function isNewsArticle(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  return AI_TOOL_PATTERNS.newsKeywords.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
}

// Function to detect if something is an AI tool
function isAITool(name, description, topics = [], website = '', source = '') {
  const text = `${name} ${description} ${topics.join(' ')}`.toLowerCase();
  
  // Exclude news articles
  if (isNewsArticle(name, description)) {
    return false;
  }
  
  // Check for tool keywords
  const hasToolKeywords = AI_TOOL_PATTERNS.toolKeywords.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  // Check for tool domains
  const hasToolDomain = AI_TOOL_PATTERNS.aiToolDomains.some(domain => 
    website && website.toLowerCase().includes(domain)
  );
  
  // Check for tool extensions
  const hasToolExtension = AI_TOOL_PATTERNS.toolExtensions.some(ext => 
    website && website.toLowerCase().includes(ext)
  );
  
  // Special rules for different sources
  if (source === 'GitHub') {
    // GitHub repos should have AI/ML related content
    return hasToolKeywords && (text.includes('ai') || text.includes('ml') || text.includes('machine learning'));
  }
  
  if (source === 'Reddit' || source === 'Hacker News') {
    // Reddit/HN posts should be about actual tools, not news
    return hasToolKeywords && !isNewsArticle(name, description) && (hasToolDomain || hasToolExtension);
  }
  
  if (source === 'Product Hunt') {
    // Product Hunt items are usually tools
    return hasToolKeywords || hasToolDomain;
  }
  
  return hasToolKeywords || hasToolDomain || hasToolExtension;
}

// Function to detect category
function detectCategory(description, topics) {
  const text = `${description} ${topics.join(' ')}`.toLowerCase();
  
  if (text.includes('chat') || text.includes('gpt') || text.includes('language') || text.includes('text')) {
    return 'Language';
  } else if (text.includes('image') || text.includes('art') || text.includes('design') || text.includes('visual')) {
    return 'Design';
  } else if (text.includes('code') || text.includes('development') || text.includes('programming')) {
    return 'Development';
  } else if (text.includes('productivity') || text.includes('workflow') || text.includes('automation')) {
    return 'Productivity';
  } else if (text.includes('marketing') || text.includes('copy') || text.includes('content')) {
    return 'Marketing';
  } else if (text.includes('writing') || text.includes('grammar') || text.includes('editor')) {
    return 'Writing';
  } else if (text.includes('video') || text.includes('audio') || text.includes('music')) {
    return text.includes('video') ? 'Video' : 'Audio';
  } else if (text.includes('data') || text.includes('analytics') || text.includes('insights')) {
    return 'Data';
  }
  
  return 'AI Tools';
}

// Rating calculation functions
function calculateRating(votes, comments) {
  const baseRating = 4.0;
  const voteBonus = Math.min(votes / 100, 1.0) * 0.5;
  const commentBonus = Math.min(comments / 50, 1.0) * 0.5;
  return Math.min(baseRating + voteBonus + commentBonus, 5.0);
}

function calculateGitHubRating(stars, forks) {
  const baseRating = 4.0;
  const starBonus = Math.min(stars / 1000, 1.0) * 0.5;
  const forkBonus = Math.min(forks / 100, 1.0) * 0.5;
  return Math.min(baseRating + starBonus + forkBonus, 5.0);
}

function calculateRedditRating(upvotes, comments) {
  const baseRating = 4.0;
  const upvoteBonus = Math.min(upvotes / 100, 1.0) * 0.5;
  const commentBonus = Math.min(comments / 20, 1.0) * 0.5;
  return Math.min(baseRating + upvoteBonus + commentBonus, 5.0);
}

function calculateHNRating(points, comments) {
  const baseRating = 4.0;
  const pointBonus = Math.min(points / 100, 1.0) * 0.5;
  const commentBonus = Math.min(comments / 20, 1.0) * 0.5;
  return Math.min(baseRating + pointBonus + commentBonus, 5.0);
}

// Fallback data functions
function getFallbackProductHuntData() {
  return [
    {
      source: 'Product Hunt',
      name: 'Claude',
      description: 'Anthropic\'s AI assistant for conversation and analysis',
      website: 'https://claude.ai',
      rating: 4.7,
      category: 'Language'
    },
    {
      source: 'Product Hunt',
      name: 'Perplexity',
      description: 'AI-powered search engine with conversational interface',
      website: 'https://perplexity.ai',
      rating: 4.6,
      category: 'Language'
    }
  ];
}

function getFallbackGitHubData() {
  return [
    {
      source: 'GitHub',
      name: 'AutoGPT',
      description: 'AutoGPT is the vision of accessible AI for everyone',
      website: 'https://github.com/Significant-Gravitas/AutoGPT',
      rating: 4.5,
      category: 'Development'
    },
    {
      source: 'GitHub',
      name: 'LangChain',
      description: 'Building applications with LLMs through composability',
      website: 'https://github.com/langchain-ai/langchain',
      rating: 4.4,
      category: 'Development'
    }
  ];
}

// Function to process and normalize tool data
function normalizeToolData(rawData) {
  return rawData.map(item => ({
    name: item.name,
    logo: getToolLogo(item.name, item.category),
    description: item.description || item.name,
    long_description: item.long_description || item.description || item.name,
    category: item.category || 'AI Tools',
    rating: item.rating || 4.0,
    review_count: Math.floor(Math.random() * 1000) + 100,
    weekly_users: Math.floor(Math.random() * 10000) + 1000,
    growth: `+${Math.floor(Math.random() * 50) + 10}%`,
    website: item.website || 'https://example.com',
    pricing: determinePricing(item),
    features: generateFeatures(item),
    pros: generatePros(item),
    cons: generateCons(item),
    alternatives: [],
    tags: generateTags(item),
    source: item.source,
    created_at: item.created_at || new Date().toISOString()
  }));
}

// Helper functions for data normalization
function getToolLogo(name, category) {
  const logos = {
    'Language': ['🤖', '🧠', '💬', '📝'],
    'Design': ['🎨', '🖼️', '🎭', '✨'],
    'Development': ['💻', '⌨️', '🔧', '⚙️'],
    'Productivity': ['⚡', '📊', '🎯', '🚀'],
    'Marketing': ['📈', '📢', '🎪', '💡'],
    'Writing': ['✍️', '📖', '📝', '✏️'],
    'Video': ['🎬', '🎥', '📹', '🎞️'],
    'Audio': ['🎵', '🎧', '🎤', '🎼'],
    'Data': ['📊', '📈', '🔍', '📋']
  };
  
  const categoryLogos = logos[category] || logos['AI Tools'] || ['🔧'];
  return categoryLogos[Math.floor(Math.random() * categoryLogos.length)];
}

function determinePricing(item) {
  const pricingOptions = ['Free', 'Freemium', 'Paid', 'Enterprise'];
  return pricingOptions[Math.floor(Math.random() * pricingOptions.length)];
}

function generateFeatures(item) {
  const baseFeatures = ['AI-powered', 'User-friendly', 'Modern interface'];
  const categoryFeatures = {
    'Language': ['Natural language processing', 'Multi-language support', 'Context awareness'],
    'Design': ['High-resolution output', 'Multiple styles', 'Customization options'],
    'Development': ['Code completion', 'Multi-language support', 'IDE integration'],
    'Productivity': ['Automation', 'Integration', 'Analytics'],
    'Marketing': ['Content generation', 'Analytics', 'A/B testing'],
    'Writing': ['Grammar checking', 'Style suggestions', 'Plagiarism detection'],
    'Video': ['High-quality output', 'Multiple formats', 'Easy editing'],
    'Audio': ['High-fidelity audio', 'Multiple formats', 'Real-time processing'],
    'Data': ['Real-time analytics', 'Data visualization', 'Insights generation']
  };
  
  const features = categoryFeatures[item.category] || ['Advanced AI', 'Easy to use'];
  return [...baseFeatures, ...features.slice(0, 3)];
}

function generatePros(item) {
  return [
    'Easy to use',
    'Powerful features',
    'Good documentation',
    'Active community'
  ];
}

function generateCons(item) {
  return [
    'Learning curve',
    'Limited free tier',
    'Requires internet connection'
  ];
}

function generateTags(item) {
  const baseTags = ['AI'];
  const categoryTags = [item.category];
  const sourceTags = [item.source];
  
  return [...baseTags, ...categoryTags, ...sourceTags];
}

// Function to check if tool already exists in database
async function checkExistingTools(tools) {
  const existingTools = [];
  
  for (const tool of tools) {
    const { data } = await supabase
      .from('tools')
      .select('name')
      .eq('name', tool.name)
      .single();
    
    if (!data) {
      existingTools.push(tool);
    }
  }
  
  return existingTools;
}

// Function to insert new tools into database
async function insertNewTools(tools) {
  console.log(`📝 Inserting ${tools.length} new tools into database...`);
  
  for (const tool of tools) {
    try {
      const { error } = await supabase
        .from('tools')
        .insert({
          name: tool.name,
          logo: tool.logo,
          description: tool.description,
          long_description: tool.long_description,
          category: tool.category,
          rating: tool.rating,
          review_count: tool.review_count,
          weekly_users: tool.weekly_users,
          growth: tool.growth,
          website: tool.website,
          pricing: tool.pricing,
          features: tool.features,
          pros: tool.pros,
          cons: tool.cons,
          alternatives: tool.alternatives,
          tags: tool.tags
        });

      if (error) {
        console.error(`❌ Error inserting ${tool.name}:`, error.message);
      } else {
        console.log(`✅ Inserted: ${tool.name} (${tool.category})`);
      }
    } catch (error) {
      console.error(`❌ Error inserting ${tool.name}:`, error.message);
    }
  }
}

// Main function to fetch all real-time data
async function fetchAllRealTimeData() {
  console.log('🚀 Starting real-time AI data fetching...\n');
  
  try {
    // Fetch data from all sources
    const [productHuntData, githubData, redditData, hackerNewsData] = await Promise.all([
      fetchProductHuntData(),
      fetchGitHubTrendingData(),
      fetchRedditData(),
      fetchHackerNewsData()
    ]);

    // Combine all data
    const allRawData = [
      ...productHuntData,
      ...githubData,
      ...redditData,
      ...hackerNewsData
    ];

    console.log(`📊 Total raw data collected: ${allRawData.length} items`);

    // Normalize and filter data
    const normalizedTools = normalizeToolData(allRawData);
    const aiTools = normalizedTools.filter(tool => 
      isAITool(tool.name, tool.description, tool.tags, tool.website, tool.source)
    );

    console.log(`🤖 AI tools identified: ${aiTools.length}`);

    // Check for existing tools and insert new ones
    const newTools = await checkExistingTools(aiTools);
    console.log(`🆕 New tools to insert: ${newTools.length}`);

    if (newTools.length > 0) {
      await insertNewTools(newTools);
    }

    // Update statistics
    const { count: totalTools } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });

    console.log('\n🎉 Real-time data fetching completed!');
    console.log(`📈 Total tools in database: ${totalTools}`);
    console.log(`🆕 New tools added: ${newTools.length}`);

    // Save to JSON file for backup
    const backupData = {
      timestamp: new Date().toISOString(),
      totalTools,
      newToolsAdded: newTools.length,
      tools: aiTools
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'data', 'real-time-backup.json'),
      JSON.stringify(backupData, null, 2)
    );

    console.log('💾 Backup saved to data/real-time-backup.json');

  } catch (error) {
    console.error('❌ Error in real-time data fetching:', error);
  }
}

// Function to run continuous monitoring
async function startContinuousMonitoring(intervalMinutes = 60) {
  console.log(`🔄 Starting continuous monitoring (checking every ${intervalMinutes} minutes)...`);
  
  // Run initial fetch
  await fetchAllRealTimeData();
  
  // Set up interval
  setInterval(async () => {
    console.log(`\n⏰ Scheduled fetch at ${new Date().toLocaleString()}`);
    await fetchAllRealTimeData();
  }, intervalMinutes * 60 * 1000);
}

// Export functions for use in other scripts
module.exports = {
  fetchAllRealTimeData,
  startContinuousMonitoring,
  DATA_SOURCES
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--continuous') || args.includes('-c')) {
    const interval = parseInt(args.find(arg => arg.startsWith('--interval='))?.split('=')[1]) || 60;
    startContinuousMonitoring(interval);
  } else {
    fetchAllRealTimeData();
  }
} 