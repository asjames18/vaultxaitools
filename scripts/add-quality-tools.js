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

// High-quality AI tools to add
const QUALITY_AI_TOOLS = [
  {
    name: 'ChatGPT',
    logo: '🤖',
    description: 'AI-powered conversational assistant for text generation and analysis',
    long_description: 'OpenAI\'s ChatGPT is a large language model that can engage in human-like conversations, answer questions, write content, and assist with various tasks.',
    category: 'Language',
    rating: 4.8,
    review_count: 15000,
    weekly_users: 50000,
    growth: '+45%',
    website: 'https://chat.openai.com',
    pricing: 'Freemium',
    features: ['Conversational AI', 'Text generation', 'Code assistance', 'Creative writing', 'Problem solving'],
    pros: ['Highly capable', 'User-friendly', 'Regular updates', 'Good documentation'],
    cons: ['Limited free tier', 'Requires internet', 'Can be slow'],
    alternatives: ['Claude', 'Bard', 'Perplexity'],
    tags: ['AI', 'Language', 'OpenAI']
  },
  {
    name: 'Claude',
    logo: '🧠',
    description: 'Anthropic\'s AI assistant for conversation, analysis, and content creation',
    long_description: 'Claude is an AI assistant developed by Anthropic, designed to be helpful, harmless, and honest in conversations.',
    category: 'Language',
    rating: 4.7,
    review_count: 8500,
    weekly_users: 25000,
    growth: '+38%',
    website: 'https://claude.ai',
    pricing: 'Freemium',
    features: ['Conversational AI', 'Content analysis', 'Writing assistance', 'Code help', 'Research support'],
    pros: ['Ethical AI', 'Good reasoning', 'Helpful responses', 'Safe to use'],
    cons: ['Limited availability', 'Conservative responses', 'No image generation'],
    alternatives: ['ChatGPT', 'Bard', 'Perplexity'],
    tags: ['AI', 'Language', 'Anthropic']
  },
  {
    name: 'Midjourney',
    logo: '🎨',
    description: 'AI-powered image generation tool for creating stunning artwork',
    long_description: 'Midjourney is an AI art generator that creates high-quality images from text descriptions using advanced machine learning.',
    category: 'Design',
    rating: 4.6,
    review_count: 12000,
    weekly_users: 35000,
    growth: '+52%',
    website: 'https://midjourney.com',
    pricing: 'Paid',
    features: ['Image generation', 'Art creation', 'Style customization', 'High resolution', 'Discord integration'],
    pros: ['High quality output', 'Creative styles', 'Fast generation', 'Active community'],
    cons: ['Paid only', 'Discord required', 'Limited control'],
    alternatives: ['DALL-E', 'Stable Diffusion', 'Leonardo AI'],
    tags: ['AI', 'Design', 'Image Generation']
  },
  {
    name: 'GitHub Copilot',
    logo: '💻',
    description: 'AI-powered code completion and generation for developers',
    long_description: 'GitHub Copilot is an AI pair programmer that helps you write code faster and with less work by suggesting whole lines or blocks of code.',
    category: 'Development',
    rating: 4.5,
    review_count: 9500,
    weekly_users: 40000,
    growth: '+41%',
    website: 'https://github.com/features/copilot',
    pricing: 'Paid',
    features: ['Code completion', 'Multi-language support', 'IDE integration', 'Real-time suggestions', 'Documentation generation'],
    pros: ['Saves time', 'Multi-language', 'Good suggestions', 'IDE integration'],
    cons: ['Paid service', 'Requires training', 'Can be inaccurate'],
    alternatives: ['Tabnine', 'Cursor', 'CodeWhisperer'],
    tags: ['AI', 'Development', 'GitHub']
  },
  {
    name: 'Notion AI',
    logo: '📝',
    description: 'AI-powered workspace for notes, docs, and project management',
    long_description: 'Notion AI helps you write, brainstorm, edit, and organize your work with intelligent assistance.',
    category: 'Productivity',
    rating: 4.4,
    review_count: 7800,
    weekly_users: 30000,
    growth: '+33%',
    website: 'https://notion.so',
    pricing: 'Freemium',
    features: ['Note taking', 'Project management', 'AI writing', 'Database creation', 'Collaboration'],
    pros: ['Versatile', 'Good AI features', 'Collaborative', 'Customizable'],
    cons: ['Learning curve', 'Limited free tier', 'Can be complex'],
    alternatives: ['Obsidian', 'Roam Research', 'Logseq'],
    tags: ['AI', 'Productivity', 'Notion']
  },
  {
    name: 'Jasper',
    logo: '✍️',
    description: 'AI content creation platform for marketing and copywriting',
    long_description: 'Jasper is an AI writing assistant that helps you create high-quality content for marketing, blogs, and social media.',
    category: 'Marketing',
    rating: 4.3,
    review_count: 6500,
    weekly_users: 22000,
    growth: '+28%',
    website: 'https://jasper.ai',
    pricing: 'Paid',
    features: ['Content creation', 'Marketing copy', 'Blog writing', 'Social media', 'SEO optimization'],
    pros: ['Marketing focused', 'Good templates', 'SEO features', 'Brand voice'],
    cons: ['Expensive', 'Limited free trial', 'Requires training'],
    alternatives: ['Copy.ai', 'Writesonic', 'Rytr'],
    tags: ['AI', 'Marketing', 'Content Creation']
  },
  {
    name: 'DALL-E',
    logo: '🎭',
    description: 'OpenAI\'s AI system for creating realistic images from text descriptions',
    long_description: 'DALL-E is an AI system that can create realistic images and art from natural language descriptions.',
    category: 'Design',
    rating: 4.5,
    review_count: 11000,
    weekly_users: 28000,
    growth: '+48%',
    website: 'https://openai.com/dall-e-2',
    pricing: 'Paid',
    features: ['Image generation', 'Text-to-image', 'Art creation', 'High quality', 'OpenAI integration'],
    pros: ['High quality', 'Easy to use', 'Good integration', 'Regular updates'],
    cons: ['Paid only', 'Limited control', 'API required'],
    alternatives: ['Midjourney', 'Stable Diffusion', 'Leonardo AI'],
    tags: ['AI', 'Design', 'OpenAI']
  },
  {
    name: 'Grammarly',
    logo: '📚',
    description: 'AI-powered writing assistant for grammar, style, and tone',
    long_description: 'Grammarly is an AI writing assistant that helps you write better by checking grammar, style, and tone.',
    category: 'Writing',
    rating: 4.4,
    review_count: 8900,
    weekly_users: 32000,
    growth: '+35%',
    website: 'https://grammarly.com',
    pricing: 'Freemium',
    features: ['Grammar checking', 'Style suggestions', 'Tone analysis', 'Plagiarism detection', 'Browser integration'],
    pros: ['Accurate suggestions', 'Easy to use', 'Browser integration', 'Good free tier'],
    cons: ['Limited free features', 'Privacy concerns', 'Can be intrusive'],
    alternatives: ['ProWritingAid', 'Hemingway Editor', 'LanguageTool'],
    tags: ['AI', 'Writing', 'Grammar']
  },
  {
    name: 'Otter.ai',
    logo: '🎤',
    description: 'AI-powered transcription and meeting assistant',
    long_description: 'Otter.ai provides real-time transcription, speaker identification, and meeting insights using AI.',
    category: 'Audio',
    rating: 4.2,
    review_count: 5400,
    weekly_users: 18000,
    growth: '+42%',
    website: 'https://otter.ai',
    pricing: 'Freemium',
    features: ['Real-time transcription', 'Speaker identification', 'Meeting insights', 'Audio recording', 'Integration'],
    pros: ['Real-time', 'Good accuracy', 'Easy to use', 'Good integration'],
    cons: ['Limited free tier', 'Requires good audio', 'Privacy concerns'],
    alternatives: ['Rev', 'Trint', 'Descript'],
    tags: ['AI', 'Audio', 'Transcription']
  },
  {
    name: 'Synthesia',
    logo: '🎬',
    description: 'AI video generation platform for creating talking avatars',
    long_description: 'Synthesia creates AI-generated videos with talking avatars for training, marketing, and communication.',
    category: 'Video',
    rating: 4.3,
    review_count: 4200,
    weekly_users: 15000,
    growth: '+55%',
    website: 'https://synthesia.io',
    pricing: 'Paid',
    features: ['AI avatars', 'Video generation', 'Multi-language', 'Custom avatars', 'Templates'],
    pros: ['High quality', 'Multi-language', 'Custom avatars', 'Easy to use'],
    cons: ['Expensive', 'Limited customization', 'Requires script'],
    alternatives: ['D-ID', 'HeyGen', 'Synthesys'],
    tags: ['AI', 'Video', 'Avatar Generation']
  },
  {
    name: 'Perplexity',
    logo: '🔍',
    description: 'AI-powered search engine with conversational interface',
    long_description: 'Perplexity is an AI search engine that provides conversational answers with sources and citations.',
    category: 'Language',
    rating: 4.4,
    review_count: 3800,
    weekly_users: 12000,
    growth: '+67%',
    website: 'https://perplexity.ai',
    pricing: 'Freemium',
    features: ['AI search', 'Conversational answers', 'Source citations', 'Real-time data', 'Multi-modal'],
    pros: ['Good sources', 'Conversational', 'Real-time data', 'Free to use'],
    cons: ['Limited features', 'Can be slow', 'Limited customization'],
    alternatives: ['ChatGPT', 'Bard', 'Claude'],
    tags: ['AI', 'Language', 'Search']
  },
  {
    name: 'Cursor',
    logo: '⌨️',
    description: 'AI-first code editor with built-in AI assistance',
    long_description: 'Cursor is a code editor built for AI, featuring built-in AI chat, code generation, and intelligent assistance.',
    category: 'Development',
    rating: 4.3,
    review_count: 3100,
    weekly_users: 9500,
    growth: '+78%',
    website: 'https://cursor.sh',
    pricing: 'Freemium',
    features: ['AI chat', 'Code generation', 'VS Code compatible', 'Multi-language', 'Git integration'],
    pros: ['AI-first design', 'VS Code compatible', 'Good AI features', 'Free tier'],
    cons: ['New platform', 'Limited features', 'Requires internet'],
    alternatives: ['VS Code', 'GitHub Copilot', 'Tabnine'],
    tags: ['AI', 'Development', 'Code Editor']
  },
  {
    name: 'Canva AI',
    logo: '🎨',
    description: 'AI-powered design tool for creating visual content',
    long_description: 'Canva AI helps you create professional designs with AI-powered tools for image generation, text effects, and design suggestions.',
    category: 'Design',
    rating: 4.2,
    review_count: 7200,
    weekly_users: 25000,
    growth: '+38%',
    website: 'https://canva.com',
    pricing: 'Freemium',
    features: ['AI image generation', 'Design templates', 'Text effects', 'Background removal', 'Collaboration'],
    pros: ['Easy to use', 'Good templates', 'AI features', 'Collaborative'],
    cons: ['Limited free tier', 'Requires internet', 'Can be slow'],
    alternatives: ['Figma', 'Adobe Creative Suite', 'Snapchat'],
    tags: ['AI', 'Design', 'Canva']
  },
  {
    name: 'ElevenLabs',
    logo: '🎵',
    description: 'AI voice generation and text-to-speech platform',
    long_description: 'ElevenLabs creates natural-sounding AI voices for content creation, audiobooks, and voiceovers.',
    category: 'Audio',
    rating: 4.4,
    review_count: 2800,
    weekly_users: 8500,
    growth: '+89%',
    website: 'https://elevenlabs.io',
    pricing: 'Freemium',
    features: ['Voice cloning', 'Text-to-speech', 'Voice design', 'Multi-language', 'API access'],
    pros: ['High quality', 'Voice cloning', 'Easy to use', 'Good API'],
    cons: ['Limited free tier', 'Voice cloning concerns', 'Requires good text'],
    alternatives: ['Murf', 'Play.ht', 'Resemble AI'],
    tags: ['AI', 'Audio', 'Voice Generation']
  }
];

