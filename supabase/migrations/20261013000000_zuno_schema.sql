-- =========================================================
-- ZUNO COMPLETE DATABASE SCHEMA & SECURITY POLICIES
-- =========================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  username text,
  age int default 25,
  gender text,
  profession text default 'Member',
  location text default 'New York, NY',
  intent text default 'Slow Romance',
  bio text default 'Looking for genuine, intentional connection.',
  interests text[] default array['Music', 'Art', 'Coffee'],
  compatibility_score int default 90,
  is_verified boolean default false,
  mood text default 'Open & Curious',
  spark_level int default 3,
  role text default 'user' check (role in ('user', 'moderator', 'admin')),
  status text default 'active' check (status in ('active', 'suspended', 'banned')),
  photo text,
  photos text[] default array[]::text[],
  settings jsonb default '{"stealthMode": false, "readReceipts": true, "aiSuggestions": true, "pushNotifications": true, "emailDigest": true, "cadenceLimit": true}'::jsonb,
  last_active timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexing for profile lookups
create index if not exists idx_profiles_status on public.profiles(status);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_last_active on public.profiles(last_active);

-- 2. MATCHES & ENCOUNTERS TABLE
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'matched', 'passed', 'unmatched', 'reported')),
  compatibility_score int default 85,
  complaint text,
  created_at timestamptz default now(),
  unique (user_a, user_b)
);

create index if not exists idx_matches_users on public.matches(user_a, user_b);

-- 3. CONVERSATIONS TABLE
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  last_message_text text,
  last_message_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (user_a, user_b)
);

-- 4. MESSAGES TABLE
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  voice_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(created_at);

-- 5. SUBSCRIPTIONS TABLE
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_name text default 'Zuno Free' check (plan_name in ('Zuno Free', 'Zuno Plus', 'Zuno Velvet', 'Zuno Gold')),
  billing_cycle text default 'monthly' check (billing_cycle in ('monthly', 'annual')),
  status text default 'active' check (status in ('active', 'expired', 'cancelled', 'pending_refund')),
  amount text default '₹0',
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- 6. SAFETY REPORTS TABLE
create table if not exists public.safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  reported_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  description text not null,
  evidence_context text,
  status text default 'Open' check (status in ('Open', 'Under Review', 'Resolved', 'Dismissed')),
  moderator_notes text,
  created_at timestamptz default now()
);

-- 7. PROFILE VERIFICATIONS TABLE
create table if not exists public.profile_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  selfie_url text not null,
  id_document_url text,
  status text default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  rejection_reason text,
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

-- 8. PLATFORM SETTINGS TABLE (Singleton)
create table if not exists public.platform_settings (
  id text primary key default 'global',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Insert default platform settings if not present
insert into public.platform_settings (id, settings)
values ('global', '{
  "maintenanceMode": false,
  "registrationStatus": "open",
  "globalUserLockdown": false,
  "freeDailySparkLimit": 25,
  "vipDailySparkLimit": 100,
  "minCompatibilityScore": 75,
  "realtimeChatFilter": true,
  "bannedKeywords": ["scam", "crypto", "cashapp", "telegram", "venmo", "sugar baby"]
}'::jsonb)
on conflict (id) do nothing;

-- =========================================================
-- TRIGGER: AUTO CREATE PROFILE ON SIGNUP
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, photo, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://ui-avatars.com/api/?name=' || replace(coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), ' ', '+') || '&background=random&color=fff'),
    case when new.email = 'admin@zuno.com' then 'admin' else 'user' end
  );

  insert into public.subscriptions (user_id, plan_name, status, amount)
  values (new.id, 'Zuno Free', 'active', '₹0');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.subscriptions enable row level security;
alter table public.safety_reports enable row level security;
alter table public.profile_verifications enable row level security;
alter table public.platform_settings enable row level security;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- PROFILES POLICIES
create policy "Active profiles are visible to authenticated users"
  on public.profiles for select
  to authenticated
  using (status != 'banned' or id = auth.uid() or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- MATCHES POLICIES
create policy "Users can see their own matches"
  on public.matches for select
  to authenticated
  using (user_a = auth.uid() or user_b = auth.uid() or public.is_admin());

create policy "Users can insert matches involving themselves"
  on public.matches for insert
  to authenticated
  with check (user_a = auth.uid() or public.is_admin());

create policy "Users can update matches involving themselves"
  on public.matches for update
  to authenticated
  using (user_a = auth.uid() or user_b = auth.uid() or public.is_admin());

-- CONVERSATIONS & MESSAGES POLICIES
create policy "Users can view their conversations"
  on public.conversations for select
  to authenticated
  using (user_a = auth.uid() or user_b = auth.uid() or public.is_admin());

create policy "Users can create conversations"
  on public.conversations for insert
  to authenticated
  with check (user_a = auth.uid() or user_b = auth.uid() or public.is_admin());

create policy "Users can view messages in their conversations"
  on public.messages for select
  to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_admin());

create policy "Users can send messages"
  on public.messages for insert
  to authenticated
  with check (sender_id = auth.uid());

create policy "Recipients can mark messages read"
  on public.messages for update
  to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

-- SUBSCRIPTIONS POLICIES
create policy "Users can view own subscription"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "Admins can manage subscriptions"
  on public.subscriptions for all
  to authenticated
  using (public.is_admin());

-- REPORTS & VERIFICATIONS POLICIES
create policy "Users can submit reports"
  on public.safety_reports for insert
  to authenticated
  with check (reporter_id = auth.uid());

create policy "Admins can view and manage reports"
  on public.safety_reports for all
  to authenticated
  using (public.is_admin());

create policy "Users can submit verifications"
  on public.profile_verifications for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can view own verification status"
  on public.profile_verifications for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "Admins can manage verifications"
  on public.profile_verifications for all
  to authenticated
  using (public.is_admin());

-- PLATFORM SETTINGS POLICIES
create policy "Authenticated users can read platform settings"
  on public.platform_settings for select
  to authenticated
  using (true);

create policy "Only admins can modify platform settings"
  on public.platform_settings for all
  to authenticated
  using (public.is_admin());

-- =========================================================
-- REALTIME REPLICATION ENABLEMENT
-- =========================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
