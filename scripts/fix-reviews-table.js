#!/usr/bin/env node

// Fix the reviews table foreign key constraint issue
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function analyzeReviewsTable() {
  console.log('🔍 Analyzing reviews table structure...');
  
  try {
    // Get a sample of the reviews table to see current data
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log('❌ Error reading reviews table:', error.message);
      return;
    }
    
    console.log('📊 Current reviews table data:');
    if (reviews && reviews.length > 0) {
      console.log('Sample record:', reviews[0]);
      console.log('tool_id examples:', reviews.map(r => r.tool_id).slice(0, 3));
    } else {
      console.log('Table is empty');
    }
  } catch (error) {
    console.log('❌ Error analyzing reviews table:', error.message);
  }
}

async function checkToolsTable() {
  console.log('\n🔍 Checking tools table...');
  
  try {
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name')
      .limit(5);
    
    if (error) {
      console.log('❌ Error reading tools table:', error.message);
      console.log('This might be why we have a foreign key constraint issue');
      return null;
    }
    
    console.log('📊 Tools table structure:');
    if (tools && tools.length > 0) {
      console.log('Sample tool:', tools[0]);
      console.log('ID type appears to be:', typeof tools[0].id === 'string' ? 'UUID/TEXT' : 'other');
    }
    
    return tools;
  } catch (error) {
    console.log('❌ Error checking tools table:', error.message);
    return null;
  }
}

async function generateSQLFixes() {
  console.log('\n📝 SQL commands to fix the reviews table:');
  
  console.log(`
-- OPTION 1: Remove the foreign key constraint and change tool_id to TEXT
-- Step 1: Drop the foreign key constraint
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_tool_id_fkey;

-- Step 2: Change tool_id column to TEXT
ALTER TABLE reviews ALTER COLUMN tool_id TYPE TEXT;

-- Step 3: Update any existing UUID tool_ids to meaningful names (if needed)
-- UPDATE reviews SET tool_id = 'chatgpt' WHERE tool_id = 'some-uuid-here';

-- OPTION 2: Keep foreign key but fix the data structure
-- This would require ensuring all tool_ids match actual UUIDs in the tools table
-- (More complex, probably not needed for your use case)

-- OPTION 3: Create a simpler reviews table without foreign key
DROP TABLE IF EXISTS reviews_backup;
CREATE TABLE reviews_backup AS SELECT * FROM reviews;

DROP TABLE reviews;

CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT, -- Keep for backward compatibility
    tool_id TEXT NOT NULL, -- Simple text, no foreign key
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    helpful INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Copy data back (if any existed)
-- INSERT INTO reviews SELECT * FROM reviews_backup;
-- DROP TABLE reviews_backup;
`);
}

async function testSimpleReview() {
  console.log('\n🧪 Testing if we can create a simple review...');
  
  try {
    // Try to insert a simple review to see what happens
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_name: 'test_user',
        tool_id: 'chatgpt', // This is what's causing the UUID error
        rating: 5,
        comment: 'Test review'
      })
      .select();
    
    if (error) {
      console.log('❌ Expected error:', error.message);
      console.log('💡 This confirms the foreign key constraint issue');
    } else {
      console.log('✅ Review created successfully:', data);
    }
  } catch (error) {
    console.log('❌ Exception during review test:', error.message);
  }
}

async function main() {
  console.log('🔧 REVIEWS TABLE FOREIGN KEY CONSTRAINT ANALYSIS');
  console.log('================================================');
  
  await analyzeReviewsTable();
  await checkToolsTable();
  await testSimpleReview();
  await generateSQLFixes();
  
  console.log('\n💡 RECOMMENDATION:');
  console.log('Use OPTION 1 from the SQL above:');
  console.log('1. Drop the foreign key constraint');
  console.log('2. Change tool_id to TEXT type');
  console.log('3. This will allow reviews with tool names like "chatgpt", "claude", etc.');
  console.log('');
  console.log('This is the simplest fix that maintains functionality while');
  console.log('allowing users to review tools by their common names.');
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables');
} else {
  main().catch(console.error);
}
