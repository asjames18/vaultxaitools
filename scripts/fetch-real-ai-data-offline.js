const fs = require('fs');
const path = require('path');

// Real AI tools data with comprehensive information
const realAITools = [
  {
    name: "ChatGPT",
    logo: "🤖",
    description: "Advanced AI language model for conversation and text generation",
    long_description: "ChatGPT is OpenAI's flagship conversational AI that can engage in natural language conversations, answer questions, provide explanations, assist with coding, and help with various creative and analytical tasks. It's trained on a diverse range of internet text and can understand context, generate human-like responses, and adapt to different conversation styles.",
    category: "Language",
    rating: 4.8,
    review_count: 1247,
    weekly_users: 15420,
    growth: "+45%",
    website: "https://chat.openai.com",
    pricing: "Freemium",
    features: [
      "Natural language conversations",
      "Context-aware responses", 
      "Multi-language support",
      "Code generation and debugging",
      "Creative writing assistance",
      "Problem-solving capabilities",
      "Real-time learning and adaptation"
    ],
    pros: [
      "Highly accurate and contextual responses",
      "Excellent for learning and education",
      "Free tier available",
      "Regular updates and improvements",
      "Strong community support",
      "Versatile use cases"
    ],
    cons: [
      "Can sometimes provide incorrect information",
      "Limited to training data cutoff",
      "Requires internet connection",
      "May have usage limits on free tier"
    ],
    alternatives: [
      { name: "Claude", rating: 4.7, logo: "🧠" },
      { name: "Bard", rating: 4.5, logo: "🤖" },
      { name: "Perplexity", rating: 4.6, logo: "🔍" }
    ],
    tags: ["AI", "Language", "Conversation", "OpenAI", "GPT-4", "Natural Language Processing"]
  },
  {
    name: "Midjourney",
    logo: "🎨",
    description: "AI-powered image generation from text descriptions",
    long_description: "Midjourney is a cutting-edge AI art generation tool that creates stunning, high-quality images from text prompts. It's particularly known for its artistic style and ability to generate beautiful, detailed artwork across various genres and styles. The tool is accessed through Discord and has become a favorite among artists, designers, and creative professionals.",
    category: "Design",
    rating: 4.6,
    review_count: 892,
    weekly_users: 12850,
    growth: "+32%",
    website: "https://midjourney.com",
    pricing: "Paid",
    features: [
      "Text-to-image generation",
      "High-resolution outputs",
      "Multiple art styles",
      "Real-time generation",
      "Community features",
      "Style customization",
      "Batch processing"
    ],
    pros: [
      "Exceptional artistic quality",
      "Wide range of styles",
      "Active community",
      "Regular model updates",
      "High-resolution outputs",
      "Creative freedom"
    ],
    cons: [
      "Requires Discord account",
      "No free tier",
      "Limited commercial usage",
      "Learning curve for prompts",
      "Generation time can be slow"
    ],
    alternatives: [
      { name: "DALL-E", rating: 4.6, logo: "🖼️" },
      { name: "Stable Diffusion", rating: 4.4, logo: "🎭" },
      { name: "Canva AI", rating: 4.3, logo: "🎨" }
    ],
    tags: ["AI Art", "Image Generation", "Design", "Creative", "Text-to-Image"]
  },
  {
    name: "GitHub Copilot",
    logo: "💻",
    description: "AI-powered code completion and pair programming assistant",
    long_description: "GitHub Copilot is an AI-powered code completion tool that helps developers write code faster and more efficiently. It uses machine learning to understand context and suggest relevant code snippets, function implementations, and even entire functions. It works as an extension in popular IDEs and can significantly speed up development workflows.",
    category: "Development",
    rating: 4.5,
    review_count: 2156,
    weekly_users: 18920,
    growth: "+67%",
    website: "https://github.com/features/copilot",
    pricing: "Paid",
    features: [
      "AI code completion",
      "Multi-language support",
      "IDE integration",
      "Context-aware suggestions",
      "Documentation generation",
      "Test case generation",
      "Code explanation"
    ],
    pros: [
      "Significantly speeds up coding",
      "Excellent code quality",
      "Multi-language support",
      "Seamless IDE integration",
      "Learns from your coding style",
      "Reduces repetitive coding tasks"
    ],
    cons: [
      "Subscription cost",
      "Can suggest incorrect code",
      "Requires good prompts",
      "May not work well with custom frameworks",
      "Privacy concerns with code sharing"
    ],
    alternatives: [
      { name: "Cursor", rating: 4.4, logo: "⌨️" },
      { name: "Tabnine", rating: 4.2, logo: "🤖" },
      { name: "CodeWhisperer", rating: 4.3, logo: "☁️" }
    ],
    tags: ["AI", "Coding", "Development", "IDE", "Code Completion", "GitHub"]
  },
  {
    name: "Notion AI",
    logo: "📝",
    description: "AI-powered productivity and note-taking platform",
    long_description: "Notion AI enhances the popular Notion workspace with artificial intelligence capabilities. It can help users write, edit, brainstorm, and organize content more efficiently. The AI can generate content, summarize text, create outlines, and even help with project management tasks, making it a powerful tool for teams and individuals.",
    category: "Productivity",
    rating: 4.4,
    review_count: 1567,
    weekly_users: 11230,
    growth: "+28%",
    website: "https://notion.so",
    pricing: "Freemium",
    features: [
      "AI-powered writing assistance",
      "Content generation",
      "Text summarization",
      "Brainstorming tools",
      "Project management",
      "Database organization",
      "Collaboration features"
    ],
    pros: [
      "Seamless integration with Notion",
      "Excellent for content creation",
      "Good for team collaboration",
      "Flexible workspace",
      "Regular feature updates",
      "Strong community"
    ],
    cons: [
      "AI features require subscription",
      "Learning curve for complex features",
      "Can be overwhelming for simple use cases",
      "Limited offline functionality"
    ],
    alternatives: [
      { name: "Obsidian", rating: 4.3, logo: "💎" },
      { name: "Roam Research", rating: 4.2, logo: "🧠" },
      { name: "Logseq", rating: 4.1, logo: "📊" }
    ],
    tags: ["AI", "Productivity", "Note-taking", "Collaboration", "Workspace"]
  },
  {
    name: "Jasper",
    logo: "✍️",
    description: "AI writing assistant for content creation and marketing",
    long_description: "Jasper is a comprehensive AI writing platform designed specifically for marketers, content creators, and businesses. It can generate various types of content including blog posts, social media content, marketing copy, emails, and more. The platform includes templates, brand voice customization, and collaboration features.",
    category: "Marketing",
    rating: 4.3,
    review_count: 2341,
    weekly_users: 9870,
    growth: "+41%",
    website: "https://jasper.ai",
    pricing: "Paid",
    features: [
      "Content generation",
      "Marketing copy creation",
      "Blog post writing",
      "Social media content",
      "Email marketing",
      "Brand voice customization",
      "SEO optimization"
    ],
    pros: [
      "Excellent for marketing content",
      "Wide variety of templates",
      "Good brand voice features",
      "SEO-friendly content",
      "Collaboration tools",
      "Regular updates"
    ],
    cons: [
      "Can be expensive for small teams",
      "Content can be generic",
      "Requires editing and review",
      "Limited free trial"
    ],
    alternatives: [
      { name: "Copy.ai", rating: 4.2, logo: "📄" },
      { name: "Writesonic", rating: 4.1, logo: "✏️" },
      { name: "ContentBot", rating: 4.0, logo: "🤖" }
    ],
    tags: ["AI", "Writing", "Marketing", "Content Creation", "Copywriting"]
  },
  {
    name: "Synthesia",
    logo: "🎬",
    description: "AI video creation platform with virtual avatars",
    long_description: "Synthesia is an AI-powered video creation platform that allows users to create professional videos using virtual avatars and AI-generated speech. It's particularly useful for training videos, presentations, marketing content, and educational materials. The platform offers a wide range of avatars, languages, and customization options.",
    category: "Video",
    rating: 4.2,
    review_count: 892,
    weekly_users: 6540,
    growth: "+38%",
    website: "https://synthesia.io",
    pricing: "Paid",
    features: [
      "AI avatar generation",
      "Text-to-speech",
      "Video templates",
      "Multi-language support",
      "Custom branding",
      "Screen recording",
      "Collaboration tools"
    ],
    pros: [
      "Professional-looking videos",
      "Wide range of avatars",
      "Multi-language support",
      "Easy to use",
      "Good for training content",
      "Customizable branding"
    ],
    cons: [
      "Can be expensive",
      "Limited free trial",
      "Avatar movements can be robotic",
      "Requires good script writing"
    ],
    alternatives: [
      { name: "Lumen5", rating: 4.1, logo: "🎥" },
      { name: "InVideo", rating: 4.0, logo: "📹" },
      { name: "Pictory", rating: 4.2, logo: "🎬" }
    ],
    tags: ["AI", "Video", "Avatar", "Text-to-Speech", "Training"]
  },
  {
    name: "Grammarly",
    logo: "📝",
    description: "AI-powered writing assistant for grammar and style improvement",
    long_description: "Grammarly is a comprehensive writing assistant that uses AI to check grammar, spelling, punctuation, and style. It provides real-time suggestions to improve writing clarity, tone, and effectiveness. The tool works across various platforms including web browsers, Microsoft Office, and mobile devices.",
    category: "Writing",
    rating: 4.6,
    review_count: 3456,
    weekly_users: 22340,
    growth: "+23%",
    website: "https://grammarly.com",
    pricing: "Freemium",
    features: [
      "Grammar checking",
      "Spell checking",
      "Style suggestions",
      "Tone detection",
      "Plagiarism detection",
      "Writing insights",
      "Multi-platform support"
    ],
    pros: [
      "Excellent grammar checking",
      "Real-time suggestions",
      "Works across platforms",
      "Good free version",
      "Detailed explanations",
      "Tone and style analysis"
    ],
    cons: [
      "Premium features are expensive",
      "Can be overly aggressive",
      "May suggest unnecessary changes",
      "Privacy concerns with text analysis"
    ],
    alternatives: [
      { name: "ProWritingAid", rating: 4.4, logo: "✍️" },
      { name: "Hemingway Editor", rating: 4.2, logo: "📖" },
      { name: "LanguageTool", rating: 4.3, logo: "🔧" }
    ],
    tags: ["AI", "Writing", "Grammar", "Spelling", "Style", "Editing"]
  },
  {
    name: "Otter.ai",
    logo: "🎤",
    description: "AI-powered meeting transcription and note-taking",
    long_description: "Otter.ai is an AI-powered transcription service that automatically transcribes meetings, interviews, and conversations in real-time. It can identify different speakers, create searchable transcripts, and generate meeting summaries. The platform is particularly useful for teams that need to capture and review meeting content.",
    category: "Productivity",
    rating: 4.3,
    review_count: 1876,
    weekly_users: 8760,
    growth: "+34%",
    website: "https://otter.ai",
    pricing: "Freemium",
    features: [
      "Real-time transcription",
      "Speaker identification",
      "Meeting summaries",
      "Searchable transcripts",
      "Integration with Zoom",
      "Collaboration tools",
      "Export options"
    ],
    pros: [
      "Accurate transcription",
      "Real-time capabilities",
      "Good speaker identification",
      "Easy integration",
      "Searchable content",
      "Meeting insights"
    ],
    cons: [
      "Requires good audio quality",
      "Limited free minutes",
      "Can miss technical terms",
      "Privacy concerns with sensitive content"
    ],
    alternatives: [
      { name: "Rev", rating: 4.4, logo: "🎧" },
      { name: "Temi", rating: 4.1, logo: "📝" },
      { name: "Trint", rating: 4.2, logo: "🎤" }
    ],
    tags: ["AI", "Transcription", "Meetings", "Productivity", "Voice Recognition"]
  },
  {
    name: "Canva AI",
    logo: "🎨",
    description: "AI-powered design tools for graphics and presentations",
    long_description: "Canva AI enhances the popular design platform with artificial intelligence capabilities. It can generate images, suggest design layouts, create color palettes, and even write copy for designs. The AI features make it easier for non-designers to create professional-looking graphics and presentations.",
    category: "Design",
    rating: 4.4,
    review_count: 2987,
    weekly_users: 15670,
    growth: "+29%",
    website: "https://canva.com",
    pricing: "Freemium",
    features: [
      "AI image generation",
      "Design suggestions",
      "Layout optimization",
      "Color palette generation",
      "Copy writing",
      "Background removal",
      "Template recommendations"
    ],
    pros: [
      "Easy to use",
      "Excellent templates",
      "AI enhances creativity",
      "Good for beginners",
      "Collaboration features",
      "Regular updates"
    ],
    cons: [
      "AI features require subscription",
      "Limited customization",
      "Can be resource-intensive",
      "May not replace professional designers"
    ],
    alternatives: [
      { name: "Figma", rating: 4.5, logo: "🎯" },
      { name: "Adobe Creative Suite", rating: 4.6, logo: "🎨" },
      { name: "Sketch", rating: 4.3, logo: "✏️" }
    ],
    tags: ["AI", "Design", "Graphics", "Presentations", "Templates"]
  },
  {
    name: "Copy.ai",
    logo: "📄",
    description: "AI copywriting platform for marketing and business content",
    long_description: "Copy.ai is an AI-powered copywriting platform that helps businesses create compelling marketing copy, product descriptions, social media content, and other business communications. It uses advanced language models to generate human-like copy that resonates with target audiences.",
    category: "Marketing",
    rating: 4.2,
    review_count: 1654,
    weekly_users: 7430,
    growth: "+36%",
    website: "https://copy.ai",
    pricing: "Freemium",
    features: [
      "Marketing copy generation",
      "Product descriptions",
      "Social media content",
      "Email marketing",
      "Blog post writing",
      "Brand voice training",
      "A/B testing suggestions"
    ],
    pros: [
      "Good for marketing copy",
      "Easy to use",
      "Multiple content types",
      "Brand voice features",
      "Regular updates",
      "Good templates"
    ],
    cons: [
      "Content can be generic",
      "Requires editing",
      "Limited free credits",
      "May not capture brand voice perfectly"
    ],
    alternatives: [
      { name: "Jasper", rating: 4.3, logo: "✍️" },
      { name: "Writesonic", rating: 4.1, logo: "✏️" },
      { name: "ContentBot", rating: 4.0, logo: "🤖" }
    ],
    tags: ["AI", "Copywriting", "Marketing", "Content", "Business"]
  }
];

