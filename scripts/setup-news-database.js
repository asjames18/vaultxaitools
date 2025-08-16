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

async function setupNewsDatabase() {
  console.log('🚀 Setting up AI News Database...');
  
  try {
    // Create AI News table by inserting a test record
    console.log('📋 Creating ai_news table...');
    
    // Try to insert a test record to create the table
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
      console.error('❌ Error creating ai_news table:', createError);
      throw createError;
    }
    
    // Clean up test record
    console.log('🧹 Cleaning up test record...');
    await supabase
      .from('ai_news')
      .delete()
      .eq('id', 'test-news-item');
    
    console.log('✅ AI News database setup completed successfully!');
    
    // Test the table
    console.log('🧪 Testing table access...');
    const { data, error: testError } = await supabase
      .from('ai_news')
      .select('count(*)')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error testing table:', testError);
    } else {
      console.log('✅ Table access test successful!');
    }
    
  } catch (error) {
    console.error('💥 Database setup failed:', error);
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  setupNewsDatabase()
    .then(() => {
      console.log('🎉 News database setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 News database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupNewsDatabase }; 