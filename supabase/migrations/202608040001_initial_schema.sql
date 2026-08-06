create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text,
  birth_date date,
  height_cm numeric(5,2),
  biological_sex text,
  goal text,
  calorie_target numeric(8,2) default 0 not null check (calorie_target >= 0),
  protein_target numeric(8,2) default 0 not null check (protein_target >= 0),
  carbohydrate_target numeric(8,2) default 0 not null check (carbohydrate_target >= 0),
  fat_target numeric(8,2) default 0 not null check (fat_target >= 0),
  fiber_target numeric(8,2) default 0 not null check (fiber_target >= 0),
  water_target numeric(8,2) default 0 not null check (water_target >= 0),
  weight_unit text default 'kg' not null,
  theme text default 'light' not null,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  brand text,
  category text not null,
  reference_amount numeric(10,2) not null check (reference_amount > 0),
  reference_unit text not null,
  calories numeric(10,2) default 0 not null check (calories >= 0),
  protein numeric(10,2) default 0 not null check (protein >= 0),
  carbohydrates numeric(10,2) default 0 not null check (carbohydrates >= 0),
  fat numeric(10,2) default 0 not null check (fat >= 0),
  fiber numeric(10,2) default 0 not null check (fiber >= 0),
  sodium numeric(10,2) default 0 not null check (sodium >= 0),
  notes text,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_date date not null,
  meal_time time not null,
  meal_type text not null,
  notes text,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  food_id uuid references public.foods(id) on delete set null,
  consumed_amount numeric(10,2) not null check (consumed_amount >= 0),
  consumed_unit text not null,
  calculated_calories numeric(10,2) default 0 not null check (calculated_calories >= 0),
  calculated_protein numeric(10,2) default 0 not null check (calculated_protein >= 0),
  calculated_carbohydrates numeric(10,2) default 0 not null check (calculated_carbohydrates >= 0),
  calculated_fat numeric(10,2) default 0 not null check (calculated_fat >= 0),
  calculated_fiber numeric(10,2) default 0 not null check (calculated_fiber >= 0),
  calculated_sodium numeric(10,2) default 0 not null check (calculated_sodium >= 0),
  created_at timestamptz default timezone('utc', now()) not null
);

create table if not exists public.weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  weight_kg numeric(6,2) not null check (weight_kg > 0),
  notes text,
  created_at timestamptz default timezone('utc', now()) not null,
  updated_at timestamptz default timezone('utc', now()) not null
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists foods_user_id_name_idx on public.foods(user_id, lower(name));
create index if not exists foods_user_id_category_idx on public.foods(user_id, category);
create index if not exists meals_user_id_date_idx on public.meals(user_id, meal_date desc);
create index if not exists meal_items_meal_id_idx on public.meal_items(meal_id);
create index if not exists meal_items_food_id_idx on public.meal_items(food_id);
create index if not exists weight_entries_user_id_date_idx on public.weight_entries(user_id, entry_date desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists foods_set_updated_at on public.foods;
create trigger foods_set_updated_at
before update on public.foods
for each row execute function public.set_updated_at();

drop trigger if exists meals_set_updated_at on public.meals;
create trigger meals_set_updated_at
before update on public.meals
for each row execute function public.set_updated_at();

drop trigger if exists weight_entries_set_updated_at on public.weight_entries;
create trigger weight_entries_set_updated_at
before update on public.weight_entries
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.foods enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.weight_entries enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = user_id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "foods_select_own"
on public.foods for select
to authenticated
using (auth.uid() = user_id);

create policy "foods_insert_own"
on public.foods for insert
to authenticated
with check (auth.uid() = user_id);

create policy "foods_update_own"
on public.foods for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "foods_delete_own"
on public.foods for delete
to authenticated
using (auth.uid() = user_id);

create policy "meals_select_own"
on public.meals for select
to authenticated
using (auth.uid() = user_id);

create policy "meals_insert_own"
on public.meals for insert
to authenticated
with check (auth.uid() = user_id);

create policy "meals_update_own"
on public.meals for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "meals_delete_own"
on public.meals for delete
to authenticated
using (auth.uid() = user_id);

create policy "meal_items_select_own"
on public.meal_items for select
to authenticated
using (
  exists (
    select 1 from public.meals
    where meals.id = meal_items.meal_id
      and meals.user_id = auth.uid()
  )
);

create policy "meal_items_insert_own"
on public.meal_items for insert
to authenticated
with check (
  exists (
    select 1 from public.meals
    where meals.id = meal_items.meal_id
      and meals.user_id = auth.uid()
  )
);

create policy "meal_items_update_own"
on public.meal_items for update
to authenticated
using (
  exists (
    select 1 from public.meals
    where meals.id = meal_items.meal_id
      and meals.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.meals
    where meals.id = meal_items.meal_id
      and meals.user_id = auth.uid()
  )
);

create policy "meal_items_delete_own"
on public.meal_items for delete
to authenticated
using (
  exists (
    select 1 from public.meals
    where meals.id = meal_items.meal_id
      and meals.user_id = auth.uid()
  )
);

create policy "weight_entries_select_own"
on public.weight_entries for select
to authenticated
using (auth.uid() = user_id);

create policy "weight_entries_insert_own"
on public.weight_entries for insert
to authenticated
with check (auth.uid() = user_id);

create policy "weight_entries_update_own"
on public.weight_entries for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "weight_entries_delete_own"
on public.weight_entries for delete
to authenticated
using (auth.uid() = user_id);
