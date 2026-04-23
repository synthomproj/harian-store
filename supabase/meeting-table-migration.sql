do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_enum e on t.oid = e.enumtypid
    where t.typname = 'meeting_status'
      and e.enumlabel = 'waiting'
  ) then
    create type public.meeting_status as enum ('waiting', 'started', 'ended', 'cancelled');
  end if;
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.meeting (
  id uuid primary key default gen_random_uuid(),
  meeting_id text,
  host_id text,
  host_email text,
  topic text,
  status public.meeting_status not null default 'waiting',
  start_time timestamptz,
  duration integer,
  timezone text not null default 'Asia/Jakarta',
  start_url text,
  join_url text,
  password text,
  meeting_created_at timestamptz,
  order_id uuid not null unique references public.orders (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_meeting_status
  on public.meeting (status);

create index if not exists idx_meeting_order_id
  on public.meeting (order_id);

create index if not exists idx_meeting_user_id
  on public.meeting (user_id);

drop trigger if exists set_meeting_updated_at on public.meeting;
create trigger set_meeting_updated_at
before update on public.meeting
for each row
execute function public.set_updated_at();

alter table public.meeting enable row level security;

drop policy if exists "meeting_select_owner_or_admin" on public.meeting;
create policy "meeting_select_owner_or_admin"
on public.meeting
for select
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.orders
    where orders.id = meeting.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "meeting_admin_manage" on public.meeting;
create policy "meeting_admin_manage"
on public.meeting
for all
using (public.is_admin())
with check (public.is_admin());
