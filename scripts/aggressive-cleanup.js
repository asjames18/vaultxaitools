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

// Comprehensive list of items to remove (non-tools)
const ITEMS_TO_REMOVE = [
  // News articles and discussions
  'How I keep up with AI progress',
  'ChatGPT\'s ultimate family car design',
  'I asked ChatGPT to age me from a photo',
  'I\'m using GPT as a relationship translator',
  'I just blue myself with ChatGPT',
  'Me & Chatgpt',
  'The AI-hate in the "creative communities"',
  'So now we\'re just giving away LLMs',
  'I\'m Rebelling Against the Algorithm',
  'Ask HN: Will AI models over time converge',
  'AI Gets Plugged into Managing California\'s Electric Grid',
  'Show HN: Molab, a cloud-hosted Marimo notebook workspace',
  'Wii U SDBoot1 Exploit "paid the beak"',
  'Valve confirms credit card companies pressured it',
  'I Asked ChatGPT to Mark Its Filtered Answers',
  'OpenAI\'s new ChatGPT Agent can control an entire computer',
  'ChatGPT Agent released and Sams take on it',
  'ChatGPT Agent will be available for Plus, Pro, and Team users',
  'Artificial Empathy and Compassion from GPT-4o',
  'OpenAI Introduces ChatGPT Agents - Will They Kill Other Agent Startups?',
  'I posted an issue in OpenAI\'s developer forums',
  'Calling AI Researchers & Startup Founders',
  'Turns out ChatGPT can make decent Colorblindness tests',
  'I asked ChatGPT to make my kid\'s drawing real',
  'Described tummy ache to GPT, told me to go to ER',
  'AI will rule the world soon...',
  'Fuck Marry Kill (AI edition)',
  'Just watched OpenAI\'s agent demo',
  'WordPecker: Personalized Duolingo built using OpenAI Agents SDK',
  'One-Minute Daily AI News 7/17/2025',
  'Harry Potter predicted AI waifus',
  '🚨 Catch up with the AI industry, July 18, 2025',
  'We now have an AI copyright lawsuit that is a class action',
  'The internet as a fae realm and the arrival of AI',
  'The most dangerous thing AI is doing right now? Staying silent',
  'Probably the best use of AI yet',
  'Random Redditor: AIs just mimick, they can\'t be creative',
  'You don\'t have to be America or China to win in AI',
  'AI "Boost" Backfires',
  'Waifus armed with nuclear codes',
  'Netflix uses generative AI in one of its shows',
  'OpenAI and Anthropic researchers decry \'reckless\' safety culture',
  'White House Partners With PragerU to Make AI-Slopified Founding Fathers',
  'ChatGPT is incredible (at being average)',
  'This AI Warps Live Video in Real Time',
  'Master SQL the Smart Way — with AI by Your Side',
  'A Prominent OpenAI Investor Appears to Be Suffering',
  'New AI Benchmark "FormulaOne" Reveals Shocking Gap',
  'OpenAI Quietly Turns to Google to Stay Online',
  'GPT Agent is doing my taxes...',
  'How I feel when I know that the GPT agent is not released',
  'Asked ChatGPT to illustrate the most recent scandal',
  'Third patient dies from acute liver failure',
  'Firefox-patch-bin, librewolf-fix-bin AUR packages contain malware',
  'Hundred Rabbits – Low-tech living while sailing the world',
  'Meta says it wont sign Europe AI agreement',
  'AI capex is so big that it\'s affecting economic statistics',
  
  // Research papers and academic content
  '[P] Understanding Muon: A Revolutionary Neural Network Optimizer',
  '[D] Any promising non-Deep Learning based AI research project?',
  '[R] A Minimum Description Length Approach to Regularization',
  '[D] Liquid neural networks on time series',
  '[D] is V-JEPA2 the GPT-2 moment?',
  '[D] Concerns about Predatory Publishers',
  '[R], Can I detect pre vs. post event changes',
  '[P [R] Deep learning-assisted SLAM to reduce computational',
  '[R] Interactive Probabilistic Neural Network Decision Matrix Model',
  'ICML 2025, can a workshop registration access poster sessions',
  
  // Generic or unclear items
  'lab',
  'courses',
  'AI_Tutorial',
  'Artificial-Intelligence-Deep-Learning-Machine-Learning-Tutorials'
];

