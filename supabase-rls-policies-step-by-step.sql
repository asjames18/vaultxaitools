-- RUN THIS FIRST: Enable RLS on tools table
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- RUN THIS SECOND: Enable RLS on reviews table  
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RUN THIS THIRD: Drop existing tools policies
DROP POLICY IF EXISTS "Public read access" ON tools;
DROP POLICY IF EXISTS "Authenticated users can insert" ON tools;
DROP POLICY IF EXISTS "Users can update own tools" ON tools;
DROP POLICY IF EXISTS "Users can delete own tools" ON tools;

-- RUN THIS FOURTH: Drop existing reviews policies
DROP POLICY IF EXISTS "Public read access" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

-- RUN THIS FIFTH: Create tools read policy
CREATE POLICY "Public read access" ON tools
FOR SELECT USING (true);

-- RUN THIS SIXTH: Create tools insert policy
CREATE POLICY "Authenticated users can insert" ON tools
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RUN THIS SEVENTH: Create tools update policy
CREATE POLICY "Users can update own tools" ON tools
FOR UPDATE USING (auth.uid()::text = user_name)
WITH CHECK (auth.uid()::text = user_name);

-- RUN THIS EIGHTH: Create tools delete policy
CREATE POLICY "Users can delete own tools" ON tools
FOR DELETE USING (auth.uid()::text = user_name);

-- RUN THIS NINTH: Create reviews read policy
CREATE POLICY "Public read access" ON reviews
FOR SELECT USING (true);

-- RUN THIS TENTH: Create reviews insert policy
CREATE POLICY "Authenticated users can insert" ON reviews
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RUN THIS ELEVENTH: Create reviews update policy
CREATE POLICY "Users can update own reviews" ON reviews
FOR UPDATE USING (auth.uid()::text = user_name)
WITH CHECK (auth.uid()::text = user_name);

-- RUN THIS TWELFTH: Create reviews delete policy
CREATE POLICY "Users can delete own reviews" ON reviews
FOR DELETE USING (auth.uid()::text = user_name); 