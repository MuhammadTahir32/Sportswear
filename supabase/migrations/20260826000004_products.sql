create table public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  category_id uuid not null references public.categories(id) on delete cascade,
  gender      text not null default 'unisex' check (gender in ('men', 'women', 'unisex', 'kids')),
  base_price  numeric(10,2) not null,
  sale_price  numeric(10,2),
  status      text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  avg_rating  numeric(2,1) not null default 0,
  created_at  timestamptz not null default now()
);
