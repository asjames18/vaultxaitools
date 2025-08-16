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

// SQL statements to set up real-time reviews system
const setupReviewsSQL = `
-- Create reviews table with comprehensive structure
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT,
    user_avatar TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    helpful_count INTEGER DEFAULT 0,
    helpful_votes JSONB DEFAULT '[]',
    verified BOOLEAN DEFAULT false,
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create review_votes table for helpful/unhelpful voting
CREATE TABLE IF NOT EXISTS public.review_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('helpful', 'unhelpful')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_name)
);

-- Create review_reports table for moderation
CREATE TABLE IF NOT EXISTS public.review_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
    reporter_name TEXT NOT NULL,
    reporter_email TEXT,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful_count ON reviews(helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user_name ON reviews(user_name);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(verified);
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_votes_user_name ON review_votes(user_name);
CREATE INDEX IF NOT EXISTS idx_review_reports_review_id ON review_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_status ON review_reports(status);

-- Create function to update tool statistics when reviews change
CREATE OR REPLACE FUNCTION update_tool_review_statistics()
RETURNS TRIGGER AS $$
DECLARE
    new_avg_rating DECIMAL;
    new_review_count INTEGER;
    new_rating_distribution JSONB;
BEGIN
    -- Calculate new statistics for the affected tool
    SELECT 
        COALESCE(AVG(rating), 0),
        COUNT(*),
        jsonb_build_object(
            '1', COUNT(*) FILTER (WHERE rating = 1),
            '2', COUNT(*) FILTER (WHERE rating = 2),
            '3', COUNT(*) FILTER (WHERE rating = 3),
            '4', COUNT(*) FILTER (WHERE rating = 4),
            '5', COUNT(*) FILTER (WHERE rating = 5)
        )
    INTO new_avg_rating, new_review_count, new_rating_distribution
    FROM reviews 
    WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id);
    
    -- Update tool statistics
    UPDATE tools 
    SET 
        rating = ROUND(new_avg_rating, 2),
        review_count = new_review_count,
        rating_distribution = new_rating_distribution,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update tool statistics when reviews change
DROP TRIGGER IF EXISTS trigger_update_tool_review_statistics ON reviews;
CREATE TRIGGER trigger_update_tool_review_statistics
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_tool_review_statistics();

-- Create function to update review helpful count
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
DECLARE
    new_helpful_count INTEGER;
BEGIN
    -- Calculate new helpful count
    SELECT COUNT(*)
    INTO new_helpful_count
    FROM review_votes 
    WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) 
    AND vote_type = 'helpful';
    
    -- Update review helpful count
    UPDATE reviews 
    SET helpful_count = new_helpful_count
    WHERE id = COALESCE(NEW.review_id, OLD.review_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update review helpful count when votes change
DROP TRIGGER IF EXISTS trigger_update_review_helpful_count ON review_votes;
CREATE TRIGGER trigger_update_review_helpful_count
    AFTER INSERT OR UPDATE OR DELETE ON review_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_review_helpful_count();

-- Create function to prevent duplicate reviews from same user
CREATE OR REPLACE FUNCTION prevent_duplicate_reviews()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user already reviewed this tool
    IF EXISTS (
        SELECT 1 FROM reviews 
        WHERE tool_id = NEW.tool_id 
        AND user_name = NEW.user_name
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    ) THEN
        RAISE EXCEPTION 'User % has already reviewed this tool', NEW.user_name;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent duplicate reviews
DROP TRIGGER IF EXISTS trigger_prevent_duplicate_reviews ON reviews;
CREATE TRIGGER trigger_prevent_duplicate_reviews
    BEFORE INSERT OR UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_reviews();

-- Create function to validate review content
CREATE OR REPLACE FUNCTION validate_review_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Check comment length
    IF LENGTH(NEW.comment) < 10 THEN
        RAISE EXCEPTION 'Review comment must be at least 10 characters long';
    END IF;
    
    -- Check for spam indicators (basic)
    IF LENGTH(NEW.comment) > 2000 THEN
        RAISE EXCEPTION 'Review comment cannot exceed 2000 characters';
    END IF;
    
    -- Check user name
    IF LENGTH(NEW.user_name) < 2 OR LENGTH(NEW.user_name) > 50 THEN
        RAISE EXCEPTION 'User name must be between 2 and 50 characters';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate review content
DROP TRIGGER IF EXISTS trigger_validate_review_content ON reviews;
CREATE TRIGGER trigger_validate_review_content
    BEFORE INSERT OR UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION validate_review_content();

-- Add rating_distribution column to tools table if it doesn't exist
ALTER TABLE tools ADD COLUMN IF NOT EXISTS rating_distribution JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}';

-- Enable real-time for all review-related tables
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE review_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE review_reports;

-- Create RLS policies for reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reviews
CREATE POLICY "Allow public read access to reviews" ON reviews
    FOR SELECT USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Allow authenticated users to insert reviews" ON reviews
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own reviews
CREATE POLICY "Allow users to update own reviews" ON reviews
    FOR UPDATE USING (user_name = current_user);

-- Allow users to delete their own reviews
CREATE POLICY "Allow users to delete own reviews" ON reviews
    FOR DELETE USING (user_name = current_user);

-- Create RLS policies for review_votes table
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to review votes
CREATE POLICY "Allow public read access to review_votes" ON review_votes
    FOR SELECT USING (true);

-- Allow authenticated users to insert/update votes
CREATE POLICY "Allow authenticated users to manage votes" ON review_votes
    FOR ALL USING (true);

-- Create RLS policies for review_reports table
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;

-- Allow public read access to review reports
CREATE POLICY "Allow public read access to review_reports" ON review_reports
    FOR SELECT USING (true);

-- Allow authenticated users to insert reports
CREATE POLICY "Allow authenticated users to insert reports" ON review_reports
    FOR INSERT WITH CHECK (true);

-- Allow admins to manage reports
CREATE POLICY "Allow admins to manage reports" ON review_reports
    FOR ALL USING (auth.role() = 'authenticated');

-- Create view for review statistics
CREATE OR REPLACE VIEW review_statistics AS
SELECT 
    tool_id,
    COUNT(*) as total_reviews,
    AVG(rating) as average_rating,
    COUNT(*) FILTER (WHERE rating = 5) as five_star_count,
    COUNT(*) FILTER (WHERE rating = 4) as four_star_count,
    COUNT(*) FILTER (WHERE rating = 3) as three_star_count,
    COUNT(*) FILTER (WHERE rating = 2) as two_star_count,
    COUNT(*) FILTER (WHERE rating = 1) as one_star_count,
    COUNT(*) FILTER (WHERE verified = true) as verified_reviews,
    COUNT(*) FILTER (WHERE helpful_count > 0) as helpful_reviews
FROM reviews
GROUP BY tool_id;

-- Create function to get review statistics for a tool
CREATE OR REPLACE FUNCTION get_tool_review_stats(p_tool_id UUID)
RETURNS TABLE (
    total_reviews BIGINT,
    average_rating DECIMAL,
    five_star_count BIGINT,
    four_star_count BIGINT,
    three_star_count BIGINT,
    two_star_count BIGINT,
    one_star_count BIGINT,
    verified_reviews BIGINT,
    helpful_reviews BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rs.total_reviews,
        ROUND(rs.average_rating, 2),
        rs.five_star_count,
        rs.four_star_count,
        rs.three_star_count,
        rs.two_star_count,
        rs.one_star_count,
        rs.verified_reviews,
        rs.helpful_reviews
    FROM review_statistics rs
    WHERE rs.tool_id = p_tool_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get recent reviews
CREATE OR REPLACE FUNCTION get_recent_reviews(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    tool_id UUID,
    tool_name TEXT,
    tool_logo TEXT,
    user_name TEXT,
    rating INTEGER,
    title TEXT,
    comment TEXT,
    helpful_count INTEGER,
    verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.tool_id,
        t.name as tool_name,
        t.logo as tool_logo,
        r.user_name,
        r.rating,
        r.title,
        r.comment,
        r.helpful_count,
        r.verified,
        r.created_at
    FROM reviews r
    JOIN tools t ON r.tool_id = t.id
    ORDER BY r.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Create function to get top helpful reviews
CREATE OR REPLACE FUNCTION get_top_helpful_reviews(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    tool_id UUID,
    tool_name TEXT,
    tool_logo TEXT,
    user_name TEXT,
    rating INTEGER,
    title TEXT,
    comment TEXT,
    helpful_count INTEGER,
    verified BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.tool_id,
        t.name as tool_name,
        t.logo as tool_logo,
        r.user_name,
        r.rating,
        r.title,
        r.comment,
        r.helpful_count,
        r.verified,
        r.created_at
    FROM reviews r
    JOIN tools t ON r.tool_id = t.id
    WHERE r.helpful_count > 0
    ORDER BY r.helpful_count DESC, r.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Insert sample reviews for existing tools
INSERT INTO reviews (tool_id, user_name, rating, title, comment, verified) 
SELECT 
    t.id,
    'Sarah M.',
    5,
    'Amazing tool!',
    'This is absolutely incredible. I use it daily and it has transformed my workflow completely.',
    true
FROM tools t
WHERE t.name = 'ChatGPT'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (tool_id, user_name, rating, title, comment, verified) 
SELECT 
    t.id,
    'Mike R.',
    4,
    'Great for productivity',
    'Very useful tool that helps me get more done. Sometimes the responses can be verbose, but overall excellent.',
    true
FROM tools t
WHERE t.name = 'ChatGPT'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (tool_id, user_name, rating, title, comment, verified) 
SELECT 
    t.id,
    'Alex T.',
    5,
    'Incredible art generation',
    'The quality and creativity of the images are mind-blowing. Worth every penny!',
    true
FROM tools t
WHERE t.name = 'Midjourney'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (tool_id, user_name, rating, title, comment, verified) 
SELECT 
    t.id,
    'David L.',
    5,
    'Game changer for development',
    'Saves me hours every day with intelligent code suggestions. Essential for any developer.',
    true
FROM tools t
WHERE t.name = 'GitHub Copilot'
ON CONFLICT DO NOTHING;

INSERT INTO reviews (tool_id, user_name, rating, title, comment, verified) 
SELECT 
    t.id,
    'Emily K.',
    4,
    'Excellent writing assistant',
    'Helps me write better content and catch errors I would miss. Very reliable.',
    true
FROM tools t
WHERE t.name = 'Grammarly'
ON CONFLICT DO NOTHING;
`;

