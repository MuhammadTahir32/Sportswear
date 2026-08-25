# StrideWear — Sportwear E-Commerce Web Application

A full-stack sportwear e-commerce platform built with **TanStack** (Start, Router, Query, Table) on the frontend and **Supabase** (Postgres, Auth, Storage, Edge Functions) on the backend.

## Features

- Product catalog with variants (size/color), filtering, search
- Cart, checkout via Stripe, order tracking
- Customer accounts, wishlist, reviews
- Admin dashboard: product/inventory/order management, basic analytics

## Tech Stack

- **Frontend:** TanStack Start, TanStack Router, TanStack Query, TanStack Table, Tailwind CSS, TypeScript
- **Backend:** Supabase (Postgres + RLS, Auth, Storage, Edge Functions)
- **Payments:** Stripe
- **Hosting:** Vercel + Supabase Cloud

## Getting Started

```bash
git clone <repo-url>
cd stridewear
pnpm install
cp .env.example .env.local   # fill in your keys — see docs/07-Deployment-Guide.md
supabase start
supabase db reset
pnpm dev
```

Visit `http://localhost:3000`.

## Documentation

All project documents live in `/docs`:

| Doc                                                          | Purpose                                    |
| ------------------------------------------------------------ | ------------------------------------------ |
| [01-SRS.md](./01-SRS.md)                                     | Requirements — what the app must do        |
| [02-HLD.md](./02-HLD.md)                                     | System architecture                        |
| [03-LLD-Database-Schema.md](./03-LLD-Database-Schema.md)     | DB schema, tables, RLS                     |
| [04-API-Documentation.md](./04-API-Documentation.md)         | Supabase queries + Edge Function endpoints |
| [05-Test-Plan.md](./05-Test-Plan.md)                         | Test strategy and test cases               |
| [06-Security-Requirements.md](./06-Security-Requirements.md) | Security checklist, OWASP mapping          |
| [07-Deployment-Guide.md](./07-Deployment-Guide.md)           | Setup, deployment, rollback runbook        |
| [09-CHANGELOG.md](./09-CHANGELOG.md)                         | Version history                            |
| [10-ROADMAP.md](./10-ROADMAP.md)                             | Full build roadmap — 10 phases, 130 tasks  |
| [11-PROGRESS-TRACKER.md](./11-PROGRESS-TRACKER.md)           | Real-time progress tracking                |
| [RULES.md](./RULES.md)                                       | Build rules — mandatory guidelines         |
| [BRAND_THEME_GUIDE.md](../BRAND_THEME_GUIDE.md)              | Brand colors, typography, components       |

> **Brand Guide:** See `w:\August_2026\Sportswear\BRAND_THEME_GUIDE.md` for all visual/design decisions (colors, fonts, spacing, components). This is the single source of truth for the UI.

## Project Structure (suggested)

```
stridewear/
├── app/                    # TanStack Start app (routes, components)
│   ├── routes/
│   ├── components/
│   ├── lib/
│   │   └── supabase.ts
│   └── hooks/               # useProducts, useCart, useOrders, etc.
├── supabase/
│   ├── migrations/
│   └── functions/
│       ├── create-checkout-session/
│       ├── stripe-webhook/
│       ├── send-order-email/
│       └── admin-update-order-status/
├── docs/                     # this documentation set
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.example
└── package.json
```

## Contributing

1. Branch from `main`: `feature/<short-description>`
2. Follow commit convention: `feat:`, `fix:`, `docs:`, `chore:`, `test:`
3. Open a PR — CI runs lint + unit tests automatically
4. Update relevant doc(s) in `/docs` if behavior/schema/API changes
5. Update `09-CHANGELOG.md`

## License

Specify your license here (e.g., MIT) if this is an open or portfolio project.
