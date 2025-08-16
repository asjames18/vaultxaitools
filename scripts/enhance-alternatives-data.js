require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Enhanced alternatives data with more comprehensive information
const enhancedAlternatives = {
  "ChatGPT": [
    {
      name: "Claude",
      rating: 4.6,
      logo: "🧠",
      description: "Anthropic's safety-focused AI assistant with excellent analysis and coding capabilities",
      pricing: "Freemium",
      pros: ["Very safe and reliable", "Excellent at analysis", "Good coding skills", "Ethical approach"],
      cons: ["More conservative responses", "Limited creative freedom", "Smaller model than GPT-4"],
      website: "https://claude.ai"
    },
    {
      name: "Google Bard",
      rating: 4.4,
      logo: "🔍",
      description: "Google's AI assistant with real-time web search and integration",
      pricing: "Free",
      pros: ["Real-time web search", "Free to use", "Google integration", "Good for research"],
      cons: ["Sometimes less creative", "Limited coding abilities", "Can be inconsistent"],
      website: "https://bard.google.com"
    },
    {
      name: "Perplexity",
      rating: 4.3,
      logo: "💡",
      description: "AI-powered search engine that provides detailed answers with sources",
      pricing: "Freemium",
      pros: ["Source citations", "Research-focused", "Clean interface", "Good for learning"],
      cons: ["Limited creative tasks", "Can be verbose", "Less conversational"],
      website: "https://www.perplexity.ai"
    }
  ],
  "Claude": [
    {
      name: "ChatGPT",
      rating: 4.7,
      logo: "🤖",
      description: "OpenAI's versatile AI assistant with broad capabilities and large knowledge base",
      pricing: "Freemium",
      pros: ["Extremely versatile", "High-quality responses", "Regular updates", "Most popular"],
      cons: ["Sometimes hallucinates", "Limited to training data", "Can be expensive"],
      website: "https://chat.openai.com"
    },
    {
      name: "Google Bard",
      rating: 4.4,
      logo: "🔍",
      description: "Google's AI with real-time information and free access",
      pricing: "Free",
      pros: ["Always up-to-date", "Free access", "Google ecosystem", "Good for current events"],
      cons: ["Less creative", "Limited coding", "Can be inconsistent"],
      website: "https://bard.google.com"
    },
    {
      name: "Perplexity",
      rating: 4.3,
      logo: "💡",
      description: "Research-focused AI that provides detailed answers with sources",
      pricing: "Freemium",
      pros: ["Source citations", "Research excellence", "Clean design", "Learning focused"],
      cons: ["Less conversational", "Limited creative tasks", "Can be verbose"],
      website: "https://www.perplexity.ai"
    }
  ],
  "GitHub Copilot": [
    {
      name: "Cursor",
      rating: 4.4,
      logo: "⌨️",
      description: "AI-powered code editor with built-in AI assistance and chat",
      pricing: "Freemium",
      pros: ["Built-in AI chat", "Free tier available", "Modern interface", "Good for learning"],
      cons: ["Newer tool", "Smaller community", "Limited IDE support"],
      website: "https://cursor.sh"
    },
    {
      name: "Tabnine",
      rating: 4.2,
      logo: "🚀",
      description: "AI code completion with privacy-focused local models",
      pricing: "Freemium",
      pros: ["Privacy focused", "Local models", "Multiple languages", "Good free tier"],
      cons: ["Less accurate than cloud", "Limited features", "Smaller model"],
      website: "https://www.tabnine.com"
    },
    {
      name: "Amazon CodeWhisperer",
      rating: 4.3,
      logo: "⚡",
      description: "AWS-powered code completion with security scanning",
      pricing: "Free for individuals",
      pros: ["Free for individuals", "Security scanning", "AWS integration", "Good for teams"],
      cons: ["Limited language support", "AWS focused", "Less feature-rich"],
      website: "https://aws.amazon.com/codewhisperer"
    }
  ],
  "Midjourney": [
    {
      name: "DALL-E",
      rating: 4.6,
      logo: "🎭",
      description: "OpenAI's image generation with excellent prompt understanding",
      pricing: "Paid",
      pros: ["Excellent prompt understanding", "High quality", "Easy to use", "Good integration"],
      cons: ["Expensive", "Limited artistic control", "Less community"],
      website: "https://openai.com/dall-e-2"
    },
    {
      name: "Stable Diffusion",
      rating: 4.5,
      logo: "🎨",
      description: "Open-source image generation with extensive customization",
      pricing: "Free/Open Source",
      pros: ["Open source", "Highly customizable", "Free to use", "Local deployment"],
      cons: ["Steep learning curve", "Requires technical knowledge", "Inconsistent quality"],
      website: "https://stability.ai"
    },
    {
      name: "Canva AI",
      rating: 4.3,
      logo: "✨",
      description: "Design-focused AI with easy-to-use interface and templates",
      pricing: "Freemium",
      pros: ["Easy to use", "Design templates", "Good for beginners", "Integrated workflow"],
      cons: ["Less artistic", "Limited customization", "Template dependent"],
      website: "https://www.canva.com"
    }
  ],
  "Notion AI": [
    {
      name: "Obsidian",
      rating: 4.3,
      logo: "💎",
      description: "Local-first note-taking with powerful linking and plugins",
      pricing: "Free",
      pros: ["Local storage", "Powerful linking", "Extensive plugins", "Privacy focused"],
      cons: ["No real-time collaboration", "Steep learning curve", "Limited AI features"],
      website: "https://obsidian.md"
    },
    {
      name: "Roam Research",
      rating: 4.2,
      logo: "🧠",
      description: "Bidirectional linking and networked thought platform",
      pricing: "Paid",
      pros: ["Bidirectional linking", "Networked thinking", "Good for research", "Unique approach"],
      cons: ["Expensive", "Limited features", "Small community"],
      website: "https://roamresearch.com"
    },
    {
      name: "Logseq",
      rating: 4.1,
      logo: "📊",
      description: "Open-source knowledge management with local-first approach",
      pricing: "Free/Open Source",
      pros: ["Open source", "Local storage", "Good linking", "Free to use"],
      cons: ["Less polished", "Smaller community", "Limited integrations"],
      website: "https://logseq.com"
    }
  ],
  "Grammarly": [
    {
      name: "ProWritingAid",
      rating: 4.4,
      logo: "📚",
      description: "Comprehensive writing assistant with detailed style analysis",
      pricing: "Freemium",
      pros: ["Detailed analysis", "Style suggestions", "Good free tier", "Multiple platforms"],
      cons: ["Can be overwhelming", "Less intuitive", "Limited real-time"],
      website: "https://prowritingaid.com"
    },
    {
      name: "Hemingway Editor",
      rating: 4.2,
      logo: "📖",
      description: "Focuses on readability and clear writing style",
      pricing: "Freemium",
      pros: ["Readability focus", "Simple interface", "Good for clarity", "Free web version"],
      cons: ["Limited features", "No real-time checking", "Basic grammar only"],
      website: "https://hemingwayapp.com"
    },
    {
      name: "Wordtune",
      rating: 4.3,
      logo: "🔄",
      description: "AI-powered writing enhancement with multiple tone options",
      pricing: "Freemium",
      pros: ["Multiple tones", "Good suggestions", "Easy to use", "Browser extension"],
      cons: ["Limited free tier", "Can change meaning", "Less comprehensive"],
      website: "https://www.wordtune.com"
    }
  ],
  "Jasper": [
    {
      name: "Copy.ai",
      rating: 4.2,
      logo: "📄",
      description: "AI copywriting with focus on marketing and business content",
      pricing: "Freemium",
      pros: ["Good templates", "Marketing focused", "Free tier", "Easy to use"],
      cons: ["Less creative", "Template dependent", "Limited customization"],
      website: "https://www.copy.ai"
    },
    {
      name: "Surfer SEO",
      rating: 4.3,
      logo: "🏄",
      description: "SEO-focused content creation with keyword optimization",
      pricing: "Paid",
      pros: ["SEO focused", "Keyword research", "Content optimization", "Good for marketing"],
      cons: ["Expensive", "SEO only", "Limited creative features"],
      website: "https://surferseo.com"
    },
    {
      name: "Phrasee",
      rating: 4.1,
      logo: "💬",
      description: "AI-powered marketing copy optimization",
      pricing: "Paid",
      pros: ["Marketing focused", "A/B testing", "Brand voice", "Good for campaigns"],
      cons: ["Expensive", "Limited use cases", "Enterprise focused"],
      website: "https://phrasee.co"
    }
  ]
};

