-- =============================================================================
-- Migration 003: Phase 15 Gamification & Recommendations
-- Melanated In Tech Platform
-- =============================================================================
-- Idempotent: uses IF NOT EXISTS, DO $$ blocks, and ON CONFLICT DO NOTHING

-- ---------------------------------------------------------------------------
-- 1. Fix ministry/church-focused category descriptions
-- ---------------------------------------------------------------------------
UPDATE categories SET description = 'AI-powered video editing and production tools'
  WHERE name = 'Video Editing';

UPDATE categories SET description = 'AI graphics design and image generation tools'
  WHERE name = 'Graphics Design';

UPDATE categories SET description = 'AI writing assistants and content creation tools'
  WHERE name = 'Writing & Content';

UPDATE categories SET description = 'AI tools for music creation and audio production'
  WHERE name = 'Music & Audio';

UPDATE categories SET description = 'AI coding assistants and software development tools'
  WHERE name = 'Coding & Development';

UPDATE categories SET description = 'AI tools for business productivity and workflow automation'
  WHERE name = 'Productivity';

UPDATE categories SET description = 'AI chatbots and conversational assistant tools'
  WHERE name = 'Chatbots & Assistants';

UPDATE categories SET description = 'AI tools for social media content and marketing'
  WHERE name = 'Social Media';

UPDATE categories SET description = 'AI-powered data analysis and business intelligence tools'
  WHERE name = 'Data & Analytics';

UPDATE categories SET description = 'AI tools for education, tutoring, and skill development'
  WHERE name = 'Education & Learning';

UPDATE categories SET description = 'AI tools for customer service and support automation'
  WHERE name = 'Customer Support';

UPDATE categories SET description = 'AI-powered research and information gathering tools'
  WHERE name = 'Research';

UPDATE categories SET description = 'AI tools for sales enablement and revenue generation'
  WHERE name = 'Sales & CRM';

UPDATE categories SET description = 'AI image generation and visual creation tools'
  WHERE name = 'Image Generation';

UPDATE categories SET description = 'AI tools for search engine optimization and digital marketing'
  WHERE name = 'SEO & Marketing';

-- ---------------------------------------------------------------------------
-- 2. Add missing columns to profiles
-- ---------------------------------------------------------------------------
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS skill_level TEXT DEFAULT 'beginner'
    CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert'));

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS learning_path TEXT DEFAULT 'explorer';

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_active_date DATE;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS total_tools_viewed INTEGER DEFAULT 0;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS organization TEXT;

-- ---------------------------------------------------------------------------
-- 3. Create achievements table (badge catalog)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('discovery', 'learning', 'community', 'streak', 'milestone')),
  points_reward INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 4. Create user_achievements table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ---------------------------------------------------------------------------
-- 5. Create user_recommendations table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  score FLOAT DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- ---------------------------------------------------------------------------
-- 6. Row Level Security
-- ---------------------------------------------------------------------------

-- achievements: public read, no user writes (admin-managed catalog)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'achievements' AND policyname = 'achievements_public_read'
  ) THEN
    CREATE POLICY achievements_public_read ON achievements
      FOR SELECT USING (true);
  END IF;
END $$;

-- user_achievements: users read/write own rows
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_achievements' AND policyname = 'user_achievements_select_own'
  ) THEN
    CREATE POLICY user_achievements_select_own ON user_achievements
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_achievements' AND policyname = 'user_achievements_insert_own'
  ) THEN
    CREATE POLICY user_achievements_insert_own ON user_achievements
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_achievements' AND policyname = 'user_achievements_delete_own'
  ) THEN
    CREATE POLICY user_achievements_delete_own ON user_achievements
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- user_recommendations: users read/write own rows
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_recommendations' AND policyname = 'user_recommendations_select_own'
  ) THEN
    CREATE POLICY user_recommendations_select_own ON user_recommendations
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_recommendations' AND policyname = 'user_recommendations_insert_own'
  ) THEN
    CREATE POLICY user_recommendations_insert_own ON user_recommendations
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_recommendations' AND policyname = 'user_recommendations_update_own'
  ) THEN
    CREATE POLICY user_recommendations_update_own ON user_recommendations
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'user_recommendations' AND policyname = 'user_recommendations_delete_own'
  ) THEN
    CREATE POLICY user_recommendations_delete_own ON user_recommendations
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 7. Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id
  ON user_achievements (user_id);

CREATE INDEX IF NOT EXISTS idx_user_recommendations_user_id
  ON user_recommendations (user_id);

CREATE INDEX IF NOT EXISTS idx_user_recommendations_score
  ON user_recommendations (score DESC);

-- ---------------------------------------------------------------------------
-- 8. Seed achievements catalog (15 achievements across 5 categories)
-- ---------------------------------------------------------------------------
INSERT INTO achievements (slug, name, description, icon, category, points_reward, requirement_type, requirement_value)
VALUES
  -- Discovery (4)
  ('first-tool-view',    'Discovered Your First Tool',  'Viewed your very first AI tool on the platform',          '🔍', 'discovery',  10,  'tools_viewed',      1),
  ('tool-explorer',      'Tool Explorer',               'Viewed 10 different AI tools',                            '🧭', 'discovery',  25,  'tools_viewed',     10),
  ('tool-enthusiast',    'Tool Enthusiast',             'Viewed 50 different AI tools',                            '🚀', 'discovery', 100,  'tools_viewed',     50),
  ('category-explorer',  'Category Explorer',           'Explored tools across 5 different categories',            '🗂️', 'discovery',  40,  'categories_viewed',  5),

  -- Learning (2)
  ('skill-setter',       'Skill Setter',                'Set your skill level to personalize your experience',     '🎯', 'learning',   10,  'skill_level_set',    1),
  ('path-chooser',       'Path Chooser',                'Chose a learning path to guide your AI journey',          '🛤️', 'learning',   10,  'learning_path_set',  1),

  -- Community (2)
  ('first-review',       'First Reviewer',              'Wrote your first tool review to help the community',      '✍️', 'community',  20,  'reviews_written',    1),
  ('reviewer',           'Trusted Reviewer',            'Wrote 5 tool reviews sharing your expertise',             '⭐', 'community', 100,  'reviews_written',    5),

  -- Streak (3)
  ('3-day-streak',       '3 Day Streak',                'Visited the platform 3 days in a row',                    '🔥', 'streak',     30,  'streak_days',        3),
  ('7-day-streak',       '7 Day Streak',                'Maintained a 7-day learning streak',                      '⚡', 'streak',     75,  'streak_days',        7),
  ('30-day-streak',      '30 Day Streak',               'Achieved an incredible 30-day learning streak',           '💎', 'streak',    250,  'streak_days',       30),

  -- Milestone (4)
  ('first-favorite',     'First Favorite',              'Saved your first AI tool to favorites',                   '❤️', 'milestone',  15,  'favorites_saved',    1),
  ('collector',          'Collector',                   'Built a favorites list of 10 AI tools',                   '📚', 'milestone',  50,  'favorites_saved',   10),
  ('profile-complete',   'Profile Complete',            'Completed your Melanated In Tech profile',                '👤', 'milestone',  25,  'profile_complete',   1),
  ('power-user',         'Power User',                  'Earned 500 points through platform engagement',           '🏆', 'milestone', 150,  'points_earned',    500)
ON CONFLICT (slug) DO NOTHING;
