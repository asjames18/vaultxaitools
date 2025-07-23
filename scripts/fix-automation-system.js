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

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function diagnoseSystem() {
  console.log('🔍 AUTOMATION SYSTEM DIAGNOSIS');
  console.log('=' .repeat(50));
  
  // Check 1: Test basic connection
  console.log('\n1. Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('tools').select('count').limit(1);
    if (error) {
      console.log('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Connection successful');
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
  
  // Check 2: Verify tools table
  console.log('\n2. Checking tools table...');
  try {
    const { data, error } = await supabase.from('tools').select('*').limit(5);
    if (error) {
      console.log('❌ Tools table issue:', error.message);
    } else {
      console.log(`✅ Tools table exists with ${data.length} sample records`);
    }
  } catch (error) {
    console.log('❌ Tools table error:', error.message);
  }
  
  // Check 3: Test content_cache table
  console.log('\n3. Checking content_cache table...');
  try {
    const { data, error } = await supabase.from('content_cache').select('*').limit(5);
    if (error) {
      console.log('❌ Content cache table missing:', error.message);
      console.log('🔧 Need to create content_cache table');
      return { needsContentCache: true };
    } else {
      console.log(`✅ Content cache table exists with ${data.length} records`);
    }
  } catch (error) {
    console.log('❌ Content cache error:', error.message);
    return { needsContentCache: true };
  }
  
  // Check 4: Test automation_settings table
  console.log('\n4. Checking automation_settings table...');
  try {
    const { data, error } = await supabase.from('automation_settings').select('*').limit(5);
    if (error) {
      console.log('❌ Automation settings table missing:', error.message);
      console.log('🔧 Need to create automation_settings table');
      return { needsAutomationSettings: true };
    } else {
      console.log(`✅ Automation settings table exists with ${data.length} records`);
    }
  } catch (error) {
    console.log('❌ Automation settings error:', error.message);
    return { needsAutomationSettings: true };
  }
  
  return { allGood: true };
}

async function createMissingTables() {
  console.log('\n🔧 CREATING MISSING TABLES');
  console.log('=' .repeat(50));
  
  // Create content_cache table using basic insert approach
  console.log('\n1. Creating content_cache table...');
  try {
    const testCache = {
      content_type: 'test',
      last_updated: new Date().toISOString(),
      updated_by: 'system'
    };
    
    const { error } = await supabase.from('content_cache').insert(testCache);
    
    if (error && error.code === 'PGRST116') {
      console.log('❌ Table does not exist. Please create it manually.');
      console.log('\n📋 SQL to create content_cache table:');
      console.log(`
CREATE TABLE content_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON content_cache FOR ALL USING (true);
      `);
    } else if (error) {
      console.log('❌ Insert error:', error.message);
    } else {
      console.log('✅ content_cache table exists');
      // Clean up test record
      await supabase.from('content_cache').delete().eq('content_type', 'test');
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
  
  // Create automation_settings table
  console.log('\n2. Creating automation_settings table...');
  try {
    const testSetting = {
      setting_key: 'test',
      setting_value: 'test_value'
    };
    
    const { error } = await supabase.from('automation_settings').insert(testSetting);
    
    if (error && error.code === 'PGRST116') {
      console.log('❌ Table does not exist. Please create it manually.');
      console.log('\n📋 SQL to create automation_settings table:');
      console.log(`
CREATE TABLE automation_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON automation_settings FOR ALL USING (true);
      `);
    } else if (error) {
      console.log('❌ Insert error:', error.message);
    } else {
      console.log('✅ automation_settings table exists');
      // Clean up test record
      await supabase.from('automation_settings').delete().eq('setting_key', 'test');
    }
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

async function testDataRefresh() {
  console.log('\n🧪 TESTING DATA REFRESH');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Calculate stats manually
    console.log('\n1. Testing manual stats calculation...');
    const { data: tools, error } = await supabase.from('tools').select('rating, review_count, weekly_users, category');
    
    if (error) {
      console.log('❌ Failed to fetch tools:', error.message);
      return;
    }
    
    const stats = {
      totalTools: tools.length,
      totalReviews: tools.reduce((sum, tool) => sum + (tool.review_count || 0), 0),
      totalUsers: tools.reduce((sum, tool) => sum + (tool.weekly_users || 0), 0),
      totalCategories: new Set(tools.map(tool => tool.category)).size,
      avgRating: tools.length > 0 
        ? tools.reduce((sum, tool) => sum + (tool.rating || 0), 0) / tools.length 
        : 0
    };
    
    console.log('✅ Stats calculated successfully:');
    console.log(`   🛠️  Tools: ${stats.totalTools}`);
    console.log(`   📝 Reviews: ${(stats.totalReviews / 1000000).toFixed(1)}M`);
    console.log(`   👥 Users: ${(stats.totalUsers / 1000000).toFixed(1)}M`);
    console.log(`   📂 Categories: ${stats.totalCategories}`);
    console.log(`   ⭐ Avg Rating: ${stats.avgRating.toFixed(1)}`);
    
    // Test 2: Try to update content cache (if table exists)
    console.log('\n2. Testing content cache update...');
    try {
      const { error: cacheError } = await supabase
        .from('content_cache')
        .upsert({
          content_type: 'tools',
          last_updated: new Date().toISOString(),
          updated_by: 'test'
        });
      
      if (cacheError) {
        console.log('❌ Cache update failed:', cacheError.message);
      } else {
        console.log('✅ Cache update successful');
      }
    } catch (error) {
      console.log('❌ Cache update error:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

async function provideSolutions() {
  console.log('\n💡 SOLUTIONS & NEXT STEPS');
  console.log('=' .repeat(50));
  
  console.log('\n🔧 To fix the automation system:');
  console.log('1. Create missing tables in Supabase dashboard');
  console.log('2. Copy the SQL provided above');
  console.log('3. Go to: https://supabase.com/dashboard/project/[your-project]/sql');
  console.log('4. Paste and execute the SQL');
  console.log('5. Run: npm run refresh:data');
  
  console.log('\n📋 Complete SQL for all missing tables:');
  console.log(`
-- Create content_cache table
CREATE TABLE IF NOT EXISTS content_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation_settings table  
CREATE TABLE IF NOT EXISTS automation_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to content_cache" ON content_cache FOR ALL USING (true);
CREATE POLICY "Allow public access to automation_settings" ON automation_settings FOR ALL USING (true);

-- Insert initial data
INSERT INTO content_cache (content_type, last_updated) VALUES
('tools', NOW()),
('news', NOW()),
('blog', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO automation_settings (setting_key, setting_value) VALUES
('auto_refresh_enabled', 'false'),
('refresh_interval_minutes', '5')
ON CONFLICT (setting_key) DO NOTHING;
  `);
  
  console.log('\n🚀 After creating tables, test with:');
  console.log('   npm run refresh:data');
  console.log('   npm run automation:combined');
}

// Main execution
async function main() {
  console.log('🔍 VaultX AI Tools - Automation System Diagnostic');
  console.log('=' .repeat(60));
  
  const diagnosis = await diagnoseSystem();
  
  if (diagnosis.needsContentCache || diagnosis.needsAutomationSettings) {
    await createMissingTables();
  }
  
  await testDataRefresh();
  await provideSolutions();
  
  console.log('\n🎉 Diagnostic complete!');
  console.log('=' .repeat(60));
}

main().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Diagnostic failed:', error);
  process.exit(1);
}); 