// Function to add quality AI tools
async function addQualityAITools() {
  console.log('➕ Adding high-quality AI tools...');
  
  let addedCount = 0;
  let skippedCount = 0;
  
  for (const tool of QUALITY_AI_TOOLS) {
    try {
      // Check if tool already exists
      const { data: existingTool } = await supabase
        .from('tools')
        .select('id')
        .eq('name', tool.name)
        .single();
      
      if (existingTool) {
        console.log(`⏭️ Skipped: ${tool.name} (already exists)`);
        skippedCount++;
        continue;
      }
      
      // Add the tool
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
          tags: tool.tags,
          source: 'Manual',
          trending_score: calculateTrendingScore(tool.rating, tool.review_count, tool.weekly_users, tool.growth)
        });
      
      if (error) {
        console.log(`⚠️ Could not add ${tool.name}: ${error.message}`);
      } else {
        console.log(`✅ Added: ${tool.name} (${tool.category})`);
        addedCount++;
      }
      
    } catch (error) {
      console.log(`⚠️ Error adding ${tool.name}: ${error.message}`);
    }
  }
  
  console.log(`\n📈 Quality tools addition completed:`);
  console.log(`   ✅ Added: ${addedCount} new tools`);
  console.log(`   ⏭️ Skipped: ${skippedCount} existing tools`);
  console.log(`   📊 Total: ${addedCount + skippedCount} processed`);
  
  return addedCount;
}

