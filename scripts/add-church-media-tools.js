require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Church/Media tools to add
const toolsToAdd = [
  {
    name: 'ProPresenter',
    logo: '🎥',
    description: 'Industry standard for church presentation software. Handles lyrics, videos, and sermon slides seamlessly across multiple screens with broadcast-level quality.',
    long_description: 'ProPresenter is the industry standard for church presentation software. It handles lyrics, videos, and sermon slides seamlessly across multiple screens with broadcast-level quality. Features multi-screen output, integrated Bible library, livestream overlays, cloud syncing, and cue automation for smooth transitions.',
    category: 'Live Streaming',
    rating: 4.8,
    review_count: 0,
    weekly_users: 200000,
    growth: '+15%',
    website: 'https://renewedvision.com/propresenter/',
    pricing: 'Paid (Free Trial)',
    features: [
      'Multi-screen output & stage display',
      'Integrated Bible library',
      'Livestream overlays (lower-thirds, camera feed)',
      'Cloud syncing & remote control app',
      'Cue automation for smooth transitions'
    ],
    pros: [
      'Professional-grade visuals and performance',
      'Perfect for large and multi-site churches',
      'Excellent Bible and video integration',
      'Stable for long services or live events',
      'Integrates with MIDI, OBS, and Resi'
    ],
    cons: [
      'Expensive for small churches',
      'Requires training and tech-savvy users',
      'Mac version slightly better than Windows',
      'Occasional licensing complexity'
    ],
    tags: ['Worship', 'Presentation', 'Livestream', 'Church Media']
  },
  {
    name: 'Canva for Churches',
    logo: '🎨',
    description: 'Drag-and-drop design tools with thousands of church-ready templates for social media, announcements, sermon slides, and event flyers.',
    long_description: 'Canva provides drag-and-drop tools with thousands of church-ready templates for social media, announcements, sermon slides, and event flyers. Features a huge library of templates, built-in animation and video tools, team collaboration, and brand kits for consistent visuals.',
    category: 'Graphics Design',
    rating: 4.9,
    review_count: 0,
    weekly_users: 1000000,
    growth: '+25%',
    website: 'https://www.canva.com/',
    pricing: 'Freemium',
    features: [
      'Huge library of templates',
      'Built-in animation and video tools',
      'Team collaboration',
      'Brand kits for consistent visuals'
    ],
    pros: [
      'Incredibly beginner-friendly',
      'Great for both print and digital content',
      'Cloud storage and real-time collaboration',
      'Constantly updated with new templates',
      'Integrates with Meta, TikTok, and YouTube'
    ],
    cons: [
      'Limited control over typography in free plan',
      'Overused templates can make designs feel generic',
      'Lacks deep video editing tools',
      'File export quality can drop on free plan'
    ],
    tags: ['Design', 'Media', 'Templates', 'Social']
  },
  {
    name: 'Tithely Media',
    logo: '📱',
    description: 'Unlimited access to Christian design resources — graphics, videos, and templates — all under one faith-based platform.',
    long_description: 'Tithely Media gives churches unlimited access to Christian design resources — graphics, videos, and templates — all under one faith-based platform. Features 60,000+ pre-made graphics, sermon series & seasonal collections, video backgrounds, and editable Canva templates.',
    category: 'Graphics Design',
    rating: 4.6,
    review_count: 0,
    weekly_users: 150000,
    growth: '+20%',
    website: 'https://get.tithely.com/media',
    pricing: 'Freemium',
    features: [
      '60,000+ pre-made graphics',
      'Sermon series & seasonal collections',
      'Video backgrounds',
      'Editable Canva templates'
    ],
    pros: [
      'Faith-specific content saves time',
      'Seamless integration with Tithely tools',
      'Easy to find seasonal and sermon visuals',
      'Strong faith-based aesthetic'
    ],
    cons: [
      'Limited customization within the platform',
      'Small churches may not use all features',
      'Requires Canva for full edits',
      'Interface can feel dated'
    ],
    tags: ['Church', 'Templates', 'Ministry', 'Design']
  },
  {
    name: 'Resi',
    logo: '📡',
    description: 'Rock-solid livestreaming for churches, designed to eliminate buffering and dropouts — perfect for multi-site streaming and online services.',
    long_description: 'Resi (formerly Living As One) provides rock-solid livestreaming for churches, designed to eliminate buffering and dropouts — perfect for multi-site streaming and online services. Features reliable Resilient Streaming Protocol (RSP), multi-site distribution, cloud automation, and real-time analytics.',
    category: 'Live Streaming',
    rating: 4.7,
    review_count: 0,
    weekly_users: 50000,
    growth: '+18%',
    website: 'https://resi.io/',
    pricing: 'Paid',
    features: [
      'Reliable Resilient Streaming Protocol (RSP)',
      'Multi-site distribution',
      'Cloud automation',
      'Real-time analytics'
    ],
    pros: [
      'Unmatched streaming reliability',
      'Professional broadcast quality',
      'Integrates with ProPresenter & BoxCast',
      'Great for large or multi-campus ministries'
    ],
    cons: [
      'Pricey for small churches',
      'Requires tech setup and bandwidth',
      'Subscription model only',
      'No built-in design features'
    ],
    tags: ['Livestream', 'Video', 'Broadcasting', 'Church']
  },
  {
    name: 'Church Motion Graphics',
    logo: '🕊️',
    description: 'Beautiful motion backgrounds, sermon visuals, and lower-thirds designed for worship environments.',
    long_description: 'Church Motion Graphics (CMG) delivers beautiful motion backgrounds, sermon visuals, and lower-thirds designed for worship environments. Features monthly motion packs, animated titles and countdowns, theme-based seasonal designs, and still graphics + social packs.',
    category: 'Graphics Design',
    rating: 4.8,
    review_count: 0,
    weekly_users: 120000,
    growth: '+12%',
    website: 'https://www.churchmotiongraphics.com/',
    pricing: 'Subscription',
    features: [
      'Monthly motion packs',
      'Animated titles and countdowns',
      'Theme-based seasonal designs',
      'Still graphics + social packs'
    ],
    pros: [
      'Visually stunning content',
      'Integrates with most presentation software',
      'Regularly updated library',
      'Easy download and use workflow'
    ],
    cons: [
      'Subscription needed for full access',
      'Limited customization',
      'No direct text editing',
      'Niche for visual elements only'
    ],
    tags: ['Motion', 'Worship', 'Visuals', 'Graphics']
  },
  {
    name: 'Planning Center',
    logo: '🎧',
    description: 'Organizes worship sets, volunteers, and service flow — the go-to coordination tool for worship and production teams.',
    long_description: 'Planning Center helps organize worship sets, volunteers, and service flow — the go-to coordination tool for worship and production teams. Features service planning and scheduling, song library management, volunteer coordination, and communication and reminders.',
    category: 'Project Management',
    rating: 4.9,
    review_count: 0,
    weekly_users: 500000,
    growth: '+22%',
    website: 'https://www.planningcenter.com/',
    pricing: 'Freemium',
    features: [
      'Service planning and scheduling',
      'Song library management',
      'Volunteer coordination',
      'Communication and reminders'
    ],
    pros: [
      'Simplifies complex team coordination',
      'Great integration with worship tools (CCLI, SongSelect)',
      'Excellent mobile app support',
      'Robust permissions and access control'
    ],
    cons: [
      'Slightly dated interface',
      'Complex for very small teams',
      'Premium features add up',
      'Limited visual design tools'
    ],
    tags: ['Worship', 'Team', 'Organization', 'Scheduling']
  },
  {
    name: 'Ecamm Live',
    logo: '🎥',
    description: 'Professional live-streaming software built for Mac, widely used by pastors and churches for online services and interviews.',
    long_description: 'Ecamm Live is professional live-streaming software built for Mac, widely used by pastors and churches for online services and interviews. Features multi-camera production, picture-in-picture overlays, live chat integration, and streaming to YouTube, Facebook, or custom RTMP.',
    category: 'Live Streaming',
    rating: 4.7,
    review_count: 0,
    weekly_users: 80000,
    growth: '+16%',
    website: 'https://www.ecamm.com/mac/ecammlive/',
    pricing: 'Paid',
    features: [
      'Multi-camera production',
      'Picture-in-picture overlays',
      'Live chat integration',
      'Stream to YouTube, Facebook, or custom RTMP'
    ],
    pros: [
      'Easy setup and pro-level control',
      'Built-in overlays and scenes',
      'Integrates with Zoom and StreamDeck',
      'Excellent for solo streamers or small teams'
    ],
    cons: [
      'Mac-only (no Windows support)',
      'Subscription-based',
      'Can be resource-heavy on older Macs',
      'Some advanced features hidden behind paywall'
    ],
    tags: ['Livestream', 'Production', 'Video', 'Broadcasting']
  },
  {
    name: 'Sunday Social',
    logo: '📊',
    description: 'Ready-to-post content for social media—graphics, quotes, scriptures, and videos—so your pages stay active and engaging.',
    long_description: 'Sunday Social gives churches ready-to-post content for social media—graphics, quotes, scriptures, and videos—so your pages stay active and engaging. Features new content drops weekly, Reels, stories, and square templates, Canva editing access, and post scheduling and download options.',
    category: 'Social Media',
    rating: 4.6,
    review_count: 0,
    weekly_users: 100000,
    growth: '+14%',
    website: 'https://sundaysocial.tv/',
    pricing: 'Subscription',
    features: [
      'New content drops weekly',
      'Reels, stories, and square templates',
      'Canva editing access',
      'Post scheduling and download options'
    ],
    pros: [
      'Saves hours of design time',
      'Consistent faith-based messaging',
      'Perfect for small media teams',
      'Works seamlessly with Canva'
    ],
    cons: [
      'Subscription required for full access',
      'Some designs feel repetitive',
      'No analytics tools',
      'Limited video customization'
    ],
    tags: ['Social Media', 'Templates', 'Church Content']
  }
];

async function addChurchMediaTools() {
  console.log('📦 Adding church/media tools to database...\n');
  
  let added = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const tool of toolsToAdd) {
    try {
      // Check if tool already exists
      const { data: existing } = await supabase
        .from('tools')
        .select('id, name')
        .eq('name', tool.name)
        .maybeSingle();
      
      if (existing) {
        console.log(`⏭️  Skipping ${tool.name} - already exists`);
        skipped++;
        continue;
      }
      
      // Insert the tool
      const { data, error } = await supabase
        .from('tools')
        .insert([{
          ...tool,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error adding ${tool.name}:`, error.message);
        errors++;
      } else {
        console.log(`✅ Added ${tool.name} (${tool.category})`);
        added++;
      }
    } catch (err) {
      console.error(`❌ Error processing ${tool.name}:`, err.message);
      errors++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`  ✅ Added: ${added}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📦 Total processed: ${toolsToAdd.length}`);
  
  if (added > 0) {
    console.log('\n🎉 Successfully added church/media tools!');
  }
}

// Run the script
addChurchMediaTools().catch(console.error);

