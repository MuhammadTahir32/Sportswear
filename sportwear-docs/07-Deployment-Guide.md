# Deployment Guide / Runbook

## StrideWear — Sportwear E-Commerce Web Application

---

## 1. Environments

| Env        | Frontend                                     | Backend                                                   |
| ---------- | -------------------------------------------- | --------------------------------------------------------- |
| Local      | `localhost:3000` (TanStack Start dev server) | Supabase CLI local stack (`supabase start`)               |
| Staging    | Vercel preview / staging branch deploy       | Separate Supabase "staging" project, Stripe **test mode** |
| Production | Vercel production deploy (custom domain)     | Supabase "production" project, Stripe **live mode**       |

## 2. Prerequisites

- Node.js LTS, pnpm/npm
- Supabase CLI installed (`npm install -g supabase`)
- Stripe account (test + live keys)
- Vercel (or Netlify) account linked to the GitHub repo
- Email provider account (e.g., Resend) with verified sending domain

## 3. Local Setup

```bash
git clone <repo-url>
cd stridewear
pnpm install

# Start local Supabase stack
supabase start

# Apply DB migrations
supabase db reset

# Copy env template
cp .env.example .env.local
# Fill in: SUPABASE_URL, SUPABASE_ANON_KEY (from `supabase start` output),
#          STRIPE_SECRET_KEY (test), STRIPE_WEBHOOK_SECRET (from `stripe listen`)

pnpm dev
```

## 4. Environment Variables

| Variable                      | Where               | Notes                          |
| ----------------------------- | ------------------- | ------------------------------ |
| `VITE_SUPABASE_URL`           | Frontend            | Public                         |
| `VITE_SUPABASE_ANON_KEY`      | Frontend            | Public, protected by RLS       |
| `SUPABASE_SERVICE_ROLE_KEY`   | Edge Functions only | Secret — never in frontend env |
| `STRIPE_SECRET_KEY`           | Edge Functions only | Secret                         |
| `STRIPE_WEBHOOK_SECRET`       | Edge Functions only | Secret                         |
| `RESEND_API_KEY` (or similar) | Edge Functions only | Secret                         |

## 5. Database Migrations

- Write schema changes as SQL migration files: `supabase migration new <name>`
- Apply locally: `supabase db reset`
- Apply to staging/prod: `supabase db push` (or via CI/CD pipeline) — **always test on staging first**
- Never edit the production schema by hand through the dashboard without also committing a migration file (keeps schema reproducible)

## 6. Deploying Edge Functions

```bash
supabase functions deploy create-checkout-session --project-ref <staging-ref>
supabase functions deploy stripe-webhook --project-ref <staging-ref>
supabase functions deploy send-order-email --project-ref <staging-ref>
supabase functions deploy admin-update-order-status --project-ref <staging-ref>

# Set secrets per project
supabase secrets set STRIPE_SECRET_KEY=sk_test_... --project-ref <staging-ref>
```

Repeat against `<prod-ref>` with live keys when promoting to production.

## 7. Frontend Deployment (Vercel)

1. Connect repo to Vercel
2. Set environment variables in Vercel dashboard per environment (Preview = staging Supabase project, Production = prod Supabase project)
3. Every PR → automatic preview deployment
4. Merge to `main` → auto-deploy to production
5. Configure custom domain + HTTPS (automatic via Vercel)

## 8. Stripe Webhook Setup

1. In Stripe Dashboard → Webhooks → add endpoint: `https://<project-ref>.functions.supabase.co/stripe-webhook`
2. Subscribe to events: `checkout.session.completed`, `charge.refunded`
3. Copy signing secret into `STRIPE_WEBHOOK_SECRET`
4. For local testing: `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`

## 9. Rollback Procedure

- Frontend: Vercel → Deployments → redeploy previous successful build (instant rollback)
- Database: restore from Supabase automatic backup (Point-in-Time Recovery on paid plans) or re-run down-migration if written
- Edge Functions: redeploy previous version from git tag

## 10. Monitoring & Alerts

- Supabase dashboard: monitor DB CPU/connections, Auth errors, Edge Function logs
- Vercel: monitor build failures, function errors, response times
- Stripe dashboard: monitor failed payments, webhook delivery failures (set up email alert for repeated webhook failures)
- (Optional) Add Sentry for frontend error tracking

## 11. Release Checklist

- [ ] All migrations applied to prod DB
- [ ] Edge Function secrets set for prod (live Stripe keys)
- [ ] Stripe webhook endpoint points to prod function URL
- [ ] Smoke test: sign up, browse, add to cart, checkout with a real small test transaction, verify order + email
- [ ] RLS spot-checked on prod (TC-9 style test)
- [ ] Changelog updated
