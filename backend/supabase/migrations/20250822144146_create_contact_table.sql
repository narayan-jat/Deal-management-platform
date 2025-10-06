-- =====================================================
-- CONTACT TABLE
-- =====================================================

-- =====================================================
-- CREATE TABLE
-- =====================================================
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE TABLE POLICIES
-- =====================================================

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create read policy.
CREATE POLICY "Allow authenticated users to read anyone's contact"
ON contacts
FOR SELECT
TO authenticated
USING (
  auth.role() = 'authenticated'
);

-- Create insert policy.
CREATE POLICY "Allow authenticated users to insert their own contact"
ON contacts
FOR INSERT
WITH CHECK (
     auth.role() = 'authenticated'
);

-- Create update policy.
CREATE POLICY "Allow users to update their own contact"
ON contacts
FOR UPDATE
USING (
     auth.role() = 'authenticated'
)
WITH CHECK (
    auth.role() = 'authenticated'
);

-- Create delete policy.
CREATE POLICY "Allow users to delete their own contact"
ON contacts
FOR DELETE
USING (
    auth.role() = 'authenticated'
);