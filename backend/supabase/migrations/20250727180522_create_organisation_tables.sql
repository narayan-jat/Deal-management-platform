--================================
-- create table for organizations
--================================
-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
-- Drop table if it exists
DROP TABLE IF EXISTS organizations CASCADE;
DROP TYPE IF EXISTS organization_role CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TYPE IF EXISTS organization_role CASCADE;

-- Create enum for organization roles
CREATE TYPE organization_role AS ENUM ('LEADER', 'ADMIN', 'MEMBER');

-- Create table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT NULL,
    logo_path TEXT NULL,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (code)
);

--================================
-- create table for organization members
--================================
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    member_id UUID NOT NULL REFERENCES profiles(id),
    role organization_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (organization_id, member_id)
);

-- Drop policies if they exist
DROP POLICY IF EXISTS "Users can view their own organisations" ON organizations;
DROP POLICY IF EXISTS "Users can insert their own organisations" ON organizations;
DROP POLICY IF EXISTS "Only Leaders and Admins can update their own organisations" ON organizations;
DROP POLICY IF EXISTS "Only Leaders and Admins can delete their own organisations" ON organizations;

DROP POLICY IF EXISTS "Users can view their own organisation members" ON organization_members;
DROP POLICY IF EXISTS "Only Leaders and Admins can insert members" ON organization_members;
DROP POLICY IF EXISTS "Only Leaders and Admins can update members" ON organization_members;
DROP POLICY IF EXISTS "Only Leaders and Admins can delete members" ON organization_members;

--================================
-- Policies for table organisation
--================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own organisations" 
ON organizations
FOR SELECT 
USING (
    created_by = auth.uid()
    OR 
    EXISTS (
        SELECT 1
        FROM organization_members
        WHERE organization_id = organizations.id
        AND member_id = auth.uid()
    )
);

CREATE POLICY "Users can insert their own organisations"
ON organizations
FOR INSERT
WITH CHECK (
    created_by = auth.uid()
    OR
    EXISTS (
        SELECT 1
        FROM organization_members
        WHERE organization_id = organizations.id
        AND member_id = auth.uid()
        AND role IN ('LEADER', 'ADMIN')
    )
);

CREATE POLICY "Only Leaders and Admins can update their own organisations"
ON organizations
FOR UPDATE
USING (
    created_by = auth.uid()
    OR
    EXISTS (
        SELECT 1
        FROM organization_members
        WHERE organization_id = organizations.id
        AND member_id = auth.uid()
        AND role IN ('LEADER', 'ADMIN')
    )
);

CREATE POLICY "Only Leaders and Admins can delete their own organisations"
ON organizations
FOR DELETE
USING (
    created_by = auth.uid()
    OR
    EXISTS (  
        SELECT 1
        FROM organization_members
        WHERE organization_id = organizations.id
        AND member_id = auth.uid()
        AND role IN ('LEADER', 'ADMIN')
    )
);

--================================
-- Policies for table organisation members
--================================
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the user is a member of the organisation
CREATE OR REPLACE FUNCTION is_organization_member(p_organization_id UUID, p_member_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM organization_members
        WHERE organization_id = p_organization_id
        AND member_id = p_member_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- allow only members of the organisation to view the members
CREATE POLICY "Users can view their own organisation members"
ON organization_members
FOR SELECT
USING (
    is_organization_member(organization_id, auth.uid())
);

-- Helper function to check if the user is a member of the organisation with a specific role
CREATE OR REPLACE FUNCTION is_organization_member_with_role(p_organization_id UUID, p_member_id UUID, p_role organization_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM organization_members
        WHERE organization_id = p_organization_id
        AND member_id = p_member_id
        AND role = p_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- allow only leader and admins of the organisation to insert members
CREATE POLICY "Only Leaders and Admins can insert members"
ON organization_members
FOR INSERT
WITH CHECK (
    is_organization_member_with_role(organization_id, auth.uid(), 'LEADER')
    OR is_organization_member_with_role(organization_id, auth.uid(), 'ADMIN')
);

-- allow only leaders and admins of the organisation to update members
CREATE POLICY "Only Leaders and Admins can update members"
ON organization_members
FOR UPDATE USING 
(
    is_organization_member_with_role(organization_id, auth.uid(), 'LEADER')
    OR is_organization_member_with_role(organization_id, auth.uid(), 'ADMIN')
);

-- allow only leaders and admins of the organisation to delete members
CREATE POLICY "Only Leaders and Admins can delete members"
ON organization_members
FOR DELETE USING 
(
    is_organization_member_with_role(organization_id, auth.uid(), 'LEADER')
    OR is_organization_member_with_role(organization_id, auth.uid(), 'ADMIN')
);