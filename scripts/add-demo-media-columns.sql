-- Add demo media columns to the tools table
-- Run these commands in your Supabase SQL Editor

-- Add demo_images column for storing image URLs and metadata
ALTER TABLE tools 
ADD COLUMN demo_images JSONB DEFAULT '[]'::jsonb;

-- Add demo_videos column for storing video URLs and metadata  
ALTER TABLE tools 
ADD COLUMN demo_videos JSONB DEFAULT '[]'::jsonb;

-- Add demo_gallery column for storing additional media assets
ALTER TABLE tools 
ADD COLUMN demo_gallery JSONB DEFAULT '[]'::jsonb;

-- Add comments to explain what each column stores
COMMENT ON COLUMN tools.demo_images IS 'Array of demo images with URLs, alt text, and descriptions';
COMMENT ON COLUMN tools.demo_videos IS 'Array of demo videos with URLs, thumbnails, and descriptions';
COMMENT ON COLUMN tools.demo_gallery IS 'Array of additional media assets like GIFs, screenshots, etc.';

-- Create GIN indexes for better query performance on JSONB columns
CREATE INDEX idx_tools_demo_images ON tools USING GIN (demo_images);
CREATE INDEX idx_tools_demo_videos ON tools USING GIN (demo_videos);
CREATE INDEX idx_tools_demo_gallery ON tools USING GIN (demo_gallery);

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tools' 
AND column_name IN ('demo_images', 'demo_videos', 'demo_gallery')
ORDER BY ordinal_position;
