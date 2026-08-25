# High-Level Design (HLD)

## StrideWear — Sportwear E-Commerce Web Application

---

## 1. Architecture Overview

```
                        ┌─────────────────────────────┐
                        │        Browser (Client)      │
                        │  TanStack Router + Query UI  │
                        └──────────────┬───────────────┘
                                       │ HTTPS
                        ┌──────────────▼───────────────┐
                        │     TanStack Start (SSR)      │
                        │  Server functions / loaders   │
                        │  Runs on Vercel/Netlify Edge  │
                        └──────────────┬───────────────┘
                                       │ Supabase JS Client (anon key)
                                       │ + Edge Function calls (service role, server-only)
                        ┌──────────────▼───────────────┐
                        │           Supabase             │
                        │  ┌─────────────────────────┐  │
                        │  │ Postgres DB + RLS        │  │
                        │  ├─────────────────────────┤  │
                        │  │ Auth (email/OAuth)       │  │
                        │  ├─────────────────────────┤  │
                        │  │ Storage (product images) │  │
                        │  ├─────────────────────────┤  │
                        │  │ Edge Functions           │  │
                        │  │  - checkout/payment      │  │
                        │  │  - order emails          │  │
                        │  └─────────────────────────┘  │
                        └──────────────┬───────────────┘
                                       │
                        ┌──────────────▼───────────────┐
                        │  Third-Party Services          │
                        │  Stripe (payments)              │
                        │  Resend/SendGrid (emails)       │
                        └───────────────────────────────┘
```

## 2. Technology Stack

| Layer               | Technology                            | Purpose                                        |
| ------------------- | ------------------------------------- | ---------------------------------------------- |
| Frontend framework  | TanStack Start                        | SSR + full-stack React framework               |
| Routing             | TanStack Router                       | Type-safe file-based routing                   |
| Data fetching/cache | TanStack Query                        | Server state caching, mutations, optimistic UI |
| Admin tables        | TanStack Table                        | Sortable/filterable order & product tables     |
| Styling             | Tailwind CSS                          | Utility-first styling                          |
| Backend/DB          | Supabase Postgres                     | Relational data storage                        |
| Auth                | Supabase Auth                         | Email/password + OAuth                         |
| File storage        | Supabase Storage                      | Product images                                 |
| Serverless logic    | Supabase Edge Functions (Deno)        | Payment webhook handling, emails               |
| Payments            | Stripe                                | Checkout + payment processing                  |
| Hosting             | Vercel or Netlify                     | SSR-compatible deployment                      |
| Type safety         | TypeScript + Supabase generated types | End-to-end type safety                         |

## 3. Module Breakdown

1. **Storefront module** — catalog browsing, product detail, search/filter
2. **Cart & Checkout module** — cart state, promo codes, Stripe checkout session
3. **Account module** — auth, profile, addresses, order history, wishlist
4. **Admin module** — product/category/inventory CRUD, order management, analytics
5. **Notification module** — transactional emails via Edge Functions

## 4. Data Flow (Checkout Example)

1. User adds items to cart (stored in `cart_items` table, keyed by `user_id`)
2. On checkout, frontend calls a TanStack Start server function
3. Server function calls a Supabase Edge Function `create-checkout-session`
4. Edge Function creates a Stripe Checkout Session (service-role key stays server-side) and returns the session URL
5. User completes payment on Stripe-hosted page
6. Stripe sends a webhook to another Edge Function `stripe-webhook`, which verifies the signature and writes the `orders` + `order_items` rows, decrements stock, and triggers a confirmation email
7. User is redirected back to an order confirmation page which polls order status via TanStack Query

## 5. Security Model

- All client-side Supabase calls use the **anon key** — never the service-role key
- **Row Level Security (RLS)** enforced on every table: customers can only read/write their own rows (cart, orders, wishlist, profile); admins bypass via a `role = 'admin'` check policy
- Payment secret keys and service-role key live only in server environment variables (Edge Functions / server functions), never shipped to the client
- Stripe webhook signature verification required before writing order data

## 6. Deployment Topology

- Frontend: Vercel (or Netlify) — auto-deploy from `main` branch, preview deployments per PR
- Backend: Supabase managed cloud project (separate `dev` and `prod` projects recommended)
- Environment variables managed per environment (`.env.local` for dev, platform secrets for prod)

## 7. Non-Goals (v1)

- Multi-currency / multi-language
- Native mobile app
- Marketplace (multi-vendor) support
