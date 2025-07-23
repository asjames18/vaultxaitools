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
  console.error('❌ Missing required environment variables');
  console.log('Make sure you have:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function setupUserDashboard() {
  console.log('🚀 Setting up User Dashboard Database...');
  
  try {
    // Since we can't use exec_sql, let's create a simple approach
    // We'll use the Supabase dashboard to create tables manually
    // and focus on setting up the API and frontend functionality
    
    console.log('\n📋 Manual Database Setup Required:');
    console.log('Please create the following tables in your Supabase dashboard:');
    
    console.log('\n1. user_profiles table:');
    console.log(`
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  level VARCHAR(20) DEFAULT 'Explorer',
  points INTEGER DEFAULT 0,
  tools_explored INTEGER DEFAULT 0,
  reviews_written INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);

    console.log('\n2. user_favorites table:');
    console.log(`
CREATE TABLE user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);
    `);

    console.log('\n3. user_activity table:');
    console.log(`
CREATE TABLE user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  activity_data JSONB,
  tool_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);

    console.log('\n4. user_recommendations table:');
    console.log(`
CREATE TABLE user_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id VARCHAR(100),
  reason TEXT,
  score DECIMAL(3,2),
  is_viewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);

    console.log('\n5. user_points table:');
    console.log(`
CREATE TABLE user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason VARCHAR(100) NOT NULL,
  activity_id UUID REFERENCES user_activity(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    `);

    console.log('\n🔒 RLS Policies to enable:');
    console.log(`
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User favorites policies
CREATE POLICY "Users can manage own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id);

-- User activity policies
CREATE POLICY "Users can view own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User recommendations policies
CREATE POLICY "Users can view own recommendations" ON user_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own recommendations" ON user_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- User points policies
CREATE POLICY "Users can view own points" ON user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert points" ON user_points FOR INSERT WITH CHECK (true);
    `);

    console.log('\n⚡ Indexes to create:');
    console.log(`
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_tool_id ON user_favorites(tool_id);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX idx_user_recommendations_user_id ON user_recommendations(user_id);
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
    `);

    // Test the connection
    console.log('\n🔍 Testing Supabase connection...');
    const { data, error } = await supabase.from('tools').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      console.log('\n💡 Make sure your Supabase URL and service key are correct');
    } else {
      console.log('✅ Supabase connection successful!');
    }

    console.log('\n🎉 Setup instructions completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the CREATE TABLE statements above');
    console.log('4. Enable RLS and create the policies');
    console.log('5. Create the indexes for performance');
    console.log('6. Test the dashboard at /dashboard');

  } catch (error) {
    console.error('💥 Setup failed:', error);
  }
}

// CLI interface
if (require.main === module) {
  setupUserDashboard()
    .then(() => {
      console.log('\n✅ User dashboard setup instructions completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupUserDashboard }; 