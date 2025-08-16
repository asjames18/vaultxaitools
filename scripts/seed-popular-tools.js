require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Curated list of ONLY the most popular and essential AI tools
const popularToolsData = [
  // Language & AI Assistants (Top Tier)
  {
    name: "ChatGPT",
    logo: "🤖",
    description: "The most popular AI assistant for conversation, writing, and problem-solving",
    long_description: "OpenAI's ChatGPT is the world's most popular AI assistant, capable of understanding context, generating human-like text, and helping with various tasks from writing to coding to analysis.",
    category: "Language",
    rating: 4.7,
    review_count: 1250,
    weekly_users: 2500000,
    growth: "15%",
    website: "https://chat.openai.com",
    pricing: "Freemium",
    features: ["Natural conversation", "Code generation", "Creative writing", "Problem solving", "Multi-language support"],
    pros: ["Extremely versatile", "High-quality responses", "Regular updates", "Large knowledge base", "Most popular"],
    cons: ["Sometimes hallucinates", "Limited to training data", "Can be expensive"],
    alternatives: [
      { name: "Claude", rating: 4.6, logo: "🧠" },
      { name: "Bard", rating: 4.4, logo: "🔍" },
      { name: "Perplexity", rating: 4.3, logo: "💡" }
    ],
    tags: ["AI Assistant", "Language Model", "OpenAI", "GPT-4", "Most Popular"],
    use_cases: [
      {
        title: "Content Creation",
        prompt: "Write a blog post about AI trends in 2024",
        description: "Generate engaging blog content with proper structure and SEO optimization"
      },
      {
        title: "Code Review",
        prompt: "Review this Python code for best practices",
        description: "Get detailed feedback on code quality and suggestions for improvement"
      }
    ],
    quick_start: [
      "Visit chat.openai.com",
      "Sign up for an account",
      "Choose your plan (free or Plus)",
      "Start chatting with the AI"
    ],
    integrations: [
      { name: "API Access", logo: "🔌", note: "Full API integration available" },
      { name: "Browser Extension", logo: "🌐", note: "ChatGPT for Chrome/Firefox" },
      { name: "Mobile App", logo: "📱", note: "iOS and Android apps" }
    ]
  },
  {
    name: "Claude",
    logo: "🧠",
    description: "Anthropic's safe and reliable AI assistant for analysis and writing",
    long_description: "Claude is designed to be helpful, harmless, and honest. It excels at analysis, writing, and coding while maintaining strong safety standards and ethical approach.",
    category: "Language",
    rating: 4.6,
    review_count: 890,
    weekly_users: 1800000,
    growth: "12%",
    website: "https://claude.ai",
    pricing: "Freemium",
    features: ["Safe AI responses", "Code analysis", "Document processing", "Creative writing", "Research assistance"],
    pros: ["Very safe and reliable", "Excellent at analysis", "Good coding skills", "Ethical approach", "High trust"],
    cons: ["More conservative responses", "Limited creative freedom", "Smaller model than GPT-4"],
    alternatives: [
      { name: "ChatGPT", rating: 4.7, logo: "🤖" },
      { name: "Bard", rating: 4.4, logo: "🔍" },
      { name: "Perplexity", rating: 4.3, logo: "💡" }
    ],
    tags: ["AI Assistant", "Safety-First", "Anthropic", "Claude 3", "Trusted"],
    use_cases: [
      {
        title: "Document Analysis",
        prompt: "Analyze this research paper and summarize key findings",
        description: "Process and understand complex documents with high accuracy"
      }
    ],
    quick_start: [
      "Visit claude.ai",
      "Sign up for an account",
      "Start chatting with Claude",
      "Upload documents for analysis"
    ],
    integrations: [
      { name: "API Access", logo: "🔌", note: "Full API integration available" },
      { name: "Slack Integration", logo: "💬", note: "Use Claude in Slack" },
      { name: "Browser Extension", logo: "🌐", note: "Claude for Chrome" }
    ]
  },

  // Development Tools (Essential for Developers)
  {
    name: "GitHub Copilot",
    logo: "⌨️",
    description: "AI-powered code completion that every developer needs",
    long_description: "GitHub Copilot is the essential AI coding assistant that helps developers write code faster by suggesting whole lines or blocks of code as they type, trained on billions of lines of public code.",
    category: "Development",
    rating: 4.5,
    review_count: 2340,
    weekly_users: 1800000,
    growth: "22%",
    website: "https://github.com/features/copilot",
    pricing: "Paid",
    features: ["Code completion", "Multi-language support", "IDE integration", "Pair programming", "Code explanation"],
    pros: ["Excellent code suggestions", "Wide language support", "Seamless IDE integration", "Learns your style", "Industry standard"],
    cons: ["Subscription cost", "Sometimes suggests outdated code", "Privacy concerns"],
    alternatives: [
      { name: "Cursor", rating: 4.4, logo: "⌨️" },
      { name: "Tabnine", rating: 4.2, logo: "🚀" },
      { name: "CodeWhisperer", rating: 4.3, logo: "⚡" }
    ],
    tags: ["Code Completion", "GitHub", "IDE Integration", "Pair Programming", "Essential"],
    use_cases: [
      {
        title: "Code Generation",
        prompt: "Generate a React component for a user profile",
        description: "Create functional React components with proper TypeScript types"
      }
    ],
    quick_start: [
      "Install VS Code or JetBrains IDE",
      "Install GitHub Copilot extension",
      "Sign in with GitHub account",
      "Start coding with AI assistance"
    ],
    integrations: [
      { name: "VS Code", logo: "💻", note: "Native extension support" },
      { name: "JetBrains", logo: "🛠️", note: "Full IDE integration" },
      { name: "Neovim", logo: "⌨️", note: "Vim/Neovim support" }
    ]
  },

  // Design Tools (Creative Professionals)
  {
    name: "Midjourney",
    logo: "🎨",
    description: "The best AI image generation for artistic and creative work",
    long_description: "Midjourney creates stunning, artistic images with incredible detail and style control, making it the go-to choice for creative professionals, artists, and designers who need high-quality visual content.",
    category: "Design",
    rating: 4.8,
    review_count: 1890,
    weekly_users: 1200000,
    growth: "32%",
    website: "https://www.midjourney.com",
    pricing: "Paid",
    features: ["High-quality generation", "Style control", "Artistic focus", "Discord integration", "Custom training"],
    pros: ["Exceptional quality", "Unique artistic style", "Great for creative work", "Active community", "Best in class"],
    cons: ["Discord only", "No free tier", "Limited commercial use", "Steep learning curve"],
    alternatives: [
      { name: "DALL-E", rating: 4.6, logo: "🎭" },
      { name: "Stable Diffusion", rating: 4.5, logo: "🎨" },
      { name: "Canva AI", rating: 4.3, logo: "✨" }
    ],
    tags: ["Image Generation", "Artistic", "High Quality", "Creative", "Premium"],
    use_cases: [
      {
        title: "Concept Art",
        prompt: "Create concept art for a sci-fi cityscape",
        description: "Generate detailed concept art for games, films, or design projects"
      }
    ],
    quick_start: [
      "Join Midjourney Discord server",
      "Subscribe to a plan",
      "Use /imagine command",
      "Refine and iterate on results"
    ],
    integrations: [
      { name: "Discord", logo: "💬", note: "Primary interface" },
      { name: "API Access", logo: "🔌", note: "Limited API available" }
    ]
  },

  // Productivity Tools (Everyone Needs)
  {
    name: "Notion AI",
    logo: "📝",
    description: "AI-powered workspace that transforms how teams work together",
    long_description: "Notion AI enhances the popular workspace tool with intelligent writing assistance, content generation, and workflow automation, making it essential for teams, students, and professionals.",
    category: "Productivity",
    rating: 4.4,
    review_count: 1234,
    weekly_users: 2100000,
    growth: "38%",
    website: "https://www.notion.so",
    pricing: "Freemium",
    features: ["AI writing", "Content generation", "Workflow automation", "Database management", "Collaboration"],
    pros: ["Excellent workspace", "AI integration", "Highly flexible", "Great collaboration", "Team essential"],
    cons: ["AI costs extra", "Steep learning curve", "Can be overwhelming", "Limited free tier"],
    alternatives: [
      { name: "Obsidian", rating: 4.3, logo: "💎" },
      { name: "Roam Research", rating: 4.2, logo: "🧠" },
      { name: "Logseq", rating: 4.1, logo: "📊" }
    ],
    tags: ["Workspace", "AI Writing", "Collaboration", "Flexible", "Team Tool"],
    use_cases: [
      {
        title: "Project Management",
        prompt: "Create a project timeline for launching a new product",
        description: "Generate comprehensive project plans with tasks and deadlines"
      }
    ],
    quick_start: [
      "Sign up at notion.so",
      "Create your first workspace",
      "Enable AI features in settings",
      "Start building with AI assistance"
    ],
    integrations: [
      { name: "Slack", logo: "💬", note: "Direct integration" },
      { name: "Google Drive", logo: "☁️", note: "File sync" },
      { name: "Zapier", logo: "🔗", note: "Workflow automation" }
    ]
  },
  {
    name: "Grammarly",
    logo: "✍️",
    description: "The essential AI writing assistant for everyone who writes",
    long_description: "Grammarly is the world's leading AI writing assistant that helps improve grammar, style, and tone across all writing platforms, making it essential for students, professionals, and anyone who communicates in writing.",
    category: "Productivity",
    rating: 4.6,
    review_count: 3456,
    weekly_users: 2800000,
    growth: "20%",
    website: "https://www.grammarly.com",
    pricing: "Freemium",
    features: ["Grammar checking", "Style suggestions", "Tone analysis", "Plagiarism detection", "Writing insights"],
    pros: ["Excellent accuracy", "Easy to use", "Multiple platforms", "Good free tier", "Industry standard"],
    cons: ["Expensive premium", "Sometimes overzealous", "Limited creative suggestions", "Privacy concerns"],
    alternatives: [
      { name: "ProWritingAid", rating: 4.4, logo: "📚" },
      { name: "Hemingway Editor", rating: 4.2, logo: "📖" },
      { name: "Wordtune", rating: 4.3, logo: "🔄" }
    ],
    tags: ["Writing", "Grammar", "Style", "Multi-platform", "Essential"],
    use_cases: [
      {
        title: "Email Writing",
        prompt: "Help me write a professional email to a client",
        description: "Improve tone and clarity for business communication"
      }
    ],
    quick_start: [
      "Install Grammarly browser extension",
      "Sign up for free account",
      "Start writing with real-time suggestions",
      "Upgrade to premium for advanced features"
    ],
    integrations: [
      { name: "Browser Extension", logo: "🌐", note: "Works on all websites" },
      { name: "Microsoft Word", logo: "📄", note: "Desktop app integration" },
      { name: "Mobile Apps", logo: "📱", note: "iOS and Android" }
    ]
  },

  // Marketing Tools (Business Essential)
  {
    name: "Jasper",
    logo: "📝",
    description: "AI content creation platform that transforms marketing",
    long_description: "Jasper is the leading AI content creation platform that helps marketers and businesses create high-quality content quickly, from blog posts to social media content and marketing copy, making it essential for any business with content needs.",
    category: "Marketing",
    rating: 4.5,
    review_count: 2340,
    weekly_users: 950000,
    growth: "42%",
    website: "https://www.jasper.ai",
    pricing: "Paid",
    features: ["Content creation", "Marketing copy", "Blog writing", "Social media", "Brand voice"],
    pros: ["High-quality output", "Marketing focused", "Brand consistency", "Good templates", "Business essential"],
    cons: ["Expensive", "No free tier", "Limited customization", "Sometimes generic"],
    alternatives: [
      { name: "Copy.ai", rating: 4.2, logo: "📄" },
      { name: "Surfer SEO", rating: 4.3, logo: "🏄" },
      { name: "Phrasee", rating: 4.1, logo: "💬" }
    ],
    tags: ["Content Creation", "Marketing", "Copywriting", "Business", "Premium"],
    use_cases: [
      {
        title: "Social Media Content",
        prompt: "Create engaging social media posts for a tech company",
        description: "Generate platform-specific content with proper tone and hashtags"
      }
    ],
    quick_start: [
      "Sign up at jasper.ai",
      "Choose your plan",
      "Set up your brand voice",
      "Start creating content with AI"
    ],
    integrations: [
      { name: "Surfer SEO", logo: "🏄", note: "SEO optimization" },
      { name: "Grammarly", logo: "✍️", note: "Writing quality" },
      { name: "Social Platforms", logo: "📱", note: "Direct publishing" }
    ]
  }
];

