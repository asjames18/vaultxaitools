const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('Environment variables:');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service Key length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 'undefined');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('tools')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection error:', error);
    } else {
      console.log('✅ Connection successful!');
      console.log('Tools count:', data);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection();
