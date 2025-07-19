const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const categories = [
  {
    name: "Language",
    icon: "💬",
    description: "AI tools for text generation, translation, and language processing",
    count: 45,
    color: "from-blue-500 to-cyan-500",
    popular_tools: ["ChatGPT", "Claude", "Bard", "Perplexity"]
  },
  {
    name: "Design",
    icon: "🎨",
    description: "AI-powered design tools for graphics, UI/UX, and creative work",
    count: 38,
    color: "from-purple-500 to-pink-500",
    popular_tools: ["Midjourney", "DALL-E", "Stable Diffusion", "Canva AI"]
  },
  {
    name: "Development",
    icon: "💻",
    description: "AI tools for coding, debugging, and software development",
    count: 52,
    color: "from-green-500 to-emerald-500",
    popular_tools: ["GitHub Copilot", "Cursor", "Tabnine", "CodeWhisperer"]
  },
  {
    name: "Productivity",
    icon: "⚡",
    description: "AI assistants and tools to boost your productivity",
    count: 29,
    color: "from-yellow-500 to-orange-500",
    popular_tools: ["Notion AI", "Grammarly", "Otter.ai", "Fireflies"]
  },
  {
    name: "Marketing",
    icon: "📈",
    description: "AI tools for marketing, advertising, and business growth",
    count: 31,
    color: "from-red-500 to-rose-500",
    popular_tools: ["Jasper", "Copy.ai", "Surfer SEO", "Phrasee"]
  },
  {
    name: "Writing",
    icon: "✍️",
    description: "AI writing assistants and content creation tools",
    count: 27,
    color: "from-indigo-500 to-blue-500",
    popular_tools: ["Grammarly", "Hemingway", "ProWritingAid", "Wordtune"]
  },
  {
    name: "Video",
    icon: "🎬",
    description: "AI tools for video creation, editing, and generation",
    count: 23,
    color: "from-pink-500 to-purple-500",
    popular_tools: ["Runway", "Synthesia", "Lumen5", "Pictory"]
  },
  {
    name: "Audio",
    icon: "🎵",
    description: "AI tools for audio processing, music generation, and voice synthesis",
    count: 19,
    color: "from-teal-500 to-cyan-500",
    popular_tools: ["Mubert", "Amper Music", "Descript", "Synthesia"]
  },
  {
    name: "Data",
    icon: "📊",
    description: "AI tools for data analysis, visualization, and insights",
    count: 34,
    color: "from-gray-500 to-slate-500",
    popular_tools: ["Tableau", "Power BI", "Looker", "Metabase"]
  }
];

async function seedCategories() {
  console.log('Starting to seed categories...');
  
  try {
    // First, let's see what categories already exist
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('name');
    
    if (fetchError) {
      console.error('Error fetching existing categories:', fetchError);
      return;
    }
    
    console.log(`Found ${existingCategories.length} existing categories:`, existingCategories.map(c => c.name));
    
    // Filter out categories that already exist
    const existingNames = existingCategories.map(c => c.name);
    const newCategories = categories.filter(cat => !existingNames.includes(cat.name));
    
    if (newCategories.length === 0) {
      console.log('All categories already exist in the database!');
      return;
    }
    
    console.log(`Adding ${newCategories.length} new categories:`, newCategories.map(c => c.name));
    
    // Insert new categories
    const { data: insertedCategories, error: insertError } = await supabase
      .from('categories')
      .insert(newCategories)
      .select();
    
    if (insertError) {
      console.error('Error inserting categories:', insertError);
      return;
    }
    
    console.log(`Successfully added ${insertedCategories.length} categories!`);
    console.log('New categories:', insertedCategories.map(c => c.name));
    
    // Verify total count
    const { data: allCategories, error: verifyError } = await supabase
      .from('categories')
      .select('*');
    
    if (verifyError) {
      console.error('Error verifying categories:', verifyError);
      return;
    }
    
    console.log(`Total categories in database: ${allCategories.length}`);
    console.log('All categories:', allCategories.map(c => c.name));
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the seed function
seedCategories()
  .then(() => {
    console.log('Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  }); 