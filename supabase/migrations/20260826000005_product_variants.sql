create table public.product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  sku            text not null unique,
  size           text not null,
  color          text not null,
  stock_qty      int not null default 0,
  price_override numeric(10,2),
  created_at     timestamptz not null default now(),
  unique (product_id, size, color)
);
