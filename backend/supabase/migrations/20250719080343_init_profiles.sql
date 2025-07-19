create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  title text,
  profile_photo text,
  bio text,
  organization_tag text,
  created_at timestamp default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- Allow all authenticated users to view profiles
create policy "Authenticated users can view any profile"
  on profiles
  for select
  using (auth.role() = 'authenticated');

-- Only owners can update their profile
create policy "Users can update their own profile"
  on profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Only owners can insert their profile
create policy "Users can insert their own profile"
  on profiles
  for insert
  with check (auth.uid() = id);

-- Only owners can delete their profile
create policy "Users can delete their own profile"
  on profiles
  for delete
  using (auth.uid() = id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
