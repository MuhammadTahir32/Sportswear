create table public.coupons (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,
  discount_type  text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10,2) not null,
  expires_at     timestamptz,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);
