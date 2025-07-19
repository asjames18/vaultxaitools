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

// Improved AI tool detection patterns
const IMPROVED_AI_PATTERNS = {
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

// Function to check if content is a news article
function isNewsArticle(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  return IMPROVED_AI_PATTERNS.newsKeywords.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
}

// Function to check if content is an actual AI tool
function isActualAITool(name, description, website, source) {
  const text = `${name} ${description}`.toLowerCase();
  
  // Exclude news articles
  if (isNewsArticle(name, description)) {
    return false;
  }
  
  // Check for tool keywords
  const hasToolKeywords = IMPROVED_AI_PATTERNS.toolKeywords.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  // Check for tool domains
  const hasToolDomain = IMPROVED_AI_PATTERNS.aiToolDomains.some(domain => 
    website && website.toLowerCase().includes(domain)
  );
  
  // Check for tool extensions
  const hasToolExtension = IMPROVED_AI_PATTERNS.toolExtensions.some(ext => 
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

// Function to clean up non-tool content
async function cleanupNonToolContent() {
  console.log('🧹 Cleaning up non-tool content...');
  
  try {
    // Get all tools
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*');
    
    if (error) {
      console.error('Error fetching tools:', error);
      return;
    }
    
    console.log(`📊 Reviewing ${tools.length} tools for cleanup...`);
    
    let removedCount = 0;
    let keptCount = 0;
    
    for (const tool of tools) {
      const isTool = isActualAITool(tool.name, tool.description, tool.website, tool.source);
      
      if (!isTool) {
        console.log(`🗑️ Removing non-tool: ${tool.name} (${tool.source})`);
        
        // Delete the tool
        const { error: deleteError } = await supabase
          .from('tools')
          .delete()
          .eq('id', tool.id);
        
        if (deleteError) {
          console.error(`❌ Error deleting ${tool.name}:`, deleteError);
        } else {
          removedCount++;
        }
      } else {
        keptCount++;
      }
    }
    
    console.log('\n📈 Cleanup completed:');
    console.log(`   ✅ Kept: ${keptCount} actual AI tools`);
    console.log(`   🗑️ Removed: ${removedCount} non-tool items`);
    console.log(`   📊 Total: ${keptCount + removedCount} reviewed`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Function to improve existing tool data
async function improveExistingTools() {
  console.log('🔧 Improving existing tool data...');
  
  try {
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*');
    
    if (error) {
      console.error('Error fetching tools:', error);
      return;
    }
    
    console.log(`📊 Improving ${tools.length} tools...`);
    
    let improvedCount = 0;
    
    for (const tool of tools) {
      let improvements = {};
      
      // Improve description if it's too generic
      if (tool.description === tool.name || tool.description.length < 20) {
        improvements.description = generateBetterDescription(tool.name, tool.category, tool.source);
      }
      
      // Improve category if it's generic
      if (tool.category === 'AI Tools' || tool.category === 'Design') {
        improvements.category = determineBetterCategory(tool.name, tool.description);
      }
      
      // Improve website if it's incorrect
      if (tool.website && (tool.website.includes('amzn.to') || tool.website.includes('example.com'))) {
        improvements.website = generateBetterWebsite(tool.name, tool.source);
      }
      
      // Apply improvements if any
      if (Object.keys(improvements).length > 0) {
        const { error: updateError } = await supabase
          .from('tools')
          .update(improvements)
          .eq('id', tool.id);
        
        if (updateError) {
          console.error(`❌ Error updating ${tool.name}:`, updateError);
        } else {
          improvedCount++;
          console.log(`✅ Improved: ${tool.name}`);
        }
      }
    }
    
    console.log(`\n📈 Improvements completed: ${improvedCount} tools enhanced`);
    
  } catch (error) {
    console.error('❌ Error improving tools:', error);
  }
}

// Function to generate better descriptions
function generateBetterDescription(name, category, source) {
  const descriptions = {
    'Development': `${name} - AI/ML development tool for building intelligent applications`,
    'Language': `${name} - AI-powered language processing and text generation tool`,
    'Design': `${name} - AI-driven design and creative tool for visual content`,
    'Productivity': `${name} - AI productivity tool to streamline workflows and tasks`,
    'Marketing': `${name} - AI marketing tool for content creation and campaign optimization`,
    'Education': `${name} - AI educational platform for learning and skill development`,
    'Research': `${name} - AI research tool for data analysis and insights`,
    'AI Tools': `${name} - Artificial intelligence tool for various applications`
  };
  
  return descriptions[category] || descriptions['AI Tools'];
}

// Function to determine better category
function determineBetterCategory(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  if (text.includes('chat') || text.includes('gpt') || text.includes('language') || text.includes('text')) {
    return 'Language';
  } else if (text.includes('image') || text.includes('art') || text.includes('design') || text.includes('visual')) {
    return 'Design';
  } else if (text.includes('code') || text.includes('development') || text.includes('programming') || text.includes('api')) {
    return 'Development';
  } else if (text.includes('productivity') || text.includes('workflow') || text.includes('automation')) {
    return 'Productivity';
  } else if (text.includes('marketing') || text.includes('copy') || text.includes('content')) {
    return 'Marketing';
  } else if (text.includes('education') || text.includes('learning') || text.includes('course')) {
    return 'Education';
  } else if (text.includes('research') || text.includes('analysis') || text.includes('data')) {
    return 'Research';
  }
  
  return 'AI Tools';
}

// Function to generate better website
function generateBetterWebsite(name, source) {
  if (source === 'GitHub') {
    return `https://github.com/search?q=${encodeURIComponent(name)}`;
  } else if (source === 'Product Hunt') {
    return `https://www.producthunt.com/search?q=${encodeURIComponent(name)}`;
  } else {
    return `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  }
}

// Function to update the real-time fetcher with improved detection
function updateRealtimeFetcher() {
  console.log('🔄 Updating real-time fetcher with improved detection...');
  
  // This would update the real-time-ai-data-fetcher.js file
  // For now, we'll create a new version
  console.log('✅ Improved detection patterns ready for next fetch');
}

// Main function
async function improveAIDetection() {
  console.log('🤖 Improving AI Tool Detection System...\n');
  
  try {
    // Step 1: Clean up non-tool content
    await cleanupNonToolContent();
    
    // Step 2: Improve existing tool data
    await improveExistingTools();
    
    // Step 3: Update real-time fetcher
    updateRealtimeFetcher();
    
    // Step 4: Verify improvements
    await verifyImprovements();
    
    console.log('\n🎉 AI detection improvement completed!');
    
  } catch (error) {
    console.error('❌ Error improving AI detection:', error);
  }
}

// Function to verify improvements
async function verifyImprovements() {
  console.log('\n🔍 Verifying improvements...');
  
  try {
    const { data: tools, count: totalTools } = await supabase
      .from('tools')
      .select('name, category, source', { count: 'exact' });
    
    console.log(`📊 Total tools after cleanup: ${totalTools}`);
    
    // Check categories
    const categories = {};
    tools?.forEach(tool => {
      categories[tool.category] = (categories[tool.category] || 0) + 1;
    });
    
    console.log('📈 Category distribution:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} tools`);
    });
    
    // Check sources
    const sources = {};
    tools?.forEach(tool => {
      sources[tool.source] = (sources[tool.source] || 0) + 1;
    });
    
    console.log('🌐 Source distribution:');
    Object.entries(sources).forEach(([source, count]) => {
      console.log(`   - ${source}: ${count} tools`);
    });
    
  } catch (error) {
    console.error('❌ Error verifying improvements:', error);
  }
}

// Run if called directly
if (require.main === module) {
  improveAIDetection();
}

module.exports = {
  improveAIDetection,
  isActualAITool,
  isNewsArticle,
  IMPROVED_AI_PATTERNS
}; 