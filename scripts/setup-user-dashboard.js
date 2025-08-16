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
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function setupUserDashboard() {
  console.log('🚀 Setting up User Dashboard Database...');
  
  try {
    // 1. User Profiles Table
    console.log('\n📊 Creating user_profiles table...');
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
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
      `
    });

    if (profilesError) {
      console.error('❌ Error creating user_profiles:', profilesError);
    } else {
      console.log('✅ user_profiles table created');
    }

    // 2. User Favorites Table
    console.log('\n❤️ Creating user_favorites table...');
    const { error: favoritesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_favorites (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          tool_id VARCHAR(100) REFERENCES tools(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, tool_id)
        );
      `
    });

    if (favoritesError) {
      console.error('❌ Error creating user_favorites:', favoritesError);
    } else {
      console.log('✅ user_favorites table created');
    }

    // 3. User Activity Table
    console.log('\n📈 Creating user_activity table...');
    const { error: activityError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_activity (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          activity_type VARCHAR(50) NOT NULL,
          activity_data JSONB,
          tool_id VARCHAR(100) REFERENCES tools(id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (activityError) {
      console.error('❌ Error creating user_activity:', activityError);
    } else {
      console.log('✅ user_activity table created');
    }

    // 4. User Recommendations Table
    console.log('\n🎯 Creating user_recommendations table...');
    const { error: recommendationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_recommendations (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          tool_id VARCHAR(100) REFERENCES tools(id) ON DELETE CASCADE,
          reason TEXT,
          score DECIMAL(3,2),
          is_viewed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (recommendationsError) {
      console.error('❌ Error creating user_recommendations:', recommendationsError);
    } else {
      console.log('✅ user_recommendations table created');
    }

    // 5. User Points/Levels Table
    console.log('\n⭐ Creating user_points table...');
    const { error: pointsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_points (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          points INTEGER NOT NULL,
          reason VARCHAR(100) NOT NULL,
          activity_id UUID REFERENCES user_activity(id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (pointsError) {
      console.error('❌ Error creating user_points:', pointsError);
    } else {
      console.log('✅ user_points table created');
    }

    // 6. Create indexes for performance
    console.log('\n⚡ Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_favorites_tool_id ON user_favorites(tool_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);',
      'CREATE INDEX IF NOT EXISTS idx_user_recommendations_user_id ON user_recommendations(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);'
    ];

    for (const index of indexes) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: index });
      if (indexError) {
        console.error('❌ Error creating index:', indexError);
      }
    }

    console.log('✅ Indexes created');

    // 7. Enable RLS and create policies
    console.log('\n🔒 Setting up RLS policies...');
    
    const policies = [
      // User profiles policies
      'ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);',
      'CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);',
      'CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);',
      
      // User favorites policies
      'ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY "Users can manage own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id);',
      
      // User activity policies
      'ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY "Users can view own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id);',
      'CREATE POLICY "Users can insert own activity" ON user_activity FOR INSERT WITH CHECK (auth.uid() = user_id);',
      
      // User recommendations policies
      'ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY "Users can view own recommendations" ON user_recommendations FOR SELECT USING (auth.uid() = user_id);',
      'CREATE POLICY "Users can update own recommendations" ON user_recommendations FOR UPDATE USING (auth.uid() = user_id);',
      
      // User points policies
      'ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;',
      'CREATE POLICY "Users can view own points" ON user_points FOR SELECT USING (auth.uid() = user_id);',
      'CREATE POLICY "System can insert points" ON user_points FOR INSERT WITH CHECK (true);'
    ];

    for (const policy of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: policy });
      if (policyError) {
        console.error('❌ Error creating policy:', policyError);
      }
    }

    console.log('✅ RLS policies created');

    // 8. Create functions for dashboard operations
    console.log('\n🔧 Creating dashboard functions...');
    
    const functions = [
      // Function to get user dashboard data
      `CREATE OR REPLACE FUNCTION get_user_dashboard(user_uuid UUID)
       RETURNS JSON AS $$
       DECLARE
         result JSON;
       BEGIN
         SELECT json_build_object(
           'profile', (
             SELECT json_build_object(
               'id', up.id,
               'username', up.username,
               'display_name', up.display_name,
               'level', up.level,
               'points', up.points,
               'tools_explored', up.tools_explored,
               'reviews_written', up.reviews_written,
               'favorites_count', up.favorites_count,
               'member_since', up.member_since
             )
             FROM user_profiles up
             WHERE up.id = user_uuid
           ),
           'recent_activity', (
             SELECT json_agg(
               json_build_object(
                 'id', ua.id,
                 'type', ua.activity_type,
                 'data', ua.activity_data,
                 'created_at', ua.created_at
               )
             )
             FROM user_activity ua
             WHERE ua.user_id = user_uuid
             ORDER BY ua.created_at DESC
             LIMIT 10
           ),
           'favorites', (
             SELECT json_agg(
               json_build_object(
                 'tool_id', uf.tool_id,
                 'created_at', uf.created_at
               )
             )
             FROM user_favorites uf
             WHERE uf.user_id = user_uuid
             ORDER BY uf.created_at DESC
             LIMIT 10
           )
         ) INTO result;
         
         RETURN result;
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER;`
    ];

    for (const func of functions) {
      const { error: funcError } = await supabase.rpc('exec_sql', { sql: func });
      if (funcError) {
        console.error('❌ Error creating function:', funcError);
      }
    }

    console.log('✅ Dashboard functions created');

    console.log('\n🎉 User Dashboard setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your API routes to use these tables');
    console.log('2. Create user profile on signup');
    console.log('3. Track user activity in your components');
    console.log('4. Implement the recommendation algorithm');
    console.log('5. Add points system for gamification');

  } catch (error) {
    console.error('💥 Setup failed:', error);
  }
}

// CLI interface
if (require.main === module) {
  setupUserDashboard()
    .then(() => {
      console.log('\n✅ User dashboard setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupUserDashboard }; 