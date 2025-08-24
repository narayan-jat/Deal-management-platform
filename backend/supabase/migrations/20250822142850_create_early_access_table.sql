-- =====================================================
-- EARLY ACCESS TABLE
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- =====================================================

-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
DROP TABLE IF EXISTS early_access CASCADE;

-- =====================================================
-- CREATE TYPE
-- =====================================================
CREATE TYPE EarlyAccessAccountType AS ENUM ('LENDER', 'BORROWER', 'BROKER', 'OTHER');

-- =====================================================
-- CREATE TABLE
-- =====================================================
CREATE TABLE early_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NULL,
  company text NOT NULL,
  account_type EarlyAccessAccountType NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Allow authenticated users to read anyone's early access" ON early_access;
DROP POLICY IF EXISTS "Allow users to insert their own early access" ON early_access;
DROP POLICY IF EXISTS "Allow users to update their own early access" ON early_access;
DROP POLICY IF EXISTS "Allow users to delete their own early access" ON early_access;

ALTER TABLE early_access ENABLE ROW LEVEL SECURITY;

-- Create read policy.
CREATE POLICY "Allow authenticated users to read anyone's early access"
ON early_access
FOR SELECT
TO authenticated
USING (
  auth.role() = 'authenticated'
);

-- Create insert policy.
CREATE POLICY "Allow authenticated users to insert their own early access"
ON early_access
FOR INSERT
WITH CHECK (
     auth.role() = 'authenticated'
);

-- Create update policy.
CREATE POLICY "Allow users to update their own early access"
ON early_access
FOR UPDATE
USING (
     auth.role() = 'authenticated'
)
WITH CHECK (
    auth.role() = 'authenticated'
);

-- Create delete policy.
CREATE POLICY "Allow users to delete their own early access"
ON early_access
FOR DELETE
USING (
    auth.role() = 'authenticated'
);