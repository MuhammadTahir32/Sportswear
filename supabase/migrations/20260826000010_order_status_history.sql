create table public.order_status_history (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  status     text not null,
  changed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
