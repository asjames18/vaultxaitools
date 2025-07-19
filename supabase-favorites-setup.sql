-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  tool_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_tool_id ON favorites(tool_id);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own favorites
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (user_id = auth.jwt() ->>sub');

-- Users can insert their own favorites
CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (user_id = auth.jwt() ->>sub');

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (user_id = auth.jwt() ->>sub');

-- Grant permissions
GRANT ALL ON favorites TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 