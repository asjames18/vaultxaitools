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

// Top AI tools database - curated list of most popular and widely-used AI tools
const TOP_AI_TOOLS = [
  // Language & Chatbots (Most Popular)
  {
    name: 'ChatGPT',
    logo: '🤖',
    description: 'OpenAI\'s conversational AI assistant for text generation and analysis',
    long_description: 'ChatGPT is the most popular AI chatbot, used by millions for conversation, writing, coding, and problem-solving.',
    category: 'Language',
    rating: 4.8,
    review_count: 250000,
    weekly_users: 1000000,
    growth: '+45%',
    website: 'https://chat.openai.com',
    pricing: 'Freemium',
    features: ['Conversational AI', 'Text generation', 'Code assistance', 'Creative writing', 'Problem solving'],
    pros: ['Most popular', 'Highly capable', 'User-friendly', 'Regular updates'],
    cons: ['Limited free tier', 'Can be slow', 'Requires internet'],
    alternatives: ['Claude', 'Bard', 'Perplexity'],
    tags: ['AI', 'Language', 'OpenAI', 'Popular'],
    popularity_score: 100
  },
  {
    name: 'Claude',
    logo: '🧠',
    description: 'Anthropic\'s AI assistant known for safety and helpfulness',
    long_description: 'Claude is a leading AI assistant focused on being helpful, harmless, and honest in conversations.',
    category: 'Language',
    rating: 4.7,
    review_count: 120000,
    weekly_users: 500000,
    growth: '+38%',
    website: 'https://claude.ai',
    pricing: 'Freemium',
    features: ['Conversational AI', 'Content analysis', 'Writing assistance', 'Code help', 'Research support'],
    pros: ['Ethical AI', 'Good reasoning', 'Safe to use', 'High quality'],
    cons: ['Limited availability', 'Conservative responses'],
    alternatives: ['ChatGPT', 'Bard', 'Perplexity'],
    tags: ['AI', 'Language', 'Anthropic', 'Popular'],
    popularity_score: 95
  },
  {
    name: 'Google Bard',
    logo: '🔍',
    description: 'Google\'s AI chatbot integrated with search and real-time data',
    long_description: 'Bard is Google\'s AI assistant that combines conversational AI with real-time search capabilities.',
    category: 'Language',
    rating: 4.5,
    review_count: 180000,
    weekly_users: 800000,
    growth: '+52%',
    website: 'https://bard.google.com',
    pricing: 'Free',
    features: ['Conversational AI', 'Real-time search', 'Multi-modal', 'Google integration', 'Free access'],
    pros: ['Free to use', 'Real-time data', 'Google integration', 'Multi-modal'],
    cons: ['Limited features', 'Can be inaccurate', 'Privacy concerns'],
    alternatives: ['ChatGPT', 'Claude', 'Perplexity'],
    tags: ['AI', 'Language', 'Google', 'Popular'],
    popularity_score: 90
  },
  {
    name: 'Perplexity',
    logo: '🔍',
    description: 'AI-powered search engine with conversational answers and sources',
    long_description: 'Perplexity combines AI chat with search to provide conversational answers with citations and sources.',
    category: 'Language',
    rating: 4.6,
    review_count: 85000,
    weekly_users: 300000,
    growth: '+67%',
    website: 'https://perplexity.ai',
    pricing: 'Freemium',
    features: ['AI search', 'Conversational answers', 'Source citations', 'Real-time data', 'Multi-modal'],
    pros: ['Good sources', 'Conversational', 'Real-time data', 'Free tier'],
    cons: ['Limited features', 'Can be slow'],
    alternatives: ['ChatGPT', 'Bard', 'Claude'],
    tags: ['AI', 'Language', 'Search', 'Popular'],
    popularity_score: 85
  },

  // Image Generation (Most Popular)
  {
    name: 'Midjourney',
    logo: '🎨',
    description: 'Premium AI art generator for creating stunning artwork',
    long_description: 'Midjourney is the most popular AI art generator, known for high-quality artistic images and creative styles.',
    category: 'Design',
    rating: 4.7,
    review_count: 150000,
    weekly_users: 400000,
    growth: '+52%',
    website: 'https://midjourney.com',
    pricing: 'Paid',
    features: ['Image generation', 'Art creation', 'Style customization', 'High resolution', 'Discord integration'],
    pros: ['Highest quality', 'Creative styles', 'Active community', 'Fast generation'],
    cons: ['Paid only', 'Discord required', 'Limited control'],
    alternatives: ['DALL-E', 'Stable Diffusion', 'Leonardo AI'],
    tags: ['AI', 'Design', 'Image Generation', 'Popular'],
    popularity_score: 95
  },
  {
    name: 'DALL-E',
    logo: '🎭',
    description: 'OpenAI\'s AI system for creating realistic images from text',
    long_description: 'DALL-E is OpenAI\'s flagship image generation AI, known for high-quality and realistic image creation.',
    category: 'Design',
    rating: 4.6,
    review_count: 120000,
    weekly_users: 350000,
    growth: '+48%',
    website: 'https://openai.com/dall-e-2',
    pricing: 'Paid',
    features: ['Image generation', 'Text-to-image', 'Art creation', 'High quality', 'OpenAI integration'],
    pros: ['High quality', 'Easy to use', 'Good integration', 'Regular updates'],
    cons: ['Paid only', 'Limited control', 'API required'],
    alternatives: ['Midjourney', 'Stable Diffusion', 'Leonardo AI'],
    tags: ['AI', 'Design', 'OpenAI', 'Popular'],
    popularity_score: 90
  },
  {
    name: 'Stable Diffusion',
    logo: '🖼️',
    description: 'Open-source AI image generation model',
    long_description: 'Stable Diffusion is a popular open-source AI model for image generation, widely used in various applications.',
    category: 'Design',
    rating: 4.4,
    review_count: 95000,
    weekly_users: 250000,
    growth: '+35%',
    website: 'https://stability.ai',
    pricing: 'Freemium',
    features: ['Image generation', 'Open source', 'Customizable', 'Multiple models', 'Local deployment'],
    pros: ['Open source', 'Customizable', 'Local deployment', 'Free options'],
    cons: ['Complex setup', 'Requires expertise', 'Variable quality'],
    alternatives: ['Midjourney', 'DALL-E', 'Leonardo AI'],
    tags: ['AI', 'Design', 'Open Source', 'Popular'],
    popularity_score: 80
  },

  // Development & Coding (Most Popular)
  {
    name: 'GitHub Copilot',
    logo: '💻',
    description: 'AI pair programmer for code completion and generation',
    long_description: 'GitHub Copilot is the most popular AI coding assistant, helping developers write code faster and more efficiently.',
    category: 'Development',
    rating: 4.5,
    review_count: 180000,
    weekly_users: 600000,
    growth: '+41%',
    website: 'https://github.com/features/copilot',
    pricing: 'Paid',
    features: ['Code completion', 'Multi-language support', 'IDE integration', 'Real-time suggestions', 'Documentation generation'],
    pros: ['Most popular', 'Multi-language', 'Good suggestions', 'IDE integration'],
    cons: ['Paid service', 'Requires training', 'Can be inaccurate'],
    alternatives: ['Tabnine', 'Cursor', 'CodeWhisperer'],
    tags: ['AI', 'Development', 'GitHub', 'Popular'],
    popularity_score: 95
  },
  {
    name: 'Cursor',
    logo: '⌨️',
    description: 'AI-first code editor with built-in AI assistance',
    long_description: 'Cursor is a modern code editor built specifically for AI, featuring advanced AI chat and code generation.',
    category: 'Development',
    rating: 4.4,
    review_count: 45000,
    weekly_users: 150000,
    growth: '+78%',
    website: 'https://cursor.sh',
    pricing: 'Freemium',
    features: ['AI chat', 'Code generation', 'VS Code compatible', 'Multi-language', 'Git integration'],
    pros: ['AI-first design', 'VS Code compatible', 'Good AI features', 'Free tier'],
    cons: ['New platform', 'Limited features', 'Requires internet'],
    alternatives: ['VS Code', 'GitHub Copilot', 'Tabnine'],
    tags: ['AI', 'Development', 'Code Editor', 'Popular'],
    popularity_score: 85
  },
  {
    name: 'Amazon CodeWhisperer',
    logo: '☁️',
    description: 'AWS AI coding companion for developers',
    long_description: 'CodeWhisperer is Amazon\'s AI coding assistant, integrated with AWS services and development tools.',
    category: 'Development',
    rating: 4.3,
    review_count: 35000,
    weekly_users: 120000,
    growth: '+55%',
    website: 'https://aws.amazon.com/codewhisperer',
    pricing: 'Freemium',
    features: ['Code completion', 'AWS integration', 'Security scanning', 'IDE support', 'Multi-language'],
    pros: ['AWS integration', 'Security focused', 'Free tier', 'Good documentation'],
    cons: ['AWS focused', 'Limited features', 'Learning curve'],
    alternatives: ['GitHub Copilot', 'Cursor', 'Tabnine'],
    tags: ['AI', 'Development', 'AWS', 'Popular'],
    popularity_score: 75
  },

  // Productivity & Work (Most Popular)
  {
    name: 'Notion AI',
    logo: '📝',
    description: 'AI-powered workspace for notes, docs, and project management',
    long_description: 'Notion AI enhances the popular Notion workspace with intelligent writing and organization assistance.',
    category: 'Productivity',
    rating: 4.4,
    review_count: 120000,
    weekly_users: 400000,
    growth: '+33%',
    website: 'https://notion.so',
    pricing: 'Freemium',
    features: ['Note taking', 'Project management', 'AI writing', 'Database creation', 'Collaboration'],
    pros: ['Versatile', 'Good AI features', 'Collaborative', 'Customizable'],
    cons: ['Learning curve', 'Limited free tier', 'Can be complex'],
    alternatives: ['Obsidian', 'Roam Research', 'Logseq'],
    tags: ['AI', 'Productivity', 'Notion', 'Popular'],
    popularity_score: 90
  },
  {
    name: 'Microsoft Copilot',
    logo: '🪟',
    description: 'AI assistant integrated across Microsoft 365 applications',
    long_description: 'Microsoft Copilot brings AI assistance to Word, Excel, PowerPoint, and other Microsoft 365 apps.',
    category: 'Productivity',
    rating: 4.3,
    review_count: 95000,
    weekly_users: 350000,
    growth: '+42%',
    website: 'https://copilot.microsoft.com',
    pricing: 'Paid',
    features: ['Office integration', 'Document creation', 'Data analysis', 'Presentation help', 'Email assistance'],
    pros: ['Office integration', 'Comprehensive', 'Good features', 'Enterprise ready'],
    cons: ['Paid only', 'Microsoft ecosystem', 'Learning curve'],
    alternatives: ['Notion AI', 'Google Workspace AI', 'Zapier AI'],
    tags: ['AI', 'Productivity', 'Microsoft', 'Popular'],
    popularity_score: 85
  },
  {
    name: 'Zapier AI',
    logo: '🔗',
    description: 'AI-powered automation platform for connecting apps',
    long_description: 'Zapier AI enhances the popular automation platform with intelligent workflow creation and optimization.',
    category: 'Productivity',
    rating: 4.2,
    review_count: 85000,
    weekly_users: 300000,
    growth: '+28%',
    website: 'https://zapier.com',
    pricing: 'Freemium',
    features: ['App automation', 'Workflow creation', 'AI assistance', 'Integration platform', 'No-code'],
    pros: ['Powerful automation', 'Many integrations', 'No-code', 'Good AI features'],
    cons: ['Complex setup', 'Limited free tier', 'Can be expensive'],
    alternatives: ['Make', 'IFTTT', 'n8n'],
    tags: ['AI', 'Productivity', 'Automation', 'Popular'],
    popularity_score: 80
  },

  // Writing & Content (Most Popular)
  {
    name: 'Grammarly',
    logo: '📚',
    description: 'AI-powered writing assistant for grammar, style, and tone',
    long_description: 'Grammarly is the most popular AI writing assistant, used by millions to improve their writing.',
    category: 'Writing',
    rating: 4.5,
    review_count: 200000,
    weekly_users: 800000,
    growth: '+35%',
    website: 'https://grammarly.com',
    pricing: 'Freemium',
    features: ['Grammar checking', 'Style suggestions', 'Tone analysis', 'Plagiarism detection', 'Browser integration'],
    pros: ['Most popular', 'Accurate suggestions', 'Easy to use', 'Browser integration'],
    cons: ['Limited free features', 'Privacy concerns', 'Can be intrusive'],
    alternatives: ['ProWritingAid', 'Hemingway Editor', 'LanguageTool'],
    tags: ['AI', 'Writing', 'Grammar', 'Popular'],
    popularity_score: 95
  },
  {
    name: 'Jasper',
    logo: '✍️',
    description: 'AI content creation platform for marketing and copywriting',
    long_description: 'Jasper is a leading AI writing platform specifically designed for marketing and business content creation.',
    category: 'Marketing',
    rating: 4.3,
    review_count: 75000,
    weekly_users: 250000,
    growth: '+28%',
    website: 'https://jasper.ai',
    pricing: 'Paid',
    features: ['Content creation', 'Marketing copy', 'Blog writing', 'Social media', 'SEO optimization'],
    pros: ['Marketing focused', 'Good templates', 'SEO features', 'Brand voice'],
    cons: ['Expensive', 'Limited free trial', 'Requires training'],
    alternatives: ['Copy.ai', 'Writesonic', 'Rytr'],
    tags: ['AI', 'Marketing', 'Content Creation', 'Popular'],
    popularity_score: 85
  },
  {
    name: 'Copy.ai',
    logo: '📝',
    description: 'AI copywriting tool for marketing and business content',
    long_description: 'Copy.ai helps businesses create compelling marketing copy, ads, and content using AI.',
    category: 'Marketing',
    rating: 4.2,
    review_count: 65000,
    weekly_users: 200000,
    growth: '+32%',
    website: 'https://copy.ai',
    pricing: 'Freemium',
    features: ['Copywriting', 'Marketing content', 'Ad creation', 'Social media', 'Brand voice'],
    pros: ['Good templates', 'Easy to use', 'Free tier', 'Marketing focused'],
    cons: ['Limited features', 'Quality varies', 'Requires editing'],
    alternatives: ['Jasper', 'Writesonic', 'Rytr'],
    tags: ['AI', 'Marketing', 'Copywriting', 'Popular'],
    popularity_score: 80
  },

  // Audio & Video (Most Popular)
  {
    name: 'ElevenLabs',
    logo: '🎵',
    description: 'AI voice generation and text-to-speech platform',
    long_description: 'ElevenLabs is the most popular AI voice generation platform, known for natural-sounding voices.',
    category: 'Audio',
    rating: 4.5,
    review_count: 45000,
    weekly_users: 150000,
    growth: '+89%',
    website: 'https://elevenlabs.io',
    pricing: 'Freemium',
    features: ['Voice cloning', 'Text-to-speech', 'Voice design', 'Multi-language', 'API access'],
    pros: ['Highest quality', 'Voice cloning', 'Easy to use', 'Good API'],
    cons: ['Limited free tier', 'Voice cloning concerns', 'Requires good text'],
    alternatives: ['Murf', 'Play.ht', 'Resemble AI'],
    tags: ['AI', 'Audio', 'Voice Generation', 'Popular'],
    popularity_score: 90
  },
  {
    name: 'Synthesia',
    logo: '🎬',
    description: 'AI video generation platform for creating talking avatars',
    long_description: 'Synthesia is the leading platform for creating AI-generated videos with talking avatars.',
    category: 'Video',
    rating: 4.4,
    review_count: 35000,
    weekly_users: 120000,
    growth: '+55%',
    website: 'https://synthesia.io',
    pricing: 'Paid',
    features: ['AI avatars', 'Video generation', 'Multi-language', 'Custom avatars', 'Templates'],
    pros: ['High quality', 'Multi-language', 'Custom avatars', 'Easy to use'],
    cons: ['Expensive', 'Limited customization', 'Requires script'],
    alternatives: ['D-ID', 'HeyGen', 'Synthesys'],
    tags: ['AI', 'Video', 'Avatar Generation', 'Popular'],
    popularity_score: 85
  },
  {
    name: 'Otter.ai',
    logo: '🎤',
    description: 'AI-powered transcription and meeting assistant',
    long_description: 'Otter.ai is a popular AI transcription service that provides real-time meeting transcription and insights.',
    category: 'Audio',
    rating: 4.3,
    review_count: 55000,
    weekly_users: 180000,
    growth: '+42%',
    website: 'https://otter.ai',
    pricing: 'Freemium',
    features: ['Real-time transcription', 'Speaker identification', 'Meeting insights', 'Audio recording', 'Integration'],
    pros: ['Real-time', 'Good accuracy', 'Easy to use', 'Good integration'],
    cons: ['Limited free tier', 'Requires good audio', 'Privacy concerns'],
    alternatives: ['Rev', 'Trint', 'Descript'],
    tags: ['AI', 'Audio', 'Transcription', 'Popular'],
    popularity_score: 80
  }
];

