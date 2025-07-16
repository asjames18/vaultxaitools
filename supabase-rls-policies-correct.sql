-- Enable RLS on tables
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "tools_select_policy" ON tools;
DROP POLICY IF EXISTS "tools_insert_policy" ON tools;
DROP POLICY IF EXISTS "tools_update_policy" ON tools;
DROP POLICY IF EXISTS "tools_delete_policy" ON tools;

DROP POLICY IF EXISTS "reviews_select_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_insert_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_update_policy" ON reviews;
DROP POLICY IF EXISTS "reviews_delete_policy" ON reviews;

-- Tools table policies (no user_name column, so use service role for admin operations)
CREATE POLICY "tools_select_policy" ON tools FOR SELECT USING (true);
CREATE POLICY "tools_insert_policy" ON tools FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "tools_update_policy" ON tools FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "tools_delete_policy" ON tools FOR DELETE USING (auth.role() = 'authenticated');

-- Reviews table policies (has user_name column)
CREATE POLICY "reviews_select_policy" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_policy" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "reviews_update_policy" ON reviews FOR UPDATE USING (auth.uid()::text = user_name);
CREATE POLICY "reviews_delete_policy" ON reviews FOR DELETE USING (auth.uid()::text = user_name); 