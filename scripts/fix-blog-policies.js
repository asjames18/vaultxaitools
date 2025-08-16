const fs = require('fs');
const path = require('path');

function displayPolicyFixInstructions() {
  console.log('🔧 Blog RLS Policy Fix Instructions');
  console.log('====================================\n');
  
  console.log('The blog is working but the public can\'t read posts due to RLS policies.');
  console.log('Please run this SQL in your Supabase Dashboard to fix the policies:\n');
  
  // Read and display the SQL
  const sqlPath = path.join(__dirname, 'fix-blog-policies.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  console.log('```sql');
  console.log(sql);
  console.log('```\n');
  
  console.log('Steps:');
  console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor (in the left sidebar)');
  console.log('4. Create a new query');
  console.log('5. Copy and paste the SQL above');
  console.log('6. Click "Run" to execute\n');
  
  console.log('✅ After running this SQL:');
  console.log('   - Public users can read published blog posts');
  console.log('   - Admin API can manage all posts');
  console.log('   - Blog page will show the published posts');
  console.log('   - Individual blog post pages will work');
}

displayPolicyFixInstructions(); 