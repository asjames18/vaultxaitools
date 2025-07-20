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

async function fixNewsRLS() {
  console.log('🔧 Fixing AI News RLS Policies...');
  
  try {
    // First, let's check if there's data in the table
    console.log('📊 Checking table data...');
    const { data: adminData, error: adminError } = await supabase
      .from('ai_news')
      .select('*')
      .limit(5);

    if (adminError) {
      console.error('❌ Admin access error:', adminError);
      return;
    }

    console.log(`✅ Admin can see ${adminData.length} items`);
    if (adminData.length > 0) {
      console.log('📋 Sample item:', adminData[0].title);
    }

    // Now let's test with anon key
    console.log('🌐 Testing anon access...');
    const { createClient: createAnonClient } = require('@supabase/supabase-js');
    const anonSupabase = createAnonClient(
      config.supabaseUrl, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: anonData, error: anonError } = await anonSupabase
      .from('ai_news')
      .select('*')
      .limit(5);

    if (anonError) {
      console.error('❌ Anon access error:', anonError);
    } else {
      console.log(`✅ Anon can see ${anonData.length} items`);
    }

    // If anon can't see data, we need to fix the RLS policies
    if (anonData.length === 0 && adminData.length > 0) {
      console.log('🔧 Fixing RLS policies...');
      console.log('');
      console.log('📋 Run this SQL in your Supabase SQL Editor:');
      console.log(`
-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON ai_news;
DROP POLICY IF EXISTS "Admin insert access" ON ai_news;
DROP POLICY IF EXISTS "Admin update access" ON ai_news;
DROP POLICY IF EXISTS "Admin delete access" ON ai_news;

-- Create new policies
CREATE POLICY "Public read access" ON ai_news FOR SELECT USING (true);
CREATE POLICY "Admin insert access" ON ai_news FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Admin update access" ON ai_news FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Admin delete access" ON ai_news FOR DELETE USING (auth.role() = 'service_role');

-- Alternative: Allow all operations for service role
CREATE POLICY "Service role full access" ON ai_news FOR ALL USING (auth.role() = 'service_role');
      `);
      console.log('');
      console.log('🔗 Go to your Supabase dashboard → SQL Editor and run the above SQL');
      console.log('📊 Then test again with: node scripts/test-frontend-news.js');
    } else if (anonData.length > 0) {
      console.log('✅ RLS policies are working correctly!');
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// CLI interface
if (require.main === module) {
  fixNewsRLS()
    .then(() => {
      console.log('🎉 RLS fix completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 RLS fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixNewsRLS }; 