// Sample reviews data
const sampleReviews = [
  {
    tool_name: "ChatGPT",
    reviews: [
      {
        user_name: "Sarah Johnson",
        rating: 5,
        date: "2 days ago",
        comment: "ChatGPT has completely transformed how I work. It's incredibly helpful for brainstorming, writing, and even coding. The responses are always relevant and well-thought-out.",
        helpful: 24,
        verified: true
      },
      {
        user_name: "Mike Chen",
        rating: 4,
        date: "1 week ago",
        comment: "Great tool for getting quick answers and explanations. Sometimes the responses can be a bit verbose, but overall very useful for learning and problem-solving.",
        helpful: 18,
        verified: true
      },
      {
        user_name: "Emily Rodriguez",
        rating: 5,
        date: "3 days ago",
        comment: "I use ChatGPT daily for content creation and research. It's like having a brilliant assistant available 24/7. The free tier is generous and the paid version is worth every penny.",
        helpful: 31,
        verified: false
      }
    ]
  },
  {
    tool_name: "Midjourney",
    reviews: [
      {
        user_name: "Alex Thompson",
        rating: 5,
        date: "5 days ago",
        comment: "The quality of images Midjourney generates is absolutely stunning. I've been using it for concept art and the results are always impressive. The community is also very helpful.",
        helpful: 42,
        verified: true
      },
      {
        user_name: "Lisa Wang",
        rating: 4,
        date: "2 weeks ago",
        comment: "Great tool for creating unique artwork. The learning curve for writing good prompts can be steep, but once you get the hang of it, the possibilities are endless.",
        helpful: 15,
        verified: true
      },
      {
        user_name: "David Kim",
        rating: 4,
        date: "1 week ago",
        comment: "Midjourney produces beautiful images, but the Discord interface can be frustrating. Wish there was a standalone app. Still, the results make it worth the hassle.",
        helpful: 28,
        verified: false
      }
    ]
  },
  {
    tool_name: "GitHub Copilot",
    reviews: [
      {
        user_name: "James Wilson",
        rating: 5,
        date: "4 days ago",
        comment: "Copilot has dramatically increased my coding speed. It's like having a pair programmer who never gets tired. The suggestions are usually spot-on and save me hours of typing.",
        helpful: 56,
        verified: true
      },
      {
        user_name: "Maria Garcia",
        rating: 4,
        date: "1 week ago",
        comment: "Very helpful for routine coding tasks and boilerplate code. Sometimes it suggests outdated patterns, but overall it's a great productivity booster.",
        helpful: 23,
        verified: true
      },
      {
        user_name: "Tom Anderson",
        rating: 3,
        date: "2 weeks ago",
        comment: "Good tool but can be expensive for individual developers. The suggestions are helpful but you still need to review everything carefully.",
        helpful: 12,
        verified: false
      }
    ]
  }
];

