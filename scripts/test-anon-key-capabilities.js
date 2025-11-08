const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Anon Key Capabilities...\n');

const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAnonCapabilities() {
  console.log('🧪 Testing what anon key can do...\n');
  
  // Test 1: Basic table read
  console.log('1. Testing basic table read...');
  try {
    const { data, error } = await anonClient
      .from('tools')
      .select('id, name, category')
      .limit(3);
    
    if (error) {
      console.log('❌ Table read failed:', error.message);
    } else {
      console.log('✅ Table read successful!');
      console.log('Sample data:', data);
    }
  } catch (err) {
    console.log('❌ Table read exception:', err.message);
  }
  
  // Test 2: Check if we can see table structure
  console.log('\n2. Testing table structure visibility...');
  try {
    const { data, error } = await anonClient
      .from('information_schema.columns')
      .select('table_name, column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'tools')
      .limit(5);
    
    if (error) {
      console.log('❌ Schema query failed:', error.message);
    } else {
      console.log('✅ Schema query successful!');
      console.log('Tools table columns:', data);
    }
  } catch (err) {
    console.log('❌ Schema query exception:', err.message);
  }
  
  // Test 3: Check available tables
  console.log('\n3. Testing available tables...');
  try {
    const { data, error } = await anonClient
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10);
    
    if (error) {
      console.log('❌ Tables query failed:', error.message);
    } else {
      console.log('✅ Tables query successful!');
      console.log('Available tables:', data?.map(t => t.table_name) || []);
    }
  } catch (err) {
    console.log('❌ Tables query exception:', err.message);
  }
  
  // Test 4: Check if workflows table exists
  console.log('\n4. Testing workflows table existence...');
  try {
    const { data, error } = await anonClient
      .from('workflows')
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('relation "workflows" does not exist')) {
      console.log('✅ Workflows table does not exist (expected)');
    } else if (error) {
      console.log('❌ Workflows query failed:', error.message);
    } else {
      console.log('✅ Workflows table exists!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.log('❌ Workflows query exception:', err.message);
  }
  
  // Test 5: Check RLS policies
  console.log('\n5. Testing RLS policy visibility...');
  try {
    const { data, error } = await anonClient
      .from('pg_policies')
      .select('schemaname, tablename, policyname')
      .eq('schemaname', 'public')
      .limit(5);
    
    if (error) {
      console.log('❌ Policies query failed:', error.message);
    } else {
      console.log('✅ Policies query successful!');
      console.log('RLS policies:', data);
    }
  } catch (err) {
    console.log('❌ Policies query exception:', err.message);
  }
}

async function testServiceKeyIssue() {
  console.log('\n🔍 Investigating Service Key Issue...\n');
  
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Test 1: Try to get user info
  console.log('1. Testing service key with auth...');
  try {
    const { data: { user }, error } = await serviceClient.auth.getUser();
    
    if (error) {
      console.log('❌ Auth failed:', error.message);
    } else {
      console.log('✅ Auth successful!');
      console.log('User:', user);
    }
  } catch (err) {
    console.log('❌ Auth exception:', err.message);
  }
  
  // Test 2: Try to get session
  console.log('\n2. Testing service key session...');
  try {
    const { data: { session }, error } = await serviceClient.auth.getSession();
    
    if (error) {
      console.log('❌ Session failed:', error.message);
    } else {
      console.log('✅ Session successful!');
      console.log('Session:', session);
    }
  } catch (err) {
    console.log('❌ Session exception:', err.message);
  }
  
  // Test 3: Try to sign in as service role
  console.log('\n3. Testing service key sign in...');
  try {
    const { data, error } = await serviceClient.auth.signInWithPassword({
      email: 'service@example.com',
      password: 'test123'
    });
    
    if (error) {
      console.log('❌ Sign in failed:', error.message);
    } else {
      console.log('✅ Sign in successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.log('❌ Sign in exception:', err.message);
  }
}

async function runTests() {
  await testAnonCapabilities();
  await testServiceKeyIssue();
  
  console.log('\n📊 SUMMARY:');
  console.log('Anon key can read public data and schema information');
  console.log('Service key seems to have authentication issues');
  console.log('\n💡 POSSIBLE CAUSES:');
  console.log('1. Service role key might be expired or revoked');
  console.log('2. Supabase project settings might be misconfigured');
  console.log('3. RLS policies might be blocking service role access');
  console.log('4. Supabase plan might limit service role functionality');
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. Check Supabase dashboard for key status');
  console.log('2. Verify project settings and RLS policies');
  console.log('3. Check if service role key needs regeneration');
  console.log('4. Consider using anon key with proper RLS policies');
}

runTests();
