# StrideWear Development Roadmap

## Complete Build Plan — All Phases & Tasks

---

## Overview

- **Total Phases:** 10
- **Total Tasks:** 87
- **Estimated Duration:** 8–10 weeks (solo/small team)
- **Status Legend:** `Not Started` | `In Progress` | `Done` | `Blocked`

---

## PHASE 0: Project Foundation

> Goal: Scaffold project, configure tooling, set up Supabase local dev

| ID   | Task                                                             | Priority | Status      |
| ---- | ---------------------------------------------------------------- | -------- | ----------- |
| 0.1  | Initialize TanStack Start project (`pnpm create tanstack-start`) | P0       | Not Started |
| 0.2  | Configure TypeScript (strict mode, path aliases)                 | P0       | Not Started |
| 0.3  | Install & configure Tailwind CSS                                 | P0       | Not Started |
| 0.4  | Set up ESLint + Prettier with project rules                      | P1       | Not Started |
| 0.5  | Create folder structure per `08-README.md`                       | P0       | Not Started |
| 0.6  | Set up Supabase CLI locally (`supabase init`)                    | P0       | Not Started |
| 0.7  | Create `.env.example` with all required variables                | P0       | Not Started |
| 0.8  | Configure Git hooks (husky + lint-staged)                        | P2       | Not Started |
| 0.9  | Set up GitHub repo + branch protection rules                     | P1       | Not Started |
| 0.10 | Create Supabase client singleton (`lib/supabase.ts`)             | P0       | Not Started |

---

## PHASE 1: Database & Schema

> Goal: All tables, indexes, RLS policies, and types generated

| ID   | Task                                                                                            | Priority | Status      |
| ---- | ----------------------------------------------------------------------------------------------- | -------- | ----------- |
| 1.1  | Create migration: `profiles` table + trigger on auth.users insert                               | P0       | Not Started |
| 1.2  | Create migration: `addresses` table                                                             | P0       | Not Started |
| 1.3  | Create migration: `categories` table (self-referencing for sub-categories)                      | P0       | Not Started |
| 1.4  | Create migration: `products` table                                                              | P0       | Not Started |
| 1.5  | Create migration: `product_variants` table + unique constraint                                  | P0       | Not Started |
| 1.6  | Create migration: `product_images` table                                                        | P0       | Not Started |
| 1.7  | Create migration: `cart_items` table                                                            | P0       | Not Started |
| 1.8  | Create migration: `coupons` table                                                               | P1       | Not Started |
| 1.9  | Create migration: `orders` + `order_items` tables                                               | P0       | Not Started |
| 1.10 | Create migration: `order_status_history` table                                                  | P1       | Not Started |
| 1.11 | Create migration: `reviews` table + check constraint                                            | P1       | Not Started |
| 1.12 | Create migration: `wishlist_items` table                                                        | P1       | Not Started |
| 1.13 | Create all indexes (category, status, gender, full-text search)                                 | P0       | Not Started |
| 1.14 | Enable RLS on ALL tables                                                                        | P0       | Not Started |
| 1.15 | Write RLS policies for `profiles` (own read/update, admin read all)                             | P0       | Not Started |
| 1.16 | Write RLS policies for `addresses` (user CRUD own)                                              | P0       | Not Started |
| 1.17 | Write RLS policies for `cart_items` (user CRUD own)                                             | P0       | Not Started |
| 1.18 | Write RLS policies for `orders` (user read own, admin all)                                      | P0       | Not Started |
| 1.19 | Write RLS policies for `order_items` (via parent order ownership)                               | P0       | Not Started |
| 1.20 | Write RLS policies for `reviews` (insert if purchased, public read)                             | P1       | Not Started |
| 1.21 | Write RLS policies for `wishlist_items` (user CRUD own)                                         | P1       | Not Started |
| 1.22 | Write RLS policies for `products`/`categories`/`variants`/`images` (public active, admin write) | P0       | Not Started |
| 1.23 | Write RLS policies for `coupons` (admin only)                                                   | P1       | Not Started |
| 1.24 | Create trigger: `avg_rating` recalculation on reviews insert/update/delete                      | P1       | Not Started |
| 1.25 | Generate Supabase TypeScript types (`supabase gen types typescript`)                            | P0       | Not Started |
| 1.26 | Seed script: sample categories, products, variants, images                                      | P1       | Not Started |

