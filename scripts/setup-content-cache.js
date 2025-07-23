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

async function setupContentCache() {
  console.log('🚀 Setting up Content Cache and Automation Settings...');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log('=' .repeat(60));
  
  try {
    // Test if tables exist by trying to query them
    console.log('🔍 Checking if tables exist...');
    
    const { data: cacheData, error: cacheError } = await supabase
      .from('content_cache')
      .select('*')
      .limit(1);
    
    const { data: settingsData, error: settingsError } = await supabase
      .from('automation_settings')
      .select('*')
      .limit(1);
    
    if (cacheError && cacheError.code === 'PGRST116') {
      console.log('❌ content_cache table does not exist');
      console.log('📋 Please run the following SQL in your Supabase SQL Editor:');
      console.log('');
      console.log('🔗 Go to: https://supabase.com/dashboard/project/[your-project]/sql');
      console.log('📄 Copy and paste the contents of: scripts/setup-content-cache.sql');
      console.log('');
      console.log('Or run this SQL directly:');
      console.log(`
-- Create content_cache table
CREATE TABLE IF NOT EXISTS content_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by TEXT DEFAULT 'system',
    cache_version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation_settings table
CREATE TABLE IF NOT EXISTS automation_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_by TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_cache_type ON content_cache(content_type);
CREATE INDEX IF NOT EXISTS idx_automation_settings_key ON automation_settings(setting_key);

-- Enable RLS
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public access to content_cache" ON content_cache FOR ALL USING (true);
CREATE POLICY "Allow public access to automation_settings" ON automation_settings FOR ALL USING (true);

-- Insert initial data
INSERT INTO automation_settings (setting_key, setting_value, description) VALUES
('auto_refresh_enabled', 'false', 'Enable automatic data refresh every 5 minutes'),
('last_tools_discovery', '2025-07-22T00:00:00Z', 'Last time AI tools discovery was run'),
('refresh_interval_minutes', '5', 'How often to refresh data in minutes')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO content_cache (content_type, last_updated) VALUES
('tools', NOW()),
('news', NOW()),
('blog', NOW())
ON CONFLICT DO NOTHING;
      `);
      return;
    }
    
    if (settingsError && settingsError.code === 'PGRST116') {
      console.log('❌ automation_settings table does not exist');
      console.log('📋 Please run the SQL script mentioned above');
      return;
    }
    
    if (!cacheError && !settingsError) {
      console.log('✅ Tables already exist');
      
      // Verify data
      console.log('🔍 Verifying table data...');
      console.log(`📊 Content cache entries: ${cacheData?.length || 0}`);
      console.log(`⚙️ Automation settings: ${settingsData?.length || 0}`);
      
      // Insert initial data if missing
      if (!cacheData || cacheData.length === 0) {
        console.log('📝 Inserting initial content cache entries...');
        const { error } = await supabase
          .from('content_cache')
          .insert([
            { content_type: 'tools', last_updated: new Date().toISOString() },
            { content_type: 'news', last_updated: new Date().toISOString() },
            { content_type: 'blog', last_updated: new Date().toISOString() }
          ]);
        
        if (error) {
          console.error('❌ Error inserting cache data:', error);
        } else {
          console.log('✅ Initial cache data inserted');
        }
      }
      
      if (!settingsData || settingsData.length === 0) {
        console.log('📝 Inserting initial automation settings...');
        const { error } = await supabase
          .from('automation_settings')
          .insert([
            {
              setting_key: 'auto_refresh_enabled',
              setting_value: 'false',
              description: 'Enable automatic data refresh every 5 minutes'
            },
            {
              setting_key: 'last_tools_discovery',
              setting_value: new Date().toISOString(),
              description: 'Last time AI tools discovery was run'
            },
            {
              setting_key: 'refresh_interval_minutes',
              setting_value: '5',
              description: 'How often to refresh data in minutes'
            }
          ]);
        
        if (error) {
          console.error('❌ Error inserting settings:', error);
        } else {
          console.log('✅ Initial settings inserted');
        }
      }
      
      console.log('🎉 Content cache setup completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error setting up content cache:', error);
  }
  
  console.log('=' .repeat(60));
}

// Run the setup
setupContentCache().then(() => {
  process.exit(0);
}); 