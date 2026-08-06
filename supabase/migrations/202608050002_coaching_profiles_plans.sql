create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

insert into public.admin_users (email)
values
  ('davialvesmonteiro24@gmail.com'),
  ('iriscarvalhoiris279@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create table if not exists public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  objective text not null,
  birth_date date,
  height_cm numeric,
  current_weight_kg numeric,
  target_weight_kg numeric,
  biological_sex text,
  activity_level text not null default 'Moderado',
  meals_per_day integer not null default 5,
  routine text,
  food_likes text,
  food_dislikes text,
  restrictions text,
  health_notes text,
  training_goal text,
  training_experience text,
  training_location text,
  training_days_per_week integer,
  available_equipment text,
  admin_notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coaching_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  title text not null,
  status text not null default 'draft',
  source text not null default 'local',
  nutrition_summary text not null,
  workout_summary text not null,
  meals jsonb not null default '[]'::jsonb,
  workouts jsonb not null default '[]'::jsonb,
  notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_profiles_user_id_idx on public.client_profiles(user_id);
create index if not exists client_profiles_status_idx on public.client_profiles(status);
create index if not exists coaching_plans_user_id_status_idx on public.coaching_plans(user_id, status);

drop trigger if exists set_client_profiles_updated_at on public.client_profiles;
create trigger set_client_profiles_updated_at
before update on public.client_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_coaching_plans_updated_at on public.coaching_plans;
create trigger set_coaching_plans_updated_at
before update on public.coaching_plans
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.client_profiles enable row level security;
alter table public.coaching_plans enable row level security;

drop policy if exists "Admins can read admins" on public.admin_users;
create policy "Admins can read admins"
on public.admin_users for select
using (public.is_admin());

drop policy if exists "Users can read own client profile" on public.client_profiles;
create policy "Users can read own client profile"
on public.client_profiles for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can create own client profile" on public.client_profiles;
create policy "Users can create own client profile"
on public.client_profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own pending client profile" on public.client_profiles;
create policy "Users can update own pending client profile"
on public.client_profiles for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can read own published plans" on public.coaching_plans;
create policy "Users can read own published plans"
on public.coaching_plans for select
using ((auth.uid() = user_id and status = 'published') or public.is_admin());

drop policy if exists "Admins can create plans" on public.coaching_plans;
create policy "Admins can create plans"
on public.coaching_plans for insert
with check (public.is_admin());

drop policy if exists "Admins can update plans" on public.coaching_plans;
create policy "Admins can update plans"
on public.coaching_plans for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete plans" on public.coaching_plans;
create policy "Admins can delete plans"
on public.coaching_plans for delete
using (public.is_admin());
