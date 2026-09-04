# API Documentation

## StrideWear — Sportwear E-Commerce Web Application

Most data access uses Supabase's auto-generated REST/RPC layer directly from TanStack Query hooks (via `@supabase/supabase-js`). Custom server logic lives in **Supabase Edge Functions**, listed below. Document any additional custom endpoints here as they're built, using this same format.

---

## 1. Conventions

- Base URL (Edge Functions): `https://<project-ref>.functions.supabase.co/`
- Auth: Bearer token (Supabase session `access_token`) in `Authorization` header
- All responses: `application/json`
- Errors: `{ "error": { "code": string, "message": string } }`

---

## 2. Direct Supabase Table Access (via supabase-js + TanStack Query)

| Resource       | Operation          | Example                                                                                               |
| -------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| Products       | List/filter        | `supabase.from('products').select('*, product_variants(*), product_images(*)').eq('status','active')` |
| Product detail | Get by slug        | `.eq('slug', slug).single()`                                                                          |
| Cart           | Read/upsert/delete | `.from('cart_items')...` scoped to `auth.uid()` via RLS                                               |
| Wishlist       | Read/insert/delete | `.from('wishlist_items')...`                                                                          |
| Orders         | Read (own)         | `.from('orders').select('*, order_items(*)').eq('user_id', uid)`                                      |
| Reviews        | Insert/list        | `.from('reviews')...`                                                                                 |

These are wrapped in typed hooks, e.g. `useProducts()`, `useCart()`, `useWishlist()`, `useOrders()` — each backed by a `useQuery`/`useMutation` from TanStack Query with defined query keys (`['products', filters]`, `['cart', userId]`, etc.) for cache invalidation.

---

## 3. Custom Edge Functions

### 3.1 `POST /create-order`

Creates a COD order for the current user's cart.

**Auth required:** Yes
**Request body:**

```json
{
  "coupon_code": "SAVE10",
  "shipping_address": { ... }
}
```

**Response 200:**

```json
{
  "order_id": "uuid-here",
  "status": "pending"
}
```

**Response 400:** invalid/expired coupon, empty cart, insufficient stock
**Response 401:** missing/invalid auth token

**Logic:**

1. Verify JWT, load user's `cart_items` with variant + price
2. Validate stock availability per variant
3. Validate coupon if provided
4. Create order + order_items rows directly in Supabase
5. Decrement stock with race condition protection
6. Clear cart
7. Return order confirmation

---

### 3.2 `POST /admin/update-order-status`

Updates order status (admin only).

**Auth required:** Yes (admin role)
**Request body:**

```json
{
  "order_id": "uuid",
  "status": "shipped",
  "tracking_number": "TRK123"
}
```

**Response 200:** Order status updated
**Response 403:** Non-admin user
**Response 404:** Order not found

**Logic:**

1. Verify JWT + admin role
2. Update order status
3. Insert into order_status_history
4. Trigger confirmation email

---

### 3.3 `POST /send-order-email`

Internal function called when order status is updated.

**Request body:**

```json
{
  "order_id": "uuid",
  "type": "confirmation"
}
```

`type`: `"confirmation" | "shipped" | "delivered" | "cancelled"`

**Response 200:** `{ "sent": true }`

---

### 3.4 `POST /admin/update-order-status`

Admin-only. Updates order status and optionally sets tracking number.

**Auth required:** Yes, `role = 'admin'` enforced in function (double-checked server-side, not just RLS)
**Request body:**

```json
{
  "order_id": "uuid",
  "status": "shipped",
  "tracking_number": "1Z999AA10123456784"
}
```

**Response 200:** updated order object
**Response 403:** not an admin

---

## 4. Query Key Conventions (TanStack Query)

| Data              | Query Key                                         |
| ----------------- | ------------------------------------------------- |
| Product list      | `['products', { category, filters, sort, page }]` |
| Product detail    | `['product', slug]`                               |
| Cart              | `['cart', userId]`                                |
| Wishlist          | `['wishlist', userId]`                            |
| Orders list       | `['orders', userId]`                              |
| Order detail      | `['order', orderId]`                              |
| Admin: all orders | `['admin', 'orders', filters]`                    |

Mutations invalidate the relevant keys on success (e.g., adding to cart invalidates `['cart', userId]`).

---

## 5. Rate Limiting & Abuse Prevention

- Supabase project-level rate limits apply by default
- Consider adding a simple check in `create-checkout-session` to prevent repeated rapid session creation per user
