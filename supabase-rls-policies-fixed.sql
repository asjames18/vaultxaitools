-- Step 1: Enable Row Level Security on tables
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public read access" ON tools;
DROP POLICY IF EXISTS "Authenticated users can insert" ON tools;
DROP POLICY IF EXISTS "Users can update own tools" ON tools;
DROP POLICY IF EXISTS "Users can delete own tools" ON tools;

DROP POLICY IF EXISTS "Public read access" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

-- Step 3: Create tools table policies
CREATE POLICY "Public read access" ON tools
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert" ON tools
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own tools" ON tools
FOR UPDATE USING (auth.uid()::text = user_name)
WITH CHECK (auth.uid()::text = user_name);

CREATE POLICY "Users can delete own tools" ON tools
FOR DELETE USING (auth.uid()::text = user_name);

-- Step 4: Create reviews table policies
CREATE POLICY "Public read access" ON reviews
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert" ON reviews
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own reviews" ON reviews
FOR UPDATE USING (auth.uid()::text = user_name)
WITH CHECK (auth.uid()::text = user_name);

CREATE POLICY "Users can delete own reviews" ON reviews
FOR DELETE USING (auth.uid()::text = user_name); 