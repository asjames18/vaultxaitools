#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuration - using the same keys as the frontend
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
};

// Check required environment variables
if (!config.supabaseUrl || !config.supabaseAnonKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('Please check your .env.local file');
  process.exit(1);
}

// Initialize Supabase client (same as frontend)
const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

async function testFrontendNewsFetch() {
  console.log('🧪 Testing Frontend News Fetch...');
  console.log('🔗 Using:', config.supabaseUrl);
  
  try {
    // Test 1: Basic query (same as frontend)
    console.log('📰 Fetching news with frontend client...');
    const { data, error } = await supabase
      .from('ai_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Frontend fetch error:', error);
      return;
    }

    console.log(`✅ Successfully fetched ${data.length} news items:`);
    data.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.title} (${item.source})`);
    });

    // Test 2: Check if data has the right structure
    if (data.length > 0) {
      const sample = data[0];
      console.log('\n📋 Sample data structure:');
      console.log('  - id:', sample.id);
      console.log('  - title:', sample.title);
      console.log('  - source:', sample.source);
      console.log('  - category:', sample.category);
      console.log('  - sentiment:', sample.sentiment);
      console.log('  - published_at:', sample.published_at);
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// CLI interface
if (require.main === module) {
  testFrontendNewsFetch()
    .then(() => {
      console.log('🎉 Frontend news test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Frontend news test failed:', error);
      process.exit(1);
    });
}

module.exports = { testFrontendNewsFetch }; 