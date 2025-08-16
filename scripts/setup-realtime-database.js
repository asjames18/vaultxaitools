const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL statements to set up real-time database
const setupSQL = `
-- Enable real-time for tools table
ALTER PUBLICATION supabase_realtime ADD TABLE tools;

-- Create unique constraint for tool names
ALTER TABLE tools ADD CONSTRAINT tools_name_unique UNIQUE (name);

-- Create unique constraint for reviews (tool_id + user_name)
ALTER TABLE reviews ADD CONSTRAINT reviews_tool_user_unique UNIQUE (tool_id, user_name);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tools_source ON tools(source);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tools_rating_weekly_users ON tools(rating DESC, weekly_users DESC);
CREATE INDEX IF NOT EXISTS idx_tools_category_rating ON tools(category, rating DESC);
CREATE INDEX IF NOT EXISTS idx_tools_tags ON tools USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tools_features ON tools USING GIN(features);
CREATE INDEX IF NOT EXISTS idx_tools_search ON tools USING GIN(to_tsvector('english', name || ' ' || description || ' ' || long_description));

-- Create function to update tool statistics
CREATE OR REPLACE FUNCTION update_tool_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update review count and average rating
  UPDATE tools 
  SET 
    review_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE tool_id = NEW.tool_id
    ),
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE tool_id = NEW.tool_id
    )
  WHERE id = NEW.tool_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update tool statistics when reviews change
DROP TRIGGER IF EXISTS trigger_update_tool_statistics ON reviews;
CREATE TRIGGER trigger_update_tool_statistics
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_statistics();

-- Create function to calculate trending score
CREATE OR REPLACE FUNCTION calculate_trending_score(
  p_rating DECIMAL,
  p_review_count INTEGER,
  p_weekly_users INTEGER,
  p_growth TEXT
) RETURNS DECIMAL AS $$
DECLARE
  growth_numeric DECIMAL;
BEGIN
  -- Extract numeric value from growth string (e.g., "+25%" -> 25)
  growth_numeric := COALESCE(
    NULLIF(regexp_replace(p_growth, '[^0-9.-]', '', 'g'), '')::DECIMAL,
    0
  );
  
  -- Calculate trending score based on multiple factors
  RETURN (
    p_rating * 0.4 + 
    LEAST(p_review_count / 1000.0, 1.0) * 0.2 +
    LEAST(p_weekly_users / 10000.0, 1.0) * 0.2 +
    LEAST(growth_numeric / 100.0, 1.0) * 0.2
  );
END;
$$ LANGUAGE plpgsql;

-- Add trending_score column to tools table
ALTER TABLE tools ADD COLUMN IF NOT EXISTS trending_score DECIMAL(3,2) DEFAULT 0;

-- Create function to update trending scores
CREATE OR REPLACE FUNCTION update_trending_scores()
RETURNS void AS $$
BEGIN
  UPDATE tools 
  SET trending_score = calculate_trending_score(rating, review_count, weekly_users, growth);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update trending scores when tool data changes
CREATE OR REPLACE FUNCTION trigger_update_trending_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.trending_score := calculate_trending_score(NEW.rating, NEW.review_count, NEW.weekly_users, NEW.growth);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_trending_score ON tools;
CREATE TRIGGER trigger_update_trending_score
  BEFORE INSERT OR UPDATE ON tools
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_trending_score();

-- Create table for data source tracking
CREATE TABLE IF NOT EXISTS data_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_name TEXT NOT NULL,
  last_fetch TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tools_found INTEGER DEFAULT 0,
  tools_added INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for tool discovery history
CREATE TABLE IF NOT EXISTS tool_discovery_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  initial_rating DECIMAL(3,2),
  initial_review_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to log tool discovery
CREATE OR REPLACE FUNCTION log_tool_discovery(
  p_tool_id UUID,
  p_source_name TEXT,
  p_initial_rating DECIMAL,
  p_initial_review_count INTEGER
) RETURNS void AS $$
BEGIN
  INSERT INTO tool_discovery_history (
    tool_id, 
    source_name, 
    initial_rating, 
    initial_review_count
  ) VALUES (
    p_tool_id, 
    p_source_name, 
    p_initial_rating, 
    p_initial_review_count
  );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to log tool discovery
CREATE OR REPLACE FUNCTION trigger_log_tool_discovery()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_tool_discovery(
    NEW.id, 
    COALESCE(NEW.source, 'manual'), 
    NEW.rating, 
    NEW.review_count
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_tool_discovery ON tools;
CREATE TRIGGER trigger_log_tool_discovery
  AFTER INSERT ON tools
  FOR EACH ROW
  EXECUTE FUNCTION trigger_log_tool_discovery();

-- Create view for trending tools
CREATE OR REPLACE VIEW trending_tools AS
SELECT 
  id,
  name,
  logo,
  description,
  category,
  rating,
  review_count,
  weekly_users,
  growth,
  trending_score,
  website,
  pricing,
  features,
  tags,
  created_at,
  updated_at
FROM tools
WHERE is_active = true
ORDER BY trending_score DESC, rating DESC, weekly_users DESC;

-- Create view for recently discovered tools
CREATE OR REPLACE VIEW recently_discovered_tools AS
SELECT 
  t.id,
  t.name,
  t.logo,
  t.description,
  t.category,
  t.rating,
  t.review_count,
  t.weekly_users,
  t.growth,
  t.website,
  t.pricing,
  tdh.source_name,
  tdh.discovered_at,
  t.created_at
FROM tools t
JOIN tool_discovery_history tdh ON t.id = tdh.tool_id
WHERE tdh.discovered_at >= NOW() - INTERVAL '7 days'
ORDER BY tdh.discovered_at DESC;

-- Create function to get tools by source
CREATE OR REPLACE FUNCTION get_tools_by_source(p_source TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  category TEXT,
  rating DECIMAL,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.description,
    t.category,
    t.rating,
    t.website,
    t.created_at
  FROM tools t
  WHERE t.source = p_source
  ORDER BY t.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get trending tools by category
CREATE OR REPLACE FUNCTION get_trending_tools_by_category(p_category TEXT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  logo TEXT,
  description TEXT,
  rating DECIMAL,
  trending_score DECIMAL,
  website TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.logo,
    t.description,
    t.rating,
    t.trending_score,
    t.website
  FROM tools t
  WHERE t.category = p_category AND t.is_active = true
  ORDER BY t.trending_score DESC, t.rating DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Insert initial data sources
INSERT INTO data_sources (source_name, status) VALUES
('Product Hunt', 'success'),
('GitHub', 'success'),
('Reddit', 'success'),
('Hacker News', 'success')
ON CONFLICT DO NOTHING;

-- Update existing tools with trending scores
SELECT update_trending_scores();

-- Create RLS policies for new tables
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_discovery_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access to data sources
CREATE POLICY "Allow public read access to data_sources" ON data_sources
  FOR SELECT USING (true);

-- Allow public read access to tool discovery history
CREATE POLICY "Allow public read access to tool_discovery_history" ON tool_discovery_history
  FOR SELECT USING (true);

-- Allow authenticated users to manage data sources
CREATE POLICY "Allow authenticated users to manage data_sources" ON data_sources
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage tool discovery history
CREATE POLICY "Allow authenticated users to manage tool_discovery_history" ON tool_discovery_history
  FOR ALL USING (auth.role() = 'authenticated');
`;

