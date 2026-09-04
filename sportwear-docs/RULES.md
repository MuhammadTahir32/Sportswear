# StrideWear Build Rules

## Mandatory Guidelines — Follow Throughout Entire Build

---

## 1. Phase Execution Rules

### Rule 1.1: Sequential Phase Completion

- Complete each phase **fully** before moving to the next
- **Exception:** Phase 6 (Admin Products) may run in parallel with Phase 4-5
- Exception: Phase 7 (Reviews/Wishlist) may start after Phase 4 completes

### Rule 1.2: Phase Exit Criteria

Before marking a phase as complete, verify:

- [ ] All P0 tasks in the phase are `Done`
- [ ] All P1 tasks in the phase are `Done` or have a documented plan
- [ ] Code compiles without errors
- [ ] No lint errors
- [ ] Progress tracker updated (`11-PROGRESS-TRACKER.md`)

### Rule 1.3: Task Status Updates

- Update `11-PROGRESS-TRACKER.md` **immediately** when starting or completing a task
- Never leave a task in `In Progress` for more than 1 work session without notes
- Mark tasks as `Blocked` with a reason in the Notes column

---

## 2. Code Quality Rules

### Rule 2.1: TypeScript Strict Mode

- `strict: true` in `tsconfig.json` — never disable
- No `any` types — use proper types or `unknown` + type guards
- All components, hooks, and functions must have explicit return types

### Rule 2.2: File Organization

Follow the structure defined in `08-README.md`:

```
app/
├── routes/          # TanStack Router file-based routes
├── components/      # Reusable UI components
├── lib/             # Utilities, Supabase client, constants
└── hooks/           # Custom hooks (useProducts, useCart, etc.)

supabase/
├── migrations/      # SQL migration files
└── functions/       # Edge Functions (one folder per function)

tests/
├── unit/            # Vitest unit tests
└── e2e/             # Playwright E2E tests
```

### Rule 2.3: Naming Conventions

| Item               | Convention              | Example                               |
| ------------------ | ----------------------- | ------------------------------------- |
| Components         | PascalCase              | `ProductCard`, `CartDrawer`           |
| Hooks              | camelCase, `use` prefix | `useProducts`, `useCart`              |
| Functions          | camelCase               | `formatPrice`, `validateCoupon`       |
| Files (components) | PascalCase              | `ProductCard.tsx`                     |
| Files (hooks)      | camelCase               | `useProducts.ts`                      |
| Files (utils)      | camelCase               | `formatPrice.ts`                      |
| Database tables    | snake_case              | `cart_items`, `order_status_history`  |
| Edge Functions     | kebab-case              | `create-checkout-session`             |
| CSS classes        | Tailwind utility-first  | N/A — use Tailwind classes            |
| Query keys         | Tuple arrays            | `['products', { category, filters }]` |

### Rule 2.4: No Comments Unless Asked

- Do not add comments to code unless explicitly requested
- Code should be self-documenting through naming
- Complex logic: extract into named functions instead of commenting

### Rule 2.5: Import Order

```typescript
// 1. React/Next/TanStack imports
import { useQuery } from '@tanstack/react-query'

// 2. Third-party libraries
import { format } from 'date-fns'

// 3. Local components
import { Button } from '@/components/ui/Button'

// 4. Local hooks/utils
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/formatPrice'

// 5. Types
import type { Product } from '@/lib/types'
```

---

## 3. Security Rules (Non-Negotiable)

### Rule 3.1: Keys & Secrets

