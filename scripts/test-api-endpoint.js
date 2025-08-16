#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

// Check required environment variables
if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client (same as API endpoint)
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function testAPIEndpoint() {
  console.log('🧪 Testing API Endpoint Logic...');
  
  try {
    // Test the exact same query as the API endpoint
    console.log('📰 Fetching news with service role...');
    const { data, error } = await supabase
      .from('ai_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ API endpoint error:', error);
      return;
    }

    console.log(`✅ API endpoint logic: ${data.length} items found`);
    
    if (data.length > 0) {
      console.log('📋 Sample items:');
      data.slice(0, 3).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.title} (${item.source})`);
      });
    } else {
      console.log('⚠️  No data found - checking if table exists...');
      
      // Try to check if table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('ai_news')
        .select('count(*)')
        .limit(1);
      
      if (tableError) {
        console.error('❌ Table check error:', tableError);
      } else {
        console.log('✅ Table exists but is empty');
      }
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// CLI interface
if (require.main === module) {
  testAPIEndpoint()
    .then(() => {
      console.log('🎉 API endpoint test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 API endpoint test failed:', error);
      process.exit(1);
    });
}

module.exports = { testAPIEndpoint }; 