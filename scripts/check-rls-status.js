#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
};

// Check required environment variables
if (!config.supabaseUrl || !config.supabaseServiceKey || !config.supabaseAnonKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Initialize clients
const adminSupabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
const anonSupabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

async function checkRLSStatus() {
  console.log('🔍 Checking RLS Status and Data Access...');
  
  try {
    // Test 1: Admin access
    console.log('\n📊 Testing Admin Access...');
    const { data: adminData, error: adminError } = await adminSupabase
      .from('ai_news')
      .select('*')
      .limit(5);

    if (adminError) {
      console.error('❌ Admin access error:', adminError);
    } else {
      console.log(`✅ Admin can see ${adminData.length} items`);
      if (adminData.length > 0) {
        console.log('📋 Sample admin item:', adminData[0].title);
      }
    }

    // Test 2: Anon access
    console.log('\n🌐 Testing Anon Access...');
    const { data: anonData, error: anonError } = await anonSupabase
      .from('ai_news')
      .select('*')
      .limit(5);

    if (anonError) {
      console.error('❌ Anon access error:', anonError);
    } else {
      console.log(`✅ Anon can see ${anonData.length} items`);
      if (anonData.length > 0) {
        console.log('📋 Sample anon item:', anonData[0].title);
      }
    }

    // Test 3: Try to check RLS status via SQL
    console.log('\n🔧 Checking RLS Status...');
    try {
      const { data: rlsData, error: rlsError } = await adminSupabase.rpc('exec_sql', {
        sql: `
          SELECT schemaname, tablename, rowsecurity 
          FROM pg_tables 
          WHERE tablename = 'ai_news';
        `
      });
      
      if (rlsError) {
        console.log('⚠️  Could not check RLS status via RPC');
      } else {
        console.log('📋 RLS Status:', rlsData);
      }
    } catch (e) {
      console.log('⚠️  Could not check RLS status');
    }

    // Test 4: Try different query approaches
    console.log('\n🧪 Testing Different Query Approaches...');
    
    // Approach 1: Simple select
    const { data: simpleData, error: simpleError } = await anonSupabase
      .from('ai_news')
      .select('id, title')
      .limit(1);
    
    console.log(`Simple query: ${simpleData?.length || 0} items`);

    // Approach 2: Count query
    const { count, error: countError } = await anonSupabase
      .from('ai_news')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Count query: ${count || 0} items`);

    // Summary
    console.log('\n📋 Summary:');
    console.log(`- Admin access: ${adminData?.length || 0} items`);
    console.log(`- Anon access: ${anonData?.length || 0} items`);
    console.log(`- Simple query: ${simpleData?.length || 0} items`);
    console.log(`- Count query: ${count || 0} items`);

    if (adminData?.length > 0 && anonData?.length === 0) {
      console.log('\n🔧 RLS is still blocking anon access!');
      console.log('📋 Try running this SQL again in Supabase:');
      console.log(`
-- Option 1: Disable RLS completely
ALTER TABLE ai_news DISABLE ROW LEVEL SECURITY;

-- Option 2: Or create a simple policy
DROP POLICY IF EXISTS "Public read access" ON ai_news;
CREATE POLICY "Public read access" ON ai_news FOR SELECT USING (true);
      `);
    } else if (anonData?.length > 0) {
      console.log('\n✅ RLS is working correctly!');
    } else {
      console.log('\n⚠️  No data found in table');
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// CLI interface
if (require.main === module) {
  checkRLSStatus()
    .then(() => {
      console.log('\n🎉 RLS status check completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 RLS status check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkRLSStatus }; 