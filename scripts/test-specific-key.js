const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Specific Service Role Key...\n');

console.log('Environment variables loaded:');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service Key (first 20 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20));
console.log('Service Key length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
console.log('Service Key format:', process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('sb_secret_') ? 'sb_secret format' : 'JWT format');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  console.log('\n🧪 Testing connection...');
  
  try {
    // Test 1: Basic table access
    console.log('1. Testing basic table access...');
    const { data, error } = await supabase
      .from('tools')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.log('❌ Basic table access failed:', error.message);
      console.log('Error details:', error);
    } else {
      console.log('✅ Basic table access successful!');
      console.log('Data:', data);
    }
    
    // Test 2: Try to get user info
    console.log('\n2. Testing auth...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth failed:', authError.message);
    } else {
      console.log('✅ Auth successful!');
      console.log('User:', user);
    }
    
    // Test 3: Try to get session
    console.log('\n3. Testing session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session failed:', sessionError.message);
    } else {
      console.log('✅ Session successful!');
      console.log('Session:', session);
    }
    
  } catch (err) {
    console.log('❌ Connection test exception:', err.message);
    console.log('Full error:', err);
  }
}

async function testAlternativeFormats() {
  console.log('\n🧪 Testing alternative key formats...');
  
  // Test with anon key to confirm it still works
  console.log('\n1. Testing anon key (should work)...');
  const anonSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  try {
    const { data, error } = await anonSupabase
      .from('tools')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.log('❌ Anon key failed:', error.message);
    } else {
      console.log('✅ Anon key works!');
    }
  } catch (err) {
    console.log('❌ Anon key exception:', err.message);
  }
  
  // Test if the service key might be a different type
  console.log('\n2. Testing if service key might be anon key...');
  const testSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    const { data, error } = await testSupabase
      .from('tools')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.log('❌ Service key as anon failed:', error.message);
    } else {
      console.log('✅ Service key works as anon key!');
      console.log('This suggests the key might be mislabeled');
    }
  } catch (err) {
    console.log('❌ Service key test exception:', err.message);
  }
}

async function runTests() {
  await testConnection();
  await testAlternativeFormats();
  
  console.log('\n📊 DIAGNOSIS:');
  console.log('The service role key format has changed from JWT to sb_secret_');
  console.log('This might indicate:');
  console.log('1. Key type changed in Supabase dashboard');
  console.log('2. Different project or environment');
  console.log('3. Plan limitations');
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. Check if you\'re in the right project in Supabase dashboard');
  console.log('2. Verify the key type (should be service_role, not anon)');
  console.log('3. Check your Supabase plan - service role keys might be limited');
  console.log('4. Try regenerating the key again');
}

runTests();
