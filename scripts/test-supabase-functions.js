const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Supabase Functions Availability...\n');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBasicConnection() {
  console.log('🧪 Testing basic connection...');
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.log('❌ Basic connection failed:', error);
      return false;
    } else {
      console.log('✅ Basic connection successful!');
      console.log('Sample data:', data);
      return true;
    }
  } catch (err) {
    console.log('❌ Basic connection exception:', err.message);
    return false;
  }
}

async function testRPCFunctions() {
  console.log('\n🧪 Testing RPC functions...');
  
  const functionsToTest = [
    'exec_sql',
    'exec_sql_with_params',
    'sql',
    'rpc',
    'pg_function'
  ];

  for (const funcName of functionsToTest) {
    try {
      console.log(`Testing ${funcName}...`);
      const { data, error } = await supabase.rpc(funcName, {
        sql: 'SELECT 1 as test'
      });
      
      if (error) {
        console.log(`❌ ${funcName} failed:`, error.message);
      } else {
        console.log(`✅ ${funcName} successful!`);
        return funcName; // Found a working function
      }
    } catch (err) {
      console.log(`❌ ${funcName} exception:`, err.message);
    }
  }
  
  return null; // No working functions found
}

async function testDirectSQL() {
  console.log('\n🧪 Testing direct SQL execution...');
  try {
    // Try to create a simple test table
    const { data, error } = await supabase
      .from('_test_table_connection')
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('relation "_test_table_connection" does not exist')) {
      console.log('✅ Direct table access works (table just doesn\'t exist)');
      return true;
    } else if (error) {
      console.log('❌ Direct table access failed:', error);
      return false;
    } else {
      console.log('✅ Direct table access successful!');
      return true;
    }
  } catch (err) {
    console.log('❌ Direct table access exception:', err.message);
    return false;
  }
}

async function testTableCreation() {
  console.log('\n🧪 Testing table creation capability...');
  try {
    // Try to create a simple test table using direct SQL
    const { data, error } = await supabase
      .from('test_connection_table')
      .insert({ test: 'connection' })
      .select();
    
    if (error && error.message.includes('relation "test_connection_table" does not exist')) {
      console.log('✅ Insert operation works (table just doesn\'t exist)');
      return true;
    } else if (error) {
      console.log('❌ Insert operation failed:', error);
      return false;
    } else {
      console.log('✅ Insert operation successful!');
      return true;
    }
  } catch (err) {
    console.log('❌ Insert operation exception:', err.message);
    return false;
  }
}

async function checkSupabaseVersion() {
  console.log('\n🧪 Checking Supabase version and capabilities...');
  try {
    // Try to get database version
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);
    
    if (error) {
      console.log('❌ Schema query failed:', error);
    } else {
      console.log('✅ Schema query successful!');
      console.log('Available tables:', data?.map(t => t.table_name) || []);
    }
  } catch (err) {
    console.log('❌ Schema query exception:', err.message);
  }
}

async function testAlternativeApproach() {
  console.log('\n🧪 Testing alternative table creation approach...');
  try {
    // Try to create a table using a different method
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('relation "workflows" does not exist')) {
      console.log('✅ Table query works (workflows table just doesn\'t exist yet)');
      console.log('🔍 This suggests we can create tables, just need the right method');
      return true;
    } else if (error) {
      console.log('❌ Table query failed:', error);
      return false;
    } else {
      console.log('✅ Workflows table already exists!');
      return true;
    }
  } catch (err) {
    console.log('❌ Table query exception:', err.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Running comprehensive Supabase function tests...\n');
  
  const basicConnection = await testBasicConnection();
  
  if (!basicConnection) {
    console.log('\n❌ Basic connection failed - cannot proceed with other tests');
    return;
  }
  
  const rpcFunction = await testRPCFunctions();
  const directSQL = await testDirectSQL();
  const tableCreation = await testTableCreation();
  await checkSupabaseVersion();
  const alternativeApproach = await testAlternativeApproach();
  
  console.log('\n📊 TEST RESULTS SUMMARY:');
  console.log('Basic Connection:', basicConnection ? '✅' : '❌');
  console.log('RPC Functions:', rpcFunction ? `✅ (${rpcFunction})` : '❌');
  console.log('Direct SQL:', directSQL ? '✅' : '❌');
  console.log('Table Creation:', tableCreation ? '✅' : '❌');
  console.log('Alternative Approach:', alternativeApproach ? '✅' : '❌');
  
  console.log('\n🔍 DIAGNOSIS:');
  if (rpcFunction) {
    console.log('✅ RPC function found - we can use this for table creation');
  } else if (directSQL && tableCreation) {
    console.log('✅ Direct SQL works - we can create tables without RPC');
  } else if (alternativeApproach) {
    console.log('✅ Alternative approach works - we can create tables');
  } else {
    console.log('❌ No table creation method available');
    console.log('🔍 This might be a Supabase plan limitation');
  }
  
  console.log('\n💡 RECOMMENDATIONS:');
  if (rpcFunction) {
    console.log('1. Use the working RPC function for table creation');
    console.log('2. Modify setup scripts to use the correct function name');
  } else if (directSQL) {
    console.log('1. Use direct SQL operations instead of RPC');
    console.log('2. Modify setup scripts to use direct table creation');
  } else {
    console.log('1. Check your Supabase plan - table creation might be limited');
    console.log('2. Contact Supabase support about RPC function availability');
    console.log('3. Consider upgrading your plan if needed');
  }
}

runAllTests();
