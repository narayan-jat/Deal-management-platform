-- =====================================================
-- SHARED LINKS TABLE
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- =====================================================

-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
DROP TABLE IF EXISTS shared_links CASCADE;

-- =====================================================
-- CREATE TABLE
-- =====================================================
CREATE TABLE shared_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES deals(id),
  token text NOT NULL,
  expires_at timestamp with time zone NULL,
  role deal_member_role NOT NULL,
  permissions jsonb NULL,
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Allow deal members to read their own shared links" ON shared_links;
DROP POLICY IF EXISTS "Allow deal members with elevated roles to insert their own shared links" ON shared_links;
DROP POLICY IF EXISTS "Allow deal members with elevated roles to update their own shared links" ON shared_links;
DROP POLICY IF EXISTS "Allow deal members with elevated roles to delete their own shared links" ON shared_links;

ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;

-- Create read policy.
CREATE POLICY "Allow deal members to read their own shared links"
ON shared_links
FOR SELECT
USING (
  created_by = auth.uid()
  OR
  deal_id IN (SELECT deal_id FROM deal_members WHERE member_id = auth.uid()));

-- Create insert policy.
CREATE POLICY "Allow deal members with elevated roles to insert their own shared links"
ON shared_links
FOR INSERT
WITH CHECK (
  created_by = auth.uid()
  OR
  deal_id IN (
    SELECT deal_id FROM deal_members 
    WHERE member_id = auth.uid() 
    AND role IN ('OWNER', 'ADMIN', 'EDITOR')));

-- Create update policy.
CREATE POLICY "Allow deal members with elevated roles to update their own shared links"
ON shared_links
FOR UPDATE
USING (
  created_by = auth.uid()
  OR
  deal_id IN (
    SELECT deal_id FROM deal_members 
    WHERE member_id = auth.uid() 
    AND role IN ('OWNER', 'ADMIN', 'EDITOR')));

-- Create delete policy.
CREATE POLICY "Allow deal members with elevated roles to delete their own shared links"
ON shared_links
FOR DELETE
USING (
  created_by = auth.uid() 
  OR 
  deal_id IN (
    SELECT deal_id FROM deal_members 
    WHERE member_id = auth.uid() 
    AND role IN ('OWNER', 'ADMIN', 'EDITOR')));
