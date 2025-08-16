const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testUsersAPI() {
  console.log('Testing Users API directly...\n');

  try {
    // Test 1: List users with admin client
    console.log('1. Fetching users with admin client...');
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError);
      return;
    }

    console.log(`✅ Successfully listed ${users.users.length} users`);

    // Test 2: Get user roles for each user
    console.log('\n2. Fetching user roles...');
    const usersWithRoles = await Promise.all(
      users.users.map(async (user) => {
        const { data: roleData } = await supabaseAdmin
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        const role = roleData?.role || 'user';
        
        console.log(`   - ${user.email}: ${role}`);
        
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          role: role
        };
      })
    );

    console.log('\n3. Final user data structure:');
    console.log(JSON.stringify(usersWithRoles, null, 2));

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testUsersAPI(); 