---

## PHASE 2: Authentication & User Management

> Goal: Sign up, login, logout, password reset, email verification, role management

| ID   | Task                                                            | Priority | Status      |
| ---- | --------------------------------------------------------------- | -------- | ----------- |
| 2.1  | Configure Supabase Auth: email/password + Google OAuth provider | P0       | Not Started |
| 2.2  | Create sign-up page/component with form validation              | P0       | Not Started |
| 2.3  | Create sign-in page/component                                   | P0       | Not Started |
| 2.4  | Implement email verification flow                               | P0       | Not Started |
| 2.5  | Create forgot password / reset password flow                    | P0       | Not Started |
| 2.6  | Implement auth state listener + session persistence             | P0       | Not Started |
| 2.7  | Create protected route wrapper / middleware                     | P0       | Not Started |
| 2.8  | Implement role-based access (customer vs admin route guards)    | P0       | Not Started |
| 2.9  | Create profile page (view/edit name, phone)                     | P1       | Not Started |
| 2.10 | Create addresses CRUD (list, add, edit, delete, set default)    | P1       | Not Started |
| 2.11 | Implement logout + session cleanup                              | P0       | Not Started |

---

## PHASE 3: Product Catalog (Storefront)

> Goal: Browse, filter, search, view product details

| ID   | Task                                                                     | Priority | Status      |
| ---- | ------------------------------------------------------------------------ | -------- | ----------- |
| 3.1  | Create TanStack Query hooks: `useProducts`, `useProductBySlug`           | P0       | Not Started |
| 3.2  | Build product listing page with pagination                               | P0       | Not Started |
| 3.3  | Build `ProductCard` component (image, name, price, rating)               | P0       | Not Started |
| 3.4  | Build category navigation / sidebar                                      | P0       | Not Started |
| 3.5  | Implement filter UI: size, color, price range, gender                    | P0       | Not Started |
| 3.6  | Implement sort: price, newest, popularity                                | P0       | Not Started |
| 3.7  | Implement debounced search with TanStack Query                           | P0       | Not Started |
| 3.8  | Build product detail page: image gallery, variant selector, stock status | P0       | Not Started |
| 3.9  | Build variant selector component (size × color matrix)                   | P0       | Not Started |
| 3.10 | Display reviews section on product detail page                           | P1       | Not Started |
| 3.11 | Implement size guide modal/drawer                                        | P2       | Not Started |
| 3.12 | SEO: SSR meta tags, sitemap.xml generation                               | P1       | Not Started |

---

## PHASE 4: Cart & Checkout

> Goal: Full cart management + Stripe checkout flow

| ID   | Task                                                                                 | Priority | Status      |
| ---- | ------------------------------------------------------------------------------------ | -------- | ----------- |
| 4.1  | Create `useCart` hook (read, add, update, remove)                                    | P0       | Not Started |
| 4.2  | Build cart page/drawer UI                                                            | P0       | Not Started |
| 4.3  | Implement cart persistence (DB for logged-in, local state for guest → sync on login) | P0       | Not Started |
| 4.4  | Build cart item component (variant display, quantity adjust, remove)                 | P0       | Not Started |
| 4.5  | Implement subtotal, tax, shipping, discount calculation                              | P0       | Not Started |
| 4.6  | Build coupon/promo code input + validation                                           | P1       | Not Started |
| 4.7  | Build checkout page: shipping address step                                           | P0       | Not Started |
| 4.8  | Build checkout page: shipping method step                                            | P1       | Not Started |
| 4.9  | Create Edge Function: `create-checkout-session`                                      | P0       | Not Started |
| 4.10 | Integrate Stripe Checkout redirect                                                   | P0       | Not Started |
| 4.11 | Create Edge Function: `stripe-webhook`                                               | P0       | Not Started |
| 4.12 | Implement order creation logic in webhook handler                                    | P0       | Not Started |
| 4.13 | Implement stock decrement logic (with race condition protection)                     | P0       | Not Started |
| 4.14 | Build order confirmation page (poll order status)                                    | P0       | Not Started |
| 4.15 | Clear cart after successful checkout                                                 | P0       | Not Started |

