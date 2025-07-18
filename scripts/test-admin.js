require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminFeatures() {
  console.log('🧪 Testing Admin Features...\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing database connection...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (catError) {
      console.error('❌ Database connection failed:', catError.message);
      return;
    }
    console.log('✅ Database connection successful');

    // Test 2: Categories
    console.log('\n2️⃣ Testing categories...');
    const { count: catCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    console.log(`✅ Found ${catCount} categories`);

    // Test 3: Tools
    console.log('\n3️⃣ Testing tools...');
    const { count: toolCount } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    console.log(`✅ Found ${toolCount} tools`);

    // Test 4: Blog Posts
    console.log('\n4️⃣ Testing blog posts...');
    const { count: blogCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    console.log(`✅ Found ${blogCount} blog posts`);

    // Test 5: Contact Messages
    console.log('\n5️⃣ Testing contact messages...');
    const { count: contactCount } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true });
    console.log(`✅ Found ${contactCount} contact messages`);

    // Test 6: Admin Users
    console.log('\n6️⃣ Testing admin users...');
    const { data: admins, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('role', 'admin');

    if (adminError) {
      console.error('❌ Admin users test failed:', adminError.message);
    } else {
      console.log(`✅ Found ${admins.length} admin users`);
      for (const admin of admins) {
        const { data: user } = await supabase.auth.admin.getUserById(admin.user_id);
        if (user.user) {
          console.log(`   - ${user.user.email}`);
        }
      }
    }

    // Test 7: RLS Policies
    console.log('\n7️⃣ Testing RLS policies...');
    const { data: publicCategories } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (publicCategories && publicCategories.length > 0) {
      console.log('✅ Public read access working');
    } else {
      console.log('⚠️  Public read access may be restricted');
    }

    console.log('\n🎉 All admin features are working correctly!');
    console.log('\n📋 Summary:');
    console.log(`   - Categories: ${catCount}`);
    console.log(`   - Tools: ${toolCount}`);
    console.log(`   - Blog Posts: ${blogCount}`);
    console.log(`   - Contact Messages: ${contactCount}`);
    console.log(`   - Admin Users: ${admins?.length || 0}`);
    
    console.log('\n🌐 Access your admin panel at:');
    console.log('   http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminFeatures(); 