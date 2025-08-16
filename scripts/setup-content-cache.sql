-- Content Cache and Automation Settings Setup
-- Run this SQL in your Supabase SQL Editor

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_cache_type ON content_cache(content_type);
CREATE INDEX IF NOT EXISTS idx_content_cache_updated ON content_cache(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_automation_settings_key ON automation_settings(setting_key);

-- Enable RLS
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for content_cache
CREATE POLICY "Allow public read access to content_cache" ON content_cache
  FOR SELECT USING (true);

CREATE POLICY "Allow system insert/update access to content_cache" ON content_cache
  FOR ALL USING (true);

-- Create policies for automation_settings
CREATE POLICY "Allow public read access to automation_settings" ON automation_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow system insert/update access to automation_settings" ON automation_settings
  FOR ALL USING (true);

-- Insert initial automation settings
INSERT INTO automation_settings (setting_key, setting_value, description) VALUES
('auto_refresh_enabled', 'false', 'Enable automatic data refresh every 5 minutes'),
('last_tools_discovery', '2025-07-22T00:00:00Z', 'Last time AI tools discovery was run'),
('refresh_interval_minutes', '5', 'How often to refresh data in minutes')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert initial content cache entries
INSERT INTO content_cache (content_type, last_updated) VALUES
('tools', NOW()),
('news', NOW()),
('blog', NOW())
ON CONFLICT DO NOTHING; 