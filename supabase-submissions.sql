-- Create tool_submissions table
CREATE TABLE IF NOT EXISTS tool_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  website TEXT NOT NULL,
  category TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  additional_info TEXT,
  submitted_by UUID REFERENCES auth.users(id),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tool_submissions_status ON tool_submissions(status);
CREATE INDEX IF NOT EXISTS idx_tool_submissions_submitted_at ON tool_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_tool_submissions_category ON tool_submissions(category);

-- Enable Row Level Security (RLS)
ALTER TABLE tool_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to insert their own submissions
CREATE POLICY "Users can insert their own submissions" ON tool_submissions
  FOR INSERT WITH CHECK (auth.uid() = submitted_by OR submitted_by IS NULL);

-- Allow users to view their own submissions
CREATE POLICY "Users can view their own submissions" ON tool_submissions
  FOR SELECT USING (auth.uid() = submitted_by OR submitted_by IS NULL);

-- Allow admins to view all submissions
CREATE POLICY "Admins can view all submissions" ON tool_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@vaultx.com') -- Add your admin emails here
    )
  );

-- Allow admins to update submissions
CREATE POLICY "Admins can update submissions" ON tool_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@vaultx.com') -- Add your admin emails here
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tool_submissions_updated_at 
  BEFORE UPDATE ON tool_submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 