// Function to calculate trending score
function calculateTrendingScore(rating, reviewCount, weeklyUsers, growth) {
  const growthNumeric = parseFloat(growth.replace(/[^0-9.-]/g, '')) || 0;
  
  const score = (
    (rating || 0) * 0.4 + 
    Math.min((reviewCount || 0) / 1000.0, 1.0) * 0.2 +
    Math.min((weeklyUsers || 0) / 10000.0, 1.0) * 0.2 +
    Math.min(growthNumeric / 100.0, 1.0) * 0.2
  );
  
  return Math.round(score * 100) / 100;
}

// Function to verify the database
async function verifyDatabase() {
  console.log('\n🔍 Verifying database...');
  
  try {
    const { data: tools, count: totalTools } = await supabase
      .from('tools')
      .select('name, category, rating', { count: 'exact' });
    
    console.log(`📊 Total tools in database: ${totalTools}`);
    
    if (tools && tools.length > 0) {
      console.log('\n📋 Sample of tools:');
      tools.slice(0, 10).forEach(tool => {
        console.log(`   - ${tool.name} (${tool.category}) - ${tool.rating}/5.0`);
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
    }
    
  } catch (error) {
    console.error('❌ Error verifying database:', error);
  }
}

// Main function
async function main() {
  console.log('🚀 Adding high-quality AI tools to database...\n');
  
  try {
    // Add quality tools
    const addedCount = await addQualityAITools();
    
    // Verify database
    await verifyDatabase();
    
    console.log('\n🎉 High-quality AI tools addition completed!');
    console.log(`📈 Added ${addedCount} new quality AI tools to your database.`);
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  addQualityAITools,
  verifyDatabase,
  calculateTrendingScore
}; 