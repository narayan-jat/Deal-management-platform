-- =====================================================
-- DEALS SYSTEM - ROW LEVEL SECURITY POLICIES
-- =====================================================
-- This file contains all RLS policies for the deals system
-- Policies are organized by table and operation type
-- =====================================================

-- =====================================================
-- DROP EXISTING POLICIES
-- =====================================================

-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
-- Drop deal_documents policies
DROP POLICY IF EXISTS "Allow members to delete deal documents for elevated roles" ON deal_documents;
DROP POLICY IF EXISTS "Allow members to update deal documents for elevated roles" ON deal_documents;
DROP POLICY IF EXISTS "Allow members to insert deal documents for elevated roles" ON deal_documents;
DROP POLICY IF EXISTS "Allow members to read deal documents" ON deal_documents;

-- Drop deal_comments policies
DROP POLICY IF EXISTS "Allow deal members to delete deal comments for elevated roles" ON deal_comments;
DROP POLICY IF EXISTS "Allow deal members to update deal comments for elevated roles" ON deal_comments;
DROP POLICY IF EXISTS "Allow deal members to insert deal comments for elevated roles" ON deal_comments;
DROP POLICY IF EXISTS "Allow deal members to read their own deal comments" ON deal_comments;

-- Drop deal_logs policies
DROP POLICY IF EXISTS "Allow deal members to insert deal logs for elevated roles" ON deal_logs;
DROP POLICY IF EXISTS "Allow deal members to read their own deal logs" ON deal_logs;

-- Drop deal_permissions policies
DROP POLICY IF EXISTS "Allow users to delete permissions for elevated roles" ON deal_permissions;
DROP POLICY IF EXISTS "Allow users to update permissions for elevated roles" ON deal_permissions;
DROP POLICY IF EXISTS "Allow users to insert permissions for elevated roles" ON deal_permissions;
DROP POLICY IF EXISTS "Allow users to read their own permissions" ON deal_permissions;

-- Drop deal_members policies
DROP POLICY IF EXISTS "Allow delete on deal_members for elevated roles" ON deal_members;
DROP POLICY IF EXISTS "Allow update on deal_members for elevated roles" ON deal_members;
DROP POLICY IF EXISTS "Allow insert on deal_members for elevated roles" ON deal_members;
DROP POLICY IF EXISTS "Allow read access to deal members" ON deal_members;

-- Drop deals policies
DROP POLICY IF EXISTS "Allow deal members to delete the deal for elevated roles" ON deals;
DROP POLICY IF EXISTS "Allow deal members to update the deal for elevated roles" ON deals;
DROP POLICY IF EXISTS "Currently authenticated user can create a deal" ON deals;
DROP POLICY IF EXISTS "Members can view the deal" ON deals;

-- Drop functions
DROP FUNCTION IF EXISTS is_deal_member(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS is_elevated_member(uuid, uuid) CASCADE;
-- =====================================================
-- DEALS TABLE POLICIES
-- =====================================================

-- Creating policies for the deals table since the organization is the 
-- the cosmetic only so no need to restrict access to the table by organization.
-- Please ensure that later these policies will be updated to restrict access to the table by organization.

-- Policies will be created based on the deal_members and deal_permissions tables.

-- =====================================================
-- DEALS - SELECT POLICY
-- =====================================================
-- The creator and all the members who are in the members of the deal
-- can view the deal.
CREATE POLICY "Members can view the deal"
ON deals
FOR SELECT
USING (
    created_by = auth.uid() OR
    id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid()
    )
);