async function seedPopularTools() {
  console.log('🚀 Starting popular tools seeding process...');
  console.log(`📊 Total popular tools to add: ${popularToolsData.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const tool of popularToolsData) {
    try {
      // Check if tool already exists
      const { data: existing } = await supabase
        .from('tools')
        .select('id')
        .eq('name', tool.name)
        .single();
      
      if (existing) {
        console.log(`⏭️  Skipping ${tool.name} - already exists`);
        continue;
      }
      
      // Prepare tool data for insertion
      const toolData = {
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
        use_cases: tool.use_cases,
        quick_start: tool.quick_start,
        integrations: tool.integrations,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Insert tool
      const { error } = await supabase
        .from('tools')
        .insert([toolData]);
      
      if (error) throw error;
      
      console.log(`✅ Added ${tool.name} (${tool.category}) - POPULAR TOOL`);
      successCount++;
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error adding ${tool.name}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n🎉 Popular tools seeding completed!');
  console.log(`✅ Successfully added: ${successCount} popular tools`);
  console.log(`❌ Errors: ${errorCount} tools`);
  
  // Verify final count and show popular tools
  try {
    const { data: allTools } = await supabase
      .from('tools')
      .select('name, category, rating, weekly_users')
      .order('weekly_users', { ascending: false });
    
    console.log(`\n🔍 Total tools in database: ${allTools?.length || 0}`);
    
    if (allTools && allTools.length > 0) {
      console.log('\n🏆 Top 10 Most Popular Tools:');
      allTools.slice(0, 10).forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} (${tool.category}) - ${tool.weekly_users?.toLocaleString()} users - ⭐${tool.rating}`);
      });
    }
  } catch (error) {
    console.error('❌ Error getting final count:', error.message);
  }
}

// Run the popular tools seeding
seedPopularTools().catch(console.error);
