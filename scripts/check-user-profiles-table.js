#!/usr/bin/env node

// Check the user_profiles table and fix the handle_new_user function issue
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserProfilesTable() {
  console.log('🔍 Checking user_profiles table...');
  
  try {
    // Try to query the user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ user_profiles table issue:', error.message);
      
      if (error.message.includes('relation "public.user_profiles" does not exist')) {
        console.log('💡 The user_profiles table does not exist!');
        console.log('This is why the handle_new_user function is failing.');
        return 'missing_table';
      } else {
        console.log('💡 user_profiles table exists but has permission/structure issues');
        return 'permission_issue';
      }
    } else {
      console.log('✅ user_profiles table exists and is accessible');
      console.log('Sample data:', data);
      return 'exists';
    }
  } catch (error) {
    console.log('❌ Error checking user_profiles table:', error.message);
    return 'error';
  }
}

async function checkTableStructure() {
  console.log('\n🔍 Checking table structure...');
  
  try {
    // Check what tables exist in the public schema
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (error) {
      console.log('❌ Error checking tables:', error.message);
    } else {
      console.log('✅ Tables in public schema:');
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
      
      const hasUserProfiles = tables.some(t => t.table_name === 'user_profiles');
      return hasUserProfiles;
    }
  } catch (error) {
    console.log('❌ Error checking table structure:', error.message);
    return false;
  }
}

async function generateCreateTableSQL() {
  console.log('\n📝 Generating CREATE TABLE SQL for user_profiles...');
  
  const createTableSQL = `
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
`;

  console.log('📋 SQL to create user_profiles table:');
  console.log(createTableSQL);
  
  return createTableSQL;
}

async function generateDisableTriggerSQL() {
  console.log('\n⚠️  Generating SQL to temporarily disable the trigger...');
  
  const disableTriggerSQL = `
-- Temporarily disable the trigger to allow signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- You can re-enable it later with:
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`;

  console.log('📋 SQL to disable the problematic trigger:');
  console.log(disableTriggerSQL);
  
  return disableTriggerSQL;
}

async function main() {
  console.log('🔍 DIAGNOSING USER SIGNUP ISSUE');
  console.log('================================');
  
  const tableStatus = await checkUserProfilesTable();
  const hasTable = await checkTableStructure();
  
  console.log('\n📊 DIAGNOSIS:');
  console.log(`Table status: ${tableStatus}`);
  console.log(`Has user_profiles table: ${hasTable}`);
  
  if (tableStatus === 'missing_table' || !hasTable) {
    console.log('\n🎯 SOLUTION 1: Create the missing user_profiles table');
    await generateCreateTableSQL();
    
    console.log('\n🎯 SOLUTION 2: Temporarily disable the trigger');
    await generateDisableTriggerSQL();
    
    console.log('\n💡 RECOMMENDED ACTION:');
    console.log('1. Run the CREATE TABLE SQL in Supabase SQL Editor');
    console.log('2. Test user signup');
    console.log('3. If you don\'t need user profiles, disable the trigger instead');
  } else if (tableStatus === 'exists') {
    console.log('\n🤔 The table exists, so the issue might be:');
    console.log('1. Missing columns (id, username, display_name)');
    console.log('2. Permission issues with the function');
    console.log('3. The function logic itself');
    
    console.log('\n🎯 Try disabling the trigger temporarily to test:');
    await generateDisableTriggerSQL();
  } else {
    console.log('\n🎯 Try disabling the trigger to test signup:');
    await generateDisableTriggerSQL();
  }
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables');
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
} else {
  main().catch(console.error);
}