---

## PHASE 5: Order Management

> Goal: Customer order history + admin order management

| ID  | Task                                                              | Priority | Status      |
| --- | ----------------------------------------------------------------- | -------- | ----------- |
| 5.1 | Create `useOrders` hook (list, detail)                            | P0       | Not Started |
| 5.2 | Build order history page (list with status badges)                | P0       | Not Started |
| 5.3 | Build order detail page (items, tracking, status timeline)        | P0       | Not Started |
| 5.4 | Create admin: `useAdminOrders` hook                               | P0       | Not Started |
| 5.5 | Build admin order list with TanStack Table (filter, sort, search) | P0       | Not Started |
| 5.6 | Create Edge Function: `admin-update-order-status`                 | P0       | Not Started |
| 5.7 | Build admin order detail: status update, tracking number input    | P0       | Not Started |
| 5.8 | Implement order status history timeline UI                        | P1       | Not Started |
| 5.9 | Implement order cancellation request flow (customer side)         | P2       | Not Started |

---

## PHASE 6: Admin Dashboard — Products & Inventory

> Goal: Full product/inventory CRUD for admins

| ID  | Task                                                              | Priority | Status      |
| --- | ----------------------------------------------------------------- | -------- | ----------- |
| 6.1 | Create `useAdminProducts` hook                                    | P0       | Not Started |
| 6.2 | Build admin product list with TanStack Table                      | P0       | Not Started |
| 6.3 | Build product create/edit form (all fields)                       | P0       | Not Started |
| 6.4 | Implement image upload to Supabase Storage (multi-image, reorder) | P0       | Not Started |
| 6.5 | Build variant manager (add/edit/remove size×color combos)         | P0       | Not Started |
| 6.6 | Implement stock quantity management per variant                   | P0       | Not Started |
| 6.7 | Build low-stock alerts / indicator                                | P1       | Not Started |
| 6.8 | Build category CRUD (name, slug, parent)                          | P1       | Not Started |
| 6.9 | Build coupon CRUD (code, type, value, expiry, active)             | P1       | Not Started |

---

## PHASE 7: Reviews & Wishlist

> Goal: Customer reviews and wishlist functionality

| ID  | Task                                                                 | Priority | Status      |
| --- | -------------------------------------------------------------------- | -------- | ----------- |
| 7.1 | Create `useReviews` hook                                             | P1       | Not Started |
| 7.2 | Build review form (star rating + comment) with purchase verification | P1       | Not Started |
| 7.3 | Display reviews list on product detail page                          | P1       | Not Started |
| 7.4 | Create `useWishlist` hook (add, remove, list)                        | P1       | Not Started |
| 7.5 | Build wishlist page                                                  | P1       | Not Started |
| 7.6 | Add "Add to Wishlist" button on product cards/detail                 | P1       | Not Started |

---

## PHASE 8: Notifications & Emails

> Goal: Transactional emails for order lifecycle

| ID  | Task                                                         | Priority | Status      |
| --- | ------------------------------------------------------------ | -------- | ----------- |
| 8.1 | Create Edge Function: `send-order-email`                     | P0       | Not Started |
| 8.2 | Configure email provider (Resend/SendGrid) + verified domain | P0       | Not Started |
| 8.3 | Build order confirmation email template                      | P0       | Not Started |
| 8.4 | Build order shipped email template (with tracking)           | P1       | Not Started |
| 8.5 | Build order delivered email template                         | P2       | Not Started |
| 8.6 | Build order cancelled email template                         | P1       | Not Started |
| 8.7 | Trigger emails from webhook handler + admin status update    | P0       | Not Started |
| 8.8 | (Optional) Low stock admin notification                      | P2       | Not Started |

---

## PHASE 9: Analytics & Admin Overview

> Goal: Basic sales analytics for admin dashboard

