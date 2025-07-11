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

-- Create policies
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_email_signups_updated_at 
  BEFORE UPDATE ON email_signups 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 