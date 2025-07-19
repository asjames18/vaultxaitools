const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Tool = require('./models/Tool');
const User = require('./models/User');

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@vaultxaitools.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isVerified: true,
    bio: 'System administrator for VaultX AI Tools'
  },
  {
    username: 'sarah_dev',
    email: 'sarah@example.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    bio: 'Full-stack developer passionate about AI tools'
  },
  {
    username: 'mike_designer',
    email: 'mike@example.com',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Chen',
    bio: 'UI/UX designer exploring AI-powered design tools'
  }
];

const sampleTools = [
  {
    name: "ChatGPT",
    logo: "🤖",
    description: "Advanced language model for conversation and text generation",
    longDescription: "ChatGPT is a powerful AI language model developed by OpenAI that can engage in human-like conversations, answer questions, write content, and assist with various tasks. It's trained on a diverse range of internet text and can understand context, generate creative content, and provide helpful responses across multiple domains.",
    category: "Language",
    website: "https://chat.openai.com",
    github: null,
    pricing: [
      { plan: "free", price: "Free", description: "Basic access with GPT-3.5" },
      { plan: "plus", price: "$20/month", description: "GPT-4 access with priority" },
      { plan: "enterprise", price: "Custom", description: "Custom pricing for businesses" }
    ],
    features: [
      "Natural language conversations",
      "Code generation and debugging",
      "Content creation and editing",
      "Translation and language learning",
      "Problem solving and analysis",
      "Creative writing assistance",
      "API access for developers",
      "Multi-language support"
    ],
    pros: [
      "Exceptional conversational abilities",
      "Wide range of use cases",
      "Regular model updates",
      "Strong community support"
    ],
    cons: [
      "Limited free tier features",
      "Occasional factual inaccuracies",
      "Requires internet connection",
      "Content moderation limitations"
    ],
    tags: ["AI", "Language", "Conversation", "OpenAI"],
    screenshots: [
      "https://via.placeholder.com/800x450/2563eb/ffffff?text=ChatGPT+Screenshot+1",
      "https://via.placeholder.com/800x450/2563eb/ffffff?text=ChatGPT+Screenshot+2",
      "https://via.placeholder.com/800x450/2563eb/ffffff?text=ChatGPT+Screenshot+3"
    ],
    videoUrl: "https://www.youtube.com/embed/example1",
    weeklyUsers: 15420,
    growth: "+45%",
    isActive: true
  },
  {
    name: "Midjourney",
    logo: "🎨",
    description: "AI-powered image generation from text descriptions",
    longDescription: "Midjourney is a cutting-edge AI art generation platform that creates stunning, high-quality images from text prompts. It's particularly known for its artistic style and ability to generate beautiful, detailed artwork. Users can create everything from photorealistic images to fantastical artwork with simple text descriptions.",
    category: "Design",
    website: "https://midjourney.com",
    github: null,
    pricing: [
      { plan: "basic", price: "$10/month", description: "200 images per month" },
      { plan: "standard", price: "$30/month", description: "Unlimited images" },
      { plan: "pro", price: "$60/month", description: "Priority access and features" }
    ],
    features: [
      "Text-to-image generation",
      "High-resolution output",
      "Multiple art styles",
      "Discord integration",
      "Community features",
      "Commercial usage rights",
      "Style customization",
      "Batch processing"
    ],
    pros: [
      "Exceptional artistic quality",
      "Unique artistic style",
      "Active community",
      "Regular updates"
    ],
    cons: [
      "Discord-only interface",
      "Limited free trial",
      "Queue times during peak hours",
      "Learning curve for prompts"
    ],
    tags: ["AI", "Design", "Image Generation", "Art"],
    screenshots: [
      "https://via.placeholder.com/800x450/8b5cf6/ffffff?text=Midjourney+Screenshot+1",
      "https://via.placeholder.com/800x450/8b5cf6/ffffff?text=Midjourney+Screenshot+2",
      "https://via.placeholder.com/800x450/8b5cf6/ffffff?text=Midjourney+Screenshot+3"
    ],
    videoUrl: "https://www.youtube.com/embed/example2",
    weeklyUsers: 12850,
    growth: "+32%",
    isActive: true
  },
  {
    name: "GitHub Copilot",
    logo: "💻",
    description: "AI pair programmer that helps write code faster",
    longDescription: "GitHub Copilot is an AI-powered code completion tool that acts as your programming partner. It suggests whole lines or blocks of code as you type, helping you write code faster and with fewer errors. It's trained on billions of lines of public code and can work with most programming languages.",
    category: "Development",
    website: "https://github.com/features/copilot",
    github: "https://github.com/github/copilot",
    pricing: [
      { plan: "individual", price: "$10/month", description: "Personal use" },
      { plan: "business", price: "$19/month", description: "Business features" },
      { plan: "education", price: "Free", description: "Free for students" }
    ],
    features: [
      "Real-time code suggestions",
      "Multi-language support",
      "IDE integration",
      "GitHub integration",
      "Code explanation",
      "Test generation",
      "Documentation help",
      "Security scanning"
    ],
    pros: [
      "Significantly speeds up coding",
      "Excellent IDE integration",
      "Supports many languages",
      "Learns from your style"
    ],
    cons: [
      "Can suggest incorrect code",
      "Requires internet connection",
      "Privacy concerns",
      "Learning curve"
    ],
    tags: ["AI", "Development", "Code", "GitHub"],
    screenshots: [
      "https://via.placeholder.com/800x450/059669/ffffff?text=GitHub+Copilot+Screenshot+1",
      "https://via.placeholder.com/800x450/059669/ffffff?text=GitHub+Copilot+Screenshot+2",
      "https://via.placeholder.com/800x450/059669/ffffff?text=GitHub+Copilot+Screenshot+3"
    ],
    videoUrl: "https://www.youtube.com/embed/example3",
    weeklyUsers: 8920,
    growth: "+67%",
    isActive: true
  },
  {
    name: "Notion AI",
    logo: "📝",
    description: "Writing assistant integrated into Notion workspace",
    longDescription: "Notion AI brings powerful AI capabilities directly into your Notion workspace. It can help you write, edit, brainstorm, and organize content with natural language commands. Perfect for teams and individuals who want to enhance their productivity within Notion.",
    category: "Productivity",
    website: "https://notion.so",
    github: null,
    pricing: [
      { plan: "free", price: "Free", description: "Basic AI features" },
      { plan: "pro", price: "$8/month", description: "Unlimited AI usage" },
      { plan: "enterprise", price: "Custom", description: "Team and enterprise features" }
    ],
    features: [
      "Writing assistance",
      "Content generation",
      "Translation",
      "Summarization",
      "Brainstorming",
      "Task automation",
      "Template creation",
      "Knowledge base building"
    ],
    pros: [
      "Seamless Notion integration",
      "Powerful writing tools",
      "Team collaboration",
      "Knowledge management"
    ],
    cons: [
      "Requires Notion subscription",
      "Limited standalone features",
      "Learning curve",
      "Internet dependency"
    ],
    tags: ["AI", "Productivity", "Writing", "Notion"],
    screenshots: [
      "https://via.placeholder.com/800x450/000000/ffffff?text=Notion+AI+Screenshot+1",
      "https://via.placeholder.com/800x450/000000/ffffff?text=Notion+AI+Screenshot+2",
      "https://via.placeholder.com/800x450/000000/ffffff?text=Notion+AI+Screenshot+3"
    ],
    videoUrl: "https://www.youtube.com/embed/example4",
    weeklyUsers: 11230,
    growth: "+28%",
    isActive: true
  },
  {
    name: "Jasper",
    logo: "✍️",
    description: "AI content creation platform for marketing and writing",
    longDescription: "Jasper is a comprehensive AI content creation platform designed for marketers, writers, and businesses. It helps create high-quality content including blog posts, social media content, marketing copy, and more. Jasper uses advanced AI models to generate human-like content that resonates with your audience.",
    category: "Marketing",
    website: "https://jasper.ai",
    github: null,
    pricing: [
      { plan: "starter", price: "$39/month", description: "20,000 words per month" },
      { plan: "pro", price: "$99/month", description: "Unlimited words" },
      { plan: "business", price: "Custom", description: "Team and enterprise features" }
    ],
    features: [
      "Content generation",
      "Marketing copy",
      "Blog writing",
      "Social media posts",
      "Email campaigns",
      "SEO optimization",
      "Brand voice training",
      "Collaboration tools"
    ],
    pros: [
      "High-quality content output",
      "Marketing-focused features",
      "Brand voice consistency",
      "Team collaboration"
    ],
    cons: [
      "Expensive for individuals",
      "Requires content review",
      "Learning curve",
      "Limited free trial"
    ],
    tags: ["AI", "Marketing", "Content", "Writing"],
    screenshots: [
      "https://via.placeholder.com/800x450/3b82f6/ffffff?text=Jasper+Screenshot+1",
      "https://via.placeholder.com/800x450/3b82f6/ffffff?text=Jasper+Screenshot+2",
      "https://via.placeholder.com/800x450/3b82f6/ffffff?text=Jasper+Screenshot+3"
    ],
    videoUrl: "https://www.youtube.com/embed/example5",
    weeklyUsers: 8750,
    growth: "+41%",
    isActive: true
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vaultxaitools', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Seed function
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await Tool.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');
    
    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }
    
    // Create tools with reviews
    for (const toolData of sampleTools) {
      const tool = new Tool(toolData);
      
      // Add sample reviews
      const sampleReviews = [
        {
          user: createdUsers[1]._id, // Sarah
          rating: 5,
          comment: "This tool has completely transformed my workflow. Highly recommended!",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
          user: createdUsers[2]._id, // Mike
          rating: 4,
          comment: "Great tool with excellent features. Takes some time to learn but worth it.",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
      ];
      
      tool.reviews = sampleReviews;
      await tool.save();
      console.log(`Created tool: ${tool.name}`);
    }
    
    console.log('Database seeding completed successfully!');
    console.log(`Created ${createdUsers.length} users and ${sampleTools.length} tools`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase(); 