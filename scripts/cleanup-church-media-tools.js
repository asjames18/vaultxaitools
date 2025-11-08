require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Church/Media/Ministry relevant categories
const CHURCH_MEDIA_CATEGORIES = [
  'Video Editing',
  'Graphics Design',
  'Social Media',
  'Live Streaming',
  'Audio/Podcasting',
  'Content Creation',
  'Website Building',
  'Email Marketing',
  'Project Management',
  'Communication',
  'Language' // Keep Language category for AI tools useful for content creation
];

// Tools to always keep (whitelist) - useful for church/media content creation
const TOOLS_TO_ALWAYS_KEEP = [
  'ChatGPT',
  'Claude',
  'Perplexity',
  'Bard',
  'Gemini',
  'Copilot',
  'Notion AI',
  'Grammarly',
  'Otter.ai',
  'Descript', // Audio transcription/editing
  'Fireflies', // Meeting transcription
  'Jasper', // Content creation
  'Copy.ai', // Content creation
  'Runway', // AI video
  'Synthesia', // AI video
  'Lumen5', // Video creation
  'Pictory', // Video creation
  'Midjourney', // AI image generation
  'DALL-E', // AI image generation
  'Stable Diffusion', // AI image generation
  'Canva AI' // Design with AI
];

// Keywords that indicate church/media/ministry relevance
const RELEVANT_KEYWORDS = [
  // Media production
  'video', 'video editing', 'video production', 'film', 'cinematography',
  'graphics', 'graphic design', 'design', 'visual', 'image', 'photo',
  'social media', 'social', 'instagram', 'facebook', 'twitter', 'youtube',
  'streaming', 'live stream', 'broadcast', 'livestream',
  'audio', 'podcast', 'sound', 'music', 'recording', 'audio editing',
  'content', 'content creation', 'content management',
  
  // Church/ministry specific
  'church', 'ministry', 'worship', 'sermon', 'service', 'outreach',
  'communication', 'messaging', 'email', 'newsletter',
  'website', 'web', 'cms', 'website builder',
  'project management', 'planning', 'scheduling',
  
  // AI tools that relate to media/church use cases
  'transcription', 'caption', 'subtitle', 'transcribe',
  'ai writing', 'content generation', 'copywriting', 'blog',
  'image generation', 'ai image', 'text to image',
  'video generation', 'ai video', 'text to video',
  'voice', 'voiceover', 'tts', 'text to speech',
  'translation', 'language', 'localization'
];

// Keywords that indicate tools should be REMOVED (not relevant)
const IRRELEVANT_KEYWORDS = [
  'cryptocurrency', 'crypto', 'blockchain', 'bitcoin', 'ethereum',
  'trading', 'stock', 'finance', 'investment', 'banking',
  'medical', 'healthcare', 'diagnosis', 'patient', 'therapy',
  'legal', 'law', 'attorney', 'lawsuit', 'contract',
  'real estate', 'property', 'mortgage', 'housing',
  'dating', 'relationship', 'matchmaking',
  'gaming', 'game', 'esports', 'gamer',
  'fitness', 'workout', 'exercise', 'gym',
  'food', 'recipe', 'cooking', 'restaurant',
  'travel', 'hotel', 'booking', 'vacation',
  'shopping', 'ecommerce', 'retail', 'store',
  'logistics', 'shipping', 'supply chain',
  'hr', 'recruitment', 'hiring', 'job board',
  'accounting', 'tax', 'invoice', 'billing',
  'enterprise', 'erp', 'crm', 'salesforce'
];

// Categories that should be removed or renamed
const CATEGORIES_TO_REMOVE = [
  // 'Language', // Keep Language category for AI tools useful for content creation
  'Development', // Keep only if it's for church websites/apps
  'Data', // Remove unless it's analytics for church media
  'Business', // Too generic
  'Finance', // Not relevant
  'Health', // Not relevant
  'Education' // Keep only if it's for church education/teaching
];