- **NEVER** put `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- **NEVER** commit `.env` files to git
- All secrets go in Edge Function environment only

### Rule 3.2: Row Level Security

- RLS must be enabled on **every** table — no exceptions
- Every table must have at least one explicit policy
- Before marking Phase 1 complete, verify: `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT IN (SELECT tablename FROM pg_policies WHERE schemaname = 'public');` returns empty

### Rule 3.3: Input Validation

- Client-side validation for UX
- Server-side validation for security (DB constraints + Edge Function checks)
- Never trust client-sent data — validate in Edge Functions
- Sanitize search queries before using in `ilike` or `tsquery`

### Rule 3.4: Authentication

- Check `auth.uid()` in RLS policies — never `user_id` from request body
- Verify JWT signature in Edge Functions (Supabase handles this)
- Enforce email verification before checkout

### Rule 3.5: Payments

- Cash on Delivery (COD) — no online payment processing
- Order creation uses DB transactions to prevent race conditions
- Stock decrement must be atomic (single transaction)

---

## 4. Git & Version Control Rules

### Rule 4.1: Branch Strategy

```
main          ← production-ready code
├── feature/* ← new features
├── fix/*     ← bug fixes
├── docs/*    ← documentation only
└── chore/*   ← tooling, config, deps
```

### Rule 4.2: Commit Messages

Format: `type(scope): description`

- `feat(catalog): add product filter by size and color`
- `fix(checkout): prevent stock race condition`
- `docs(api): update Edge Function documentation`
- `chore(deps): update Supabase CLI to v1.8`
- `test(rls): add RLS policy tests for cart_items`

### Rule 4.3: Branch Protection

- Never push directly to `main`
- All PRs require at least one review (or self-review for solo)
- CI must pass before merge (lint + typecheck + tests)

### Rule 4.4: PR Checklist

Before creating a PR, verify:

- [ ] Code compiles (`pnpm build` or `pnpm typecheck`)
- [ ] Lint passes (`pnpm lint`)
- [ ] No `console.log` left in production code
- [ ] Types are correct (no `any`)
- [ ] RLS policies updated if new table/columns added
- [ ] Documentation updated if behavior/schema/API changed
- [ ] Progress tracker updated

---

## 5. Database Rules

### Rule 5.1: Migration Files

- Every schema change is a new migration file: `supabase migration new <descriptive_name>`
- Never edit an existing migration file after it's been applied
- Always test migrations locally with `supabase db reset` before pushing

### Rule 5.2: Schema Design

- Every table must have a `uuid` primary key (use `gen_random_uuid()`)
- Every table must have `created_at timestamptz default now()`
- Foreign keys must have explicit `ON DELETE` behavior (usually `CASCADE` or `SET NULL`)
- Use `numeric(10,2)` for money values — never `float`

### Rule 5.3: Indexes

- Index foreign keys used in RLS policies
- Index columns used in `WHERE` clauses (status, category_id, user_id)
- Add full-text search index for product search

### Rule 5.4: RLS Policy Template

```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Users can read their own rows
CREATE POLICY "users_read_own" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own rows
CREATE POLICY "users_insert_own" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own rows
CREATE POLICY "users_update_own" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own rows
CREATE POLICY "users_delete_own" ON table_name
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 6. Frontend Rules

### Rule 6.1: Component Structure

```tsx
// ComponentName.tsx
import { ... } from '...';

type ComponentNameProps = {
  // explicit props
};

export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // hooks first
  // then derived state
  // then handlers
  // then render
  return (
    <div>
      ...
    </div>
  );
}
```

### Rule 6.2: TanStack Query Usage

- Every data fetch uses TanStack Query — no raw `fetch` + `useState`
- Query keys follow convention: `['resource', { filters }]`
- Mutations invalidate related query keys on success
- Use `staleTime` and `cacheTime` appropriately

### Rule 6.3: State Management

- Server state: TanStack Query (never duplicate in local state)
- Form state: React Hook Form or controlled components
- URL state: TanStack Router search params
- UI state: React `useState` / `useReducer`
- **No global state library** (Redux, Zustand) unless explicitly required

### Rule 6.4: Styling

- Tailwind CSS only — no custom CSS files (except minimal global reset)
- No inline styles except dynamic values
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes

### Rule 6.5: Error Handling

- All API calls must handle errors gracefully
- Show user-friendly error messages (not raw error objects)
- Log errors to console in development, to service in production

---

## 7. Edge Function Rules

### Rule 7.1: Structure

```typescript
// supabase/functions/function-name/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Create Supabase client with auth
    // 2. Verify JWT / permissions
    // 3. Business logic
    // 4. Return response
  } catch (error) {
    return new Response(JSON.stringify({ error: { code: 'INTERNAL', message: error.message } }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
```

### Rule 7.2: Error Responses

Always return consistent error format:

```json
{
  "error": {
    "code": "STOCK_INSUFFICIENT",
    "message": "Variant XYZ is out of stock"
  }
}
```

### Rule 7.3: Order Creation

- Use DB transactions for stock decrement (race condition protection)
- Validate stock before creating order
- Clear cart after successful order creation

---

## 8. Testing Rules

### Rule 8.1: Test Coverage Minimums

| Type       | Minimum Coverage         |
| ---------- | ------------------------ |
| Unit tests | All utility functions    |
| RLS tests  | Every table's policies   |
| E2E tests  | Checkout flow, Auth flow |

### Rule 8.2: Test Naming

```
describe('formatPrice', () => {
  it('formats USD with two decimal places', () => { ... });
  it('handles zero price correctly', () => { ... });
});
```

### Rule 8.3: RLS Test Pattern

```typescript
// Test that User A cannot read User B's data
const { data, error } = await supabaseUserA.from('orders').select('*').eq('user_id', userB_id)

expect(data).toHaveLength(0) // RLS blocks access
```

---

## 9. Deployment Rules

### Rule 9.1: Environment Parity

- Staging must mirror production (same Supabase schema, same Edge Functions)
- Test everything on staging before production deploy

### Rule 9.2: Pre-Deploy Checklist

- [ ] All migrations applied
- [ ] Edge Function secrets set
- [ ] Smoke test completed (signup → browse → cart → checkout)
- [ ] RLS spot-checked
- [ ] Changelog updated

### Rule 9.3: Rollback Plan

- Frontend: Vercel instant rollback to previous deployment
- Database: Supabase Point-in-Time Recovery or down-migration
- Edge Functions: Redeploy previous git tag

---

## 10. Documentation Rules

### Rule 10.1: Keep Docs Updated

- If schema changes → update `03-LLD-Database-Schema.md`
- If API changes → update `04-API-Documentation.md`
- If new env vars → update `07-Deployment-Guide.md`
- If new features → update `01-SRS.md` and `08-README.md`

### Rule 10.2: Changelog Format

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- New feature description

### Changed

- Modification description

### Fixed

- Bug fix description

### Security

- Security improvement description
```

### Rule 10.3: Progress Tracker

- Update `11-PROGRESS-TRACKER.md` at start and end of each work session
- Add entries to Daily Log for accountability
- Record decisions in Decisions Log

---

## 11. Performance Rules

### Rule 11.1: Frontend

- Lighthouse performance score ≥ 80
- Product pages load < 2s on 4G
- Use TanStack Query caching effectively
- Lazy load routes and heavy components
- Optimize images (WebP, proper sizing)

### Rule 11.2: Database

- Paginate all list queries (no `SELECT *` without limit)
- Use database indexes on filtered/sorted columns
- Avoid N+1 queries — use joins/subqueries

---

## 12. Communication Rules

### Rule 12.1: Progress Updates

- After completing each phase, update dashboard.html
- Weekly summary: tasks completed, blockers, next priorities

### Rule 12.2: Issue Tracking

- Bugs → GitHub Issues with `bug` label
- Feature requests → GitHub Issues with `enhancement` label
- Blockers → Mark task as `Blocked` in progress tracker with reason

---

## 13. Brand & Theme Rules

### Rule 13.1: Brand Theme Source of Truth

- **MUST** follow `w:\August_2026\Sportswear\BRAND_THEME_GUIDE.md` for all visual/design decisions
- Colors, typography, spacing, components — all defined in the brand guide take precedence over defaults
- If a design conflict exists between Tailwind defaults and the brand guide, the brand guide wins

### Rule 13.2: Color Palette

- Primary background: `#0D0D0D` / `#111111` (black)
- Page background: `#FFFFFF` (white)
- Primary accent: `#C6FF3D` (lime green) — CTAs, highlights, badges, hover states
- Hover shade: `#A6E62D` (lime-dark)
- Card/section backgrounds: `#F7F7F7` (gray-50)
- Swatch/divider backgrounds: `#EFEFEF` (gray-100)
- Secondary/meta text: `#9A9A9A` (gray-400)
- Body copy: `#4A4A4A` (gray-700)
- Star ratings: `#F5A623` (gold)
- Price text: `#111111` (bold black)
- **Never use** random Tailwind colors — always reference the brand palette above

### Rule 13.3: Typography

- **Headlines:** Condensed black display font (`Anton`, `Archivo Black`, `Oswald`) — ALL CAPS, tight letter-spacing, weight 900
  - Hero H1: 64–80px, line-height 0.95
  - Section H2: 36–44px, weight 900
  - Category tile label: 20–24px, weight 800
- **Body/UI:** Clean sans-serif (`Inter`, `Helvetica Neue`, Arial) — regular to semibold
  - Nav links: 14px, weight 500
  - Product title: 14–15px, weight 600
  - Price: 14px, weight 700
  - Body/description: 14–16px, weight 400
  - Micro/meta text: 11–12px, weight 500, letter-spacing 0.5px, uppercase
- **Rule:** Headlines = condensed display font. Everything else = clean sans-serif. Never mix.

### Rule 13.4: Layout & Spacing

- Max content width: `1440px`, centered
- Desktop side gutters: `~24px`, mobile: `16px`
- Section vertical rhythm: `80–100px` padding between major sections
- Card border-radius: `8–12px` (images/tiles), buttons: `6–8px` or pill
- Grid gap: `20–24px`
- Product/category grids: 4-up (best sellers, new arrivals) and 3-up (categories, news)

### Rule 13.5: Component Styles

- **Announcement bar:** Black bg, lime text, marquee, 32px height, 11px uppercase
- **Navigation:** White bg, black logo, sticky on scroll
- **Hero:** Full-bleed photo, dark overlay left, lime CTA pill button
- **Product card:** Light-gray square image, name (2-line max), gold stars, bold price, color swatches
- **Buttons:** Primary CTA = lime bg `#C6FF3D`, black bold text, pill/rounded
- **Footer:** Full black bg, lime radial glow at top edge, 4-column links

### Rule 13.6: Imagery

- High-contrast editorial photography, outdoor urban/athletic settings
- Product photography: clean, isolated on light-gray backgrounds, slight drop shadow
- Hero aspect ratio: ~21:9, category tiles: ~4:5, promo banner: ~21:9
- Brand/partner logos as SVG for crispness

### Rule 13.7: Motion & Interaction

- Hover: product image slight zoom, card shadow lift
- Hover: nav links underline or color shift to lime
- Arrow-circle buttons: fill/scale on hover
- Marquee ticker: continuous horizontal scroll

---

## Quick Reference Card

| What       | Rule                                                     |
| ---------- | -------------------------------------------------------- |
| TypeScript | Strict mode, no `any`                                    |
| Secrets    | Server-side only, never in frontend                      |
| RLS        | Enabled on every table, explicit policies                |
| Migrations | New file per change, test locally first                  |
| Git        | Feature branches, no direct push to main                 |
| Testing    | Unit + RLS + E2E (checkout, auth)                        |
| Deploy     | Staging first, smoke test, then production               |
| Docs       | Update when behavior/schema/API changes                  |
| Progress   | Update tracker at start/end of each session              |
| **Brand**  | **Follow BRAND_THEME_GUIDE.md for all design decisions** |
| **Colors** | **Lime `#C6FF3D`, Black `#0D0D0D`, White `#FFFFFF`**     |
| **Fonts**  | **Headlines: Anton/Archivo Black. Body: Inter**          |
