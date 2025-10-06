-- Anyone logged in can read profile images
CREATE POLICY "Anyone can read profile images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

-- Only owner can upload to their own folder
CREATE POLICY "Owner can upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Only owner can update their own file
CREATE POLICY "Owner can update"
ON storage.objects
FOR UPDATE
WITH CHECK (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Only owner can delete their own file
CREATE POLICY "Owner can delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);