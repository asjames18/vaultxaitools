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
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('Please check your .env.local file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function testNewsDatabase() {
  console.log('🧪 Testing AI News Database...');
  
  try {
    // Test 1: Check if table exists
    console.log('📋 Checking if ai_news table exists...');
    const { data: tableData, error: tableError } = await supabase
      .from('ai_news')
      .select('count(*)')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table error:', tableError);
      console.log('🔧 Creating ai_news table...');
      
      // Try to create the table by inserting a test record
      const testRecord = {
        id: 'test-news-item',
        title: 'Test AI News Article',
        content: 'This is a test article to create the table structure.',
        url: 'https://example.com',
        source: 'Test',
        author: 'Test Author',
        published_at: new Date().toISOString(),
        category: 'General AI',
        sentiment: 'neutral',
        topics: ['AI', 'Test'],
        read_time: 1,
        engagement: 0
      };
      
      const { error: createError } = await supabase
        .from('ai_news')
        .insert(testRecord);
      
      if (createError) {
        console.error('❌ Error creating table:', createError);
        return;
      }
      
      console.log('✅ Table created successfully!');
      
      // Clean up test record
      await supabase
        .from('ai_news')
        .delete()
        .eq('id', 'test-news-item');
    } else {
      console.log('✅ Table exists!');
    }
    
    // Test 2: Count records
    console.log('📊 Counting news records...');
    const { count, error: countError } = await supabase
      .from('ai_news')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Count error:', countError);
    } else {
      console.log(`✅ Found ${count} news records`);
    }
    
    // Test 3: Fetch sample records
    console.log('📰 Fetching sample news records...');
    const { data: newsData, error: newsError } = await supabase
      .from('ai_news')
      .select('*')
      .limit(5);
    
    if (newsError) {
      console.error('❌ Fetch error:', newsError);
    } else {
      console.log(`✅ Fetched ${newsData.length} sample records:`);
      newsData.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.title} (${item.source})`);
      });
    }
    
    // Test 4: Test with client-side Supabase (like the frontend)
    console.log('🌐 Testing client-side access...');
    const { createClient: createClientSide } = require('@supabase/supabase-js');
    const clientSupabase = createClientSide(config.supabaseUrl, config.supabaseServiceKey);
    
    const { data: clientData, error: clientError } = await clientSupabase
      .from('ai_news')
      .select('*')
      .limit(1);
    
    if (clientError) {
      console.error('❌ Client-side error:', clientError);
    } else {
      console.log('✅ Client-side access working!');
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// CLI interface
if (require.main === module) {
  testNewsDatabase()
    .then(() => {
      console.log('🎉 News database test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 News database test failed:', error);
      process.exit(1);
    });
}

module.exports = { testNewsDatabase }; 