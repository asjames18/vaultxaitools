-- Complete Supabase Database Setup for VaultX AI Tools
-- This script creates all necessary tables for email collection and tool submissions

-- ========================================
-- EMAIL SIGNUPS TABLE
-- ========================================

-- Create email_signups table
CREATE TABLE IF NOT EXISTS email_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  source TEXT DEFAULT 'website', -- website, modal, footer, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_signups_email ON email_signups(email);
CREATE INDEX IF NOT EXISTS idx_email_signups_subscribed_at ON email_signups(subscribed_at);
CREATE INDEX IF NOT EXISTS idx_email_signups_is_active ON email_signups(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert email signups" ON email_signups;
DROP POLICY IF EXISTS "Admins can view all email signups" ON email_signups;
DROP POLICY IF EXISTS "Admins can update email signups" ON email_signups;

-- Create policies for email_signups
-- Allow anyone to insert email signups
CREATE POLICY "Anyone can insert email signups" ON email_signups
  FOR INSERT WITH CHECK (true);

-- Allow admins to view all email signups
CREATE POLICY "Admins can view all email signups" ON email_signups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@vaultx.com') -- Add your admin emails here
    )
  );

-- Allow admins to update email signups
CREATE POLICY "Admins can update email signups" ON email_signups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@vaultx.com') -- Add your admin emails here
    )
  );

-- ========================================
-- TOOL SUBMISSIONS TABLE
-- ========================================

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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own submissions" ON tool_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON tool_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON tool_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON tool_submissions;

-- Create policies for tool_submissions
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

-- ========================================
-- UTILITY FUNCTIONS AND TRIGGERS
-- ========================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_email_signups_updated_at ON email_signups;
DROP TRIGGER IF EXISTS update_tool_submissions_updated_at ON tool_submissions;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_email_signups_updated_at 
  BEFORE UPDATE ON email_signups 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tool_submissions_updated_at 
  BEFORE UPDATE ON tool_submissions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- You can run these queries to verify the setup:

-- Check if tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('email_signups', 'tool_submissions');

-- Check if RLS is enabled:
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('email_signups', 'tool_submissions');

-- Check if policies were created:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename IN ('email_signups', 'tool_submissions'); 