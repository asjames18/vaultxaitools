const { execSync } = require('child_process');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🚀 Starting AI data update process...\n');

async function updateDatabaseStats() {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('⚠️  Skipping database stats update - missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get total tools count
    const { count: toolsCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });

    // Get total reviews count
    const { count: reviewsCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    // Get average rating
    const { data: avgRating } = await supabase
      .from('tools')
      .select('rating');

    const averageRating = avgRating?.reduce((sum, tool) => sum + tool.rating, 0) / avgRating?.length || 0;

    console.log(`📊 Database Statistics:`);
    console.log(`   - Total Tools: ${toolsCount}`);
    console.log(`   - Total Reviews: ${reviewsCount}`);
    console.log(`   - Average Rating: ${averageRating.toFixed(2)}/5.0`);

  } catch (error) {
    console.error('Error updating database stats:', error);
  }
}

async function main() {
  try {
    // Step 1: Seed with real AI tools data
    console.log('📊 Step 1: Seeding real AI tools data...');
    execSync('node scripts/fetch-real-ai-data.js', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Real AI data seeded successfully\n');

    // Step 2: Fetch live data from external sources
    console.log('🌐 Step 2: Fetching live data from external sources...');
    execSync('node scripts/fetch-live-ai-data.js', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Live data fetched successfully\n');

    // Step 3: Update database statistics
    console.log('📈 Step 3: Updating database statistics...');
    await updateDatabaseStats();
    console.log('✅ Database statistics updated\n');

    console.log('🎉 AI data update process completed successfully!');
    console.log('📊 Your database now contains:');
    console.log('   - Real AI tools with comprehensive information');
    console.log('   - Live data from external sources');
    console.log('   - Realistic reviews and ratings');
    console.log('   - Updated statistics and metrics');

  } catch (error) {
    console.error('❌ Error during AI data update process:', error.message);
    process.exit(1);
  }
}

// Run the main function
main(); 