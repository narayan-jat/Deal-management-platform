-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================

-- =====================================================
-- CREATE TABLE
-- =====================================================
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  data jsonb NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE TABLE POLICIES
-- =====================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create read policy.
CREATE POLICY "Allow authenticated users to read their own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (
  auth.role() = 'authenticated'
);

-- Create insert policy.
CREATE POLICY "Allow authenticated users to insert their own notifications"
ON notifications
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
);

-- Create update policy.
CREATE POLICY "Allow users to update their own notifications"
ON notifications
FOR UPDATE
USING (
    auth.role() = 'authenticated'
)
WITH CHECK (
    auth.role() = 'authenticated'
);

-- Create delete policy.
CREATE POLICY "Allow users to delete their own notifications"
ON notifications
FOR DELETE
USING (
    auth.uid() = user_id
);