| ID  | Task                                                      | Priority | Status      |
| --- | --------------------------------------------------------- | -------- | ----------- |
| 9.1 | Create admin dashboard home page                          | P1       | Not Started |
| 9.2 | Revenue by day/week chart (using a lightweight chart lib) | P1       | Not Started |
| 9.3 | Top products by revenue/units sold                        | P1       | Not Started |
| 9.4 | Recent orders summary widget                              | P1       | Not Started |
| 9.5 | Low stock alerts widget                                   | P2       | Not Started |

---

## PHASE 10: Polish, Testing & Deployment

> Goal: Testing, performance, accessibility, production deployment

| ID    | Task                                                        | Priority | Status      |
| ----- | ----------------------------------------------------------- | -------- | ----------- |
| 10.1  | Write unit tests for utility functions (Vitest)             | P0       | Not Started |
| 10.2  | Write component tests for Cart, ProductCard, forms          | P1       | Not Started |
| 10.3  | Write integration tests for RLS policies                    | P0       | Not Started |
| 10.4  | Write E2E tests for checkout flow (Playwright)              | P0       | Not Started |
| 10.5  | Write E2E tests for auth flow                               | P0       | Not Started |
| 10.6  | Manual RLS verification (TC-9 style) on all tables          | P0       | Not Started |
| 10.7  | Accessibility audit (semantic HTML, alt text, keyboard nav) | P1       | Not Started |
| 10.8  | Lighthouse performance audit (target ≥80)                   | P1       | Not Started |
| 10.9  | Cross-browser testing (Chrome, Firefox, Safari, Edge)       | P1       | Not Started |
| 10.10 | Responsive testing (mobile, tablet, desktop)                | P1       | Not Started |
| 10.11 | Set up staging Supabase project                             | P0       | Not Started |
| 10.12 | Deploy Edge Functions to staging                            | P0       | Not Started |
| 10.13 | Deploy frontend to Vercel (staging)                         | P0       | Not Started |
| 10.14 | Stripe webhook configured for staging                       | P0       | Not Started |
| 10.15 | End-to-end smoke test on staging                            | P0       | Not Started |
| 10.16 | Set up production Supabase project                          | P0       | Not Started |
| 10.17 | Deploy to production                                        | P0       | Not Started |
| 10.18 | Production smoke test                                       | P0       | Not Started |
| 10.19 | Final README + CHANGELOG update                             | P1       | Not Started |

---

## Phase Summary

| Phase               | Tasks   | P0     | P1     | P2     |
| ------------------- | ------- | ------ | ------ | ------ |
| 0: Foundation       | 10      | 6      | 2      | 2      |
| 1: Database         | 26      | 14     | 9      | 0      | (3 implicit) |
| 2: Auth             | 11      | 7      | 3      | 1      |
| 3: Catalog          | 12      | 8      | 3      | 1      |
| 4: Cart/Checkout    | 15      | 12     | 2      | 1      |
| 5: Orders           | 9       | 5      | 2      | 2      |
| 6: Admin Products   | 9       | 5      | 4      | 0      |
| 7: Reviews/Wishlist | 6       | 0      | 6      | 0      |
| 8: Notifications    | 8       | 3      | 3      | 2      |
| 9: Analytics        | 5       | 0      | 3      | 2      |
| 10: Polish/Deploy   | 19      | 10     | 7      | 2      |
| **TOTAL**           | **130** | **70** | **44** | **13** |

---

## Critical Path

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 10
                              ↓
                         Phase 6 (Admin parallel)
                         Phase 7 (can start after Phase 4)
                         Phase 8 (starts at Phase 4, continues)
                         Phase 9 (starts after Phase 5)
```

## Dependencies

- **Phase 1** blocks everything (schema must exist first)
- **Phase 2** blocks Phase 4, 5, 7 (auth required for cart/orders/wishlist)
- **Phase 3** can partially overlap with Phase 2
- **Phase 4** blocks Phase 5, 8 (checkout flow needed for orders/emails)
- **Phase 6** can run in parallel with Phase 4-5
- **Phase 10** can only fully start after Phase 4-5 complete
