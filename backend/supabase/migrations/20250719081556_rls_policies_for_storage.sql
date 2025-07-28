-- Drop existing policies if they exist
-- Note: Dropping of tables, types, and policies is only done because in
-- development, phase things changes but please remove these in production.
drop policy if exists "Anyone can read profile images" on storage.objects;
drop policy if exists "Owner can upload" on storage.objects;
drop policy if exists "Owner can update" on storage.objects;
drop policy if exists "Owner can delete" on storage.objects;

-- Anyone logged in can read profile images
create policy "Anyone can read profile images"
on storage.objects
for select
using (bucket_id = 'profile-images' and auth.role() = 'authenticated');

-- Only owner can upload to their own folder
create policy "Owner can upload"
on storage.objects
for insert
with check (bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- Only owner can update their own file
create policy "Owner can update"
on storage.objects
for update
with check (bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- Only owner can delete their own file
create policy "Owner can delete"
on storage.objects
for delete
using (bucket_id = 'profile-images' and (storage.foldername(name))[1] = auth.uid()::text);