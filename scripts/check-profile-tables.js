#!/usr/bin/env node

// Check what profile and user-related tables exist
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('🔍 Checking profile-related tables...');
  
  const tablesToCheck = ['profiles', 'user_profiles', 'favorites', 'reviews'];
  
  for (const tableName of tablesToCheck) {
    try {
      console.log(`\n📋 Checking table: ${tableName}`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ Table "${tableName}" does not exist`);
        } else {
          console.log(`⚠️  Table "${tableName}" exists but has error:`, error.message);
        }
      } else {
        console.log(`✅ Table "${tableName}" exists and is accessible`);
        if (data && data.length > 0) {
          console.log(`   Sample data:`, Object.keys(data[0]));
        } else {
          console.log(`   Table is empty`);
        }
      }
    } catch (error) {
      console.log(`❌ Error checking table "${tableName}":`, error.message);
    }
  }
}

async function createMissingTables() {
  console.log('\n📝 SQL to create missing tables:');
  
  console.log(`
-- Create profiles table (for user profile data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    organization TEXT,
    bio TEXT,
    newsletter_opt_in BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, tool_id)
);

-- Enable RLS for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites." ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites." ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites." ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool_id TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Reviews are viewable by everyone." ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews." ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews." ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews." ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);
`);
}

async function main() {
  console.log('🔍 CHECKING PROFILE TABLES');
  console.log('===========================');
  
  await checkTables();
  await createMissingTables();
  
  console.log('\n💡 NEXT STEPS:');
  console.log('1. If tables are missing, run the SQL above in Supabase SQL Editor');
  console.log('2. Test the dashboard page again');
  console.log('3. The /dashboard route is now allowed in middleware');
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables');
} else {
  main().catch(console.error);
}
