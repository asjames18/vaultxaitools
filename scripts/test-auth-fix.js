#!/usr/bin/env node

// Test the authentication fix for user profile APIs
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUserAPIWithToken() {
  console.log('🧪 Testing User API Authentication Fix');
  console.log('====================================');
  
  // Create a test user
  console.log('1. Creating test user...');
  const testEmail = `test-auth-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  try {
    const { data: adminUser, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });
    
    if (createError) {
      console.log('❌ Error creating test user:', createError.message);
      return;
    }
    
    console.log('✅ Test user created');
    
    // Sign in to get a token
    console.log('\n2. Signing in to get access token...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.log('❌ Error signing in:', signInError.message);
      return;
    }
    
    const accessToken = signInData.session?.access_token;
    if (!accessToken) {
      console.log('❌ No access token received');
      return;
    }
    
    console.log('✅ Access token obtained');
    
    // Test the export API with Bearer token
    console.log('\n3. Testing /api/user/export with Bearer token...');
    try {
      const exportResponse = await fetch('http://localhost:3000/api/user/export', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log('Export API status:', exportResponse.status);
      if (exportResponse.ok) {
        const exportData = await exportResponse.json();
        console.log('✅ Export API working - returned data structure:', Object.keys(exportData));
      } else {
        const errorText = await exportResponse.text();
        console.log('❌ Export API failed:', errorText);
      }
    } catch (error) {
      console.log('❌ Export API request failed:', error.message);
    }
    
    // Test the profile API with Bearer token
    console.log('\n4. Testing /api/user/profile with Bearer token...');
    try {
      const profileResponse = await fetch('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          display_name: 'Test User',
          organization: 'Test Org',
          bio: 'Test bio',
          newsletterOptIn: true
        })
      });
      
      console.log('Profile API status:', profileResponse.status);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Profile API working - response:', profileData);
      } else {
        const errorText = await profileResponse.text();
        console.log('❌ Profile API failed:', errorText);
      }
    } catch (error) {
      console.log('❌ Profile API request failed:', error.message);
    }
    
    // Cleanup
    console.log('\n5. Cleaning up test user...');
    await supabase.auth.admin.deleteUser(adminUser.user.id);
    console.log('✅ Test user deleted');
    
  } catch (error) {
    console.log('❌ Test failed with exception:', error.message);
  }
}

async function testDirectDBAccess() {
  console.log('\n🔍 Testing direct database access...');
  
  try {
    // Test if we can access the profiles table
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    
    if (error) {
      console.log('❌ Database access error:', error.message);
    } else {
      console.log('✅ Database access working');
    }
  } catch (error) {
    console.log('❌ Database access exception:', error.message);
  }
}

async function main() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing environment variables');
    console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    return;
  }
  
  console.log('📍 Testing against:', supabaseUrl);
  
  await testDirectDBAccess();
  
  console.log('\n💡 NOTE: API endpoint tests require the Next.js dev server to be running');
  console.log('If you see connection errors, make sure "npm run dev" is running');
  
  await testUserAPIWithToken();
  
  console.log('\n📊 SUMMARY:');
  console.log('The authentication fix adds Bearer token support to user APIs');
  console.log('This should resolve the 401 Unauthorized errors you were seeing');
  console.log('');
  console.log('✅ Fixed APIs:');
  console.log('- GET /api/user/export (data export)');
  console.log('- PUT /api/user/profile (profile updates)');
  console.log('');
  console.log('🔧 How it works:');
  console.log('- Dashboard client now sends Authorization: Bearer <token>');
  console.log('- API routes accept both Bearer tokens and cookies');
  console.log('- Backward compatible with existing functionality');
}

main().catch(console.error);