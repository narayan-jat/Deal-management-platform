-- =====================================================
-- CONTACT TABLE
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- =====================================================

-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
DROP TABLE IF EXISTS contact CASCADE;

-- =====================================================
-- CREATE TABLE
-- =====================================================
CREATE TABLE contact (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Allow authenticated users to read anyone's contact" ON contact;
DROP POLICY IF EXISTS "Allow users to insert their own contact" ON contact;
DROP POLICY IF EXISTS "Allow users to update their own contact" ON contact;
DROP POLICY IF EXISTS "Allow users to delete their own contact" ON contact;

ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Create read policy.
CREATE POLICY "Allow authenticated users to read anyone's contact"
ON contact
FOR SELECT
TO authenticated
USING (
  auth.role() = 'authenticated'
);

-- Create insert policy.
CREATE POLICY "Allow authenticated users to insert their own contact"
ON contact
FOR INSERT
WITH CHECK (
     auth.role() = 'authenticated'
);

-- Create update policy.
CREATE POLICY "Allow users to update their own contact"
ON contact
FOR UPDATE
USING (
     auth.role() = 'authenticated'
)
WITH CHECK (
    auth.role() = 'authenticated'
);

-- Create delete policy.
CREATE POLICY "Allow users to delete their own contact"
ON contact
FOR DELETE
USING (
    auth.role() = 'authenticated'
);