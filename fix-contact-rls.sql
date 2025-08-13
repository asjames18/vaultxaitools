-- Fix contact_messages RLS policies
-- Run this in your Supabase SQL Editor

-- First, let's check the current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'contact_messages';

-- Check table constraints
SELECT conname, contype, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'contact_messages'::regclass;

-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'contact_messages';

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON contact_messages;

-- Create new policies
CREATE POLICY "Anyone can create contact messages" ON contact_messages 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage contact messages" ON contact_messages 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Service role full access" ON contact_messages 
FOR ALL USING (auth.role() = 'service_role');

-- Alternative: If you want to temporarily disable RLS for testing
-- ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'contact_messages';
