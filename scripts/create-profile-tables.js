#!/usr/bin/env node

// Create all missing profile-related tables and ensure they work properly
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createProfilesTable() {
  console.log('📋 Creating profiles table...');
  
  const createTableSQL = `
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
`;

  try {
    const { error } = await supabase.rpc('exec_sql', { query: createTableSQL });
    if (error) {
      console.log('❌ Error creating profiles table:', error.message);
      return false;
    }
    console.log('✅ Profiles table created successfully');
    return true;
  } catch (error) {
    console.log('❌ Exception creating profiles table:', error.message);
    return false;
  }
}

async function fixFavoritesTable() {
  console.log('\n📋 Ensuring favorites table has correct structure...');
  
  const favoritesSQL = `
-- Ensure favorites table exists with correct structure
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, tool_id)
);

-- Enable RLS for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own favorites." ON public.favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites." ON public.favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites." ON public.favorites;

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites." ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites." ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites." ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);
`;

  try {
    const { error } = await supabase.rpc('exec_sql', { query: favoritesSQL });
    if (error) {
      console.log('❌ Error with favorites table:', error.message);
      return false;
    }
    console.log('✅ Favorites table is properly configured');
    return true;
  } catch (error) {
    console.log('❌ Exception with favorites table:', error.message);
    return false;
  }
}

async function fixReviewsTable() {
  console.log('\n📋 Ensuring reviews table has correct structure...');
  
  // Check current reviews table structure
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Reviews table issue:', error.message);
      return false;
    }
    
    console.log('✅ Reviews table exists and is accessible');
    
    // Check if it has user_id column (it might have user_name instead)
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('   Columns:', columns);
      
      if (!columns.includes('user_id') && columns.includes('user_name')) {
        console.log('⚠️  Reviews table uses user_name instead of user_id');
        console.log('   This might cause issues with user-specific queries');
      }
    }
    
    return true;
  } catch (error) {
    console.log('❌ Exception checking reviews table:', error.message);
    return false;
  }
}

async function testTableAccess() {
  console.log('\n🧪 Testing table access...');
  
  const tables = ['profiles', 'favorites', 'reviews'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Error accessing ${table}:`, error.message);
      } else {
        console.log(`✅ ${table} table accessible`);
      }
    } catch (error) {
      console.log(`❌ Exception accessing ${table}:`, error.message);
    }
  }
}

async function createSQLFunction() {
  console.log('\n📋 Creating SQL execution function...');
  
  const functionSQL = `
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
  RETURN 'Success';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Error: ' || SQLERRM;
END;
$$;
`;

  try {
    const { error } = await supabase.rpc('sql', { query: functionSQL });
    if (error && !error.message.includes('already exists')) {
      console.log('❌ Error creating SQL function:', error.message);
      return false;
    }
    console.log('✅ SQL execution function ready');
    return true;
  } catch (error) {
    console.log('❌ Exception creating SQL function:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 SETTING UP USER PROFILE TABLES');
  console.log('==================================');
  
  // First create the SQL execution function
  await createSQLFunction();
  
  // Create and configure tables
  const profilesOk = await createProfilesTable();
  const favoritesOk = await fixFavoritesTable();
  const reviewsOk = await fixReviewsTable();
  
  // Test access
  await testTableAccess();
  
  console.log('\n📊 SUMMARY:');
  console.log(`Profiles table: ${profilesOk ? '✅' : '❌'}`);
  console.log(`Favorites table: ${favoritesOk ? '✅' : '❌'}`);
  console.log(`Reviews table: ${reviewsOk ? '✅' : '❌'}`);
  
  if (profilesOk && favoritesOk && reviewsOk) {
    console.log('\n🎉 All profile tables are ready!');
    console.log('Users should now be able to:');
    console.log('- Access the dashboard page');
    console.log('- Update their profile information');
    console.log('- Save favorites');
    console.log('- Export their data');
    console.log('- Delete their account');
  } else {
    console.log('\n⚠️  Some tables had issues. Check the errors above.');
  }
}

main().catch(console.error);
