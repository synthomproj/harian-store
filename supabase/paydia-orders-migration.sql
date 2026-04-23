do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_enum e on t.oid = e.enumtypid
    where t.typname = 'payment_status'
      and e.enumlabel = 'pending'
  ) then
    alter type public.payment_status add value 'pending' after 'unpaid';
  end if;
end
$$;

alter table public.orders
  add column if not exists payment_provider text,
  add column if not exists paydia_transaction_id text,
  add column if not exists paydia_payment_url text,
  add column if not exists paydia_status text,
  add column if not exists paydia_expires_at timestamptz,
  add column if not exists paydia_paid_at timestamptz,
  add column if not exists paydia_payload jsonb not null default '{}'::jsonb;

create unique index if not exists idx_orders_paydia_transaction_id
  on public.orders (paydia_transaction_id)
  where paydia_transaction_id is not null;

create index if not exists idx_orders_payment_provider
  on public.orders (payment_provider);

create index if not exists idx_orders_paydia_status
  on public.orders (paydia_status);