async function setupRealtimeDatabase() {
  console.log('🔧 Setting up real-time database...');
  
  try {
    // Execute the setup SQL
    const { error } = await supabase.rpc('exec_sql', { sql: setupSQL });
    
    if (error) {
      console.error('❌ Error executing setup SQL:', error);
      
      // Fallback: execute statements one by one
      console.log('🔄 Trying fallback method...');
      await executeStatementsIndividually();
    } else {
      console.log('✅ Database setup completed successfully!');
    }
    
    // Verify setup
    await verifySetup();
    
  } catch (error) {
    console.error('❌ Error in database setup:', error);
  }
}

async function executeStatementsIndividually() {
  const statements = setupSQL.split(';').filter(stmt => stmt.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.log(`⚠️ Statement failed: ${statement.substring(0, 50)}...`);
        }
      } catch (error) {
        console.log(`⚠️ Statement error: ${error.message}`);
      }
    }
  }
}

async function verifySetup() {
  console.log('🔍 Verifying database setup...');
  
  try {
    // Check if tables exist
    const { data: toolsData } = await supabase
      .from('tools')
      .select('id, name, trending_score')
      .limit(1);
    
    const { data: sourcesData } = await supabase
      .from('data_sources')
      .select('source_name, status')
      .limit(1);
    
    const { data: historyData } = await supabase
      .from('tool_discovery_history')
      .select('id')
      .limit(1);
    
    console.log('✅ Database verification completed:');
    console.log(`   - Tools table: ${toolsData ? 'OK' : 'Missing'}`);
    console.log(`   - Data sources table: ${sourcesData ? 'OK' : 'Missing'}`);
    console.log(`   - Discovery history table: ${historyData ? 'OK' : 'Missing'}`);
    
    // Check trending tools view
    const { data: trendingData } = await supabase
      .from('trending_tools')
      .select('name, trending_score')
      .limit(5);
    
    console.log(`   - Trending tools view: ${trendingData ? 'OK' : 'Missing'}`);
    
    if (trendingData) {
      console.log('📊 Sample trending tools:');
      trendingData.forEach(tool => {
        console.log(`   - ${tool.name}: ${tool.trending_score}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  setupRealtimeDatabase();
}

module.exports = {
  setupRealtimeDatabase,
  verifySetup
}; 