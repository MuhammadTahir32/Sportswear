# Implementation Plan — StrideWear Shoelace Store

---

## Phase 1: Fix Missing Route Pages (Navbar "Not Found")

**Goal:** All 6 navbar links work without showing "Not Found"

| Route          | File to Create               | Description                                                |
| -------------- | ---------------------------- | ---------------------------------------------------------- |
| `/brands`      | `app/routes/brands.tsx`      | Laces by Shoe Brand — filter by Nike, Adidas, etc.         |
| `/laces`       | `app/routes/laces.tsx`       | All shoe laces — links to `/products` with lace categories |
| `/accessories` | `app/routes/accessories.tsx` | Accessories page (lace tips, aglets, etc.)                 |
| `/custom`      | `app/routes/custom.tsx`      | Custom shoelaces page                                      |
| `/size-chart`  | `app/routes/size-chart.tsx`  | Shoelace size chart (not clothing)                         |
| `/reviews`     | `app/routes/reviews.tsx`     | All reviews page                                           |

**Also fix:**

- Navbar `/account` link → change to `/profile`
- Footer dead links (`href="#"`) → update to proper routes

---

## Phase 2: Update Seed Data for Shoelace Products

**Goal:** Replace shoe products with shoelace products in `supabase/seed.sql`

### Categories to insert:

| Name         | Slug           |
| ------------ | -------------- |
| Round Laces  | `round-laces`  |
| Flat Laces   | `flat-laces`   |
| Oval Laces   | `oval-laces`   |
| Waxed Laces  | `waxed-laces`  |
| No-Tie Laces | `no-tie-laces` |
| Fat Laces    | `fat-laces`    |
| Accessories  | `accessories`  |

### Products (15 items):

| #   | Name                           | Category     | Brand       | Gender | Price |
| --- | ------------------------------ | ------------ | ----------- | ------ | ----- |
| 1   | Nike Round Laces - Black       | round-laces  | Nike        | unisex | 12.99 |
| 2   | Nike Round Laces - White       | round-laces  | Nike        | unisex | 12.99 |
| 3   | Adidas Flat Laces - Black      | flat-laces   | Adidas      | men    | 14.99 |
| 4   | Adidas Flat Laces - Lime       | flat-laces   | Adidas      | unisex | 14.99 |
| 5   | New Balance Oval Laces - Navy  | oval-laces   | New Balance | men    | 11.99 |
| 6   | Jordan Flat Laces - Red        | flat-laces   | Jordan      | unisex | 15.99 |
| 7   | Vans Classic Laces - White     | flat-laces   | Vans        | kids   | 9.99  |
| 8   | Converse Round Laces - Multi   | round-laces  | Converse    | unisex | 13.99 |
| 9   | Hoka No-Tie Laces - Black      | no-tie-laces | Hoka        | unisex | 18.99 |
| 10  | Puma Fat Laces - White         | fat-laces    | Puma        | men    | 16.99 |
| 11  | Nike Waxed Laces - Brown       | waxed-laces  | Nike        | men    | 19.99 |
| 12  | Adidas Oval Laces - Pink       | oval-laces   | Adidas      | women  | 12.99 |
| 13  | New Balance Round Laces - Grey | round-laces  | New Balance | unisex | 11.99 |
| 14  | Jordan Fat Laces - Black/Green | fat-laces    | Jordan      | unisex | 17.99 |
| 15  | Converse Flat Laces - Striped  | flat-laces   | Converse    | kids   | 10.99 |

**Each product includes:**

- `product_variants` (size/color variants)
- `product_images` (links to generated images)

---

## Phase 3: Generate Product Images with Gemini

**Goal:** Create product images for all 15 products

### Image Generation Prompt Pattern:

```
Product photo of [color] [lace type] shoelaces for [brand] shoes, coiled bundle, white background, e-commerce style, high quality, studio lighting
```

### Images to save in `public/` folder:

| File Name                   | Product                        |
| --------------------------- | ------------------------------ |
| `nike-round-black.jpg`      | Nike Round Laces - Black       |
| `nike-round-white.jpg`      | Nike Round Laces - White       |
| `adidas-flat-black.jpg`     | Adidas Flat Laces - Black      |
| `adidas-flat-lime.jpg`      | Adidas Flat Laces - Lime       |
| `nb-oval-navy.jpg`          | New Balance Oval Laces - Navy  |
| `jordan-flat-red.jpg`       | Jordan Flat Laces - Red        |
| `vans-flat-white.jpg`       | Vans Classic Laces - White     |
| `converse-round-multi.jpg`  | Converse Round Laces - Multi   |
| `hoka-notie-black.jpg`      | Hoka No-Tie Laces - Black      |
| `puma-fat-white.jpg`        | Puma Fat Laces - White         |
| `nike-waxed-brown.jpg`      | Nike Waxed Laces - Brown       |
| `adidas-oval-pink.jpg`      | Adidas Oval Laces - Pink       |
| `nb-round-grey.jpg`         | New Balance Round Laces - Grey |
| `jordan-fat-blackgreen.jpg` | Jordan Fat Laces - Black/Green |
| `converse-flat-striped.jpg` | Converse Flat Laces - Striped  |