-- =====================================================
-- DEALS - INSERT POLICY
-- =====================================================
-- Only current authenticated user can create a deal.
CREATE POLICY "Currently authenticated user can create a deal"
ON deals
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- =====================================================
-- DEALS - UPDATE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can update the deal.
CREATE POLICY "Allow deal members to update the deal for elevated roles"
ON deals
FOR UPDATE
USING (
    created_by = auth.uid() OR
    id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
)
WITH CHECK (
    created_by = auth.uid() OR
    id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEALS - DELETE POLICY
-- =====================================================
-- Only EDITOR, OWNER and ADMIN can delete the deal.
CREATE POLICY "Allow deal members to delete the deal for elevated roles"
ON deals
FOR DELETE
USING (
    created_by = auth.uid() OR
    id IN (
        SELECT deal_id FROM deal_members WHERE member_id = auth.uid() AND role IN ('EDITOR', 'OWNER', 'ADMIN')
    )
);

-- =====================================================
-- DEAL MEMBERS TABLE POLICIES
-- =====================================================

-- =====================================================
-- DEAL MEMBERS - SELECT POLICY
-- =====================================================
-- Create a read policy for the deal_members table
-- If the member is part of the deal they are allowed to view deal members.

-- Helper function to check the user is member of deal.
CREATE FUNCTION is_deal_member(p_deal_id uuid, p_member_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM deal_members
    WHERE deal_id = p_deal_id AND member_id = p_member_id
  );
$$;

CREATE POLICY "Allow read access to deal members"
ON deal_members
FOR SELECT
USING (
  is_deal_member(deal_id, auth.uid())
);

-- =====================================================
-- DEAL MEMBERS - INSERT POLICY
-- =====================================================
-- Create a insert policy for the deal_members table
-- Note: Only the owner, editor and admin can insert a member to a deal
-- Note: Also these members can assign any role to the new member.

-- Helper function to check the user is member of deal with elevated roles.
CREATE FUNCTION is_elevated_member(p_deal_id uuid, p_member_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM deal_members
    WHERE deal_id = p_deal_id AND member_id = p_member_id
    AND role IN ('OWNER', 'ADMIN', 'EDITOR')
  );
$$;

CREATE POLICY "Allow insert on deal_members for elevated roles"
ON deal_members
FOR INSERT
WITH CHECK (
    -- Only members with OWNER, EDITOR and ADMIN roles can insert a member to a deal.
    is_elevated_member(deal_id, auth.uid())
);

-- =====================================================
-- DEAL MEMBERS - UPDATE POLICY
-- =====================================================
-- Create a update policy for the deal_members table
-- Note: Only the owner, editor and admin can update a member's role.
CREATE POLICY "Allow update on deal_members for elevated roles"
ON deal_members
FOR UPDATE
USING (
  is_elevated_member(deal_id, auth.uid())
)
WITH CHECK (
  is_elevated_member(deal_id, auth.uid())
);

-- =====================================================
-- DEAL MEMBERS - DELETE POLICY
-- =====================================================
-- Create a delete policy for the deal_members table
-- Note: Only the owner, editor and admin can delete a member from a deal
-- Note: When a member is deleted, the member can no longer access the deal.
CREATE POLICY "Allow delete on deal_members for elevated roles"
ON deal_members
FOR DELETE
USING (
  is_elevated_member(deal_id, auth.uid())
);

-- Note: Not creating any trigger to log the deal member operations. Since
-- this are the part of deal updates so will be handled in deal updates logging.
-- from frontend services.

-- =====================================================
-- DEAL PERMISSIONS TABLE POLICIES
-- =====================================================

-- =====================================================
-- DEAL PERMISSIONS - SELECT POLICY
-- =====================================================
-- Create a read policy for the deal_permissions table
CREATE POLICY "Allow users to read their own permissions"
ON deal_permissions
FOR SELECT
USING (
  member_id = auth.uid()
);

-- =====================================================
-- DEAL PERMISSIONS - INSERT POLICY
-- =====================================================
-- Create a insert policy for the deal_permissions table
CREATE POLICY "Allow users to insert permissions for elevated roles"
ON deal_permissions
FOR INSERT
WITH CHECK (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'ADMIN')
  )
);

-- =====================================================
-- DEAL PERMISSIONS - UPDATE POLICY
-- =====================================================
-- Create a update policy for the deal_permissions table
CREATE POLICY "Allow users to update permissions for elevated roles"
ON deal_permissions
FOR UPDATE
USING (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'ADMIN')
  )
)
WITH CHECK (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'ADMIN')
  )
);

-- =====================================================
-- DEAL PERMISSIONS - DELETE POLICY
-- =====================================================
-- Create a delete policy for the deal_permissions table
CREATE POLICY "Allow users to delete permissions for elevated roles"
ON deal_permissions
FOR DELETE
USING (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'ADMIN')
  )
);

