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

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function debugTable() {
  console.log('🔍 Debugging ai_news table...');
  
  try {
    // Test 1: Simple select all
    console.log('\n📊 Test 1: Simple select all...');
    const { data: allData, error: allError } = await supabase
      .from('ai_news')
      .select('*');

    if (allError) {
      console.error('❌ All data error:', allError);
    } else {
      console.log(`✅ Found ${allData.length} total items`);
    }

    // Test 2: Select with limit
    console.log('\n📊 Test 2: Select with limit...');
    const { data: limitData, error: limitError } = await supabase
      .from('ai_news')
      .select('*')
      .limit(5);

    if (limitError) {
      console.error('❌ Limit data error:', limitError);
    } else {
      console.log(`✅ Found ${limitData.length} items with limit`);
      if (limitData.length > 0) {
        console.log('📋 First item:', limitData[0].title);
      }
    }

    // Test 3: Count query
    console.log('\n📊 Test 3: Count query...');
    const { count, error: countError } = await supabase
      .from('ai_news')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count error:', countError);
    } else {
      console.log(`✅ Count: ${count} items`);
    }

    // Test 4: Check specific columns
    console.log('\n📊 Test 4: Check specific columns...');
    const { data: colData, error: colError } = await supabase
      .from('ai_news')
      .select('id, title, source')
      .limit(3);

    if (colError) {
      console.error('❌ Column select error:', colError);
    } else {
      console.log(`✅ Column select: ${colData.length} items`);
      if (colData.length > 0) {
        console.log('📋 Sample:', colData[0]);
      }
    }

    // Test 5: Try to insert a test record and immediately fetch it
    console.log('\n📊 Test 5: Insert and fetch test record...');
    const testRecord = {
      id: 'debug-test-' + Date.now(),
      title: 'Debug Test Article',
      content: 'This is a debug test.',
      url: 'https://example.com',
      source: 'Debug',
      author: 'Debug Author',
      published_at: new Date().toISOString(),
      category: 'General AI',
      sentiment: 'neutral',
      topics: ['Debug'],
      read_time: 1,
      engagement: 0
    };

    const { data: insertData, error: insertError } = await supabase
      .from('ai_news')
      .insert(testRecord)
      .select();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
    } else {
      console.log('✅ Insert successful:', insertData[0].title);
      
      // Immediately try to fetch it
      const { data: fetchData, error: fetchError } = await supabase
        .from('ai_news')
        .select('*')
        .eq('id', testRecord.id);

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError);
      } else {
        console.log(`✅ Fetch successful: ${fetchData.length} items`);
      }

      // Clean up
      await supabase
        .from('ai_news')
        .delete()
        .eq('id', testRecord.id);
    }

  } catch (error) {
    console.error('💥 Debug failed:', error);
  }
}

// CLI interface
if (require.main === module) {
  debugTable()
    .then(() => {
      console.log('\n🎉 Debug completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Debug failed:', error);
      process.exit(1);
    });
}

module.exports = { debugTable }; 