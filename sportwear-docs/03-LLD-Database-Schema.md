# Low-Level Design (LLD) & Database Schema

## StrideWear — Sportwear E-Commerce Web Application

---

## 1. Entity Relationship Overview

```
profiles ──< addresses
profiles ──< orders ──< order_items >── product_variants
profiles ──< cart_items >── product_variants
profiles ──< wishlist_items >── products
profiles ──< reviews >── products
categories ──< products ──< product_variants
products ──< product_images
orders ──< order_status_history
coupons ──< orders (applied_coupon_id)
```

## 2. Table Definitions (Postgres / Supabase)

### 2.1 `profiles`

Extends `auth.users` (1:1 via `id`).

| Column     | Type                               | Notes                                  |
| ---------- | ---------------------------------- | -------------------------------------- |
| id         | uuid PK, references auth.users(id) |                                        |
| full_name  | text                               |                                        |
| phone      | text                               |                                        |
| role       | text default 'customer'            | 'customer' \| 'admin' \| 'super_admin' |
| created_at | timestamptz default now()          |                                        |

### 2.2 `addresses`

| Column                            | Type                              | Notes               |
| --------------------------------- | --------------------------------- | ------------------- |
| id                                | uuid PK default gen_random_uuid() |                     |
| user_id                           | uuid FK → profiles.id             |                     |
| label                             | text                              | e.g. "Home", "Work" |
| full_name                         | text                              |                     |
| line1, line2                      | text                              |                     |
| city, state, postal_code, country | text                              |                     |
| phone                             | text                              |                     |
| is_default                        | boolean default false             |                     |

### 2.3 `categories`

| Column    | Type                             | Notes                           |
| --------- | -------------------------------- | ------------------------------- |
| id        | uuid PK                          |                                 |
| name      | text unique                      | e.g. Running, Football, Apparel |
| slug      | text unique                      |                                 |
| parent_id | uuid FK → categories.id nullable | for sub-categories              |

### 2.4 `products`

| Column      | Type                      | Notes                                  |
| ----------- | ------------------------- | -------------------------------------- |
| id          | uuid PK                   |                                        |
| name        | text                      |                                        |
| slug        | text unique               |                                        |
| description | text                      |                                        |
| category_id | uuid FK → categories.id   |                                        |
| gender      | text                      | 'men' \| 'women' \| 'unisex' \| 'kids' |
| base_price  | numeric(10,2)             |                                        |
| sale_price  | numeric(10,2) nullable    |                                        |
| status      | text default 'draft'      | 'draft' \| 'active' \| 'archived'      |
| avg_rating  | numeric(2,1) default 0    | denormalized, updated via trigger      |
| created_at  | timestamptz default now() |                                        |

### 2.5 `product_variants`

| Column         | Type                   | Notes                               |
| -------------- | ---------------------- | ----------------------------------- |
| id             | uuid PK                |                                     |
| product_id     | uuid FK → products.id  |                                     |
| sku            | text unique            |                                     |
| size           | text                   | e.g. S, M, L, XL, or shoe size      |
| color          | text                   |                                     |
| stock_qty      | int default 0          |                                     |
| price_override | numeric(10,2) nullable | overrides product base_price if set |

### 2.6 `product_images`

| Column       | Type                  | Notes                                            |
| ------------ | --------------------- | ------------------------------------------------ |
| id           | uuid PK               |                                                  |
| product_id   | uuid FK → products.id |                                                  |
| storage_path | text                  | path in Supabase Storage bucket `product-images` |
| position     | int default 0         | display order                                    |

### 2.7 `cart_items`

| Column     | Type                          | Notes |
| ---------- | ----------------------------- | ----- |
| id         | uuid PK                       |       |
| user_id    | uuid FK → profiles.id         |       |
| variant_id | uuid FK → product_variants.id |       |
| quantity   | int default 1                 |       |
| updated_at | timestamptz default now()     |       |

### 2.8 `coupons`

| Column         | Type                 | Notes                |
| -------------- | -------------------- | -------------------- |
| id             | uuid PK              |                      |
| code           | text unique          |                      |
| discount_type  | text                 | 'percent' \| 'fixed' |
| discount_value | numeric(10,2)        |                      |
| expires_at     | timestamptz nullable |                      |
| active         | boolean default true |                      |

### 2.9 `orders`

| Column                                       | Type                          | Notes                                                        |
| -------------------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| id                                           | uuid PK                       |                                                              |
| user_id                                      | uuid FK → profiles.id         |                                                              |
| status                                       | text default 'pending'        | pending/paid/processing/shipped/delivered/cancelled/refunded |
| subtotal, tax, shipping_fee, discount, total | numeric(10,2)                 |                                                              |
| applied_coupon_id                            | uuid FK → coupons.id nullable |                                                              |
| shipping_address                             | jsonb                         | snapshot at time of order                                    |
| stripe_session_id                            | text nullable                 |                                                              |
| tracking_number                              | text nullable                 |                                                              |
| created_at                                   | timestamptz default now()     |                                                              |

### 2.10 `order_items`

| Column     | Type                          | Notes                              |
| ---------- | ----------------------------- | ---------------------------------- |
| id         | uuid PK                       |                                    |
| order_id   | uuid FK → orders.id           |                                    |
| variant_id | uuid FK → product_variants.id |                                    |
| quantity   | int                           |                                    |
| unit_price | numeric(10,2)                 | snapshot of price at purchase time |

### 2.11 `order_status_history`

| Column     | Type                      | Notes |
| ---------- | ------------------------- | ----- |
| id         | uuid PK                   |       |
| order_id   | uuid FK → orders.id       |       |
| status     | text                      |       |
| changed_at | timestamptz default now() |       |

### 2.12 `reviews`

| Column     | Type                               | Notes |
| ---------- | ---------------------------------- | ----- |
| id         | uuid PK                            |       |
| product_id | uuid FK → products.id              |       |
| user_id    | uuid FK → profiles.id              |       |
| rating     | int check (rating between 1 and 5) |       |
| comment    | text                               |       |
| created_at | timestamptz default now()          |       |

### 2.13 `wishlist_items`

| Column     | Type                  | Notes |
| ---------- | --------------------- | ----- |
| id         | uuid PK               |       |
| user_id    | uuid FK → profiles.id |       |
| product_id | uuid FK → products.id |       |

---

## 3. Row Level Security (RLS) Policy Summary

| Table                                                     | Policy                                                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| profiles                                                  | User can select/update own row; admin can select all                                                |
| addresses                                                 | User can CRUD own rows only                                                                         |
| cart_items                                                | User can CRUD own rows only                                                                         |
| wishlist_items                                            | User can CRUD own rows only                                                                         |
| orders                                                    | User can select own orders; admin can select/update all                                             |
| order_items                                               | Readable via parent order ownership                                                                 |
| reviews                                                   | User can insert own review (if purchased); anyone can select                                        |
| products / categories / product_variants / product_images | Public select for `status = 'active'`; insert/update/delete restricted to admin role                |
| coupons                                                   | Select restricted to admin (validated server-side on apply, not exposed client-side as a full list) |

Enable RLS on every table with `alter table X enable row level security;` and define explicit policies — never leave a table open by default.

## 4. Key Indexes

- `products (category_id)`, `products (status)`, `products (gender)`
- `product_variants (product_id)`, unique on `(product_id, size, color)`
- `orders (user_id)`, `orders (status)`
- Full-text search index on `products (name, description)` via `tsvector` for search

## 5. API Contract Summary

See `04-API-Documentation.md` for endpoint-level specs (mostly handled via Supabase auto-generated REST/RPC + a few custom Edge Functions).
