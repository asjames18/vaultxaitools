require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Demo media data for top tools
const demoMediaData = {
  "ChatGPT": {
    demo_images: [
      {
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        alt: "ChatGPT interface showing conversation with AI",
        description: "ChatGPT's clean, conversational interface",
        type: "interface"
      },
      {
        url: "https://images.unsplash.com/photo-1673187730327-4d8e2e287c1c?w=800&h=600&fit=crop", 
        alt: "ChatGPT being used for code generation",
        description: "AI-powered code generation in action",
        type: "feature"
      }
    ],
    demo_videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop",
        title: "ChatGPT Tutorial: Getting Started",
        description: "Learn how to use ChatGPT effectively",
        duration: "5:30",
        type: "tutorial"
      }
    ],
    demo_gallery: [
      {
        url: "https://images.unsplash.com/photo-1673187730327-4d8e2e287c1c?w=600&h=400&fit=crop",
        alt: "ChatGPT writing assistance",
        description: "AI writing help and content creation",
        type: "screenshot"
      }
    ]
  },
  "Midjourney": {
    demo_images: [
      {
        url: "https://images.unsplash.com/photo-1686191128892-3b8c7d1b5c8f?w=800&h=600&fit=crop",
        alt: "Stunning AI-generated artwork by Midjourney",
        description: "High-quality artistic image generation",
        type: "artwork"
      },
      {
        url: "https://images.unsplash.com/photo-1686191128892-3b8c7d1b5c8f?w=800&h=600&fit=crop",
        alt: "Midjourney Discord interface",
        description: "Discord-based AI art creation",
        type: "interface"
      }
    ],
    demo_videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1686191128892-3b8c7d1b5c8f?w=400&h=225&fit=crop",
        title: "Midjourney Art Creation Process",
        description: "See how AI art is created step by step",
        duration: "8:45",
        type: "process"
      }
    ],
    demo_gallery: [
      {
        url: "https://images.unsplash.com/photo-1686191128892-3b8c7d1b5c8f?w=600&h=400&fit=crop",
        alt: "Before and after image refinement",
        description: "Image refinement and iteration process",
        type: "comparison"
      }
    ]
  },
  "GitHub Copilot": {
    demo_images: [
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d9bad734?w=800&h=600&fit=crop",
        alt: "GitHub Copilot code suggestions in VS Code",
        description: "AI code completion in action",
        type: "interface"
      },
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d9bad734?w=800&h=600&fit=crop",
        alt: "Copilot explaining code",
        description: "AI-powered code explanation",
        type: "feature"
      }
    ],
    demo_videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d9bad734?w=400&h=225&fit=crop",
        title: "GitHub Copilot: AI Pair Programming",
        description: "See how Copilot enhances your coding workflow",
        duration: "6:15",
        type: "workflow"
      }
    ],
    demo_gallery: [
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d9bad734?w=600&h=400&fit=crop",
        alt: "Multiple language support",
        description: "Support for Python, JavaScript, TypeScript, and more",
        type: "screenshot"
      }
    ]
  },
  "Notion AI": {
    demo_images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        alt: "Notion AI workspace with AI writing assistance",
        description: "AI-powered workspace and writing tools",
        type: "interface"
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        alt: "AI content generation in Notion",
        description: "Generate content, ideas, and workflows",
        type: "feature"
      }
    ],
    demo_videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
        title: "Notion AI: Transform Your Workspace",
        description: "Learn how to use AI to enhance your Notion experience",
        duration: "7:20",
        type: "tutorial"
      }
    ],
    demo_gallery: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        alt: "Team collaboration features",
        description: "AI-enhanced team collaboration and project management",
        type: "screenshot"
      }
    ]
  },
  "Grammarly": {
    demo_images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        alt: "Grammarly browser extension in action",
        description: "Real-time writing assistance across the web",
        type: "interface"
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        alt: "Grammar and style suggestions",
        description: "AI-powered writing improvement suggestions",
        type: "feature"
      }
    ],
    demo_videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
        title: "Grammarly: Write with Confidence",
        description: "Master Grammarly's AI writing assistance",
        duration: "4:45",
        type: "tutorial"
      }
    ],
    demo_gallery: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        alt: "Multi-platform integration",
        description: "Works on web, desktop, and mobile devices",
        type: "screenshot"
      }
    ]
  },
  "Jasper": {
    demo_images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        alt: "Jasper AI content creation dashboard",
        description: "AI-powered marketing content creation",
        type: "interface"
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        alt: "Content templates and brand voice",
        description: "Professional marketing templates and customization",
        type: "feature"
      }
    ],
    demo_videos: [
      {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
        title: "Jasper: AI Content Creation Masterclass",
        description: "Create professional marketing content with AI",
        duration: "9:30",
        type: "masterclass"
      }
    ],
    demo_gallery: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        alt: "Content variety and formats",
        description: "Blog posts, social media, ads, and more",
        type: "screenshot"
      }
    ]
  }
};

async function seedDemoMedia() {
  console.log('🎬 Starting demo media seeding process...');
  console.log(`📊 Tools to update with demo media: ${Object.keys(demoMediaData).length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [toolName, mediaData] of Object.entries(demoMediaData)) {
    try {
      // Find the tool by name
      const { data: tool, error: findError } = await supabase
        .from('tools')
        .select('id, name')
        .eq('name', toolName)
        .single();
      
      if (findError || !tool) {
        console.log(`⚠️  Tool not found: ${toolName}`);
        continue;
      }
      
      // Update the tool with demo media
      const { error: updateError } = await supabase
        .from('tools')
        .update({
          demo_images: mediaData.demo_images,
          demo_videos: mediaData.demo_videos,
          demo_gallery: mediaData.demo_gallery,
          updated_at: new Date().toISOString()
        })
        .eq('id', tool.id);
      
      if (updateError) throw updateError;
      
      console.log(`✅ Added demo media to ${toolName}`);
      successCount++;
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error updating ${toolName}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n🎉 Demo media seeding completed!');
  console.log(`✅ Successfully updated: ${successCount} tools`);
  console.log(`❌ Errors: ${errorCount} tools`);
  
  // Verify the updates
  try {
    const { data: updatedTools } = await supabase
      .from('tools')
      .select('name, demo_images, demo_videos, demo_gallery')
      .not('demo_images', 'eq', '[]')
      .order('name');
    
    console.log(`\n🔍 Tools with demo media: ${updatedTools?.length || 0}`);
    if (updatedTools && updatedTools.length > 0) {
      updatedTools.forEach(tool => {
        const imageCount = tool.demo_images?.length || 0;
        const videoCount = tool.demo_videos?.length || 0;
        const galleryCount = tool.demo_gallery?.length || 0;
        console.log(`  - ${tool.name}: ${imageCount} images, ${videoCount} videos, ${galleryCount} gallery items`);
      });
    }
  } catch (error) {
    console.error('❌ Error verifying updates:', error.message);
  }
}

// Run the demo media seeding
seedDemoMedia().catch(console.error);
