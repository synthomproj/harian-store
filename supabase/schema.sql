create extension if not exists pgcrypto;

create type public.app_role as enum ('user', 'admin');
create type public.order_status as enum (
  'pending_payment',
  'payment_review',
  'paid',
  'processing',
  'completed',
  'cancelled',
  'rejected'
);
create type public.payment_status as enum ('unpaid', 'pending', 'submitted', 'approved', 'rejected');
create type public.provisioning_status as enum (
  'not_started',
  'queued',
  'processing',
  'success',
  'failed'
);
create type public.manual_payment_status as enum ('submitted', 'approved', 'rejected');
create type public.zoom_meeting_status as enum ('pending', 'generated', 'delivered', 'expired', 'failed');
create type public.webhook_direction as enum ('outbound', 'inbound');
create type public.webhook_status as enum ('pending', 'success', 'failed');

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
  user_id uuid not null unique references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  whatsapp text,
  company text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price bigint not null check (price >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  participant_limit integer check (participant_limit is null or participant_limit > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (user_id) on delete restrict,
  product_id uuid not null references public.products (id) on delete restrict,
  order_code text not null unique,
  status public.order_status not null default 'pending_payment',
  payment_status public.payment_status not null default 'unpaid',
  provisioning_status public.provisioning_status not null default 'not_started',
  total_amount bigint not null check (total_amount >= 0),
  payment_provider text,
  paydia_transaction_id text unique,
  paydia_partner_reference_no text,
  paydia_reference_no text,
  paydia_payment_url text,
  paydia_qr_content text,
  paydia_status text,
  paydia_status_desc text,
  paydia_expires_at timestamptz,
  paydia_paid_at timestamptz,
  paydia_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.meeting_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  agenda text not null,
  meeting_date date not null,
  start_time time not null,
  duration_minutes integer not null check (duration_minutes > 0),
  notes text,
  timezone text not null default 'Asia/Jakarta',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.manual_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  bank_name text not null,
  account_name text not null,
  transfer_amount bigint not null check (transfer_amount >= 0),
  proof_file_path text not null,
  status public.manual_payment_status not null default 'submitted',
  admin_notes text,
  submitted_at timestamptz not null default timezone('utc', now()),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.zoom_meetings (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  provider text not null default 'zoom',
  external_meeting_id text,
  join_url text,
  start_url text,
  meeting_password text,
  status public.zoom_meeting_status not null default 'pending',
  generated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.webhook_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  source text not null,
  event_type text not null,
  direction public.webhook_direction not null,
  status public.webhook_status not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  response_payload jsonb,
  error_message text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_products_is_active on public.products (is_active);
create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_product_id on public.orders (product_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_payment_status on public.orders (payment_status);
create index if not exists idx_orders_provisioning_status on public.orders (provisioning_status);
create index if not exists idx_orders_payment_provider on public.orders (payment_provider);
create index if not exists idx_orders_paydia_partner_reference_no on public.orders (paydia_partner_reference_no);
create index if not exists idx_orders_paydia_reference_no on public.orders (paydia_reference_no);
create index if not exists idx_orders_paydia_status on public.orders (paydia_status);
create index if not exists idx_meeting_requests_meeting_date on public.meeting_requests (meeting_date);
create index if not exists idx_manual_payments_order_id on public.manual_payments (order_id);
create index if not exists idx_manual_payments_status on public.manual_payments (status);
create index if not exists idx_zoom_meetings_status on public.zoom_meetings (status);
create index if not exists idx_webhook_logs_order_id on public.webhook_logs (order_id);
create index if not exists idx_webhook_logs_source on public.webhook_logs (source);
create index if not exists idx_webhook_logs_status on public.webhook_logs (status);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists set_meeting_requests_updated_at on public.meeting_requests;
create trigger set_meeting_requests_updated_at
before update on public.meeting_requests
for each row
execute function public.set_updated_at();

drop trigger if exists set_manual_payments_updated_at on public.manual_payments;
create trigger set_manual_payments_updated_at
before update on public.manual_payments
for each row
execute function public.set_updated_at();

drop trigger if exists set_zoom_meetings_updated_at on public.zoom_meetings;
create trigger set_zoom_meetings_updated_at
before update on public.zoom_meetings
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.meeting_requests enable row level security;
alter table public.manual_payments enable row level security;
alter table public.zoom_meetings enable row level security;
alter table public.webhook_logs enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
with check (user_id = auth.uid());

drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
on public.profiles
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "products_select_active_or_admin" on public.products;
create policy "products_select_active_or_admin"
on public.products
for select
using (is_active or public.is_admin());

drop policy if exists "products_admin_manage" on public.products;
create policy "products_admin_manage"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "orders_select_owner_or_admin" on public.orders;
create policy "orders_select_owner_or_admin"
on public.orders
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_insert_owner" on public.orders;
create policy "orders_insert_owner"
on public.orders
for insert
with check (user_id = auth.uid());

drop policy if exists "orders_update_owner_or_admin" on public.orders;
create policy "orders_update_owner_or_admin"
on public.orders
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "meeting_requests_select_owner_or_admin" on public.meeting_requests;
create policy "meeting_requests_select_owner_or_admin"
on public.meeting_requests
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = meeting_requests.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "meeting_requests_insert_owner" on public.meeting_requests;
create policy "meeting_requests_insert_owner"
on public.meeting_requests
for insert
with check (
  exists (
    select 1
    from public.orders
    where orders.id = meeting_requests.order_id
      and orders.user_id = auth.uid()
  )
);

drop policy if exists "meeting_requests_update_owner_or_admin" on public.meeting_requests;
create policy "meeting_requests_update_owner_or_admin"
on public.meeting_requests
for update
using (
  exists (
    select 1
    from public.orders
    where orders.id = meeting_requests.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.orders
    where orders.id = meeting_requests.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "manual_payments_select_owner_or_admin" on public.manual_payments;
create policy "manual_payments_select_owner_or_admin"
on public.manual_payments
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = manual_payments.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "manual_payments_insert_owner" on public.manual_payments;
create policy "manual_payments_insert_owner"
on public.manual_payments
for insert
with check (
  exists (
    select 1
    from public.orders
    where orders.id = manual_payments.order_id
      and orders.user_id = auth.uid()
  )
);

drop policy if exists "manual_payments_update_admin_only" on public.manual_payments;
create policy "manual_payments_update_admin_only"
on public.manual_payments
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "zoom_meetings_select_owner_or_admin" on public.zoom_meetings;
create policy "zoom_meetings_select_owner_or_admin"
on public.zoom_meetings
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = zoom_meetings.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "zoom_meetings_admin_manage" on public.zoom_meetings;
create policy "zoom_meetings_admin_manage"
on public.zoom_meetings
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "webhook_logs_admin_only" on public.webhook_logs;
create policy "webhook_logs_admin_only"
on public.webhook_logs
for all
using (public.is_admin())
with check (public.is_admin());