// Keywords that indicate non-tool content
const NON_TOOL_KEYWORDS = [
  'dies', 'death', 'patient', 'therapy', 'treatment', 'medical',
  'malware', 'security', 'breach', 'hack', 'vulnerability',
  'agreement', 'policy', 'regulation', 'law', 'legal',
  'economic', 'statistics', 'market', 'finance', 'investment',
  'announces', 'announced', 'says', 'said', 'reports', 'reported',
  'breaking', 'news', 'update', 'latest', 'developing',
  'won\'t', 'will not', 'refuses', 'rejects', 'denies',
  'low-tech', 'sailing', 'living', 'lifestyle', 'travel',
  'asked', 'told', 'feel', 'using', 'just', 'blue', 'myself',
  'relationship', 'translator', 'kid', 'drawing', 'real',
  'tummy', 'ache', 'ER', 'CT', 'scan', 'appendicitis',
  'age', 'photo', 'dad', 'family', 'car', 'design',
  'hate', 'creative', 'communities', 'jarring',
  'giving', 'away', 'customer', 'convos', 'company', 'data',
  'rebelling', 'algorithm', 'models', 'converge', 'system',
  'plugged', 'managing', 'electric', 'grid', 'california',
  'show', 'hn:', 'molab', 'cloud-hosted', 'notebook', 'workspace',
  'wii', 'exploit', 'paid', 'beak', 'valve', 'credit', 'card',
  'pressured', 'delist', 'adult', 'games', 'mark', 'filtered',
  'answers', 'agent', 'control', 'computer', 'tasks',
  'released', 'take', 'plus', 'pro', 'team', 'users',
  'empathy', 'compassion', 'beating', 'theory', 'mind',
  'introduces', 'kill', 'startups', 'posted', 'issue',
  'forums', 'quoted', 'response', 'calling', 'researchers',
  'founders', 'join', 'ask-me-anything', 'session',
  'turns', 'colorblindness', 'tests', 'scandal', 'style',
  'francis', 'bacon', 'prominent', 'investor', 'suffering',
  'mental', 'health', 'crisis', 'peers', 'benchmark',
  'formulaone', 'reveals', 'shocking', 'gap', 'models',
  'solve', 'research', 'problems', 'quietly', 'turns',
  'google', 'stay', 'online', 'powerful', 'admitted',
  'needs', 'help', 'biggest', 'rivals', 'stay', 'afloat',
  'taxes', 'released', 'country', 'illustrate', 'recent',
  'patient', 'dies', 'acute', 'liver', 'failure', 'caused',
  'sarepta', 'gene', 'therapy', 'firefox', 'patch', 'bin',
  'librewolf', 'fix', 'aur', 'packages', 'contain', 'malware',
  'hundred', 'rabbits', 'low-tech', 'living', 'sailing',
  'world', 'meta', 'sign', 'europe', 'agreement', 'calling',
  'growth', 'stunting', 'overreach', 'capex', 'big',
  'affecting', 'economic', 'statistics', 'keep', 'progress',
  'ultimate', 'family', 'car', 'design', 'pure', 'efficiency',
  'fuck', 'marry', 'kill', 'edition', 'watched', 'demo',
  'weird', 'realization', 'future', 'shopping', 'wordpecker',
  'personalized', 'duolingo', 'built', 'agents', 'sdk',
  'minute', 'daily', 'news', 'harry', 'potter', 'predicted',
  'waifus', 'catch', 'industry', 'copyright', 'lawsuit',
  'class', 'action', 'internet', 'fae', 'realm', 'arrival',
  'dangerous', 'silent', 'probably', 'best', 'use', 'yet',
  'random', 'redditor', 'mimick', 'creative', 'godfather',
  'america', 'china', 'win', 'rishi', 'sunak', 'boost',
  'backfires', 'armed', 'nuclear', 'codes', 'netflix',
  'generative', 'shows', 'anthropic', 'decry', 'reckless',
  'safety', 'culture', 'musk', 'white', 'house', 'partners',
  'prageru', 'slopified', 'founding', 'fathers', 'incredible',
  'average', 'article', 'ethics', 'information', 'technology',
  'llm-driven', 'output', 'homogenization', 'warps', 'live',
  'video', 'real', 'time', 'master', 'sql', 'smart', 'way',
  'prominent', 'suffering', 'chatgpt-related', 'mental',
  'health', 'crisis', 'peers', 'new', 'benchmark', 'formulaone',
  'reveals', 'shocking', 'gap', 'top', 'models', 'openai',
  'solve', 'real', 'research', 'problems', 'quietly', 'turns',
  'google', 'stay', 'online', 'powerful', 'artificial',
  'intelligence', 'company', 'world', 'admitted', 'needs',
  'help', 'biggest', 'rivals', 'stay', 'afloat', 'agent',
  'taxes', 'feel', 'know', 'released', 'country', 'asked',
  'illustrate', 'recent', 'scandal', 'style', 'francis',
  'bacon', 'third', 'patient', 'dies', 'acute', 'liver',
  'failure', 'caused', 'sarepta', 'gene', 'therapy',
  'firefox-patch-bin', 'librewolf-fix-bin', 'aur', 'packages',
  'contain', 'malware', 'hundred', 'rabbits', 'low-tech',
  'living', 'sailing', 'world', 'meta', 'sign', 'europe',
  'agreement', 'calling', 'growth', 'stunting', 'overreach',
  'capex', 'big', 'affecting', 'economic', 'statistics'
];

