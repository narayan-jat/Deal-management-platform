-- =====================================================
-- DEALS SYSTEM - TABLES AND ENUMS MIGRATION
-- =====================================================
-- This file contains all table creation statements and enum definitions
-- for the deals system. Tables are created in dependency order.
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- =====================================================

-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
DROP TABLE IF EXISTS deal_documents CASCADE;
DROP TABLE IF EXISTS deal_comments CASCADE;
DROP TABLE IF EXISTS deal_logs CASCADE;
DROP TABLE IF EXISTS deal_permissions CASCADE;
DROP TABLE IF EXISTS deal_members CASCADE;
DROP TABLE IF EXISTS deals CASCADE;

-- =====================================================
-- DROP EXISTING ENUMS
-- =====================================================
DROP TYPE IF EXISTS signature_status CASCADE;
DROP TYPE IF EXISTS log_type CASCADE;
DROP TYPE IF EXISTS deal_member_role CASCADE;
DROP TYPE IF EXISTS deal_status CASCADE;

-- =====================================================
-- ENUM DEFINITIONS
-- =====================================================

-- Deal status enum - represents the current state of a deal
CREATE TYPE deal_status AS ENUM ('NEW', 'IN_PROGRESS', 'NEGOTIATION', 'COMPLETED', 'REJECTED', 'DRAFT');

-- Deal member role enum - represents the role of a member in a deal
CREATE TYPE deal_member_role AS ENUM ('OWNER', 'EDITOR', 'VIEWER', 'ADMIN', 'COMMENTER');

-- Log type enum - represents the type of log entry
CREATE TYPE log_type AS ENUM (
  'CREATED',
  'UPDATED',
  'DELETED',
  'COMMENTED'
);

-- Signature status enum - represents the signature status of a document
CREATE TYPE signature_status AS ENUM (
  'UNSIGNED',
  'SIGNED',
  'PARTIALLY_SIGNED',
  'REJECTED'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- =====================================================
-- DEALS TABLE
-- =====================================================
-- Main deals table that stores all deal information
-- This is the central table that other tables reference
CREATE TABLE deals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    status deal_status NOT NULL,
    created_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    industry TEXT NOT NULL,
    organization_id TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    requested_amount NUMERIC DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    next_meeting_date DATE NOT NULL,
    location TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL
);

-- =====================================================
-- DEAL MEMBERS TABLE
-- =====================================================
-- Stores the members associated with each deal and their roles
-- Note: For the MVP owner, editor and admin have same level of permissions.
CREATE TABLE deal_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  added_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role deal_member_role NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (deal_id, member_id) -- ✅ Enforce no duplicate entries
);

-- =====================================================
-- DEAL PERMISSIONS TABLE
-- =====================================================
-- Stores granular permissions for each member in a deal
CREATE TABLE deal_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  can_edit BOOLEAN NOT NULL DEFAULT FALSE,
  can_comment BOOLEAN NOT NULL DEFAULT FALSE,
  can_upload_files BOOLEAN NOT NULL DEFAULT FALSE,
  can_view BOOLEAN NOT NULL DEFAULT FALSE,
  can_move_deal BOOLEAN NOT NULL DEFAULT FALSE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (deal_id, member_id) -- ✅ Enforce no duplicate entries
);

-- =====================================================
-- DEAL LOGS TABLE
-- =====================================================
-- Stores audit logs for all deal-related activities
CREATE TABLE deal_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  log_type log_type NOT NULL,
  log_data jsonb DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DEAL COMMENTS TABLE
-- =====================================================
-- Stores comments made on deals by members
CREATE TABLE deal_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DEAL DOCUMENTS TABLE
-- =====================================================
-- Stores documents uploaded for deals
CREATE TABLE deal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  signature_status signature_status NOT NULL DEFAULT 'UNSIGNED',
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
-- Enable RLS on all tables for security
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_documents ENABLE ROW LEVEL SECURITY; 