// Test environment variables loading
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('Testing environment variables...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (length: ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ')' : 'NOT SET');

// Test if the values match what we expect
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('URL starts with:', process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20) + '...');
}
if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('Key starts with:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...');
} 