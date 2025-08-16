const fs = require('fs');
const path = require('path');

function displaySetupInstructions() {
  console.log('🚀 Blog Database Setup Instructions');
  console.log('=====================================\n');
  
  console.log('Since we need admin privileges to create tables, please follow these steps:\n');
  
  console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor (in the left sidebar)');
  console.log('4. Create a new query');
  console.log('5. Copy and paste the following SQL:\n');
  
  // Read and display the SQL
  const sqlPath = path.join(__dirname, 'create-blog-table.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  console.log('```sql');
  console.log(sql);
  console.log('```\n');
  
  console.log('6. Click "Run" to execute the SQL');
  console.log('7. You should see success messages for each statement\n');
  
  console.log('✅ After running this SQL, your blog database will be set up with:');
  console.log('   - blog_posts table with all necessary fields');
  console.log('   - Proper indexes for performance');
  console.log('   - Row Level Security policies');
  console.log('   - Sample blog posts');
  console.log('   - Admin-only access for management\n');
  
  console.log('📝 You can then use the blog management features in your admin panel!');
}

displaySetupInstructions(); 