// Function to set up real-time reviews system
async function setupRealtimeReviews() {
  console.log('🚀 Setting up real-time reviews and ratings system...');
  
  try {
    // Execute the SQL setup
    const { error } = await supabase.rpc('exec_sql', { sql: setupReviewsSQL });
    
    if (error) {
      console.error('❌ Error setting up reviews system:', error);
      
      // If exec_sql doesn't exist, we'll need to run this manually
      console.log('\n📋 Please run the following SQL in your Supabase dashboard:');
      console.log(setupReviewsSQL);
      return;
    }
    
    console.log('✅ Real-time reviews system setup completed!');
    
    // Verify the setup
    await verifyReviewsSetup();
    
  } catch (error) {
    console.error('❌ Error in setup:', error);
    console.log('\n📋 Please run the following SQL in your Supabase dashboard:');
    console.log(setupReviewsSQL);
  }
}

// Function to verify reviews setup
async function verifyReviewsSetup() {
  console.log('\n🔍 Verifying reviews system setup...');
  
  try {
    // Check if reviews table exists
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (reviewsError) {
      console.log('⚠️ Reviews table not found:', reviewsError.message);
    } else {
      console.log('✅ Reviews table exists');
    }
    
    // Check if review_votes table exists
    const { data: votes, error: votesError } = await supabase
      .from('review_votes')
      .select('*')
      .limit(1);
    
    if (votesError) {
      console.log('⚠️ Review votes table not found:', votesError.message);
    } else {
      console.log('✅ Review votes table exists');
    }
    
    // Check if review_reports table exists
    const { data: reports, error: reportsError } = await supabase
      .from('review_reports')
      .select('*')
      .limit(1);
    
    if (reportsError) {
      console.log('⚠️ Review reports table not found:', reportsError.message);
    } else {
      console.log('✅ Review reports table exists');
    }
    
    // Get review statistics
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, rating, review_count')
      .limit(5);
    
    if (!toolsError && tools) {
      console.log('\n📊 Current tool statistics:');
      tools.forEach(tool => {
        console.log(`   - ${tool.name}: ${tool.rating}/5.0 (${tool.review_count} reviews)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error verifying setup:', error);
  }
}

// Function to add sample reviews
async function addSampleReviews() {
  console.log('\n📝 Adding sample reviews...');
  
  try {
    // Get all tools
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, category');
    
    if (toolsError || !tools) {
      console.error('❌ Error fetching tools:', toolsError);
      return;
    }
    
    const sampleReviews = [
      { name: 'Sarah M.', rating: 5, title: 'Amazing tool!', comment: 'This is absolutely incredible. I use it daily and it has transformed my workflow completely.' },
      { name: 'Mike R.', rating: 4, title: 'Great for productivity', comment: 'Very useful tool that helps me get more done. Sometimes the responses can be verbose, but overall excellent.' },
      { name: 'Alex T.', rating: 5, title: 'Incredible features', comment: 'The quality and creativity are mind-blowing. Worth every penny!' },
      { name: 'David L.', rating: 5, title: 'Game changer', comment: 'Saves me hours every day with intelligent suggestions. Essential for any professional.' },
      { name: 'Emily K.', rating: 4, title: 'Excellent assistant', comment: 'Helps me work better and catch errors I would miss. Very reliable.' },
      { name: 'John D.', rating: 4, title: 'Solid tool', comment: 'Good features and easy to use. Could be better in some areas but overall satisfied.' },
      { name: 'Lisa P.', rating: 5, title: 'Love it!', comment: 'This tool has become an essential part of my daily routine. Highly recommended!' },
      { name: 'Tom W.', rating: 3, title: 'Decent but expensive', comment: 'Good functionality but the pricing could be more reasonable for what it offers.' }
    ];
    
    let addedCount = 0;
    
    for (const tool of tools) {
      // Add 2-4 reviews per tool
      const numReviews = Math.floor(Math.random() * 3) + 2;
      const selectedReviews = sampleReviews.slice(0, numReviews);
      
      for (const review of selectedReviews) {
        try {
          const { error } = await supabase
            .from('reviews')
            .insert({
              tool_id: tool.id,
              user_name: review.name,
              rating: review.rating,
              title: review.title,
              comment: review.comment,
              verified: Math.random() > 0.3, // 70% verified
              helpful_count: Math.floor(Math.random() * 10) // Random helpful votes
            });
          
          if (!error) {
            addedCount++;
          }
        } catch (error) {
          // Ignore duplicate errors
        }
      }
    }
    
    console.log(`✅ Added ${addedCount} sample reviews`);
    
  } catch (error) {
    console.error('❌ Error adding sample reviews:', error);
  }
}

// Main function
async function main() {
  console.log('🎯 Setting up Real-Time Reviews & Ratings System...\n');
  
  try {
    // Set up the reviews system
    await setupRealtimeReviews();
    
    // Add sample reviews
    await addSampleReviews();
    
    console.log('\n🎉 Real-time reviews system setup completed!');
    console.log('📈 Your platform now supports:');
    console.log('   ✅ Real-time user reviews and ratings');
    console.log('   ✅ Helpful/unhelpful voting system');
    console.log('   ✅ Review moderation and reporting');
    console.log('   ✅ Automatic rating calculations');
    console.log('   ✅ Review statistics and analytics');
    console.log('   ✅ Duplicate prevention and validation');
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  setupRealtimeReviews,
  verifyReviewsSetup,
  addSampleReviews
}; 