### Also generate:

- `placeholder-product.jpg` — generic lace bundle (fallback image)
- `cat_brand.jpg` — category tile for "Laces by Brand"
- `cat_sport.jpg` — category tile for "Laces by Sport"
- `cat_accessories.jpg` — category tile for "Accessories"
- `hero-bg.jpg` — hero banner background

---

## Phase 4: Fix Product Listing Page

**Goal:** Products display correctly with images, prices, and filters work

### Tasks:

1. Verify Supabase connection (`VITE_SUPABASE_URL` in `.env` is correct)
2. Run seed SQL to populate database with shoelace products
3. Verify `useProducts` hook fetches data correctly
4. Verify `ProductCard` renders images from generated files
5. Test category filter, gender filter, price range filter
6. Test pagination (12 products per page)

### Files to verify/update:

- `app/hooks/useProducts.ts` — data fetching
- `app/routes/products.tsx` — product grid layout
- `app/components/ui/FilterSidebar.tsx` — filter sidebar
- `app/components/ui/ProductCard.tsx` — product card display

---

## Phase 5: Fix Home Page Product Links

**Goal:** Product cards link to correct detail pages

### Current Bug:

`index.tsx` line 440, 484:

```tsx
href={`/products/${product.id}`}  // Uses ID instead of slug
```

### Fix:

- Update `BEST_SELLERS` and `NEW_ARRIVALS` arrays to include `slug` field
- Change href to use `product.slug`
- Or fetch from database instead of hardcoded data

---

## Phase 6: Update Size Chart Content

**Goal:** Size chart shows shoelace sizing, not clothing

### File:

`app/components/ui/SizeGuideModal.tsx`

### Replace clothing measurements with shoelace size chart:

| Shoe Size (US) | Lace Length  | Recommended For                   |
| -------------- | ------------ | --------------------------------- |
| 3–5            | 36" (91 cm)  | Kids / Low-top sneakers           |
| 5–8            | 45" (114 cm) | Low-top sneakers (Vans, Converse) |
| 7–10           | 54" (137 cm) | Mid-top sneakers (Nike, Adidas)   |
| 9–12           | 63" (160 cm) | High-top sneakers, boots          |
| 11–14          | 72" (183 cm) | Large boots, hiking shoes         |

### Also update:

- "How to measure" section with shoelace tips
- Table headers: `Size | Lace Length | Recommended For`

---

## Phase 7: Fix Cart Functionality

**Goal:** Add to cart actually works

### Current Bugs:

- `products.$slug.tsx` line 160-164: `handleAddToCart` only sets UI state, doesn't call `addToCart()`
- `ProductCard.tsx` line 66-69: quick-add only does `console.log()`

### Fix:

- Import `useCart` hook
- Wire `handleAddToCart` to call `addToCart(productId, variant)`
- Wire quick-add button in `ProductCard` to call cart API

---

## Execution Order

| Phase   | Description         | Est. Effort | Status         |
| ------- | ------------------- | ----------- | -------------- |
| Phase 1 | Missing Route Pages | 1-2 hours   | Ready          |
| Phase 2 | Seed Data           | 30 min      | Ready          |
| Phase 3 | Gemini Images       | 1-2 hours   | You generate   |
| Phase 4 | Product Listing     | 1 hour      | Depends on 2+3 |
| Phase 5 | Home Page Links     | 15 min      | Ready          |
| Phase 6 | Size Chart          | 30 min      | Ready          |
| Phase 7 | Cart Fix            | 30 min      | Ready          |

**Recommended start:** Phase 1 → Phase 2 → Phase 3 (you do) → Phase 4

---

## File Reference

### Key Files:

| File                                   | Purpose               |
| -------------------------------------- | --------------------- |
| `app/routes/index.tsx`                 | Home page             |
| `app/routes/products.tsx`              | Product listing page  |
| `app/routes/products.$slug.tsx`        | Product detail page   |
| `app/components/ui/Navbar.tsx`         | Navigation bar        |
| `app/components/ui/Footer.tsx`         | Footer                |
| `app/components/ui/FilterSidebar.tsx`  | Product filters       |
| `app/components/ui/ProductCard.tsx`    | Product card          |
| `app/components/ui/SizeGuideModal.tsx` | Size chart modal      |
| `app/hooks/useProducts.ts`             | Product data fetching |
| `app/hooks/useCart.ts`                 | Cart functionality    |
| `supabase/seed.sql`                    | Database seed data    |

### Brands:

- Nike
- Adidas
- New Balance
- Jordan
- Hoka
- Vans
- Converse
- Puma

### Gender Categories:

- Men
- Women
- Unisex
- Kids

### Price Ranges:

- Under $50
- $50 – $100
- $100 – $200
- Over $200

> **Note:** Most shoelace products will fall under $50. Higher price ranges are reserved for premium/custom bundles.
