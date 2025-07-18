require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUsersAPI() {
  console.log('🧪 Testing Users API...\n');

  try {
    // Test 1: List all users using service role
    console.log('1️⃣ Testing user listing...');
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('❌ Error listing users:', error.message);
      return;
    }

    console.log(`✅ Found ${users.users.length} users`);

    // Test 2: Get user roles
    console.log('\n2️⃣ Testing user roles...');
    const usersWithRoles = await Promise.all(
      users.users.map(async (user) => {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          role: roleData?.role || 'user'
        };
      })
    );

    console.log('✅ User roles retrieved successfully');

    // Display users
    console.log('\n📋 Users in system:');
    usersWithRoles.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.role})`);
      console.log(`      - Created: ${new Date(user.created_at).toLocaleDateString()}`);
      console.log(`      - Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`      - Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}`);
    });

    // Test 3: Check admin users specifically
    console.log('\n3️⃣ Testing admin users...');
    const adminUsers = usersWithRoles.filter(user => user.role === 'admin');
    console.log(`✅ Found ${adminUsers.length} admin users:`);
    adminUsers.forEach(user => {
      console.log(`   - ${user.email}`);
    });

    console.log('\n🎉 Users API test completed successfully!');
    console.log('\n💡 If you\'re still seeing "No users found" in the admin panel:');
    console.log('   1. Make sure you\'re signed in as admin at http://localhost:3001/admin/login');
    console.log('   2. Check the browser console for any JavaScript errors');
    console.log('   3. Verify the API endpoint is accessible');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUsersAPI(); 