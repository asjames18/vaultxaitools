require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin functionality...\n');

    // Check if tables exist
    console.log('📋 Checking database tables...');
    
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (categoriesError) {
      console.error('❌ Categories table not found. Please run the schema.sql file first.');
      console.error('Error:', categoriesError.message);
      return;
    }
    
    console.log('✅ Categories table exists');

    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);
    
    if (blogError) {
      console.error('❌ Blog posts table not found. Please run the schema.sql file first.');
      console.error('Error:', blogError.message);
      return;
    }
    
    console.log('✅ Blog posts table exists');

    const { data: contactMessages, error: contactError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1);
    
    if (contactError) {
      console.error('❌ Contact messages table not found. Please run the schema.sql file first.');
      console.error('Error:', contactError.message);
      return;
    }
    
    console.log('✅ Contact messages table exists');

    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(1);
    
    if (rolesError) {
      console.error('❌ User roles table not found. Please run the schema.sql file first.');
      console.error('Error:', rolesError.message);
      return;
    }
    
    console.log('✅ User roles table exists\n');

    // Check for existing admin users
    console.log('👥 Checking for existing admin users...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('role', 'admin');

    if (adminError) {
      console.error('❌ Error checking admin users:', adminError.message);
      return;
    }

    if (adminUsers && adminUsers.length > 0) {
      console.log(`✅ Found ${adminUsers.length} admin user(s)`);
      
      // Get user details for admin users
      for (const admin of adminUsers) {
        const { data: user, error: userError } = await supabase.auth.admin.getUserById(admin.user_id);
        if (!userError && user.user) {
          console.log(`   - ${user.user.email} (${admin.role})`);
        }
      }
    } else {
      console.log('⚠️  No admin users found');
      console.log('   To create an admin user:');
      console.log('   1. Sign up normally at /sign-up');
      console.log('   2. Run this script with the user ID to assign admin role');
    }

    // Check for sample data
    console.log('\n📊 Checking for sample data...');
    
    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   Categories: ${categoriesCount || 0}`);
    
    const { count: toolsCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   Tools: ${toolsCount || 0}`);
    
    const { count: blogCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   Blog posts: ${blogCount || 0}`);
    
    const { count: contactCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   Contact messages: ${contactCount || 0}`);

    console.log('\n🎉 Admin setup check completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:3000/admin/login');
    console.log('   2. Sign in with an admin account');
    console.log('   3. Test the admin dashboard features');
    
    if (!adminUsers || adminUsers.length === 0) {
      console.log('\n🔑 To create your first admin user:');
      console.log('   1. Sign up at http://localhost:3000/sign-up');
      console.log('   2. Note your user ID from the signup response');
      console.log('   3. Run: node scripts/setup-admin.js <user-id>');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

async function assignAdminRole(userId) {
  try {
    console.log(`🔑 Assigning admin role to user: ${userId}`);
    
    const { data, error } = await supabase
      .from('user_roles')
      .insert([
        {
          user_id: userId,
          role: 'admin'
        }
      ]);

    if (error) {
      console.error('❌ Failed to assign admin role:', error.message);
      return;
    }

    console.log('✅ Admin role assigned successfully!');
    console.log('   You can now sign in at http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error assigning admin role:', error.message);
  }
}

// Main execution
const userId = process.argv[2];

if (userId) {
  assignAdminRole(userId);
} else {
  setupAdmin();
} 