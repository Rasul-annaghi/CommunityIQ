-- CommunityIQ Phase 2 – run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- Profiles: one row per auth user (id = auth.uid())
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz default now() not null
);

-- Quiz submissions: one row per completed quiz, linked to user
create table if not exists public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null,
  archetype text not null,
  created_at timestamptz default now() not null
);

-- RLS: users can read/update own profile
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS: users can read/insert own quiz submissions only
alter table public.quiz_submissions enable row level security;

drop policy if exists "Users can read own quiz submissions" on public.quiz_submissions;
create policy "Users can read own quiz submissions"
  on public.quiz_submissions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own quiz submission" on public.quiz_submissions;
create policy "Users can insert own quiz submission"
  on public.quiz_submissions for insert
  with check (auth.uid() = user_id);

-- Create profile when a new user signs up
drop trigger if exists on_auth_user_created on auth.users;
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
