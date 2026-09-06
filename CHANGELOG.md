# Changelog

All notable changes to the StrideWear project will be documented in this file.

## [1.0.0] - 2026-09-07

### Phase 9: Analytics & Admin Overview

- **Added:** Admin dashboard (`/admin/dashboard`) with real-time stats overview.
- **Added:** Custom, animated SVG Revenue Chart showing the last 7 days of sales.
- **Added:** Top Products widget displaying the highest-grossing products with images.
- **Added:** Recent Orders widget with quick links to order details.
- **Added:** Low Stock Alerts widget prioritizing variants with `stock_qty <= 5`.
- **Refactored:** Extracted dashboard queries into `useAdminDashboard.ts` utilizing `Promise.all` for performance.

### Phase 8: Notifications & Emails

- **Added:** Centralized `send-email` Supabase Edge Function to handle transactional emails via Resend.
- **Added:** Auto-generated HTML templates for Order Confirmation, Order Shipped, Order Delivered, Order Cancelled, and Low Stock Alerts.
- **Added:** Mock mode for local development (prints email payloads to console if `RESEND_API_KEY` is missing).
- **Changed:** `decrement_stock` RPC now intelligently returns an array of variants that just dropped to the low stock threshold, triggering admin alerts seamlessly.
- **Changed:** `admin-update-order-status` edge function now asynchronously triggers the `send-email` function on status transitions.

### Phase 7: Reviews & Wishlist

- **Added:** Wishlist functionality with optimistic UI updates via `useWishlist.ts`.
- **Added:** `/wishlist` dedicated page displaying saved products in a responsive grid.
- **Added:** `ReviewForm` component with an interactive 5-star selector.
- **Security:** Implemented `can_review_product` Postgres RPC to enforce strict review eligibility (only verified buyers with a `delivered` status can review).
- **Added:** Edit and Delete review functionality directly on the product page.

### Phase 6: Admin Dashboard — Products & Inventory

- **Added:** Protected `/admin/products` and `/admin/products/$productId` routes for catalog management.
- **Added:** Full CRUD operations for Products, Variants, and Images.
- **Added:** Admin Coupon management (`/admin/coupons`).
- **Security:** Row Level Security (RLS) policies implemented allowing only `admin` and `super_admin` roles to modify catalog data.

### Phase 5: Order Management

- **Added:** Customer order history page (`/orders`) and detailed view (`/orders/$orderId`).
- **Added:** Shared `StatusTimeline` component for tracking order progress.
- **Added:** Admin order management list (`/admin/orders`) with powerful filtering and sorting.
- **Added:** `admin-update-order-status` Edge Function to securely enforce allowed state transitions (e.g., cannot move from `pending` to `delivered` directly).
- **Security:** Implemented `restore_stock` Postgres RPC to atomically return items to inventory upon order cancellation.

### Phase 4: Checkout Flow

- **Added:** `useCheckout.ts` hook handling the multi-step checkout process.
- **Security:** Created `decrement_stock` Postgres RPC utilizing `FOR UPDATE` locks to eliminate race conditions when purchasing items.
- **Added:** Address management integration and coupon application logic during checkout.
- **Refactored:** Advanced cart calculations (subtotal, tax, dynamic shipping thresholds) extracted to `lib/cartCalculations.ts`.

### Phase 3: Cart & User Flows

- **Added:** Client-side Cart Context utilizing local storage for persistence.
- **Added:** Dynamic slide-out Cart Drawer accessible from the navigation bar.
- **Added:** Auth modals (Login/Signup) directly integrated into the UI.
- **Added:** Protected route wrappers and auth state listeners (`useAuth.ts`).

### Phase 2: Product Listing & Search

- **Added:** Robust `/products` listing page with responsive CSS grid.
- **Added:** Advanced filtering panel (Categories, Colors, Sizes, Price Range).
- **Added:** Client-side search and dynamic sorting capabilities.
- **Added:** Detail page (`/products/$slug`) with image galleries and variant selection matrices.

### Phase 1: Foundation & UI System

- **Added:** Project scaffolding with Vite, React 19, and Tailwind CSS v4.
- **Added:** Supabase integration setup and database schema initialization (24 core migrations including Profiles, Orders, Products, and fully locked-down RLS).
- **Added:** Component library foundation (Buttons, Inputs, Modals) enforcing strict, premium aesthetics.
- **Added:** Marketing pages (Home Page, Hero, Categories grid).
