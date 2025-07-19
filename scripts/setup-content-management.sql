-- Content Management Database Setup
-- Run this script in your Supabase SQL Editor

-- Create content_management table
CREATE TABLE IF NOT EXISTS content_management (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('news', 'tool-update', 'announcement', 'feature')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    publish_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}',
    target_audience TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    views INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0
);

-- Create content_cache table for tracking updates
CREATE TABLE IF NOT EXISTS content_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    cache_version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_analytics table for tracking performance
CREATE TABLE IF NOT EXISTS content_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES content_management(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_schedules table for scheduled publishing
CREATE TABLE IF NOT EXISTS content_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES content_management(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'cancelled')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_management_type ON content_management(type);
CREATE INDEX IF NOT EXISTS idx_content_management_status ON content_management(status);
CREATE INDEX IF NOT EXISTS idx_content_management_created_at ON content_management(created_at);
CREATE INDEX IF NOT EXISTS idx_content_cache_type ON content_cache(content_type);
CREATE INDEX IF NOT EXISTS idx_content_analytics_date ON content_analytics(date);

-- Enable Row Level Security (RLS)
ALTER TABLE content_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for content_management
CREATE POLICY "Admins can manage all content" ON content_management
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Users can view published content" ON content_management
    FOR SELECT USING (status = 'published');

-- Create RLS policies for content_cache
CREATE POLICY "Admins can manage cache" ON content_cache
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Users can view cache" ON content_cache
    FOR SELECT USING (true);

-- Create RLS policies for content_analytics
CREATE POLICY "Admins can manage analytics" ON content_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Create RLS policies for content_schedules
CREATE POLICY "Admins can manage schedules" ON content_schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for content_management
CREATE TRIGGER update_content_management_updated_at 
    BEFORE UPDATE ON content_management 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle content publishing
CREATE OR REPLACE FUNCTION publish_content(content_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE content_management 
    SET status = 'published', 
        publish_date = NOW(),
        updated_at = NOW()
    WHERE id = content_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create function to get content statistics
CREATE OR REPLACE FUNCTION get_content_stats()
RETURNS TABLE (
    total_content INTEGER,
    published_content INTEGER,
    draft_content INTEGER,
    scheduled_content INTEGER,
    total_views INTEGER,
    avg_engagement DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_content,
        COUNT(*) FILTER (WHERE status = 'published')::INTEGER as published_content,
        COUNT(*) FILTER (WHERE status = 'draft')::INTEGER as draft_content,
        COUNT(*) FILTER (WHERE status = 'scheduled')::INTEGER as scheduled_content,
        COALESCE(SUM(views), 0)::INTEGER as total_views,
        COALESCE(AVG(engagement), 0)::DECIMAL(5,2) as avg_engagement
    FROM content_management;
END;
$$ LANGUAGE plpgsql;

-- Insert initial cache records
INSERT INTO content_cache (content_type, last_updated) VALUES
    ('news', NOW()),
    ('tool-update', NOW()),
    ('announcement', NOW()),
    ('feature', NOW())
ON CONFLICT (content_type) DO NOTHING;

-- Create view for content dashboard
CREATE OR REPLACE VIEW content_dashboard AS
SELECT 
    cm.id,
    cm.type,
    cm.title,
    cm.status,
    cm.priority,
    cm.publish_date,
    cm.created_at,
    cm.views,
    cm.engagement,
    u.email as created_by_email,
    cc.last_updated as cache_updated
FROM content_management cm
LEFT JOIN auth.users u ON cm.created_by = u.id
LEFT JOIN content_cache cc ON cm.type = cc.content_type
ORDER BY cm.created_at DESC;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON content_management TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON content_cache TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON content_analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON content_schedules TO authenticated;
GRANT SELECT ON content_dashboard TO authenticated;

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_content_views(content_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE content_management 
    SET views = views + 1 
    WHERE id = content_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to track engagement
CREATE OR REPLACE FUNCTION track_content_engagement(content_id UUID, engagement_type TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO content_analytics (content_id, clicks, shares, date)
    VALUES (
        content_id,
        CASE WHEN engagement_type = 'click' THEN 1 ELSE 0 END,
        CASE WHEN engagement_type = 'share' THEN 1 ELSE 0 END,
        CURRENT_DATE
    )
    ON CONFLICT (content_id, date) 
    DO UPDATE SET
        clicks = content_analytics.clicks + CASE WHEN engagement_type = 'click' THEN 1 ELSE 0 END,
        shares = content_analytics.shares + CASE WHEN engagement_type = 'share' THEN 1 ELSE 0 END;
END;
$$ LANGUAGE plpgsql; 