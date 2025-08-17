#!/usr/bin/env node

// Check the exact structure of the user_profiles table
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableColumns() {
  console.log('🔍 Checking user_profiles table columns...');
  
  try {
    // Try to describe the table structure
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0); // Just get the structure, no data
    
    if (error) {
      console.log('❌ Error getting table structure:', error.message);
      return false;
    }
    
    console.log('✅ Successfully accessed user_profiles table');
    
    // Try to insert a test record to see what fails
    console.log('\n🧪 Testing insert operation...');
    
    const testUserId = '00000000-0000-0000-0000-000000000000';
    const testData = {
      id: testUserId,
      username: 'test_user',
      display_name: 'Test User'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
      console.log('💡 This might be why the handle_new_user function is failing!');
      
      if (insertError.message.includes('foreign key')) {
        console.log('🎯 Issue: Foreign key constraint (user doesn\'t exist in auth.users)');
      } else if (insertError.message.includes('unique')) {
        console.log('🎯 Issue: Unique constraint violation');
      } else if (insertError.message.includes('not null')) {
        console.log('🎯 Issue: Required column is null');
      } else {
        console.log('🎯 Issue: Unknown database constraint');
      }
      
      return false;
    } else {
      console.log('✅ Insert test successful:', insertData);
      
      // Clean up test data
      await supabase.from('user_profiles').delete().eq('id', testUserId);
      console.log('🧹 Cleaned up test data');
      
      return true;
    }
  } catch (error) {
    console.log('❌ Error during table test:', error.message);
    return false;
  }
}

async function testTriggerDisable() {
  console.log('\n⚠️  QUICK FIX OPTION: Disable the trigger');
  console.log('======================================');
  
  console.log('To immediately fix user signup, run this SQL in Supabase:');
  console.log('');
  console.log('DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;');
  console.log('');
  console.log('This will:');
  console.log('✅ Allow users to sign up immediately');
  console.log('⚠️  Skip creating user profiles (you can add this later)');
  console.log('🔄 Can be re-enabled once the function is fixed');
}

async function analyzeFunction() {
  console.log('\n🔍 Analyzing the handle_new_user function...');
  
  console.log('The function tries to:');
  console.log('1. Extract username from raw_user_meta_data or email');
  console.log('2. Extract display_name from raw_user_meta_data or email');
  console.log('3. Insert into user_profiles table');
  console.log('');
  console.log('Possible issues:');
  console.log('- user_profiles table missing required columns');
  console.log('- Constraint violations (unique username, etc.)');
  console.log('- Permission issues with the function');
  console.log('- Invalid data being inserted');
}

async function main() {
  console.log('🔍 DETAILED USER_PROFILES TABLE ANALYSIS');
  console.log('=========================================');
  
  const tableWorking = await checkTableColumns();
  
  await analyzeFunction();
  await testTriggerDisable();
  
  console.log('\n💡 RECOMMENDATION:');
  if (tableWorking) {
    console.log('1. The table seems fine, the issue might be in the function logic');
    console.log('2. Try disabling the trigger temporarily to confirm this fixes signup');
    console.log('3. Debug the function further or recreate it');
  } else {
    console.log('1. There are issues with the user_profiles table');
    console.log('2. Disable the trigger immediately to fix signup');
    console.log('3. Fix the table structure or function logic');
  }
  
  console.log('\n🚀 IMMEDIATE ACTION:');
  console.log('Run this in Supabase SQL Editor:');
  console.log('DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;');
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables');
} else {
  main().catch(console.error);
}
