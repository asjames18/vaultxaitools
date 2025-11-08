const { createClient } = require('@supabase/supabase-js');

console.log('🧪 Testing New Service Role Key Directly...\n');

// Use the key directly from the file content
const NEW_SERVICE_KEY = 'sb_secret_eokVe5IdRzxFOJA22t8DKw_8aY0anbm';
const SUPABASE_URL = 'https://eyrjonntxrlykglvskua.supabase.co';

console.log('Testing with:');
console.log('URL:', SUPABASE_URL);
console.log('Key (first 20 chars):', NEW_SERVICE_KEY.substring(0, 20));
console.log('Key format:', NEW_SERVICE_KEY.startsWith('sb_secret_') ? 'sb_secret format' : 'JWT format');

const supabase = createClient(SUPABASE_URL, NEW_SERVICE_KEY);

async function testNewKey() {
  console.log('\n🧪 Testing new service role key...');
  
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

async function testAdminOperations() {
  console.log('\n🧪 Testing admin operations...');
  
  try {
    // Test 1: Try to create a test workflow
    console.log('1. Testing workflow creation...');
    const { data, error } = await supabase
      .from('workflows')
      .insert({
        name: 'Test Admin Workflow',
        description: 'Testing admin write access',
        type: 'test',
        status: 'draft',
        config: { test: true }
      })
      .select();
    
    if (error) {
      console.log('❌ Workflow creation failed:', error.message);
    } else {
      console.log('✅ Workflow creation successful!');
      console.log('Created workflow:', data);
      
      // Clean up - delete the test workflow
      console.log('\n2. Cleaning up test workflow...');
      const { error: deleteError } = await supabase
        .from('workflows')
        .delete()
        .eq('id', data[0].id);
      
      if (deleteError) {
        console.log('❌ Cleanup failed:', deleteError.message);
      } else {
        console.log('✅ Cleanup successful!');
      }
    }
    
  } catch (err) {
    console.log('❌ Admin operations exception:', err.message);
  }
}

async function runTests() {
  await testNewKey();
  await testAdminOperations();
  
  console.log('\n📊 TEST RESULTS:');
  console.log('If the key works, you should see successful table access and admin operations');
  console.log('If it fails, we need to troubleshoot further');
}

runTests();
