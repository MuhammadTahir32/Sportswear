create table public.cart_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  quantity   int not null default 1 check (quantity > 0),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, variant_id)
);
