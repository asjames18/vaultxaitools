-- Schema alignment: ministry categories, favorites FK, blog read_time, user profiles

-- Ministry-focused categories (idempotent)
INSERT INTO categories (name, description, icon)
VALUES
  ('Video Editing', 'Video editing tools for church and ministry videos', '🎬'),
  ('Graphics Design', 'Graphics design tools for church media', '🎨'),
  ('Social Media', 'Social media management for ministry outreach', '📱'),
  ('Live Streaming', 'Live streaming for church services and events', '📺'),
  ('Audio/Podcasting', 'Audio production for sermons and podcasts', '🎙️'),
  ('Presentation', 'Presentation tools for worship and teaching', '📊'),
  ('Photography', 'Photography tools for church events', '📷'),
  ('Website/Hosting', 'Website and hosting for ministries', '🌐'),
  ('Communication', 'Communication tools for church teams', '💬'),
  ('Productivity', 'Productivity tools for ministry staff', '⚡')
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;

-- Ensure blog_posts.read_time is integer (safe if already integer)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts'
      AND column_name = 'read_time'
      AND data_type <> 'integer'
  ) THEN
    ALTER TABLE blog_posts
      ALTER COLUMN read_time TYPE INTEGER USING COALESCE(NULLIF(read_time::text, '')::integer, 5);
  END IF;
END $$;

-- User profiles and activity (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Explorer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  tool_id UUID,
  tool_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own activity" ON user_activity;
CREATE POLICY "Users can view own activity" ON user_activity
  FOR SELECT USING (auth.uid() = user_id);

-- Favorites: migrate tool_id TEXT to UUID FK where possible
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'favorites' AND column_name = 'tool_id' AND data_type = 'text'
  ) THEN
    DELETE FROM favorites f
    WHERE f.tool_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

    ALTER TABLE favorites ALTER COLUMN tool_id TYPE UUID USING tool_id::uuid;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'favorites_tool_id_fkey'
    ) THEN
      ALTER TABLE favorites
        ADD CONSTRAINT favorites_tool_id_fkey
        FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
