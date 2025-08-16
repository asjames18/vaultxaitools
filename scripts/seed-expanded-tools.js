require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Comprehensive AI tools data
const toolsData = [
  // Language & Communication Tools
  {
    name: "ChatGPT",
    logo: "🤖",
    description: "Advanced AI language model for conversation, writing, and analysis",
    long_description: "OpenAI's flagship AI assistant capable of understanding context, generating human-like text, and helping with various tasks from writing to problem-solving.",
    category: "Language",
    rating: 4.7,
    review_count: 1250,
    weekly_users: 2500000,
    growth: "15%",
    website: "https://chat.openai.com",
    pricing: "Freemium",
    features: ["Natural conversation", "Code generation", "Creative writing", "Problem solving", "Multi-language support"],
    pros: ["Extremely versatile", "High-quality responses", "Regular updates", "Large knowledge base"],
    cons: ["Sometimes hallucinates", "Limited to training data", "Can be expensive"],
    alternatives: [
      { name: "Claude", rating: 4.6, logo: "🧠" },
      { name: "Bard", rating: 4.4, logo: "🔍" },
      { name: "Perplexity", rating: 4.3, logo: "💡" }
    ],
    tags: ["AI Assistant", "Language Model", "OpenAI", "GPT-4"],
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
    description: "Anthropic's AI assistant focused on helpful, harmless, and honest responses",
    long_description: "Claude is designed to be helpful, harmless, and honest. It excels at analysis, writing, and coding while maintaining strong safety standards.",
    category: "Language",
    rating: 4.6,
    review_count: 890,
    weekly_users: 1800000,
    growth: "12%",
    website: "https://claude.ai",
    pricing: "Freemium",
    features: ["Safe AI responses", "Code analysis", "Document processing", "Creative writing", "Research assistance"],
    pros: ["Very safe and reliable", "Excellent at analysis", "Good coding skills", "Ethical approach"],
    cons: ["More conservative responses", "Limited creative freedom", "Smaller model than GPT-4"],
    alternatives: [
      { name: "ChatGPT", rating: 4.7, logo: "🤖" },
      { name: "Bard", rating: 4.4, logo: "🔍" },
      { name: "Perplexity", rating: 4.3, logo: "💡" }
    ],
    tags: ["AI Assistant", "Safety-First", "Anthropic", "Claude 3"],
    use_cases: [
      {
        title: "Document Analysis",
        prompt: "Analyze this research paper and summarize key findings",
        description: "Process and understand complex documents with high accuracy"
      }
    ]
  },
  {
    name: "Perplexity",
    logo: "🔍",
    description: "AI-powered search engine with conversational interface and real-time information",
    long_description: "Perplexity combines the power of AI with real-time web search to provide accurate, up-to-date information in a conversational format.",
    category: "Language",
    rating: 4.3,
    review_count: 456,
    weekly_users: 950000,
    growth: "25%",
    website: "https://perplexity.ai",
    pricing: "Freemium",
    features: ["Real-time search", "Conversational interface", "Source citations", "Multiple perspectives", "Research mode"],
    pros: ["Always up-to-date", "Source citations", "Free tier available", "Fast responses"],
    cons: ["Limited creative tasks", "Sometimes too focused on search", "Less versatile than ChatGPT"],
    alternatives: [
      { name: "ChatGPT", rating: 4.7, logo: "🤖" },
      { name: "Claude", rating: 4.6, logo: "🧠" },
      { name: "Bard", rating: 4.4, logo: "🔍" }
    ],
    tags: ["Search Engine", "Real-time", "Research", "Citations"]
  },
  {
    name: "Bard",
    logo: "🔍",
    description: "Google's AI chatbot with real-time information and multimodal capabilities",
    long_description: "Google Bard leverages Google's vast knowledge and real-time information to provide helpful, accurate responses with image understanding capabilities.",
    category: "Language",
    rating: 4.4,
    review_count: 678,
    weekly_users: 1200000,
    growth: "18%",
    website: "https://bard.google.com",
    pricing: "Free",
    features: ["Real-time information", "Image understanding", "Google integration", "Multilingual support", "Creative writing"],
    pros: ["Always current", "Free to use", "Google integration", "Good image understanding"],
    cons: ["Limited to Google ecosystem", "Sometimes biased", "Less creative than competitors"],
    alternatives: [
      { name: "ChatGPT", rating: 4.7, logo: "🤖" },
      { name: "Claude", rating: 4.6, logo: "🧠" },
      { name: "Perplexity", rating: 4.3, logo: "💡" }
    ],
    tags: ["Google AI", "Real-time", "Multimodal", "Free"]
  },

  // Development Tools
  {
    name: "GitHub Copilot",
    logo: "⌨️",
    description: "AI-powered code completion and pair programming assistant",
    long_description: "GitHub Copilot helps developers write code faster by suggesting whole lines or blocks of code as they type, trained on billions of lines of public code.",
    category: "Development",
    rating: 4.5,
    review_count: 2340,
    weekly_users: 1800000,
    growth: "22%",
    website: "https://github.com/features/copilot",
    pricing: "Paid",
    features: ["Code completion", "Multi-language support", "IDE integration", "Pair programming", "Code explanation"],
    pros: ["Excellent code suggestions", "Wide language support", "Seamless IDE integration", "Learns your style"],
    cons: ["Subscription cost", "Sometimes suggests outdated code", "Privacy concerns"],
    alternatives: [
      { name: "Cursor", rating: 4.4, logo: "⌨️" },
      { name: "Tabnine", rating: 4.2, logo: "🚀" },
      { name: "CodeWhisperer", rating: 4.3, logo: "⚡" }
    ],
    tags: ["Code Completion", "GitHub", "IDE Integration", "Pair Programming"]
  },
  {
    name: "Cursor",
    logo: "⌨️",
    description: "AI-first code editor with advanced completion and chat capabilities",
    long_description: "Cursor is built on VS Code but designed specifically for AI-powered development, featuring built-in AI chat and advanced code generation.",
    category: "Development",
    rating: 4.4,
    review_count: 890,
    weekly_users: 750000,
    growth: "35%",
    website: "https://cursor.sh",
    pricing: "Freemium",
    features: ["AI chat integration", "Code generation", "VS Code compatibility", "Built-in AI assistant", "Multi-language support"],
    pros: ["Excellent AI integration", "VS Code familiar", "Free tier available", "Fast performance"],
    cons: ["Newer tool", "Smaller community", "Limited extensions"],
    alternatives: [
      { name: "GitHub Copilot", rating: 4.5, logo: "⌨️" },
      { name: "Tabnine", rating: 4.2, logo: "🚀" },
      { name: "CodeWhisperer", rating: 4.3, logo: "⚡" }
    ],
    tags: ["Code Editor", "AI-First", "VS Code", "Free"]
  },
  {
    name: "Tabnine",
    logo: "🚀",
    description: "AI code completion that works offline and learns from your codebase",
    long_description: "Tabnine provides intelligent code completion that works both online and offline, learning from your specific codebase for personalized suggestions.",
    category: "Development",
    rating: 4.2,
    review_count: 567,
    weekly_users: 450000,
    growth: "18%",
    website: "https://www.tabnine.com",
    pricing: "Freemium",
    features: ["Offline functionality", "Personalized learning", "Multi-language support", "IDE integration", "Team collaboration"],
    pros: ["Works offline", "Learns your style", "Good privacy", "Team features"],
    cons: ["Less advanced than Copilot", "Smaller model", "Limited creative suggestions"],
    alternatives: [
      { name: "GitHub Copilot", rating: 4.5, logo: "⌨️" },
      { name: "Cursor", rating: 4.4, logo: "⌨️" },
      { name: "CodeWhisperer", rating: 4.3, logo: "⚡" }
    ],
    tags: ["Code Completion", "Offline", "Personalized", "Team"]
  },
  {
    name: "Amazon CodeWhisperer",
    logo: "⚡",
    description: "AWS-powered AI coding companion with security scanning",
    long_description: "Amazon CodeWhisperer provides AI-powered code suggestions with built-in security scanning, optimized for AWS development.",
    category: "Development",
    rating: 4.3,
    review_count: 345,
    weekly_users: 380000,
    growth: "28%",
    website: "https://aws.amazon.com/codewhisperer",
    pricing: "Freemium",
    features: ["AWS optimization", "Security scanning", "Code completion", "IDE integration", "Compliance support"],
    pros: ["AWS integration", "Security focused", "Free tier", "Compliance ready"],
    cons: ["AWS-centric", "Limited language support", "Less creative than others"],
    alternatives: [
      { name: "GitHub Copilot", rating: 4.5, logo: "⌨️" },
      { name: "Cursor", rating: 4.4, logo: "⌨️" },
      { name: "Tabnine", rating: 4.2, logo: "🚀" }
    ],
    tags: ["AWS", "Security", "Compliance", "Enterprise"]
  },

  // Design Tools
  {
    name: "Midjourney",
    logo: "🎨",
    description: "AI image generation with exceptional artistic quality and style control",
    long_description: "Midjourney creates stunning, artistic images with incredible detail and style control, perfect for creative professionals and artists.",
    category: "Design",
    rating: 4.8,
    review_count: 1890,
    weekly_users: 1200000,
    growth: "32%",
    website: "https://www.midjourney.com",
    pricing: "Paid",
    features: ["High-quality generation", "Style control", "Artistic focus", "Discord integration", "Custom training"],
    pros: ["Exceptional quality", "Unique artistic style", "Great for creative work", "Active community"],
    cons: ["Discord only", "No free tier", "Limited commercial use", "Steep learning curve"],
    alternatives: [
      { name: "DALL-E", rating: 4.6, logo: "🎭" },
      { name: "Stable Diffusion", rating: 4.5, logo: "🎨" },
      { name: "Canva AI", rating: 4.3, logo: "✨" }
    ],
    tags: ["Image Generation", "Artistic", "High Quality", "Creative"]
  },
  {
    name: "DALL-E",
    logo: "🎭",
    description: "OpenAI's AI image generation with creative control and editing capabilities",
    long_description: "DALL-E generates creative images from text descriptions with advanced editing capabilities and integration with OpenAI's ecosystem.",
    category: "Design",
    rating: 4.6,
    review_count: 1456,
    weekly_users: 980000,
    growth: "25%",
    website: "https://openai.com/dall-e-2",
    pricing: "Paid",
    features: ["Text-to-image", "Image editing", "Creative variations", "High resolution", "OpenAI integration"],
    pros: ["Excellent quality", "Good editing tools", "OpenAI ecosystem", "Reliable"],
    cons: ["Expensive", "Limited free tier", "Less artistic than Midjourney", "API costs"],
    alternatives: [
      { name: "Midjourney", rating: 4.8, logo: "🎨" },
      { name: "Stable Diffusion", rating: 4.5, logo: "🎨" },
      { name: "Canva AI", rating: 4.3, logo: "✨" }
    ],
    tags: ["Image Generation", "OpenAI", "Editing", "Creative"]
  },
  {
    name: "Stable Diffusion",
    logo: "🎨",
    description: "Open-source AI image generation with local deployment options",
    long_description: "Stable Diffusion offers high-quality image generation with the flexibility of local deployment and extensive customization options.",
    category: "Design",
    rating: 4.5,
    review_count: 2340,
    weekly_users: 1500000,
    growth: "40%",
    website: "https://stability.ai",
    pricing: "Freemium",
    features: ["Open source", "Local deployment", "Custom models", "High quality", "Extensible"],
    pros: ["Free and open", "Local deployment", "Highly customizable", "Active community"],
    cons: ["Technical setup", "Resource intensive", "Inconsistent quality", "Steep learning curve"],
    alternatives: [
      { name: "Midjourney", rating: 4.8, logo: "🎨" },
      { name: "DALL-E", rating: 4.6, logo: "🎭" },
      { name: "Canva AI", rating: 4.3, logo: "✨" }
    ],
    tags: ["Open Source", "Local", "Customizable", "Free"]
  },
  {
    name: "Canva AI",
    logo: "✨",
    description: "AI-powered design tools integrated into Canva's design platform",
    long_description: "Canva AI brings artificial intelligence to graphic design, making it easier to create professional designs with smart suggestions and automation.",
    category: "Design",
    rating: 4.3,
    review_count: 890,
    weekly_users: 850000,
    growth: "45%",
    website: "https://www.canva.com",
    pricing: "Freemium",
    features: ["AI design suggestions", "Smart templates", "Background removal", "Text generation", "Design automation"],
    pros: ["Easy to use", "Integrated platform", "Good templates", "Free tier"],
    cons: ["Limited AI features", "Template dependent", "Less creative control", "Watermarks on free"],
    alternatives: [
      { name: "Midjourney", rating: 4.8, logo: "🎨" },
      { name: "DALL-E", rating: 4.6, logo: "🎭" },
      { name: "Stable Diffusion", rating: 4.5, logo: "🎨" }
    ],
    tags: ["Design Platform", "Templates", "Easy to Use", "Integrated"]
  },

  // Productivity Tools
  {
    name: "Notion AI",
    logo: "📝",
    description: "AI-powered workspace for notes, docs, and project management",
    long_description: "Notion AI enhances the popular workspace tool with intelligent writing assistance, content generation, and workflow automation.",
    category: "Productivity",
    rating: 4.4,
    review_count: 1234,
    weekly_users: 2100000,
    growth: "38%",
    website: "https://www.notion.so",
    pricing: "Freemium",
    features: ["AI writing", "Content generation", "Workflow automation", "Database management", "Collaboration"],
    pros: ["Excellent workspace", "AI integration", "Highly flexible", "Great collaboration"],
    cons: ["AI costs extra", "Steep learning curve", "Can be overwhelming", "Limited free tier"],
    alternatives: [
      { name: "Obsidian", rating: 4.3, logo: "💎" },
      { name: "Roam Research", rating: 4.2, logo: "🧠" },
      { name: "Logseq", rating: 4.1, logo: "📊" }
    ],
    tags: ["Workspace", "AI Writing", "Collaboration", "Flexible"]
  },
  {
    name: "Grammarly",
    logo: "✍️",
    description: "AI-powered writing assistant for grammar, style, and tone",
    long_description: "Grammarly uses AI to improve writing by checking grammar, suggesting style improvements, and helping maintain consistent tone across documents.",
    category: "Productivity",
    rating: 4.6,
    review_count: 3456,
    weekly_users: 2800000,
    growth: "20%",
    website: "https://www.grammarly.com",
    pricing: "Freemium",
    features: ["Grammar checking", "Style suggestions", "Tone analysis", "Plagiarism detection", "Writing insights"],
    pros: ["Excellent accuracy", "Easy to use", "Multiple platforms", "Good free tier"],
    cons: ["Expensive premium", "Sometimes overzealous", "Limited creative suggestions", "Privacy concerns"],
    alternatives: [
      { name: "ProWritingAid", rating: 4.4, logo: "📚" },
      { name: "Hemingway Editor", rating: 4.2, logo: "📖" },
      { name: "Wordtune", rating: 4.3, logo: "🔄" }
    ],
    tags: ["Writing", "Grammar", "Style", "Multi-platform"]
  },
  {
    name: "Otter.ai",
    logo: "🎤",
    description: "AI-powered transcription and meeting assistant",
    long_description: "Otter.ai provides real-time transcription, meeting notes, and collaboration tools to make meetings more productive and accessible.",
    category: "Productivity",
    rating: 4.3,
    review_count: 678,
    weekly_users: 450000,
    growth: "28%",
    website: "https://otter.ai",
    pricing: "Freemium",
    features: ["Real-time transcription", "Meeting notes", "Speaker identification", "Integration", "Collaboration"],
    pros: ["Accurate transcription", "Real-time capability", "Good integrations", "Easy to use"],
    cons: ["Limited free tier", "Accent challenges", "Background noise issues", "Privacy concerns"],
    alternatives: [
      { name: "Fireflies", rating: 4.3, logo: "🔥" },
      { name: "Rev", rating: 4.2, logo: "🔄" },
      { name: "Descript", rating: 4.4, logo: "🎬" }
    ],
    tags: ["Transcription", "Meetings", "Real-time", "Collaboration"]
  },
  {
    name: "Zapier AI",
    logo: "🔗",
    description: "AI-powered automation platform connecting apps and workflows",
    long_description: "Zapier AI enhances the popular automation platform with intelligent workflow suggestions, natural language automation, and smart integrations.",
    category: "Productivity",
    rating: 4.2,
    review_count: 456,
    weekly_users: 380000,
    growth: "35%",
    website: "https://zapier.com",
    pricing: "Freemium",
    features: ["Workflow automation", "AI suggestions", "App integrations", "Natural language", "Smart triggers"],
    pros: ["Extensive integrations", "AI-powered suggestions", "Reliable automation", "Good documentation"],
    cons: ["Complex setup", "Expensive for power users", "Limited AI features", "Learning curve"],
    alternatives: [
      { name: "IFTTT", rating: 4.1, logo: "⚡" },
      { name: "Make", rating: 4.3, logo: "🔧" },
      { name: "n8n", rating: 4.0, logo: "🔄" }
    ],
    tags: ["Automation", "Integrations", "Workflows", "AI-Powered"]
  },

  // Marketing Tools
  {
    name: "Jasper",
    logo: "📝",
    description: "AI content creation platform for marketing and business",
    long_description: "Jasper helps marketers and businesses create high-quality content quickly using AI, from blog posts to social media content and marketing copy.",
    category: "Marketing",
    rating: 4.5,
    review_count: 2340,
    weekly_users: 950000,
    growth: "42%",
    website: "https://www.jasper.ai",
    pricing: "Paid",
    features: ["Content creation", "Marketing copy", "Blog writing", "Social media", "Brand voice"],
    pros: ["High-quality output", "Marketing focused", "Brand consistency", "Good templates"],
    cons: ["Expensive", "No free tier", "Limited customization", "Sometimes generic"],
    alternatives: [
      { name: "Copy.ai", rating: 4.2, logo: "📄" },
      { name: "Surfer SEO", rating: 4.3, logo: "🏄" },
      { name: "Phrasee", rating: 4.1, logo: "💬" }
    ],
    tags: ["Content Creation", "Marketing", "Copywriting", "Business"]
  },
  {
    name: "Copy.ai",
    logo: "📄",
    description: "AI copywriting tool for marketing and advertising content",
    long_description: "Copy.ai specializes in creating compelling marketing copy, from ads to product descriptions, using advanced AI language models.",
    category: "Marketing",
    rating: 4.2,
    review_count: 1234,
    weekly_users: 680000,
    growth: "38%",
    website: "https://www.copy.ai",
    pricing: "Freemium",
    features: ["Copywriting", "Marketing content", "Product descriptions", "Ad copy", "Brand voice"],
    pros: ["Good copy quality", "Marketing focus", "Free tier available", "Easy to use"],
    cons: ["Limited content types", "Sometimes repetitive", "Basic AI", "Limited customization"],
    alternatives: [
      { name: "Jasper", rating: 4.5, logo: "📝" },
      { name: "Surfer SEO", rating: 4.3, logo: "🏄" },
      { name: "Phrasee", rating: 4.1, logo: "💬" }
    ],
    tags: ["Copywriting", "Marketing", "Ads", "Free Tier"]
  },
  {
    name: "Surfer SEO",
    logo: "🏄",
    description: "AI-powered SEO tool for content optimization and keyword research",
    long_description: "Surfer SEO uses AI to analyze top-ranking content and provide data-driven recommendations for improving search engine rankings.",
    category: "Marketing",
    rating: 4.3,
    review_count: 567,
    weekly_users: 320000,
    growth: "45%",
    website: "https://surferseo.com",
    pricing: "Paid",
    features: ["Content optimization", "Keyword research", "Competitor analysis", "SERP analysis", "Content editor"],
    pros: ["Data-driven insights", "Good competitor analysis", "Content optimization", "SEO focused"],
    cons: ["Expensive", "No free tier", "Complex interface", "Limited AI features"],
    alternatives: [
      { name: "Jasper", rating: 4.5, logo: "📝" },
      { name: "Copy.ai", rating: 4.2, logo: "📄" },
      { name: "Phrasee", rating: 4.1, logo: "💬" }
    ],
    tags: ["SEO", "Content Optimization", "Keyword Research", "Data-Driven"]
  },

  // Writing Tools
  {
    name: "Hemingway Editor",
    logo: "📖",
    description: "AI-powered writing assistant focused on clarity and readability",
    long_description: "Hemingway Editor helps writers create clear, concise content by highlighting complex sentences and suggesting improvements for better readability.",
    category: "Writing",
    rating: 4.2,
    review_count: 890,
    weekly_users: 450000,
    growth: "22%",
    website: "https://hemingwayapp.com",
    pricing: "Freemium",
    features: ["Readability analysis", "Style suggestions", "Grammar checking", "Writing tips", "Desktop app"],
    pros: ["Focus on clarity", "Easy to use", "Good free tier", "Desktop version"],
    cons: ["Limited AI features", "Basic suggestions", "No cloud sync", "Limited export options"],
    alternatives: [
      { name: "Grammarly", rating: 4.6, logo: "✍️" },
      { name: "ProWritingAid", rating: 4.4, logo: "📚" },
      { name: "Wordtune", rating: 4.3, logo: "🔄" }
    ],
    tags: ["Writing", "Clarity", "Readability", "Style"]
  },
  {
    name: "ProWritingAid",
    logo: "📚",
    description: "Comprehensive writing assistant with advanced grammar and style analysis",
    long_description: "ProWritingAid provides in-depth writing analysis, from grammar and style to structure and readability, helping writers improve their craft.",
    category: "Writing",
    rating: 4.4,
    review_count: 1234,
    weekly_users: 580000,
    growth: "28%",
    website: "https://prowritingaid.com",
    pricing: "Freemium",
    features: ["Grammar checking", "Style analysis", "Structure analysis", "Readability", "Writing reports"],
    pros: ["Comprehensive analysis", "Detailed reports", "Good free tier", "Multiple platforms"],
    cons: ["Complex interface", "Overwhelming suggestions", "Slow performance", "Limited AI features"],
    alternatives: [
      { name: "Grammarly", rating: 4.6, logo: "✍️" },
      { name: "Hemingway Editor", rating: 4.2, logo: "📖" },
      { name: "Wordtune", rating: 4.3, logo: "🔄" }
    ],
    tags: ["Writing", "Grammar", "Style Analysis", "Comprehensive"]
  },
  {
    name: "Wordtune",
    logo: "🔄",
    description: "AI-powered writing assistant for improving tone and style",
    long_description: "Wordtune helps writers improve their content by suggesting alternative phrasings, adjusting tone, and enhancing overall writing quality.",
    category: "Writing",
    rating: 4.3,
    review_count: 678,
    weekly_users: 420000,
    growth: "32%",
    website: "https://www.wordtune.com",
    pricing: "Freemium",
    features: ["Tone adjustment", "Style improvement", "Alternative phrasings", "Browser extension", "Writing suggestions"],
    pros: ["Good tone control", "Easy to use", "Browser integration", "Free tier available"],
    cons: ["Limited content types", "Sometimes awkward suggestions", "Basic AI", "Limited customization"],
    alternatives: [
      { name: "Grammarly", rating: 4.6, logo: "✍️" },
      { name: "ProWritingAid", rating: 4.4, logo: "📚" },
      { name: "Hemingway Editor", rating: 4.2, logo: "📖" }
    ],
    tags: ["Writing", "Tone", "Style", "Browser Extension"]
  },

  // Video Tools
  {
    name: "Runway",
    logo: "🎬",
    description: "AI-powered video editing and generation platform",
    long_description: "Runway brings AI to video creation with tools for editing, generation, and manipulation, making professional video production accessible to everyone.",
    category: "Video",
    rating: 4.4,
    review_count: 567,
    weekly_users: 380000,
    growth: "55%",
    website: "https://runwayml.com",
    pricing: "Freemium",
    features: ["Video editing", "AI generation", "Motion tracking", "Green screen", "Text-to-video"],
    pros: ["Professional quality", "AI-powered tools", "Good free tier", "Easy to use"],
    cons: ["Expensive premium", "Limited export options", "Learning curve", "Resource intensive"],
    alternatives: [
      { name: "Synthesia", rating: 4.3, logo: "🎭" },
      { name: "Lumen5", rating: 4.2, logo: "💡" },
      { name: "Pictory", rating: 4.1, logo: "🎨" }
    ],
    tags: ["Video Editing", "AI Generation", "Professional", "Creative"]
  },
  {
    name: "Synthesia",
    logo: "🎭",
    description: "AI video generation platform with virtual presenters and avatars",
    long_description: "Synthesia creates professional videos using AI-generated presenters, perfect for training, marketing, and educational content.",
    category: "Video",
    rating: 4.3,
    review_count: 345,
    weekly_users: 280000,
    growth: "48%",
    website: "https://www.synthesia.io",
    pricing: "Paid",
    features: ["Virtual presenters", "AI avatars", "Text-to-speech", "Video templates", "Custom branding"],
    pros: ["Professional avatars", "Easy to use", "Good templates", "Custom branding"],
    cons: ["Expensive", "No free tier", "Limited customization", "Avatar limitations"],
    alternatives: [
      { name: "Runway", rating: 4.4, logo: "🎬" },
      { name: "Lumen5", rating: 4.2, logo: "💡" },
      { name: "Pictory", rating: 4.1, logo: "🎨" }
    ],
    tags: ["Video Generation", "Virtual Presenters", "AI Avatars", "Professional"]
  },
  {
    name: "Lumen5",
    logo: "💡",
    description: "AI-powered video creation from text and images",
    long_description: "Lumen5 transforms text content into engaging videos using AI, making video creation accessible to content creators and marketers.",
    category: "Video",
    rating: 4.2,
    review_count: 456,
    weekly_users: 320000,
    growth: "42%",
    website: "https://lumen5.com",
    pricing: "Freemium",
    features: ["Text-to-video", "AI suggestions", "Video templates", "Brand customization", "Social media"],
    pros: ["Easy to use", "Good templates", "Free tier available", "Social media focus"],
    cons: ["Limited creativity", "Template dependent", "Basic AI", "Watermarks on free"],
    alternatives: [
      { name: "Runway", rating: 4.4, logo: "🎬" },
      { name: "Synthesia", rating: 4.3, logo: "🎭" },
      { name: "Pictory", rating: 4.1, logo: "🎨" }
    ],
    tags: ["Video Creation", "Text-to-Video", "Templates", "Social Media"]
  },

  // Audio Tools
  {
    name: "Mubert",
    logo: "🎵",
    description: "AI music generation platform for creators and developers",
    long_description: "Mubert uses AI to create original, royalty-free music for videos, podcasts, and other creative projects, with customizable styles and moods.",
    category: "Audio",
    rating: 4.1,
    review_count: 234,
    weekly_users: 180000,
    growth: "35%",
    website: "https://mubert.com",
    pricing: "Freemium",
    features: ["AI music generation", "Royalty-free", "Customizable styles", "API access", "Multiple genres"],
    pros: ["Royalty-free music", "API access", "Good variety", "Free tier available"],
    cons: ["Limited quality", "Repetitive patterns", "Basic AI", "Limited customization"],
    alternatives: [
      { name: "Amper Music", rating: 4.2, logo: "🎼" },
      { name: "Descript", rating: 4.4, logo: "🎬" },
      { name: "Synthesia", rating: 4.3, logo: "🎭" }
    ],
    tags: ["Music Generation", "Royalty-Free", "API", "Creative"]
  },
  {
    name: "Amper Music",
    logo: "🎼",
    description: "AI music composition platform for professional content creators",
    long_description: "Amper Music creates original, professional-quality music compositions using AI, perfect for film, advertising, and commercial projects.",
    category: "Audio",
    rating: 4.2,
    review_count: 189,
    weekly_users: 150000,
    growth: "28%",
    website: "https://www.ampermusic.com",
    pricing: "Paid",
    features: ["Professional composition", "Custom styles", "Commercial licensing", "High quality", "Multiple genres"],
    pros: ["Professional quality", "Commercial licensing", "Custom styles", "Good variety"],
    cons: ["Expensive", "No free tier", "Limited customization", "Complex interface"],
    alternatives: [
      { name: "Mubert", rating: 4.1, logo: "🎵" },
      { name: "Descript", rating: 4.4, logo: "🎬" },
      { name: "Synthesia", rating: 4.3, logo: "🎭" }
    ],
    tags: ["Music Composition", "Professional", "Commercial", "High Quality"]
  },
  {
    name: "Descript",
    logo: "🎬",
    description: "AI-powered audio and video editing with transcription",
    long_description: "Descript combines audio/video editing with AI transcription, making it easy to edit content by editing the text transcript.",
    category: "Audio",
    rating: 4.4,
    review_count: 567,
    weekly_users: 420000,
    growth: "38%",
    website: "https://www.descript.com",
    pricing: "Freemium",
    features: ["Audio editing", "Video editing", "AI transcription", "Text-based editing", "Podcast tools"],
    pros: ["Innovative editing", "Good transcription", "Easy to use", "Free tier available"],
    cons: ["Learning curve", "Limited free tier", "Resource intensive", "Sometimes buggy"],
    alternatives: [
      { name: "Mubert", rating: 4.1, logo: "🎵" },
      { name: "Amper Music", rating: 4.2, logo: "🎼" },
      { name: "Synthesia", rating: 4.3, logo: "🎭" }
    ],
    tags: ["Audio Editing", "Video Editing", "Transcription", "Innovative"]
  }
];

async function seedTools() {
  console.log('🚀 Starting tool seeding process...');
  console.log(`📊 Total tools to add: ${toolsData.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const tool of toolsData) {
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
      
      console.log(`✅ Added ${tool.name} (${tool.category})`);
      successCount++;
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error adding ${tool.name}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n🎉 Seeding completed!');
  console.log(`✅ Successfully added: ${successCount} tools`);
  console.log(`❌ Errors: ${errorCount} tools`);
  console.log(`📊 Total tools in database: ${successCount + 19} (including existing)`);
  
  // Verify final count
  try {
    const { data: finalCount } = await supabase
      .from('tools')
      .select('id', { count: 'exact' });
    
    console.log(`🔍 Final database count: ${finalCount?.length || 0} tools`);
  } catch (error) {
    console.error('❌ Error getting final count:', error.message);
  }
}

// Run the seeding
seedTools().catch(console.error);
