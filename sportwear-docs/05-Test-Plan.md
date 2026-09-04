# Test Plan

## StrideWear — Sportwear E-Commerce Web Application

---

## 1. Objectives

Verify every functional requirement in `01-SRS.md` works correctly, the app is secure against common issues (especially RLS bypass), and critical flows (checkout, orders) are reliable.

## 2. Test Types & Tools

| Type               | Tool                              | Scope                                                                       |
| ------------------ | --------------------------------- | --------------------------------------------------------------------------- |
| Unit tests         | Vitest                            | Utility functions, price/discount calculations, form validators             |
| Component tests    | Vitest + Testing Library          | Cart, ProductCard, VariantSelector, forms                                   |
| Integration tests  | Vitest + Supabase local dev (CLI) | RLS policies, Edge Functions, DB triggers                                   |
| E2E tests          | Playwright                        | Full user journeys (signup → browse → cart → checkout → order confirmation) |
| Manual/exploratory | —                                 | Admin dashboard flows, responsive/cross-browser checks                      |

## 3. Test Environment

- Local: Supabase CLI (`supabase start`) for isolated DB + Auth + Storage emulation
- Staging: Separate Supabase project + Vercel preview deployment
- CI: Run unit + integration tests on every PR (GitHub Actions); run E2E against a preview deployment before merge to `main`

## 4. Test Cases (Sample — expand per FR)

| ID    | Requirement           | Test Case                                                         | Expected Result                                                      |
| ----- | --------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| TC-1  | FR-1.1                | Sign up with valid email/password                                 | Account created, verification email sent                             |
| TC-2  | FR-1.1                | Sign up with already-registered email                             | Error shown, no duplicate account                                    |
| TC-3  | FR-2.4                | Filter products by size M + color Black                           | Only matching variants shown                                         |
| TC-4  | FR-3.1                | Add product variant to cart, refresh page                         | Cart persists (logged-in)                                            |
| TC-5  | FR-3.3                | Apply expired coupon code                                         | Error: "Coupon expired"                                              |
| TC-6  | FR-3.5                | Complete checkout with COD                                        | Order created with status `pending`, stock decremented               |
| TC-7  | FR-3.5                | Checkout with a variant that just went out of stock               | Checkout blocked with stock error before payment                     |
| TC-8  | FR-4.1                | View order history as Customer A                                  | Only Customer A's orders visible (RLS check)                         |
| TC-9  | Security              | Customer A attempts to query Customer B's orders via API directly | Request denied by RLS, empty result                                  |
| TC-10 | FR-7.1                | Admin uploads product with 3 images                               | Images stored in Supabase Storage, linked correctly, order preserved |
| TC-11 | FR-7.3                | Admin updates order status to "shipped" with tracking number      | Customer sees updated status + tracking; email triggered             |
| TC-12 | FR-5.1                | Non-purchaser attempts to leave a review                          | Blocked / hidden review form                                         |
| TC-13 | Non-func: Performance | Load product listing page (50 products)                           | Renders in < 2s on throttled 4G in Lighthouse                        |
| TC-14 | Non-func: Security    | Attempt to call `/admin/update-order-status` as non-admin         | 403 Forbidden                                                        |
| TC-15 | FR-6.1                | Add/remove product to wishlist                                    | Reflects immediately (optimistic update via TanStack Query)          |

## 5. Regression Testing

Re-run full Playwright E2E suite before every production deployment (checkout flow is the highest-risk regression area).

## 6. Bug Tracking

Use GitHub Issues with labels: `bug`, `severity:critical/high/medium/low`, `area:frontend/backend/db`. Every bug references the failing test case ID where applicable.

## 7. Exit Criteria for Release

- All Critical/High severity bugs resolved
- 100% of P0 test cases (checkout, auth, RLS security) passing
- Lighthouse performance score ≥ 80 on product & home pages
- No RLS policy allows cross-user data access (manually verified via TC-9 style tests on every table)
