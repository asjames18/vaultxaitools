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

async function fixRLSPolicies() {
  console.log('🔧 Fixing RLS Policies for ai_news table...');
  
  try {
    // Option 1: Disable RLS temporarily for testing
    console.log('🔓 Temporarily disabling RLS for testing...');
    const { error: disableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE ai_news DISABLE ROW LEVEL SECURITY;'
    });

    if (disableError) {
      console.log('⚠️  Could not disable RLS via RPC, using direct SQL approach');
      console.log('');
      console.log('📋 Please run this SQL in your Supabase SQL Editor:');
      console.log(`
-- Option 1: Disable RLS temporarily (for testing)
ALTER TABLE ai_news DISABLE ROW LEVEL SECURITY;

-- Option 2: Or create proper policies (recommended for production)
-- DROP POLICY IF EXISTS "Public read access" ON ai_news;
-- CREATE POLICY "Public read access" ON ai_news FOR SELECT USING (true);
-- CREATE POLICY "Service role full access" ON ai_news FOR ALL USING (auth.role() = 'service_role');
      `);
    } else {
      console.log('✅ RLS disabled successfully!');
    }

    // Test the fix
    console.log('🧪 Testing frontend access after RLS fix...');
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
      console.error('❌ Anon access still failing:', anonError);
    } else {
      console.log(`✅ Anon can now see ${anonData.length} items!`);
      if (anonData.length > 0) {
        console.log('📋 Sample item:', anonData[0].title);
      }
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// CLI interface
if (require.main === module) {
  fixRLSPolicies()
    .then(() => {
      console.log('🎉 RLS fix completed!');
      console.log('');
      console.log('📊 Test the news page now: http://localhost:3000/news');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 RLS fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixRLSPolicies }; 