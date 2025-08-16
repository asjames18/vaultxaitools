-- Tools curation schema + RLS
-- Run this in the Supabase SQL editor (or psql) on your project

-- 1) Ensure columns exist for curation workflow
ALTER TABLE tools 
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  ADD COLUMN IF NOT EXISTS curator_notes text,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS features text[],
  ADD COLUMN IF NOT EXISTS pros text[],
  ADD COLUMN IF NOT EXISTS cons text[],
  ADD COLUMN IF NOT EXISTS tags text[],
  ADD COLUMN IF NOT EXISTS og_image_url text,
  ADD COLUMN IF NOT EXISTS favicon_url text;

-- 2) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_updated_at ON tools(updated_at);

-- 3) RLS: Only published tools are visible publicly; admins manage tools
-- Enable RLS if not already
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that conflict
DROP POLICY IF EXISTS "Anyone can view tools" ON tools;
DROP POLICY IF EXISTS "Public can view tools" ON tools;
DROP POLICY IF EXISTS "Admins can manage tools" ON tools;

-- Public can view only published tools
CREATE POLICY "Public can view published tools" ON tools
  FOR SELECT USING (status = 'published');

-- Admin full manage
CREATE POLICY "Admins can manage tools" ON tools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Optional: prevent non-admin inserts with anon keys explicitly (redundant if only server inserts)
-- You can omit if you only insert through server-side admin routes

-- 4) Data hygiene: set default timestamps if missing
UPDATE tools SET updated_at = NOW() WHERE updated_at IS NULL;

-- 5) (Optional) backfill status for currently live tools
-- UPDATE tools SET status = 'published' WHERE status IS NULL OR status = 'draft';


