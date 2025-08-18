-- =====================================================
-- MATRIX USER TABLE
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- =====================================================

-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
DROP TABLE IF EXISTS matrix_users CASCADE;

-- =====================================================
-- CREATE TABLE
-- =====================================================
CREATE TABLE matrix_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  matrix_user_id text NOT NULL,
  matrix_password text NOT NULL,
  matrix_access_token text NULL,
  matrix_refresh_token text NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE TABLE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Allow authenticated users to read anyone's matrix users" ON matrix_users;
DROP POLICY IF EXISTS "Allow users to insert their own matrix users" ON matrix_users;
DROP POLICY IF EXISTS "Allow users to update their own matrix users" ON matrix_users;
DROP POLICY IF EXISTS "Allow users to delete their own matrix users" ON matrix_users;

ALTER TABLE matrix_users ENABLE ROW LEVEL SECURITY;

-- Create read policy.
CREATE POLICY "Allow authenticated users to read anyone's matrix users"
ON matrix_users
FOR SELECT
TO authenticated
USING (
  auth.role() = 'authenticated'
);

-- Create insert policy.
CREATE POLICY "Allow authenticated users to insert their own matrix users"
ON matrix_users
FOR INSERT
WITH CHECK (
    auth.uid() = user_id
);

-- Create update policy.
CREATE POLICY "Allow users to update their own matrix users"
ON matrix_users
FOR UPDATE
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

-- Create delete policy.
CREATE POLICY "Allow users to delete their own matrix users"
ON matrix_users
FOR DELETE
USING (
    auth.uid() = user_id
);