-- Enable RLS on tools table only for now
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "tools_select_policy" ON tools;
DROP POLICY IF EXISTS "tools_insert_policy" ON tools;
DROP POLICY IF EXISTS "tools_update_policy" ON tools;
DROP POLICY IF EXISTS "tools_delete_policy" ON tools;

-- Tools table policies (no user_name column, so use service role for admin operations)
CREATE POLICY "tools_select_policy" ON tools FOR SELECT USING (true);
CREATE POLICY "tools_insert_policy" ON tools FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "tools_update_policy" ON tools FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "tools_delete_policy" ON tools FOR DELETE USING (auth.role() = 'authenticated'); 