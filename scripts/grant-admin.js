#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

// Check required environment variables
if (!config.supabaseUrl || !config.supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase admin client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function grantAdminAccess(email) {
  console.log(`🔑 Granting admin access to: ${email}`);
  console.log('=' .repeat(50));
  
  try {
    // Find user by email
    console.log('🔍 Finding user...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError.message);
      return false;
    }
    
    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      console.log('💡 Make sure the user has signed up first at: http://localhost:3000/sign-up');
      return false;
    }
    
    console.log(`✅ User found: ${user.email} (ID: ${user.id})`);
    
    // Check if user already has admin role
    console.log('🔍 Checking current role...');
    const { data: existingRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (existingRole && existingRole.role === 'admin') {
      console.log('ℹ️  User already has admin role');
      return true;
    }
    
    // Grant admin role
    console.log('🔧 Granting admin role...');
    const { error: insertError } = await supabase
      .from('user_roles')
      .upsert([
        {
          user_id: user.id,
          role: 'admin'
        }
      ], {
        onConflict: 'user_id'
      });
    
    if (insertError) {
      console.error('❌ Error granting admin role:', insertError.message);
      return false;
    }
    
    console.log('✅ Admin role granted successfully!');
    console.log('');
    console.log('🎉 Next steps:');
    console.log('   1. Go to: http://localhost:3000/admin/login');
    console.log(`   2. Sign in with: ${email}`);
    console.log('   3. Access the admin dashboard');
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

async function listUsers() {
  console.log('👥 Current Users');
  console.log('=' .repeat(50));
  
  try {
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error listing users:', usersError.message);
      return;
    }
    
    if (users.users.length === 0) {
      console.log('No users found. Create a user first at: http://localhost:3000/sign-up');
      return;
    }
    
    // Get roles for all users
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
    
    const roleMap = {};
    if (!rolesError && roles) {
      roles.forEach(role => {
        roleMap[role.user_id] = role.role;
      });
    }
    
    console.log(`Found ${users.users.length} users:`);
    console.log('');
    
    users.users.forEach((user, index) => {
      const role = roleMap[user.id] || 'user';
      const created = new Date(user.created_at).toLocaleDateString();
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Role: ${role}`);
      console.log(`   Created: ${created}`);
      console.log(`   ID: ${user.id}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Main execution
const email = process.argv[2];

if (!email) {
  console.log('🛡️  Admin Access Manager');
  console.log('=' .repeat(50));
  console.log('');
  console.log('Usage:');
  console.log('  npm run grant-admin <email>    - Grant admin access');
  console.log('  npm run grant-admin --list     - List all users');
  console.log('');
  console.log('Examples:');
  console.log('  npm run grant-admin john@example.com');
  console.log('  npm run grant-admin --list');
  console.log('');
  
  listUsers();
} else if (email === '--list') {
  listUsers();
} else {
  grantAdminAccess(email);
} 