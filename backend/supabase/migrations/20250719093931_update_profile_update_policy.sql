drop policy if exists "Users can update their own profile" on profiles;
-- Only owners can update their profile

create policy "Users can update their own profile"
  on profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