// Function to fetch top AI tools
async function fetchTopAITools() {
  console.log('🚀 Fetching top, most-used AI tools...');
  
  try {
    // Clear existing tools first
    console.log('🧹 Clearing existing tools to focus on top AI tools...');
    const { error: deleteError } = await supabase
      .from('tools')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all tools
    
    if (deleteError) {
      console.error('Error clearing tools:', deleteError);
    } else {
      console.log('✅ Cleared existing tools');
    }
    
    // Add top AI tools
    console.log(`📝 Adding ${TOP_AI_TOOLS.length} top AI tools...`);
    
    let addedCount = 0;
    
    for (const tool of TOP_AI_TOOLS) {
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
          console.log(`⚠️ Could not add ${tool.name}: ${error.message}`);
        } else {
          console.log(`✅ Added: ${tool.name} (${tool.category}) - ${tool.popularity_score}/100 popularity`);
          addedCount++;
        }
        
      } catch (error) {
        console.log(`⚠️ Error adding ${tool.name}: ${error.message}`);
      }
    }
    
    console.log(`\n📈 Top AI tools fetch completed:`);
    console.log(`   ✅ Added: ${addedCount} top AI tools`);
    console.log(`   📊 Total: ${TOP_AI_TOOLS.length} processed`);
    
    // Verify the results
    await verifyTopTools();
    
  } catch (error) {
    console.error('❌ Error fetching top AI tools:', error);
  }
}

