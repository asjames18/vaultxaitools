export interface Tool {
  id: string;
  name: string;
  logo: string;
  description: string;
  longDescription?: string;
  category: string;
  rating: number;
  reviewCount: number;
  weeklyUsers: number;
  growth: string;
  website: string;
  pricing: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: { id?: string; name: string; rating: number; logo: string }[];
  tags?: string[];
  // Optional tailored fields
  useCases?: { title: string; prompt: string; description?: string; notes?: string }[];
  quickStart?: string[];
  integrations?: { name: string; logo?: string; note?: string }[];
  faq?: { q: string; a: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  name: string;
  icon: string;
  description: string;
  count: number;
  color: string;
  popularTools: string[];
}

export const categories: Category[] = [
  {
    name: "Language",
    icon: "💬",
    description: "AI tools for text generation, translation, and language processing",
    count: 45,
    color: "from-blue-500 to-cyan-500",
    popularTools: ["ChatGPT", "Claude", "Bard", "Perplexity"]
  },
  {
    name: "Design",
    icon: "🎨",
    description: "AI-powered design tools for graphics, UI/UX, and creative work",
    count: 38,
    color: "from-purple-500 to-pink-500",
    popularTools: ["Midjourney", "DALL-E", "Stable Diffusion", "Canva AI"]
  },
  {
    name: "Development",
    icon: "💻",
    description: "AI tools for coding, debugging, and software development",
    count: 52,
    color: "from-green-500 to-emerald-500",
    popularTools: ["GitHub Copilot", "Cursor", "Tabnine", "CodeWhisperer"]
  },
  {
    name: "Productivity",
    icon: "⚡",
    description: "AI assistants and tools to boost your productivity",
    count: 29,
    color: "from-yellow-500 to-orange-500",
    popularTools: ["Notion AI", "Grammarly", "Otter.ai", "Fireflies"]
  },
  {
    name: "Marketing",
    icon: "📈",
    description: "AI tools for marketing, advertising, and business growth",
    count: 31,
    color: "from-red-500 to-rose-500",
    popularTools: ["Jasper", "Copy.ai", "Surfer SEO", "Phrasee"]
  },
  {
    name: "Writing",
    icon: "✍️",
    description: "AI writing assistants and content creation tools",
    count: 27,
    color: "from-indigo-500 to-blue-500",
    popularTools: ["Grammarly", "Hemingway", "ProWritingAid", "Wordtune"]
  },
  {
    name: "Video",
    icon: "🎬",
    description: "AI tools for video creation, editing, and generation",
    count: 23,
    color: "from-pink-500 to-purple-500",
    popularTools: ["Runway", "Synthesia", "Lumen5", "Pictory"]
  },
  {
    name: "Audio",
    icon: "🎵",
    description: "AI tools for audio processing, music generation, and voice synthesis",
    count: 19,
    color: "from-teal-500 to-cyan-500",
    popularTools: ["Mubert", "Amper Music", "Descript", "Synthesia"]
  },
  {
    name: "Data",
    icon: "📊",
    description: "AI tools for data analysis, visualization, and insights",
    count: 34,
    color: "from-gray-500 to-slate-500",
    popularTools: ["Tableau", "Power BI", "Looker", "Metabase"]
  }
];

export const tools: Tool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    logo: "🤖",
    description: "Advanced language model for conversation and text generation",
    longDescription: "ChatGPT is an AI-powered conversational agent that can engage in natural language conversations, answer questions, provide explanations, and assist with various tasks. It's built on OpenAI's GPT architecture and can understand context, generate human-like responses, and adapt to different conversation styles.",
    category: "Language",
    rating: 4.8,
    reviewCount: 1247,
    weeklyUsers: 15420,
    growth: "+45%",
    website: "https://chat.openai.com",
    pricing: "Freemium",
    features: [
      "Natural language conversations",
      "Context-aware responses",
      "Multi-language support",
      "Code generation and debugging",
      "Creative writing assistance",
      "Educational explanations",
      "Real-time responses",
      "Customizable conversation styles"
    ],
    pros: [
      "Highly accurate and contextual responses",
      "Excellent for learning and education",
      "Free tier available",
      "Regular updates and improvements",
      "Good for creative tasks"
    ],
    cons: [
      "Can sometimes provide incorrect information",
      "Limited to training data cutoff",
      "May not always understand complex queries",
      "Privacy concerns with data handling"
    ],
    alternatives: [
      { name: "Claude", rating: 4.7, logo: "🧠" },
      { name: "Bard", rating: 4.5, logo: "🤖" },
      { name: "Perplexity", rating: 4.6, logo: "🔍" }
    ],
    tags: ["AI", "Language", "Conversation", "OpenAI"],
    useCases: [
      { title: "Research assistant", prompt: "Summarize the latest on {topic} with 5 cited sources and key takeaways.", notes: "Replace {topic}." },
      { title: "Draft better emails", prompt: "Write a concise reply to this email: {paste email}. Goal: {goal}. Tone: {tone}.", notes: "Paste email + goal." },
      { title: "Meeting prep", prompt: "Create a 5-bullet briefing on {project} including risks, dependencies, and open questions." }
    ],
    quickStart: [
      "Log in with your account",
      "Pick a style (professional, friendly) and set a goal",
      "Paste your context and run a starter prompt"
    ],
    createdAt: "2023-01-01",
    updatedAt: "2024-01-15"
  },
  {
    id: "midjourney",
    name: "Midjourney",
    logo: "🎨",
    description: "AI-powered image generation from text descriptions",
    longDescription: "Midjourney is a cutting-edge AI art generation tool that creates stunning images from text prompts. It's known for its artistic quality and ability to generate highly detailed, creative visuals across various styles and genres.",
    category: "Design",
    rating: 4.6,
    reviewCount: 892,
    weeklyUsers: 12850,
    growth: "+32%",
    website: "https://midjourney.com",
    pricing: "Paid",
    features: [
      "Text-to-image generation",
      "High-resolution outputs",
      "Multiple art styles",
      "Customizable parameters",
      "Community features",
      "Discord integration"
    ],
    pros: [
      "Exceptional artistic quality",
      "Wide range of styles",
      "Active community",
      "Regular model updates"
    ],
    cons: [
      "Requires Discord account",
      "No free tier",
      "Limited commercial usage",
      "Queue times during peak hours"
    ],
    alternatives: [
      { name: "DALL-E", rating: 4.6, logo: "🖼️" },
      { name: "Stable Diffusion", rating: 4.4, logo: "🎭" },
      { name: "Canva AI", rating: 4.3, logo: "🎨" }
    ],
    tags: ["AI Art", "Image Generation", "Design", "Creative"],
    useCases: [
      { title: "Concept art", prompt: "Create concept art of {subject} in the style of {style}, ultra‑detailed, cinematic lighting.", notes: "Swap {subject}/{style}." },
      { title: "Brand moodboard", prompt: "Generate 4 images exploring a brand moodboard: {adjectives}, {palette}, {textures}." }
    ],
    quickStart: ["Join the Discord", "Use /imagine with a clear subject", "Iterate with V/U buttons"],
    createdAt: "2022-07-01",
    updatedAt: "2024-01-10"
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    logo: "💻",
    description: "AI pair programmer that helps write code faster",
    longDescription: "GitHub Copilot is an AI-powered code completion tool that suggests whole lines or blocks of code as you type. It's trained on billions of lines of code and can help developers write code faster and with fewer errors.",
    category: "Development",
    rating: 4.7,
    reviewCount: 1563,
    weeklyUsers: 8920,
    growth: "+67%",
    website: "https://github.com/features/copilot",
    pricing: "Paid",
    features: [
      "Real-time code suggestions",
      "Multi-language support",
      "IDE integration",
      "Context-aware completions",
      "Documentation generation",
      "Test case suggestions"
    ],
    pros: [
      "Significantly speeds up coding",
      "Supports many programming languages",
      "Learns from your coding style",
      "Excellent IDE integration"
    ],
    cons: [
      "Can suggest incorrect code",
      "Privacy concerns with code sharing",
      "Requires internet connection",
      "May not understand complex business logic"
    ],
    alternatives: [
      { name: "Cursor", rating: 4.5, logo: "⌨️" },
      { name: "Tabnine", rating: 4.3, logo: "🔧" },
      { name: "CodeWhisperer", rating: 4.4, logo: "🤖" }
    ],
    tags: ["Coding", "AI Assistant", "Development", "Productivity"],
    createdAt: "2021-06-01",
    updatedAt: "2024-01-12"
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    logo: "📝",
    description: "Writing assistant integrated into Notion workspace",
    longDescription: "Notion AI brings artificial intelligence directly into your Notion workspace, helping you write, edit, and organize content more efficiently. It can generate text, summarize documents, and assist with various writing tasks.",
    category: "Productivity",
    rating: 4.5,
    reviewCount: 734,
    weeklyUsers: 11230,
    growth: "+28%",
    website: "https://notion.so",
    pricing: "Freemium",
    features: [
      "Text generation and editing",
      "Document summarization",
      "Translation capabilities",
      "Task automation",
      "Template generation",
      "Content organization"
    ],
    pros: [
      "Seamless Notion integration",
      "Improves writing quality",
      "Helps with content organization",
      "Multiple use cases"
    ],
    cons: [
      "Limited to Notion ecosystem",
      "Can be expensive for teams",
      "Sometimes generates generic content",
      "Requires Notion subscription"
    ],
    alternatives: [
      { name: "Grammarly", rating: 4.4, logo: "✍️" },
      { name: "Otter.ai", rating: 4.2, logo: "🎤" },
      { name: "Fireflies", rating: 4.3, logo: "🔥" }
    ],
    tags: ["Productivity", "Writing", "Organization", "Notion"],
    createdAt: "2023-02-01",
    updatedAt: "2024-01-08"
  },
  {
    id: "jasper",
    name: "Jasper",
    logo: "✍️",
    description: "AI content creation platform for marketing and writing",
    longDescription: "Jasper is a comprehensive AI writing platform designed for marketers, content creators, and businesses. It helps create high-quality content for various purposes including blog posts, social media, ads, and more.",
    category: "Marketing",
    rating: 4.4,
    reviewCount: 567,
    weeklyUsers: 8750,
    growth: "+41%",
    website: "https://jasper.ai",
    pricing: "Paid",
    features: [
      "Content generation",
      "SEO optimization",
      "Brand voice customization",
      "Multi-language support",
      "Collaboration tools",
      "Content templates"
    ],
    pros: [
      "Excellent for marketing content",
      "Strong SEO capabilities",
      "Good brand voice control",
      "Comprehensive templates"
    ],
    cons: [
      "Can be expensive",
      "Sometimes repetitive content",
      "Requires human editing",
      "Limited free trial"
    ],
    alternatives: [
      { name: "Copy.ai", rating: 4.3, logo: "📄" },
      { name: "Surfer SEO", rating: 4.2, logo: "🏄" },
      { name: "Phrasee", rating: 4.1, logo: "💬" }
    ],
    tags: ["Marketing", "Content Creation", "SEO", "Writing"],
    createdAt: "2021-01-01",
    updatedAt: "2024-01-05"
  },
  {
    id: "dalle",
    name: "DALL-E",
    logo: "🖼️",
    description: "AI system that creates realistic images from text descriptions",
    longDescription: "DALL-E is OpenAI's AI system that creates images from text descriptions. It can generate highly detailed and creative images across various styles and can edit existing images based on natural language instructions.",
    category: "Design",
    rating: 4.6,
    reviewCount: 445,
    weeklyUsers: 6540,
    growth: "+38%",
    website: "https://openai.com/dall-e-2",
    pricing: "Paid",
    features: [
      "Text-to-image generation",
      "Image editing capabilities",
      "Multiple art styles",
      "High-resolution outputs",
      "Variation generation",
      "Commercial usage rights"
    ],
    pros: [
      "High-quality image generation",
      "Good commercial usage terms",
      "Regular model improvements",
      "Easy to use interface"
    ],
    cons: [
      "No free tier",
      "Limited to OpenAI ecosystem",
      "Can be expensive for heavy usage",
      "Sometimes inconsistent results"
    ],
    alternatives: [
      { name: "Midjourney", rating: 4.6, logo: "🎨" },
      { name: "Stable Diffusion", rating: 4.4, logo: "🎭" },
      { name: "Canva AI", rating: 4.3, logo: "🎨" }
    ],
    tags: ["AI Art", "Image Generation", "OpenAI", "Creative"],
    createdAt: "2021-01-01",
    updatedAt: "2024-01-03"
  },
  {
    id: "claude",
    name: "Claude",
    logo: "🧠",
    description: "Advanced AI assistant with strong reasoning capabilities",
    longDescription: "Claude is an AI assistant developed by Anthropic, known for its strong reasoning abilities, safety features, and helpful personality. It excels at analysis, writing, and complex problem-solving tasks.",
    category: "Language",
    rating: 4.7,
    reviewCount: 678,
    weeklyUsers: 9870,
    growth: "+52%",
    website: "https://claude.ai",
    pricing: "Freemium",
    features: [
      "Advanced reasoning",
      "Document analysis",
      "Code assistance",
      "Creative writing",
      "Safety-focused design",
      "Large context window"
    ],
    pros: [
      "Excellent reasoning capabilities",
      "Strong safety features",
      "Good for analysis tasks",
      "Helpful personality"
    ],
    cons: [
      "Limited availability",
      "Can be overly cautious",
      "Sometimes verbose responses",
      "Limited image capabilities"
    ],
    alternatives: [
      { name: "ChatGPT", rating: 4.8, logo: "🤖" },
      { name: "Bard", rating: 4.5, logo: "🤖" },
      { name: "Perplexity", rating: 4.6, logo: "🔍" }
    ],
    tags: ["AI Assistant", "Reasoning", "Analysis", "Anthropic"],
    createdAt: "2023-03-01",
    updatedAt: "2024-01-14"
  },
  {
    id: "cursor",
    name: "Cursor",
    logo: "⌨️",
    description: "AI-powered code editor with intelligent autocomplete",
    longDescription: "Cursor is a modern code editor built on VS Code that integrates AI capabilities directly into the development workflow. It can help with code generation, debugging, and understanding complex codebases.",
    category: "Development",
    rating: 4.5,
    reviewCount: 423,
    weeklyUsers: 5430,
    growth: "+89%",
    website: "https://cursor.sh",
    pricing: "Freemium",
    features: [
      "AI code generation",
      "Intelligent autocomplete",
      "Code explanation",
      "Bug detection",
      "Refactoring assistance",
      "Multi-language support"
    ],
    pros: [
      "Excellent AI integration",
      "Familiar VS Code interface",
      "Good code understanding",
      "Free tier available"
    ],
    cons: [
      "Still in development",
      "Can be resource-intensive",
      "Sometimes generates incorrect code",
      "Limited offline capabilities"
    ],
    alternatives: [
      { name: "GitHub Copilot", rating: 4.7, logo: "💻" },
      { name: "Tabnine", rating: 4.3, logo: "🔧" },
      { name: "CodeWhisperer", rating: 4.4, logo: "🤖" }
    ],
    tags: ["Code Editor", "AI", "Development", "VS Code"],
    createdAt: "2023-01-01",
    updatedAt: "2024-01-11"
  },
  {
    id: "grammarly",
    name: "Grammarly",
    logo: "✍️",
    description: "AI-powered writing assistant for grammar and style",
    longDescription: "Grammarly is an AI-powered writing assistant that helps improve grammar, spelling, punctuation, and writing style. It provides real-time suggestions and explanations to enhance your writing.",
    category: "Writing",
    rating: 4.6,
    reviewCount: 892,
    weeklyUsers: 15670,
    growth: "+23%",
    website: "https://grammarly.com",
    pricing: "Freemium",
    features: [
      "Grammar checking",
      "Style suggestions",
      "Plagiarism detection",
      "Tone analysis",
      "Real-time corrections",
      "Multi-platform support"
    ],
    pros: [
      "Excellent grammar checking",
      "Real-time suggestions",
      "Works across platforms",
      "Free tier available"
    ],
    cons: [
      "Can be expensive for premium features",
      "Sometimes over-corrects",
      "Privacy concerns",
      "Limited offline functionality"
    ],
    alternatives: [
      { name: "Hemingway", rating: 4.2, logo: "📝" },
      { name: "ProWritingAid", rating: 4.4, logo: "✏️" },
      { name: "Wordtune", rating: 4.3, logo: "🔄" }
    ],
    tags: ["Writing", "Grammar", "AI Assistant", "Productivity"],
    createdAt: "2009-01-01",
    updatedAt: "2024-01-10"
  },
  {
    id: "bard",
    name: "Bard",
    logo: "🤖",
    description: "Google's conversational AI assistant",
    longDescription: "Bard is Google's conversational AI assistant that can help with writing, analysis, and creative tasks. It's integrated with Google's search capabilities and can provide real-time information.",
    category: "Language",
    rating: 4.3,
    reviewCount: 567,
    weeklyUsers: 8230,
    growth: "+34%",
    website: "https://bard.google.com",
    pricing: "Free",
    features: [
      "Conversational AI",
      "Real-time search integration",
      "Creative writing assistance",
      "Code generation",
      "Multi-language support",
      "Google integration"
    ],
    pros: [
      "Free to use",
      "Good search integration",
      "Regular updates",
      "Google ecosystem integration"
    ],
    cons: [
      "Sometimes less accurate than competitors",
      "Limited to Google ecosystem",
      "Can be slow at times",
      "Privacy concerns"
    ],
    alternatives: [
      { name: "ChatGPT", rating: 4.8, logo: "🤖" },
      { name: "Claude", rating: 4.7, logo: "🧠" },
      { name: "Perplexity", rating: 4.6, logo: "🔍" }
    ],
    tags: ["AI Assistant", "Google", "Language", "Search"],
    createdAt: "2023-03-01",
    updatedAt: "2024-01-12"
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    logo: "🎭",
    description: "Open-source AI image generation model",
    longDescription: "Stable Diffusion is an open-source AI image generation model that can create high-quality images from text descriptions. It's widely used for creative projects and has spawned many community tools.",
    category: "Design",
    rating: 4.4,
    reviewCount: 678,
    weeklyUsers: 9870,
    growth: "+56%",
    website: "https://stability.ai",
    pricing: "Freemium",
    features: [
      "Text-to-image generation",
      "Image-to-image editing",
      "Inpainting capabilities",
      "Open source",
      "Community models",
      "Local deployment"
    ],
    pros: [
      "Open source",
      "Highly customizable",
      "Active community",
      "Can run locally"
    ],
    cons: [
      "Requires technical knowledge",
      "Resource intensive",
      "Inconsistent results",
      "Complex setup"
    ],
    alternatives: [
      { name: "Midjourney", rating: 4.6, logo: "🎨" },
      { name: "DALL-E", rating: 4.6, logo: "🖼️" },
      { name: "Canva AI", rating: 4.3, logo: "🎨" }
    ],
    tags: ["AI Art", "Open Source", "Image Generation", "Creative"],
    createdAt: "2022-08-01",
    updatedAt: "2024-01-08"
  }
];

// Helper functions for working with tools data
export const getToolsByCategory = (category: string): Tool[] => {
  return tools.filter(tool => tool.category === category);
};

export const getPopularTools = (limit: number = 6): Tool[] => {
  return tools
    .sort((a, b) => b.weeklyUsers - a.weeklyUsers)
    .slice(0, limit);
};

export const getTrendingTools = (limit: number = 6): Tool[] => {
  return tools
    .sort((a, b) => {
      const aGrowth = parseInt(a.growth.replace('+', '').replace('%', ''));
      const bGrowth = parseInt(b.growth.replace('+', '').replace('%', ''));
      return bGrowth - aGrowth;
    })
    .slice(0, limit);
};

export const searchTools = (query: string): Tool[] => {
  const lowercaseQuery = query.toLowerCase();
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getToolById = (id: string): Tool | undefined => {
  return tools.find(tool => tool.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return categories.find(category => category.name === name);
}; 