create table if not exists public.public_leads (
  id uuid primary key default gen_random_uuid(),
  public_token uuid not null default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text,
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
  selected_plan text,
  checkout_status text not null default 'intake_submitted',
  payment_provider text,
  payment_reference text,
  converted_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists public_leads_email_idx on public.public_leads(lower(email));
create index if not exists public_leads_status_idx on public.public_leads(checkout_status);
create index if not exists public_leads_created_at_idx on public.public_leads(created_at desc);

drop trigger if exists set_public_leads_updated_at on public.public_leads;
create trigger set_public_leads_updated_at
before update on public.public_leads
for each row execute function public.set_updated_at();

alter table public.public_leads enable row level security;

drop policy if exists "Anyone can submit public lead" on public.public_leads;
create policy "Anyone can submit public lead"
on public.public_leads for insert
with check (true);

drop policy if exists "Anyone can move own checkout draft" on public.public_leads;
create policy "Anyone can move own checkout draft"
on public.public_leads for update
using (checkout_status in ('intake_submitted', 'plan_selected', 'checkout_started'))
with check (checkout_status in ('intake_submitted', 'plan_selected', 'checkout_started'));

drop policy if exists "Admins can read public leads" on public.public_leads;
create policy "Admins can read public leads"
on public.public_leads for select
using (public.is_admin());

drop policy if exists "Admins can update public leads" on public.public_leads;
create policy "Admins can update public leads"
on public.public_leads for update
using (public.is_admin())
with check (public.is_admin());
