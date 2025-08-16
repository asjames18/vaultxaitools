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

// Initialize Supabase client with service role (admin access)
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function testNewsInsert() {
  console.log('🧪 Testing AI News Insert...');
  
  try {
    // Test 1: Try to insert a simple record
    console.log('📝 Inserting test record...');
    const testRecord = {
      id: 'test-insert-' + Date.now(),
      title: 'Test AI News Article',
      content: 'This is a test article to verify the table structure.',
      url: 'https://example.com',
      source: 'Test',
      author: 'Test Author',
      published_at: new Date().toISOString(),
      image_url: null,
      category: 'General AI',
      sentiment: 'neutral',
      topics: ['AI', 'Test'],
      read_time: 1,
      engagement: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabase
      .from('ai_news')
      .insert(testRecord)
      .select();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      console.log('');
      console.log('🔧 The table might not exist or have wrong structure.');
      console.log('📋 Please run this SQL in Supabase SQL Editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS ai_news (
  id VARCHAR(100) PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT,
  source VARCHAR(50) NOT NULL,
  author VARCHAR(100),
  published_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  category VARCHAR(50) NOT NULL,
  sentiment VARCHAR(20) DEFAULT 'neutral',
  topics TEXT[],
  read_time INTEGER DEFAULT 1,
  engagement INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ai_news ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON ai_news FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON ai_news FOR ALL USING (auth.role() = 'service_role');
      `);
      return;
    }

    console.log('✅ Insert successful!');
    console.log('📋 Inserted record:', insertData[0]);

    // Test 2: Try to fetch the record
    console.log('📖 Fetching inserted record...');
    const { data: fetchData, error: fetchError } = await supabase
      .from('ai_news')
      .select('*')
      .eq('id', testRecord.id)
      .single();

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
    } else {
      console.log('✅ Fetch successful!');
      console.log('📋 Fetched record:', fetchData);
    }

    // Test 3: Clean up
    console.log('🧹 Cleaning up test record...');
    await supabase
      .from('ai_news')
      .delete()
      .eq('id', testRecord.id);

    console.log('✅ Cleanup successful!');

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// CLI interface
if (require.main === module) {
  testNewsInsert()
    .then(() => {
      console.log('🎉 News insert test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 News insert test failed:', error);
      process.exit(1);
    });
}

module.exports = { testNewsInsert }; 