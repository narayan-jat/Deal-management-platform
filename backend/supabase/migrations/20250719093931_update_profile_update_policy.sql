-- DROP EXISTING POLICIES
-- =====================================================

-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Only owners can update their profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
