const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Debugging Supabase connection...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service Key Length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
console.log('Service Key Preview:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 50) + '...');
console.log('Anon Key Length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length);
console.log('Anon Key Preview:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 50) + '...\n');

// Test with anon key first
console.log('🧪 Testing with ANON key...');
const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAnonConnection() {
  try {
    const { data, error } = await anonClient
      .from('tools')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Anon client error:', error);
    } else {
      console.log('✅ Anon client successful! Count:', data);
    }
  } catch (err) {
    console.log('❌ Anon client exception:', err.message);
  }
}

// Test with service role key
console.log('🧪 Testing with SERVICE ROLE key...');
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testServiceConnection() {
  try {
    const { data, error } = await serviceClient
      .from('tools')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Service client error:', error);
      
      // Try to get more details about the error
      if (error.message.includes('Invalid API key')) {
        console.log('🔍 This suggests the service role key is invalid or expired');
        console.log('🔍 Check if the key is still valid in your Supabase dashboard');
      }
    } else {
      console.log('✅ Service client successful! Count:', data);
    }
  } catch (err) {
    console.log('❌ Service client exception:', err.message);
  }
}

// Test RPC function availability
async function testRPC() {
  console.log('🧪 Testing RPC function availability...');
  try {
    const { data, error } = await serviceClient.rpc('exec_sql', {
      sql: 'SELECT 1 as test'
    });
    
    if (error) {
      console.log('❌ RPC error:', error);
      console.log('🔍 This suggests the exec_sql function might not exist');
    } else {
      console.log('✅ RPC successful! Data:', data);
    }
  } catch (err) {
    console.log('❌ RPC exception:', err.message);
  }
}

// Test basic table access
async function testTableAccess() {
  console.log('🧪 Testing basic table access...');
  try {
    const { data, error } = await serviceClient
      .from('tools')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.log('❌ Table access error:', error);
    } else {
      console.log('✅ Table access successful! Sample data:', data);
    }
  } catch (err) {
    console.log('❌ Table access exception:', err.message);
  }
}

// Run all tests
async function runAllTests() {
  await testAnonConnection();
  console.log('');
  await testServiceConnection();
  console.log('');
  await testRPC();
  console.log('');
  await testTableAccess();
  
  console.log('\n🔍 Summary:');
  console.log('- If anon key works but service key doesn\'t: Service key issue');
  console.log('- If neither works: URL or authentication issue');
  console.log('- If RPC fails: Function not available in your Supabase instance');
}

runAllTests();
