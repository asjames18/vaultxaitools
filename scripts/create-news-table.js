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

async function createNewsTable() {
  console.log('🚀 Creating AI News Table...');
  
  try {
    // First, let's try to create the table by inserting a properly structured record
    console.log('📋 Creating table structure...');
    
    const testRecord = {
      id: 'test-news-item',
      title: 'Test AI News Article',
      content: 'This is a test article to create the table structure.',
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
    
    const { error: createError } = await supabase
      .from('ai_news')
      .insert(testRecord);
    
    if (createError) {
      console.error('❌ Error creating table:', createError);
      
      // If the table doesn't exist, we need to create it manually
      console.log('🔧 Table does not exist. You need to create it manually in Supabase:');
      console.log('');
      console.log('📋 SQL to create the table:');
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_news_category ON ai_news(category);
CREATE INDEX IF NOT EXISTS idx_ai_news_source ON ai_news(source);
CREATE INDEX IF NOT EXISTS idx_ai_news_published_at ON ai_news(published_at);
CREATE INDEX IF NOT EXISTS idx_ai_news_sentiment ON ai_news(sentiment);
CREATE INDEX IF NOT EXISTS idx_ai_news_engagement ON ai_news(engagement);

-- Enable RLS
ALTER TABLE ai_news ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON ai_news FOR SELECT USING (true);
CREATE POLICY "Admin insert access" ON ai_news FOR INSERT WITH CHECK (auth.role() = 'admin');
CREATE POLICY "Admin update access" ON ai_news FOR UPDATE USING (auth.role() = 'admin');
CREATE POLICY "Admin delete access" ON ai_news FOR DELETE USING (auth.role() = 'admin');
      `);
      console.log('');
      console.log('🔗 Go to your Supabase dashboard and run this SQL in the SQL Editor');
      console.log('📊 Then run the news automation again: npm run automation:news');
      return;
    }
    
    console.log('✅ Table created successfully!');
    
    // Clean up test record
    console.log('🧹 Cleaning up test record...');
    await supabase
      .from('ai_news')
      .delete()
      .eq('id', 'test-news-item');
    
    console.log('✅ Test record cleaned up!');
    
    // Test the table
    console.log('🧪 Testing table access...');
    const { data: testData, error: testError } = await supabase
      .from('ai_news')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Test error:', testError);
    } else {
      console.log('✅ Table access working!');
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// CLI interface
if (require.main === module) {
  createNewsTable()
    .then(() => {
      console.log('🎉 News table setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 News table setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createNewsTable }; 