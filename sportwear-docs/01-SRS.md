# Software Requirements Specification (SRS)

## Project: StrideWear — Sportwear E-Commerce Web Application

**Version:** 1.0
**Stack:** TanStack (Start/Router/Query/Table) + Supabase (Postgres, Auth, Storage, Edge Functions)

---

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for StrideWear, an e-commerce web application for a sportwear brand, allowing customers to browse, purchase, and track sportswear products, and allowing admins to manage catalog, orders, and inventory.

### 1.2 Scope

The application includes a customer-facing storefront and an admin dashboard, backed by a shared Supabase database and authentication layer, with a TanStack-powered frontend.

### 1.3 Intended Audience

Developer (solo/small team), instructors/reviewers (if academic), future contributors.

---

## 2. Overall Description

### 2.1 Product Perspective

A standalone full-stack web app. Frontend: TanStack Start (SSR) + TanStack Router (routing) + TanStack Query (data fetching/caching) + TanStack Table (admin data grids). Backend: Supabase (Postgres DB, Row Level Security, Auth, Storage for product images, Edge Functions for business logic like checkout/payment webhooks).

### 2.2 User Classes

| Role                   | Description                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| Guest                  | Browses catalog, adds to cart, must sign up/in to checkout                                |
| Customer               | Registered user — places orders, views order history, manages profile/addresses, wishlist |
| Admin                  | Manages products, categories, inventory, orders, discounts                                |
| Super Admin (optional) | Manages admin accounts, site settings, analytics                                          |

### 2.3 Operating Environment

- Web browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)
- Responsive: desktop, tablet, mobile
- Hosted frontend: Vercel/Netlify (SSR-compatible for TanStack Start)
- Backend: Supabase cloud project

---

## 3. Functional Requirements

### FR-1: Authentication & Accounts

- FR-1.1: User can sign up via email/password and OAuth (Google) using Supabase Auth
- FR-1.2: User can log in / log out / reset password
- FR-1.3: Email verification required before checkout
- FR-1.4: Admin roles enforced via Supabase custom claims / a `profiles.role` column + RLS policies

### FR-2: Product Catalog

- FR-2.1: Products have: name, SKU, description, price, sale price, category, sub-category, sizes, colors, images, stock quantity, gender (men/women/unisex/kids), status (active/draft)
- FR-2.2: Products support variants (size × color combinations) with independent stock counts
- FR-2.3: Browse by category (e.g., Running, Training, Football, Basketball, Apparel, Footwear, Accessories)
- FR-2.4: Filter by size, color, price range, brand line, gender
- FR-2.5: Sort by price, newest, popularity
- FR-2.6: Search with debounced query (product name/description/tags)
- FR-2.7: Product detail page: image gallery, size guide, variant selector, stock status, reviews

### FR-3: Cart & Checkout

- FR-3.1: Add/update/remove items in cart (persisted per user in DB; guest cart in local state synced on login)
- FR-3.2: Cart shows subtotal, estimated tax, shipping, discount
- FR-3.3: Apply promo/discount codes
- FR-3.4: Checkout flow: shipping address → shipping method → payment → order confirmation
- FR-3.5: Payment integration (e.g., Stripe) via Supabase Edge Function to keep secret keys server-side
- FR-3.6: Order confirmation email (Supabase Edge Function + email provider, e.g., Resend)

### FR-4: Orders

- FR-4.1: Customer can view order history and order status (pending, paid, processing, shipped, delivered, cancelled, refunded)
- FR-4.2: Customer can view order detail with tracking info
- FR-4.3: Admin can update order status, add tracking number
- FR-4.4: Order cancellation/refund request flow

### FR-5: Reviews & Ratings

- FR-5.1: Verified purchasers can leave star rating + review per product
- FR-5.2: Reviews shown on product detail page with average rating

### FR-6: Wishlist

- FR-6.1: Authenticated users can add/remove products to a wishlist

### FR-7: Admin Dashboard

- FR-7.1: CRUD for products, categories, variants (image upload to Supabase Storage)
- FR-7.2: Inventory management with low-stock alerts
- FR-7.3: Order management (list, filter, update status) using TanStack Table
- FR-7.4: Basic sales analytics (revenue by day/week, top products)
- FR-7.5: Discount/coupon management

### FR-8: Notifications

- FR-8.1: Order status change emails
- FR-8.2: Low stock admin notification (optional)

---

## 4. Non-Functional Requirements

| Category        | Requirement                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------- |
| Performance     | Product listing pages load < 2s on 4G; use TanStack Query caching + Supabase indexes                           |
| Scalability     | Support catalog growth to 10,000+ SKUs without redesign (paginated queries, indexed filters)                   |
| Security        | Row Level Security (RLS) on all Supabase tables; no service-role key on client; input validation on all forms  |
| Availability    | Target 99.5% uptime (dependent on Supabase + hosting SLA)                                                      |
| Accessibility   | WCAG 2.1 AA where feasible (semantic HTML, alt text, keyboard nav)                                             |
| SEO             | SSR via TanStack Start for product/category pages; meta tags, sitemap.xml                                      |
| Maintainability | Typed end-to-end (TypeScript), documented API layer, consistent folder structure                               |
| Data Privacy    | User data handling compliant with basic privacy practices; passwords never stored (delegated to Supabase Auth) |

---

## 5. Constraints

- Must use TanStack (Start/Router/Query) for frontend
- Must use Supabase for database, auth, storage
- Budget-conscious: prefer free-tier services where possible for a student/portfolio project

## 6. Assumptions

- Single currency, single region shipping initially (extensible later)
- Payment gateway sandbox/test mode acceptable for demo purposes

## 7. Traceability

Each FR above should map to at least one entry in `05-Test-Plan.md` test cases before being marked "done".