async function generateOfflineData() {
  console.log('🚀 Generating offline AI tools data...');
  
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Update the tools.json file with comprehensive data
    const toolsForJson = realAITools.map(tool => ({
      name: tool.name,
      blurb: tool.description,
      category: tool.category,
      priceTier: tool.pricing,
      affiliateUrl: tool.website,
      logo: tool.logo
    }));

    fs.writeFileSync(
      path.join(dataDir, 'tools.json'),
      JSON.stringify(toolsForJson, null, 2)
    );

    // Create comprehensive tools data file
    fs.writeFileSync(
      path.join(dataDir, 'tools-comprehensive.json'),
      JSON.stringify(realAITools, null, 2)
    );

    // Create reviews data file
    fs.writeFileSync(
      path.join(dataDir, 'reviews.json'),
      JSON.stringify(sampleReviews, null, 2)
    );

    // Create categories data file
    const categories = [
      {
        name: "Language",
        icon: "💬",
        description: "AI tools for text generation, translation, and language processing",
        count: realAITools.filter(t => t.category === "Language").length,
        color: "from-blue-500 to-cyan-500",
        popular_tools: ["ChatGPT", "Claude", "Bard", "Perplexity"]
      },
      {
        name: "Design",
        icon: "🎨",
        description: "AI-powered design tools for graphics, UI/UX, and creative work",
        count: realAITools.filter(t => t.category === "Design").length,
        color: "from-purple-500 to-pink-500",
        popular_tools: ["Midjourney", "DALL-E", "Stable Diffusion", "Canva AI"]
      },
      {
        name: "Development",
        icon: "💻",
        description: "AI tools for coding, debugging, and software development",
        count: realAITools.filter(t => t.category === "Development").length,
        color: "from-green-500 to-emerald-500",
        popular_tools: ["GitHub Copilot", "Cursor", "Tabnine", "CodeWhisperer"]
      },
      {
        name: "Productivity",
        icon: "⚡",
        description: "AI assistants and tools to boost your productivity",
        count: realAITools.filter(t => t.category === "Productivity").length,
        color: "from-yellow-500 to-orange-500",
        popular_tools: ["Notion AI", "Grammarly", "Otter.ai", "Fireflies"]
      },
      {
        name: "Marketing",
        icon: "📈",
        description: "AI tools for marketing, advertising, and business growth",
        count: realAITools.filter(t => t.category === "Marketing").length,
        color: "from-red-500 to-rose-500",
        popular_tools: ["Jasper", "Copy.ai", "Surfer SEO", "Phrasee"]
      },
      {
        name: "Writing",
        icon: "✍️",
        description: "AI writing assistants and grammar tools",
        count: realAITools.filter(t => t.category === "Writing").length,
        color: "from-indigo-500 to-purple-500",
        popular_tools: ["Grammarly", "ProWritingAid", "Hemingway Editor"]
      },
      {
        name: "Video",
        icon: "🎬",
        description: "AI video creation and editing tools",
        count: realAITools.filter(t => t.category === "Video").length,
        color: "from-pink-500 to-rose-500",
        popular_tools: ["Synthesia", "Lumen5", "InVideo", "Pictory"]
      }
    ];

    fs.writeFileSync(
      path.join(dataDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    );

    // Create SQL insert statements for database seeding
    const sqlStatements = [];
    
    // Tools insert statements
    realAITools.forEach(tool => {
      sqlStatements.push(`
INSERT INTO tools (name, logo, description, long_description, category, rating, review_count, weekly_users, growth, website, pricing, features, pros, cons, alternatives, tags) VALUES (
  '${tool.name.replace(/'/g, "''")}',
  '${tool.logo}',
  '${tool.description.replace(/'/g, "''")}',
  '${tool.long_description.replace(/'/g, "''")}',
  '${tool.category}',
  ${tool.rating},
  ${tool.review_count},
  ${tool.weekly_users},
  '${tool.growth}',
  '${tool.website}',
  '${tool.pricing}',
  ARRAY[${tool.features.map(f => `'${f.replace(/'/g, "''")}'`).join(', ')}],
  ARRAY[${tool.pros.map(p => `'${p.replace(/'/g, "''")}'`).join(', ')}],
  ARRAY[${tool.cons.map(c => `'${c.replace(/'/g, "''")}'`).join(', ')}],
  '${JSON.stringify(tool.alternatives).replace(/'/g, "''")}',
  ARRAY[${tool.tags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}]
);`);
    });

    fs.writeFileSync(
      path.join(dataDir, 'tools-seed.sql'),
      sqlStatements.join('\n\n')
    );

    console.log('✅ Successfully generated offline AI tools data!');
    console.log('📁 Files created:');
    console.log('   - data/tools.json (basic tool data)');
    console.log('   - data/tools-comprehensive.json (full tool data)');
    console.log('   - data/reviews.json (sample reviews)');
    console.log('   - data/categories.json (category information)');
    console.log('   - data/tools-seed.sql (SQL insert statements)');
    console.log('\n📊 Summary:');
    console.log(`   - ${realAITools.length} AI tools with comprehensive data`);
    console.log(`   - ${sampleReviews.length} tools with sample reviews`);
    console.log(`   - ${categories.length} categories defined`);
    console.log('\n💡 Next steps:');
    console.log('   1. Set up your Supabase environment variables');
    console.log('   2. Run: npm run seed:ai-data (for database seeding)');
    console.log('   3. Or use the SQL file: data/tools-seed.sql');

  } catch (error) {
    console.error('❌ Error generating offline data:', error);
  }
}

// Run the function
generateOfflineData(); 