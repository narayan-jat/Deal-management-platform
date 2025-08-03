-- =====================================================
-- INVITES TABLE
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- =====================================================

-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
DROP TABLE IF EXISTS invites CASCADE;
DROP TYPE IF EXISTS invite_status CASCADE;

-- Create enum for invite status.
CREATE TYPE invite_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- =====================================================
-- CREATE TABLE
-- =====================================================
CREATE TABLE invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES deals(id),
  email text NOT NULL,
  status invite_status NOT NULL,
  invited_by uuid NOT NULL REFERENCES profiles(id),
  role deal_member_role NOT NULL,
  permissions jsonb NULL,
  token text NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Allow invited users and deal members to read their own invites" ON invites;
DROP POLICY IF EXISTS "Allow invited users and deal members with elevated roles to insert their own invites" ON invites;
DROP POLICY IF EXISTS "Invited user can accept their own invite" ON invites;
DROP POLICY IF EXISTS "Allow invited users and deal members with elevated roles to delete their own invites" ON invites;

ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Create read policy.
CREATE POLICY "Allow invited users and deal members to read their own invites"
ON invites
FOR SELECT
USING (
  invited_by = auth.uid() 
  OR 
  deal_id IN (SELECT deal_id FROM deal_members WHERE member_id = auth.uid()));

-- Create insert policy.
CREATE POLICY "Allow invited users and deal members with elevated roles to insert their own invites"
ON invites
FOR INSERT
WITH CHECK (
  invited_by = auth.uid() 
  OR 
  deal_id IN (
    SELECT deal_id FROM deal_members 
    WHERE member_id = auth.uid() 
    AND role IN ('OWNER', 'ADMIN', 'EDITOR')));

-- Create update policy.
CREATE POLICY "Invited user can accept their own invite"
ON invites
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.email = invites.email
  )
  OR
  deal_id IN (
    SELECT deal_id FROM deal_members 
    WHERE member_id = auth.uid() 
    AND role IN ('OWNER', 'ADMIN', 'EDITOR')) 
);

-- Create delete policy.
CREATE POLICY "Allow invited users and deal members with elevated roles to delete their own invites"
ON invites
FOR DELETE
USING (
  invited_by = auth.uid() 
  OR 
  deal_id IN (
    SELECT deal_id FROM deal_members 
    WHERE member_id = auth.uid() 
    AND role IN ('OWNER', 'ADMIN', 'EDITOR')));