# StrideWear — Phase 0: Foundation, Brand Theme & Reusable Components

## Background

StrideWear is a full-stack sportswear e-commerce web app using **TanStack Start + Supabase + Stripe**.
All 130 tasks across 10 phases are currently `Not Started`.

This plan covers the critical **Phase 0** work — scaffolding the TanStack Start project, establishing the brand design system from `BRAND_THEME_GUIDE.md`, and building every reusable UI component needed across the entire app.

**Brand Identity (from BRAND_THEME_GUIDE.md + RULES.md):**

- Name: **StrideWear** (sportswear e-commerce, vs KICKS which is a separate reference brand)
- Palette: Black `#0D0D0D`, White `#FFF`, Lime `#C6FF3D`, Lime-Dark `#A6E62D`
- Display Font: **Anton** (headlines, ALL CAPS, weight 900, tight tracking)
- Body Font: **Inter** (nav, UI, prices, body copy)
- Layout: 1440px max, 12-col grid, 80–100px section rhythm

---

## Open Questions

> [!IMPORTANT]
> **Q1 — Project Scaffold**: The docs specify TanStack Start + Tailwind CSS. The RULES.md (Rule 6.4) mandates "Tailwind CSS only — no custom CSS files". However, the general system prompt calls for Vanilla CSS. **Docs & RULES.md take precedence** — we will use **TanStack Start + Tailwind CSS v4** as required.

> [!IMPORTANT]
> **Q2 — Scope of this session**: This plan covers **Phase 0 (Foundation) + Brand Design System + Reusable Components**. Phases 1–10 (DB, Auth, Catalog, Checkout etc.) will follow in subsequent sessions.

---

## Proposed Changes

### Phase 0.1 — TanStack Start Project Scaffold

#### [NEW] `w:\August_2026\Sportswear\` (project root)

- Initialize TanStack Start project using `pnpm create tanstack@latest`
- Configure TypeScript with strict mode + path aliases (`@/` → `./app`)
- Install Tailwind CSS v4, PostCSS, Autoprefixer
- Install ESLint, Prettier, and project rules
- Install core deps: `@tanstack/react-router`, `@tanstack/react-query`, `@tanstack/react-table`, `@supabase/supabase-js`, `clsx`, `tailwind-merge`

---

### Phase 0.2 — Brand Design System (Tailwind Config + CSS Tokens)

#### [MODIFY] `tailwind.config.ts`

Extend with all brand tokens from `BRAND_THEME_GUIDE.md`:

```
colors: { black: '#0D0D0D', white: '#FFFFFF', lime: '#C6FF3D', lime-dark: '#A6E62D', gray-50/100/400/700, star-gold, price }
fonts: { display: ['Anton', 'Archivo Black', 'Oswald', ...], body: ['Inter', 'Helvetica Neue', ...] }
screens, container (1440px max), borderRadius tokens, spacing scale
```

#### [NEW] `app/styles/globals.css`

- Google Fonts import (Anton + Inter)
- CSS custom properties for all brand tokens
- Global reset (minimal)
- Marquee keyframe animation
- Hover/transition utility classes

#### [NEW] `app/lib/cn.ts`

- `cn()` utility using `clsx` + `tailwind-merge` (per Rule 6.4)

---

### Phase 0.3 — Reusable UI Components (`app/components/ui/`)

All components follow Rule 6.1 (explicit props typed, hooks first, no comments).

#### [NEW] `app/components/ui/Button.tsx`

Variants: `primary` (lime bg, black text, pill), `secondary` (outline), `icon-circle` (arrow button on tiles)
Props: `variant`, `size`, `asChild`, `loading`, `icon`

#### [NEW] `app/components/ui/Badge.tsx`

Sale badge, New badge, category pill — lime or black bg

#### [NEW] `app/components/ui/AnnouncementBar.tsx`

- Black bg, lime text, `32px` height
- Marquee: "Easy Return + 24/7 Support + Worldwide Shipping" repeating
- CSS marquee animation (continuous horizontal scroll)

#### [NEW] `app/components/ui/Navbar.tsx`

- White bg, sticky on scroll
- Bold STRIDEWEAR wordmark (Anton font)
- Center nav links with dropdown support
- Right: currency selector, search icon, account icon, cart icon with badge count

#### [NEW] `app/components/ui/ProductCard.tsx`

- Light-gray square image tile, rounded corners
- Product name (2-line clamp, semibold Inter)
- Star rating row (gold stars + numeric rating)
- Price (bold, `#111111`)
- Color swatch row (`+ N` overflow pill)
- Hover: image zoom + card shadow lift

