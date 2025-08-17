#!/usr/bin/env node

// Check and fix profile functionality without SQL execution
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfilesTable() {
  console.log('🔍 Checking profiles table structure...');
  
  try {
    // Try to select from profiles table to see its structure
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Profiles table error:', error.message);
      
      if (error.message.includes('does not exist')) {
        console.log('💡 Need to create profiles table manually');
        return 'missing';
      } else {
        console.log('💡 Profiles table exists but has issues');
        return 'error';
      }
    } else {
      console.log('✅ Profiles table exists and accessible');
      if (data && data.length > 0) {
        console.log('   Columns:', Object.keys(data[0]));
      } else {
        console.log('   Table is empty (which is fine)');
      }
      return 'exists';
    }
  } catch (error) {
    console.log('❌ Exception checking profiles:', error.message);
    return 'error';
  }
}

async function testProfileOperations() {
  console.log('\n🧪 Testing profile operations...');
  
  // Test creating a profile entry
  const testUserId = '00000000-0000-0000-0000-000000000000';
  
  try {
    // First try to insert a test profile
    console.log('Testing insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: testUserId,
        display_name: 'Test User',
        organization: 'Test Org',
        bio: 'Test bio',
        newsletter_opt_in: true
      })
      .select();
    
    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      
      if (insertError.message.includes('foreign key')) {
        console.log('💡 This is expected - foreign key constraint prevents inserting without real user');
      }
    } else {
      console.log('✅ Insert successful:', insertData);
      
      // Clean up
      await supabase.from('profiles').delete().eq('id', testUserId);
      console.log('🧹 Cleaned up test data');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Exception during profile test:', error.message);
    return false;
  }
}

async function checkFavoritesTable() {
  console.log('\n🔍 Checking favorites table...');
  
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Favorites table error:', error.message);
      return false;
    }
    
    console.log('✅ Favorites table accessible');
    if (data && data.length > 0) {
      console.log('   Columns:', Object.keys(data[0]));
    }
    
    return true;
  } catch (error) {
    console.log('❌ Exception checking favorites:', error.message);
    return false;
  }
}

async function checkReviewsCompatibility() {
  console.log('\n🔍 Checking reviews table compatibility...');
  
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Reviews table error:', error.message);
      return false;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('   Current columns:', columns);
      
      // Check for compatibility issues
      const hasUserId = columns.includes('user_id');
      const hasUserName = columns.includes('user_name');
      
      if (!hasUserId && hasUserName) {
        console.log('⚠️  Reviews table uses user_name instead of user_id');
        console.log('   Dashboard queries expect user_id - this needs to be fixed');
        return 'needs_fix';
      } else if (hasUserId) {
        console.log('✅ Reviews table has user_id column');
        return true;
      } else {
        console.log('❌ Reviews table missing both user_id and user_name');
        return false;
      }
    } else {
      console.log('✅ Reviews table exists (empty)');
      return true;
    }
  } catch (error) {
    console.log('❌ Exception checking reviews:', error.message);
    return false;
  }
}

async function generateSQLFixes() {
  console.log('\n📝 SQL commands to fix any issues:');
  
  console.log(`
-- Create profiles table if missing
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    organization TEXT,
    bio TEXT,
    newsletter_opt_in BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Fix favorites table if needed
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);
`);
}

async function testAPIEndpoints() {
  console.log('\n🌐 Note: API endpoints to test manually:');
  console.log('1. GET /api/user/export - Export user data');
  console.log('2. PUT /api/user/profile - Update profile');
  console.log('3. DELETE /api/user/account - Delete account');
  console.log('4. GET /dashboard - Dashboard page');
}

async function main() {
  console.log('🔍 COMPREHENSIVE PROFILE SYSTEM CHECK');
  console.log('=====================================');
  
  const profilesStatus = await checkProfilesTable();
  const favoritesOk = await checkFavoritesTable();
  const reviewsStatus = await checkReviewsCompatibility();
  
  if (profilesStatus === 'exists') {
    await testProfileOperations();
  }
  
  await generateSQLFixes();
  await testAPIEndpoints();
  
  console.log('\n📊 SUMMARY:');
  console.log(`Profiles table: ${profilesStatus === 'exists' ? '✅' : profilesStatus === 'missing' ? '❌ Missing' : '⚠️  Has issues'}`);
  console.log(`Favorites table: ${favoritesOk ? '✅' : '❌'}`);
  console.log(`Reviews table: ${reviewsStatus === true ? '✅' : reviewsStatus === 'needs_fix' ? '⚠️  Needs user_id column' : '❌'}`);
  
  console.log('\n🎯 NEXT STEPS:');
  if (profilesStatus === 'missing') {
    console.log('1. Run the SQL above to create profiles table');
  }
  if (reviewsStatus === 'needs_fix') {
    console.log('2. Consider adding user_id column to reviews table for user-specific queries');
  }
  console.log('3. Test the dashboard page and profile functionality');
  console.log('4. Test profile update, data export, and account deletion');
}

main().catch(console.error);
