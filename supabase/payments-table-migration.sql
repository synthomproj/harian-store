create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null,
  provider_transaction_id text,
  provider_reference_id text,
  provider_status text,
  payment_type text,
  snap_token text,
  redirect_url text,
  qr_string text,
  qr_url text,
  va_number text,
  bill_key text,
  biller_code text,
  expiry_at timestamptz,
  paid_at timestamptz,
  amount bigint not null check (amount >= 0),
  currency text not null default 'IDR',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_payments_order_id
  on public.payments (order_id);

create index if not exists idx_payments_provider
  on public.payments (provider);

create index if not exists idx_payments_provider_status
  on public.payments (provider_status);

create index if not exists idx_payments_provider_transaction_id
  on public.payments (provider_transaction_id);

create index if not exists idx_payments_provider_reference_id
  on public.payments (provider_reference_id);

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();

alter table public.payments enable row level security;

drop policy if exists "payments_select_owner_or_admin" on public.payments;
create policy "payments_select_owner_or_admin"
on public.payments
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = payments.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "payments_insert_owner_or_admin" on public.payments;
create policy "payments_insert_owner_or_admin"
on public.payments
for insert
with check (
  exists (
    select 1
    from public.orders
    where orders.id = payments.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "payments_update_owner_or_admin" on public.payments;
create policy "payments_update_owner_or_admin"
on public.payments
for update
using (
  exists (
    select 1
    from public.orders
    where orders.id = payments.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1
    from public.orders
    where orders.id = payments.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);