function isRelevantToChurchMedia(tool) {
  const name = (tool.name || '').toLowerCase();
  const description = (tool.description || '').toLowerCase();
  const longDescription = (tool.long_description || '').toLowerCase();
  const category = (tool.category || '').toLowerCase();
  const tags = (tool.tags || []).map(t => t.toLowerCase()).join(' ');
  const features = (tool.features || []).map(f => f.toLowerCase()).join(' ');
  
  const allText = `${name} ${description} ${longDescription} ${category} ${tags} ${features}`.toLowerCase();
  
  // Check if tool is in whitelist (always keep these)
  const isWhitelisted = TOOLS_TO_ALWAYS_KEEP.some(keepTool => 
    name === keepTool.toLowerCase() || name.includes(keepTool.toLowerCase())
  );
  
  if (isWhitelisted) {
    return true; // Always keep whitelisted tools
  }
  
  // Check if category is church/media relevant
  const isRelevantCategory = CHURCH_MEDIA_CATEGORIES.some(cat => 
    category.includes(cat.toLowerCase())
  );
  
  // Check for relevant keywords
  const hasRelevantKeywords = RELEVANT_KEYWORDS.some(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  
  // Check for irrelevant keywords (exclude these)
  const hasIrrelevantKeywords = IRRELEVANT_KEYWORDS.some(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  
  // Check if category should be removed
  const isRemovedCategory = CATEGORIES_TO_REMOVE.some(cat => 
    category === cat.toLowerCase()
  );
  
  // Tool is relevant if:
  // 1. Is whitelisted, OR
  // 2. Category is church/media relevant, OR
  // 3. Has relevant keywords, AND
  // 4. Doesn't have irrelevant keywords, AND
  // 5. Category is not in removal list
  return (
    isWhitelisted ||
    ((isRelevantCategory || hasRelevantKeywords) &&
    !hasIrrelevantKeywords &&
    !isRemovedCategory)
  );
}

function mapToChurchMediaCategory(tool) {
  const name = (tool.name || '').toLowerCase();
  const description = (tool.description || '').toLowerCase();
  const category = (tool.category || '').toLowerCase();
  const allText = `${name} ${description} ${category}`.toLowerCase();
  
  // Check if tool is a language/AI tool that should stay in Language or move to Content Creation
  const isLanguageAI = TOOLS_TO_ALWAYS_KEEP.some(keepTool => 
    name === keepTool.toLowerCase() || name.includes(keepTool.toLowerCase())
  );
  
  if (isLanguageAI && (category === 'language' || category.includes('language'))) {
    // Keep language AI tools in Language category or move to Content Creation
    return 'Content Creation';
  }
  
  // Map to church/media categories
  if (allText.includes('video') || allText.includes('film') || (allText.includes('editing') && allText.includes('video'))) {
    return 'Video Editing';
  }
  if (allText.includes('graphic') || allText.includes('design') || allText.includes('image') || allText.includes('photo')) {
    return 'Graphics Design';
  }
  if (allText.includes('social') || allText.includes('instagram') || allText.includes('facebook') || allText.includes('twitter')) {
    return 'Social Media';
  }
  if (allText.includes('stream') || allText.includes('broadcast') || allText.includes('live')) {
    return 'Live Streaming';
  }
  if (allText.includes('audio') || allText.includes('podcast') || allText.includes('sound') || allText.includes('music')) {
    return 'Audio/Podcasting';
  }
  if (allText.includes('content') || allText.includes('writing') || allText.includes('blog') || allText.includes('ai') && (allText.includes('text') || allText.includes('language'))) {
    return 'Content Creation';
  }
  if (allText.includes('website') || allText.includes('web') || allText.includes('cms')) {
    return 'Website Building';
  }
  if (allText.includes('email') || allText.includes('newsletter')) {
    return 'Email Marketing';
  }
  if (allText.includes('project') || allText.includes('planning') || allText.includes('scheduling')) {
    return 'Project Management';
  }
  if (allText.includes('communication') || allText.includes('messaging') || allText.includes('chat')) {
    return 'Communication';
  }
  
  // Default to original category if it's in our list
  if (CHURCH_MEDIA_CATEGORIES.includes(tool.category)) {
    return tool.category;
  }
  
  // Default fallback
  return 'Content Creation';
}

async function cleanupChurchMediaTools() {
  console.log('🧹 Starting church/media tools cleanup...\n');
  
  try {
    // Fetch all tools
    const { data: allTools, error: fetchError } = await supabase
      .from('tools')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Error fetching tools:', fetchError);
      return;
    }
    
    if (!allTools || allTools.length === 0) {
      console.log('⚠️  No tools found in database');
      return;
    }
    
    console.log(`📊 Found ${allTools.length} tools to review\n`);
    
    const relevantTools = [];
    const irrelevantTools = [];
    const toolsToUpdate = [];
    
    // Categorize tools
    allTools.forEach(tool => {
      if (isRelevantToChurchMedia(tool)) {
        relevantTools.push(tool);
        
        // Check if category needs updating
        const newCategory = mapToChurchMediaCategory(tool);
        if (newCategory !== tool.category) {
          toolsToUpdate.push({
            id: tool.id,
            name: tool.name,
            oldCategory: tool.category,
            newCategory: newCategory
          });
        }
      } else {
        irrelevantTools.push(tool);
      }
    });
    
    console.log(`✅ Relevant tools: ${relevantTools.length}`);
    console.log(`❌ Irrelevant tools: ${irrelevantTools.length}`);
    console.log(`🔄 Tools to update category: ${toolsToUpdate.length}\n`);
    
    // Show irrelevant tools
    if (irrelevantTools.length > 0) {
      console.log('📋 Irrelevant tools to remove:');
      irrelevantTools.slice(0, 20).forEach(tool => {
        console.log(`  - ${tool.name} (${tool.category})`);
      });
      if (irrelevantTools.length > 20) {
        console.log(`  ... and ${irrelevantTools.length - 20} more`);
      }
      console.log('');
    }
    
    // Show tools that need category updates
    if (toolsToUpdate.length > 0) {
      console.log('🔄 Tools to update category:');
      toolsToUpdate.slice(0, 10).forEach(tool => {
        console.log(`  - ${tool.name}: ${tool.oldCategory} → ${tool.newCategory}`);
      });
      if (toolsToUpdate.length > 10) {
        console.log(`  ... and ${toolsToUpdate.length - 10} more`);
      }
      console.log('');
    }
    
    // Ask for confirmation (in production, you'd want to add a prompt)
    console.log('⚠️  This will:');
    console.log(`  1. Archive/remove ${irrelevantTools.length} irrelevant tools`);
    console.log(`  2. Update categories for ${toolsToUpdate.length} tools`);
    console.log('\n💡 To proceed, uncomment the execution code below\n');
    
    // UNCOMMENT BELOW TO EXECUTE CLEANUP
    /*
    // Update categories
    for (const tool of toolsToUpdate) {
      const { error } = await supabase
        .from('tools')
        .update({ category: tool.newCategory })
        .eq('id', tool.id);
      
      if (error) {
        console.error(`❌ Error updating ${tool.name}:`, error.message);
      } else {
        console.log(`✅ Updated ${tool.name}: ${tool.oldCategory} → ${tool.newCategory}`);
      }
    }
    
    // Archive irrelevant tools (set status to 'archived' if you have that field, or delete)
    for (const tool of irrelevantTools) {
      // Option 1: Delete (permanent)
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', tool.id);
      
      // Option 2: Archive (if you have a status field)
      // const { error } = await supabase
      //   .from('tools')
      //   .update({ status: 'archived' })
      //   .eq('id', tool.id);
      
      if (error) {
        console.error(`❌ Error removing ${tool.name}:`, error.message);
      } else {
        console.log(`🗑️  Removed ${tool.name}`);
      }
    }
    */
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`  Total tools: ${allTools.length}`);
    console.log(`  Relevant tools: ${relevantTools.length} (${Math.round(relevantTools.length / allTools.length * 100)}%)`);
    console.log(`  Irrelevant tools: ${irrelevantTools.length} (${Math.round(irrelevantTools.length / allTools.length * 100)}%)`);
    console.log(`  Category updates needed: ${toolsToUpdate.length}`);
    
    // Category breakdown for relevant tools
    const categoryBreakdown = {};
    relevantTools.forEach(tool => {
      const cat = mapToChurchMediaCategory(tool);
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
    });
    
    console.log('\n📈 Category breakdown (after cleanup):');
    Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`  - ${cat}: ${count} tools`);
      });
    
    console.log('\n✅ Cleanup analysis complete!');
    console.log('💡 Review the output above and uncomment the execution code to proceed.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    console.error(error);
  }
}

// Run the cleanup
cleanupChurchMediaTools().catch(console.error);

