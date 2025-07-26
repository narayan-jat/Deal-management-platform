-- ================================================
-- Create a policy to allow the user to read documents from the deal-documents bucket.
CREATE POLICY "Allow deal members to read documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'deal-documents'
  AND EXISTS (
    SELECT 1
    FROM deal_members
    WHERE deal_members.deal_id::text = (storage.foldername(name))[1]
    AND deal_members.member_id = auth.uid()
  )
);

-- ================================================
-- Create a policy to allow the user to upload documents to the deal-documents bucket.
CREATE POLICY "Allow editors/owners/admins to upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'deal-documents'
  AND EXISTS (
    SELECT 1
    FROM deal_members
    WHERE deal_members.deal_id::text = (storage.foldername(name))[1]
    AND deal_members.member_id = auth.uid()
    AND deal_members.role IN ('OWNER', 'EDITOR', 'ADMIN')
  )
);


-- ================================================
-- Create a policy to allow the user to delete documents from the deal-documents bucket.
CREATE POLICY "Allow editors/owners/admins to delete documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'deal-documents'
  AND EXISTS (
    SELECT 1
    FROM deal_members
    WHERE deal_members.deal_id::text = (storage.foldername(name))[1]
    AND deal_members.member_id = auth.uid()
    AND deal_members.role IN ('OWNER', 'ADMIN', 'EDITOR')
  )
);

-- ================================================
-- Create a policy to allow the user to update documents in the deal-documents bucket.
CREATE POLICY "Allow editors/owners/admins to update documents"
ON storage.objects
FOR UPDATE
WITH CHECK (
  bucket_id = 'deal-documents'
  AND EXISTS (
    SELECT 1
    FROM deal_members
    WHERE deal_members.deal_id::text = (storage.foldername(name))[1]
    AND deal_members.member_id = auth.uid()
    AND deal_members.role IN ('OWNER', 'ADMIN', 'EDITOR')
  )
);
