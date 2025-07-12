// Test Supabase connection directly
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl ? 'SET' : 'NOT SET');
console.log('Key:', supabaseKey ? 'SET (length: ' + supabaseKey.length + ')' : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('\n1. Testing basic connection...');
    
    // Test a simple query to see if we can connect
    const { data: testData, error: testError } = await supabase
      .from('contact_messages')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection test failed:', testError);
      return;
    }
    
    console.log('✅ Connection successful');
    
    // Test insert with minimal data
    console.log('\n2. Testing insert with minimal data...');
    const testInsert = {
      name: "Test User",
      email: "test@example.com",
      subject: "Test",
      message: "Test message"
    };
    
    console.log('Inserting data:', testInsert);
    
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([testInsert])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Insert failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Try to get more info about the table structure
      console.log('\n3. Checking table structure...');
      const { data: tableInfo, error: tableError } = await supabase
        .from('contact_messages')
        .select('*')
        .limit(0);
      
      if (tableError) {
        console.error('❌ Cannot query table structure:', tableError);
      } else {
        console.log('✅ Table structure query successful');
      }
      
      // Try a different approach - test with service role key
      console.log('\n4. Testing with different approach...');
      console.log('The issue might be with the anon key permissions.');
      console.log('Please try manually inserting a row in Supabase Table Editor as anon role.');
      console.log('If that works, the issue is with the API route or client configuration.');
      
    } else {
      console.log('✅ Insert successful:', data);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSupabaseConnection(); 