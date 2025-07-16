-- Enable RLS on tables
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create basic policies for tools
CREATE POLICY "tools_select_policy" ON tools FOR SELECT USING (true);
CREATE POLICY "tools_insert_policy" ON tools FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "tools_update_policy" ON tools FOR UPDATE USING (auth.uid()::text = user_name);
CREATE POLICY "tools_delete_policy" ON tools FOR DELETE USING (auth.uid()::text = user_name);

-- Create basic policies for reviews
CREATE POLICY "reviews_select_policy" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_policy" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "reviews_update_policy" ON reviews FOR UPDATE USING (auth.uid()::text = user_name);
CREATE POLICY "reviews_delete_policy" ON reviews FOR DELETE USING (auth.uid()::text = user_name); 