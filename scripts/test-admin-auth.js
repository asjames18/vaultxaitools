const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminAuth() {
  console.log('Testing admin authentication...\n');

  try {
    // Test 1: List users with admin client
    console.log('1. Testing admin client listUsers...');
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError);
    } else {
      console.log(`✅ Successfully listed ${users.users.length} users`);
      users.users.slice(0, 3).forEach(user => {
        console.log(`   - ${user.email} (${user.id})`);
      });
    }

    // Test 2: Check user roles
    console.log('\n2. Testing user roles...');
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('*');

    if (rolesError) {
      console.error('❌ Error fetching user roles:', rolesError);
    } else {
      console.log(`✅ Successfully fetched ${roles.length} user roles`);
      roles.forEach(role => {
        console.log(`   - User ${role.user_id}: ${role.role}`);
      });
    }

    // Test 3: Test regular client authentication
    console.log('\n3. Testing regular client...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Error getting user:', authError);
    } else if (user) {
      console.log(`✅ User authenticated: ${user.email}`);
      
      // Check if user is admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      console.log(`   Role: ${userRole?.role || 'user'}`);
    } else {
      console.log('ℹ️  No user authenticated');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testAdminAuth(); 