#### [NEW] `app/components/ui/CategoryTile.tsx`

- Full-bleed photo, rounded corners
- Bottom-left label overlay (white bold caps text)
- Bottom-right circular arrow button (fill/scale on hover)
- Props: `image`, `label`, `href`

#### [NEW] `app/components/ui/SectionHeader.tsx`

- Large condensed Anton headline, left-aligned, black
- Optional sub-label right-aligned (e.g., "View All →")

#### [NEW] `app/components/ui/StarRating.tsx`

- Filled/empty star icons, gold `#F5A623`
- Props: `rating` (number), `count` (reviews), `size`

#### [NEW] `app/components/ui/SwatchGroup.tsx`

- Square swatch thumbnails + `+N` overflow pill
- Props: `swatches[]`, `maxVisible`, `selected`, `onSelect`

#### [NEW] `app/components/ui/Input.tsx`

- Clean geometric input field (Inter)
- Variants: default, search (with icon), error state
- Controlled + uncontrolled support

#### [NEW] `app/components/ui/Select.tsx`

- Brand-styled native/custom select
- Used for currency selector, sort by, size

#### [NEW] `app/components/ui/Modal.tsx`

- Accessible modal/dialog (portal-based)
- Used for size guide, image lightbox

#### [NEW] `app/components/ui/Drawer.tsx`

- Slide-in side panel (right)
- Used for cart drawer

#### [NEW] `app/components/ui/Skeleton.tsx`

- Animated skeleton loaders (product card, hero, etc.)

#### [NEW] `app/components/ui/Toast.tsx`

- Toast notification system
- Variants: success (lime), error (red), info

#### [NEW] `app/components/ui/Footer.tsx`

- Full black bg with lime radial glow at top edge
- Logo + social icons (Facebook, Instagram)
- 4-column link grid: Shoe Laces / Customer Service / Information / Brand Info
- Bottom bar: copyright, small muted gray

#### [NEW] `app/components/ui/BrandLogoStrip.tsx`

- Centered label + row of 6 grayscale brand logos
- Reused for both "Popular Brands" and "Partnerships"

#### [NEW] `app/components/ui/PromoBanner.tsx`

- Full-width dark photo banner
- Lime kicker text + large white/lime headline
- Lime pill CTA button

---

### Phase 0.4 — App Shell & Route Setup

#### [NEW] `app/routes/__root.tsx`

- Root layout: `<AnnouncementBar />` + `<Navbar />` + `<Outlet />` + `<Footer />`
- TanStack Query provider + Router provider

#### [NEW] `app/routes/index.tsx`

- Placeholder homepage (will be fleshed out in Phase 3)
- Shows all components rendered in context

#### [NEW] `app/lib/supabase.ts`

- Supabase client singleton (anon key only, per Rule 3.1)
- Server-side client factory for loaders

#### [NEW] `.env.example`

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # Server/Edge only
STRIPE_SECRET_KEY=            # Server/Edge only
STRIPE_WEBHOOK_SECRET=        # Server/Edge only
RESEND_API_KEY=               # Server/Edge only
```

---

### Phase 0.5 — Progress Tracker Update

#### [MODIFY] `sportwear-docs/11-PROGRESS-TRACKER.md`

Update Phase 0 tasks to `Done` as each is completed. Update Quick Stats accordingly.

---

## Verification Plan

### Manual Verification

1. Run `pnpm dev` — app loads without errors at `localhost:3000`
2. All components render correctly in the root route
3. Brand tokens (lime `#C6FF3D`, Anton font, Inter body) are visually verified
4. Marquee animation runs smoothly in the announcement bar
5. Navbar is sticky on scroll
6. ProductCard hover effects (zoom + shadow lift) work
7. Mobile responsive layout (16px gutters) verified

### Automated

- `pnpm typecheck` — zero TypeScript errors
- `pnpm lint` — zero ESLint errors

---

## Execution Order

1. Scaffold TanStack Start project (0.1 → 0.2)
2. Configure TypeScript + Tailwind with brand tokens (0.3)
3. Create `cn()` utility + globals CSS
4. Build UI components in dependency order (primitives first: Button, Badge, Input, Select, StarRating, SwatchGroup, Skeleton → composites: ProductCard, CategoryTile, AnnouncementBar, Navbar, Footer, Modal, Drawer, Toast)
5. Wire root layout
6. Render all components in index route for visual verification
7. Update progress tracker
