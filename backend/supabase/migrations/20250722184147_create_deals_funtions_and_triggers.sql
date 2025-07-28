-- =====================================================
-- DEALS SYSTEM - FUNCTIONS AND TRIGGERS
-- =====================================================
-- This file contains all functions and triggers for the deals system
-- Functions and triggers are organized by purpose and table
-- =====================================================

-- =====================================================
-- DROP EXISTING TRIGGERS AND FUNCTIONS
-- =====================================================

-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
-- Drop triggers first (in reverse order)
DROP TRIGGER IF EXISTS log_deal_deletion ON deals;
DROP TRIGGER IF EXISTS insert_deal_related_data ON deals;

-- Drop functions
DROP FUNCTION IF EXISTS log_deal_deletion() CASCADE;
DROP FUNCTION IF EXISTS insert_deal_related_data() CASCADE;

-- =====================================================
-- DEAL CREATION TRIGGER FUNCTION
-- =====================================================
-- Creating a deal will trigger to insert a row in following tables:
-- 1. deal_members
-- 2. deal_logs
-- 3. deal_permissions

-- Function to insert a row in deal_members, deal_logs and deal_permissions tables
CREATE OR REPLACE FUNCTION insert_deal_related_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a row in deal_members table
    INSERT INTO deal_members (deal_id, member_id, added_by, role)
    VALUES (NEW.id, NEW.created_by, NEW.created_by, 'OWNER');

    -- Insert a row in deal_logs table
    INSERT INTO deal_logs (deal_id, member_id, log_type)
    VALUES (NEW.id, NEW.created_by, 'CREATED');

    -- Insert a row in deal_permissions table
    INSERT INTO deal_permissions (deal_id, member_id, can_edit, can_comment, can_upload_files, can_view, can_move_deal)
    VALUES (NEW.id, NEW.created_by, TRUE, TRUE, TRUE, TRUE, TRUE);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DEAL DELETION LOGGING FUNCTION
-- =====================================================
-- Function to log the deal deletion.
CREATE OR REPLACE FUNCTION log_deal_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert a row in deal_logs table
    INSERT INTO deal_logs (deal_id, member_id, log_type)
    VALUES (OLD.id, auth.uid(), 'DELETED');

    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- =====================================================
-- DEAL CREATION TRIGGER
-- =====================================================
-- Trigger to insert a row in deal_members, deal_logs and deal_permissions tables
CREATE TRIGGER insert_deal_related_data
AFTER INSERT ON deals
FOR EACH ROW
EXECUTE FUNCTION insert_deal_related_data();

-- =====================================================
-- DEAL DELETION TRIGGER
-- =====================================================
-- Trigger to log the deal deletion.
CREATE TRIGGER log_deal_deletion
AFTER DELETE ON deals
FOR EACH ROW
EXECUTE FUNCTION log_deal_deletion();

-- =====================================================
-- NOTES
-- =====================================================
-- Note: Deal logging for the updates may be complex and may needs more context
-- So will be handled in client side services for logging. 