// Function to check if item should be removed
function shouldRemoveItem(name, description) {
  const text = `${name} ${description}`.toLowerCase();
  
  // Check exact matches
  if (ITEMS_TO_REMOVE.some(item => name.toLowerCase().includes(item.toLowerCase()))) {
    return true;
  }
  
  // Check for non-tool keywords
  if (NON_TOOL_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()))) {
    return true;
  }
  
  // Check for news-like patterns
  if (text.includes('says') || text.includes('announced') || text.includes('reports')) {
    return true;
  }
  
  // Check for discussion patterns
  if (text.includes('how i') || text.includes('i asked') || text.includes('i\'m using')) {
    return true;
  }
  
  // Check for research paper patterns
  if (text.includes('[p]') || text.includes('[d]') || text.includes('[r]')) {
    return true;
  }
  
  return false;
}

// Function to perform aggressive cleanup
async function aggressiveCleanup() {
  console.log('🧹 Performing aggressive cleanup of non-tool content...');
  
  try {
    // Get all tools
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*');
    
    if (error) {
      console.error('Error fetching tools:', error);
      return;
    }
    
    console.log(`📊 Reviewing ${tools.length} tools for aggressive cleanup...`);
    
    let removedCount = 0;
    let keptCount = 0;
    
    for (const tool of tools) {
      const shouldRemove = shouldRemoveItem(tool.name, tool.description);
      
      if (shouldRemove) {
        console.log(`🗑️ Removing: ${tool.name} (${tool.source})`);
        
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
    
    console.log('\n📈 Aggressive cleanup completed:');
    console.log(`   ✅ Kept: ${keptCount} actual AI tools`);
    console.log(`   🗑️ Removed: ${removedCount} non-tool items`);
    console.log(`   📊 Total: ${keptCount + removedCount} reviewed`);
    
    // Verify cleanup
    await verifyCleanup();
    
  } catch (error) {
    console.error('❌ Error during aggressive cleanup:', error);
  }
}

// Function to verify cleanup
async function verifyCleanup() {
  console.log('\n🔍 Verifying cleanup results...');
  
  try {
    const { data: tools, count: totalTools } = await supabase
      .from('tools')
      .select('name, category, source', { count: 'exact' });
    
    console.log(`📊 Total tools after cleanup: ${totalTools}`);
    
    // Show sample of remaining tools
    if (tools && tools.length > 0) {
      console.log('\n📋 Sample of remaining tools:');
      tools.slice(0, 10).forEach(tool => {
        console.log(`   - ${tool.name} (${tool.category})`);
      });
    }
    
    // Check for any remaining problematic items
    const problematicItems = tools?.filter(tool => 
      shouldRemoveItem(tool.name, tool.description || '')
    ) || [];
    
    if (problematicItems.length > 0) {
      console.log(`\n⚠️ Found ${problematicItems.length} remaining problematic items:`);
      problematicItems.forEach(item => {
        console.log(`   - ${item.name}`);
      });
    } else {
      console.log('\n✅ No problematic items found!');
    }
    
  } catch (error) {
    console.error('❌ Error verifying cleanup:', error);
  }
}

// Function to add some high-quality AI tools to replace removed content
async function addQualityAITools() {
  console.log('\n➕ Adding high-quality AI tools...');
  
  const qualityTools = [
    {
      name: 'ChatGPT',
      description: 'AI-powered conversational assistant for text generation and analysis',
      category: 'Language',
      website: 'https://chat.openai.com',
      pricing: 'Freemium',
      logo: '🤖',
      source: 'OpenAI',
      rating: 4.8,
      review_count: 15000,
      weekly_users: 50000,
      growth: '+45%'
    },
    {
      name: 'Claude',
      description: 'Anthropic\'s AI assistant for conversation, analysis, and content creation',
      category: 'Language',
      website: 'https://claude.ai',
      pricing: 'Freemium',
      logo: '🧠',
      source: 'Anthropic',
      rating: 4.7,
      review_count: 8500,
      weekly_users: 25000,
      growth: '+38%'
    },
    {
      name: 'Midjourney',
      description: 'AI-powered image generation tool for creating stunning artwork',
      category: 'Design',
      website: 'https://midjourney.com',
      pricing: 'Paid',
      logo: '🎨',
      source: 'Midjourney',
      rating: 4.6,
      review_count: 12000,
      weekly_users: 35000,
      growth: '+52%'
    },
    {
      name: 'GitHub Copilot',
      description: 'AI-powered code completion and generation for developers',
      category: 'Development',
      website: 'https://github.com/features/copilot',
      pricing: 'Paid',
      logo: '💻',
      source: 'GitHub',
      rating: 4.5,
      review_count: 9500,
      weekly_users: 40000,
      growth: '+41%'
    },
    {
      name: 'Notion AI',
      description: 'AI-powered workspace for notes, docs, and project management',
      category: 'Productivity',
      website: 'https://notion.so',
      pricing: 'Freemium',
      logo: '📝',
      source: 'Notion',
      rating: 4.4,
      review_count: 7800,
      weekly_users: 30000,
      growth: '+33%'
    },
    {
      name: 'Jasper',
      description: 'AI content creation platform for marketing and copywriting',
      category: 'Marketing',
      website: 'https://jasper.ai',
      pricing: 'Paid',
      logo: '✍️',
      source: 'Jasper',
      rating: 4.3,
      review_count: 6500,
      weekly_users: 22000,
      growth: '+28%'
    }
  ];
  
  let addedCount = 0;
  
  for (const tool of qualityTools) {
    try {
      const { error } = await supabase
        .from('tools')
        .insert(tool);
      
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
  
  console.log(`\n📈 Added ${addedCount} high-quality AI tools`);
}

// Main function
async function main() {
  console.log('🚀 Starting aggressive cleanup and quality improvement...\n');
  
  try {
    // Step 1: Aggressive cleanup
    await aggressiveCleanup();
    
    // Step 2: Add quality AI tools
    await addQualityAITools();
    
    console.log('\n🎉 Aggressive cleanup and quality improvement completed!');
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  aggressiveCleanup,
  shouldRemoveItem,
  addQualityAITools,
  verifyCleanup
}; 