-- Note: Not creating any trigger to log the deal permissions operations. Since
-- this are the part of deal updates so will be handled in deal updates logging.
-- from frontend services.

-- =====================================================
-- DEAL LOGS TABLE POLICIES
-- =====================================================

-- =====================================================
-- DEAL LOGS - SELECT POLICY
-- =====================================================
-- create a read policy for the deals_logs table
CREATE POLICY "Allow deal members to read their own deal logs"
ON deal_logs
FOR SELECT
USING (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid()
  )
);

-- =====================================================
-- DEAL LOGS - INSERT POLICY
-- =====================================================
-- create a insert policy for the deals_logs table
-- Note: With the owner, editor and admin, now commenter also can inser logs.
-- Since commenter will eventually update the deal table. Indirectly by 
-- inserting comment rows in deal_comments table, which is indirectly 
-- updating the deal table, so mutation should be logged.
CREATE POLICY "Allow deal members to insert deal logs for elevated roles"
ON deal_logs
FOR INSERT
WITH CHECK (
  deal_id IN (  
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'COMMENTER', 'ADMIN')
  )
);

-- Note: For integrity purposes, we should not update and delete the logs.
-- So no policies for update and delete. Consequently, update and delete 
-- can not be performed.

-- =====================================================
-- DEAL COMMENTS TABLE POLICIES
-- =====================================================

-- =====================================================
-- DEAL COMMENTS - SELECT POLICY
-- =====================================================
-- create a read policy for the deals_comments table
CREATE POLICY "Allow deal members to read their own deal comments"
ON deal_comments
FOR SELECT
USING (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid()
  )
);

-- =====================================================
-- DEAL COMMENTS - INSERT POLICY
-- =====================================================
-- create a insert policy for the deals_comments table
CREATE POLICY "Allow deal members to insert deal comments for elevated roles"
ON deal_comments
FOR INSERT
WITH CHECK (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'COMMENTER', 'ADMIN')
  )
);

-- =====================================================
-- DEAL COMMENTS - UPDATE POLICY
-- =====================================================
-- create a update policy for the deals_comments table
CREATE POLICY "Allow deal members to update deal comments for elevated roles"
ON deal_comments
FOR UPDATE
USING (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'COMMENTER', 'ADMIN')
  )
)
WITH CHECK (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'COMMENTER', 'ADMIN')
  )
);

-- =====================================================
-- DEAL COMMENTS - DELETE POLICY
-- =====================================================
-- create a delete policy for the deals_comments table
CREATE POLICY "Allow deal members to delete deal comments for elevated roles"
ON deal_comments
FOR DELETE
USING (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'COMMENTER', 'ADMIN')
  )
);

-- =====================================================
-- DEAL DOCUMENTS TABLE POLICIES
-- =====================================================

-- =====================================================
-- DEAL DOCUMENTS - SELECT POLICY
-- =====================================================
-- Create a read policy for the deal_documents table
CREATE POLICY "Allow members to read deal documents"
ON deal_documents
FOR SELECT
USING (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid()
  )
);

-- =====================================================
-- DEAL DOCUMENTS - INSERT POLICY
-- =====================================================
-- Create a insert policy for the deal_documents table
CREATE POLICY "Allow members to insert deal documents for elevated roles"
ON deal_documents
FOR INSERT
WITH CHECK (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'ADMIN')
  )
);

-- =====================================================
-- DEAL DOCUMENTS - UPDATE POLICY
-- =====================================================
-- Create a update policy for the deal_documents table
CREATE POLICY "Allow members to update deal documents for elevated roles"
ON deal_documents
FOR UPDATE
USING (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'ADMIN')
  )
)
WITH CHECK (
  deal_id IN (
    SELECT deal_id FROM deal_members  
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'ADMIN')
  )
);

-- =====================================================
-- DEAL DOCUMENTS - DELETE POLICY
-- =====================================================
-- Create a delete policy for the deal_documents table
CREATE POLICY "Allow members to delete deal documents for elevated roles"
ON deal_documents
FOR DELETE
USING (
  deal_id IN (
    SELECT deal_id FROM deal_members
    WHERE member_id = auth.uid() AND role IN ('OWNER', 'EDITOR', 'ADMIN')
  )
); 