async function enhanceAlternativesData() {
  console.log('🚀 Starting alternatives enhancement process...');
  console.log(`📊 Tools to enhance: ${Object.keys(enhancedAlternatives).length}`);

  let successCount = 0;
  let errorCount = 0;

  for (const [toolName, alternatives] of Object.entries(enhancedAlternatives)) {
    try {
      // Find the tool by name
      const { data: tool, error: findError } = await supabase
        .from('tools')
        .select('id, name, category')
        .eq('name', toolName)
        .single();

      if (findError || !tool) {
        console.log(`⚠️  Tool not found: ${toolName}`);
        continue;
      }

      // Update the tool with enhanced alternatives
      const { error: updateError } = await supabase
        .from('tools')
        .update({
          alternatives: alternatives,
          updated_at: new Date().toISOString()
        })
        .eq('id', tool.id);

      if (updateError) throw updateError;

      console.log(`✅ Enhanced alternatives for ${toolName} (${tool.category})`);
      console.log(`   - Added ${alternatives.length} detailed alternatives`);
      successCount++;

      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Error enhancing ${toolName}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n🎉 Alternatives enhancement completed!');
  console.log(`✅ Successfully enhanced: ${successCount} tools`);
  console.log(`❌ Errors: ${errorCount} tools`);

  // Verify the updates
  try {
    const { data: updatedTools } = await supabase
      .from('tools')
      .select('name, alternatives')
      .not('alternatives', 'eq', null)
      .order('name');

    console.log(`\n🔍 Total tools with alternatives: ${updatedTools?.length || 0}`);
    if (updatedTools && updatedTools.length > 0) {
      console.log('\n📋 Sample of enhanced alternatives:');
      updatedTools.slice(0, 5).forEach(tool => {
        const altCount = tool.alternatives?.length || 0;
        const hasEnhancedData = tool.alternatives?.[0]?.description ? 'Enhanced' : 'Basic';
        console.log(`  - ${tool.name}: ${altCount} alternatives (${hasEnhancedData})`);
      });
    }
  } catch (error) {
    console.error('❌ Error verifying updates:', error.message);
  }
}

// Run the alternatives enhancement
enhanceAlternativesData().catch(console.error);
