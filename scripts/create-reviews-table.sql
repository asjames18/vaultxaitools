-- Create reviews table for user feedback and recommendations
-- Run these commands in your Supabase SQL Editor

-- Create the reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID, -- Can be null for anonymous reviews
  user_name TEXT NOT NULL,
  user_email TEXT, -- Optional for anonymous users
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pros TEXT[], -- Array of positive points
  cons TEXT[], -- Array of negative points
  use_case TEXT, -- How they use the tool
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  verified_user BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'moderated', 'hidden')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_reviews_helpful_count ON reviews(helpful_count);
CREATE INDEX idx_reviews_status ON reviews(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_reviews_updated_at 
  BEFORE UPDATE ON reviews 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to update tool ratings when reviews change
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the tool's rating and review count
  UPDATE tools 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews 
      WHERE tool_id = NEW.tool_id AND status = 'active'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE tool_id = NEW.tool_id AND status = 'active'
    )
  WHERE id = NEW.tool_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for rating updates
CREATE TRIGGER trigger_update_tool_rating_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_rating();

CREATE TRIGGER trigger_update_tool_rating_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_rating();

CREATE TRIGGER trigger_update_tool_rating_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_rating();

-- Create helpful votes table for review voting
CREATE TABLE IF NOT EXISTS review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID, -- Can be null for anonymous votes
  user_ip TEXT, -- For anonymous user tracking
  vote_type TEXT CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(review_id, user_id, user_ip) -- Prevent duplicate votes
);

-- Create indexes for review votes
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_review_votes_user_id ON review_votes(user_id);

-- Add comments to explain the tables
COMMENT ON TABLE reviews IS 'User reviews and recommendations for AI tools';
COMMENT ON TABLE review_votes IS 'Votes on review helpfulness';
COMMENT ON COLUMN reviews.verified_user IS 'Whether the user has been verified (e.g., email confirmed)';
COMMENT ON COLUMN reviews.experience_level IS 'User experience level with the tool';
COMMENT ON COLUMN reviews.status IS 'Review moderation status';

-- Verify the tables were created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('reviews', 'review_votes')
ORDER BY table_name, ordinal_position;
