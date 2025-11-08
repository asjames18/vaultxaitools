console.log('🔧 SUPABASE SERVICE ROLE KEY FIX\n');

console.log('❌ PROBLEM IDENTIFIED:');
console.log('Your service role key is invalid or expired.\n');

console.log('🔍 SYMPTOMS:');
console.log('- Anon key works (can read public data)');
console.log('- Service role key fails (can\'t create tables)');
console.log('- RPC functions unavailable');
console.log('- Workflow database setup fails\n');

console.log('✅ SOLUTION STEPS:\n');

console.log('1. 📱 Go to your Supabase Dashboard:');
console.log('   https://supabase.com/dashboard\n');

console.log('2. 🏠 Select your project:');
console.log('   Project: eyrjonntxrlykglvskua\n');

console.log('3. ⚙️ Go to Settings > API\n');

console.log('4. 🔑 Copy the "service_role" key (NOT anon key)');
console.log('   - It should start with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
console.log('   - Length should be around 203 characters\n');

console.log('5. 📝 Update your .env.local file:');
console.log('   SUPABASE_SERVICE_ROLE_KEY=your_new_key_here\n');

console.log('6. 🧪 Test the connection:');
console.log('   node scripts/debug-supabase-connection.js\n');

console.log('⚠️  IMPORTANT NOTES:');
console.log('- Service role keys have FULL ACCESS to your database');
console.log('- Keep them secure and never commit to git');
console.log('- Keys can expire if not used for a long time');
console.log('- You may need to regenerate the key if it\'s corrupted\n');

console.log('🔍 ALTERNATIVE: Check if you have the right project');
console.log('Current URL: https://eyrjonntxrlykglvskua.supabase.co');
console.log('Make sure this matches your Supabase project URL\n');

console.log('🚀 Once fixed, we can:');
console.log('- Set up workflow database tables');
console.log('- Enable real workflow persistence');
console.log('- Test advanced search API');
console.log('- Complete the admin portal\n');

console.log('Need help? Check:');
console.log('- Supabase documentation: https://supabase.com/docs');
console.log('- API key management: https://supabase.com/docs/guides/api/api-keys');