// Function to verify top tools
async function verifyTopTools() {
  console.log('\n🔍 Verifying top AI tools...');
  
  try {
    const { data: tools, count: totalTools } = await supabase
      .from('tools')
      .select('name, category, rating, weekly_users', { count: 'exact' });
    
    console.log(`📊 Total tools in database: ${totalTools}`);
    
    if (tools && tools.length > 0) {
      console.log('\n🏆 Top AI Tools by Weekly Users:');
      tools
        .sort((a, b) => (b.weekly_users || 0) - (a.weekly_users || 0))
        .slice(0, 10)
        .forEach((tool, index) => {
          console.log(`   ${index + 1}. ${tool.name} (${tool.category}) - ${tool.weekly_users?.toLocaleString()} users - ${tool.rating}/5.0`);
        });
      
      // Check categories
      const categories = {};
      tools.forEach(tool => {
        categories[tool.category] = (categories[tool.category] || 0) + 1;
      });
      
      console.log('\n📈 Category distribution:');
      Object.entries(categories).forEach(([category, count]) => {
        console.log(`   - ${category}: ${count} tools`);
      });
      
      // Calculate average metrics
      const avgRating = tools.reduce((sum, tool) => sum + (tool.rating || 0), 0) / tools.length;
      const avgUsers = tools.reduce((sum, tool) => sum + (tool.weekly_users || 0), 0) / tools.length;
      
      console.log(`\n📊 Average metrics:`);
      console.log(`   - Average rating: ${avgRating.toFixed(1)}/5.0`);
      console.log(`   - Average weekly users: ${avgUsers.toLocaleString()}`);
    }
    
  } catch (error) {
    console.error('❌ Error verifying top tools:', error);
  }
}

// Function to get popularity ranking
function getPopularityRanking() {
  console.log('\n🏆 Top AI Tools by Popularity Score:');
  
  TOP_AI_TOOLS
    .sort((a, b) => b.popularity_score - a.popularity_score)
    .forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.name} (${tool.category}) - ${tool.popularity_score}/100`);
    });
}

// Main function
async function main() {
  console.log('🎯 Fetching Top, Most-Used AI Tools Only...\n');
  
  try {
    // Show popularity ranking
    getPopularityRanking();
    
    // Fetch top AI tools
    await fetchTopAITools();
    
    console.log('\n🎉 Top AI tools fetch completed!');
    console.log('📈 Your database now contains only the most popular and widely-used AI tools.');
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  fetchTopAITools,
  verifyTopTools,
  getPopularityRanking,
  TOP_AI_TOOLS
}; 