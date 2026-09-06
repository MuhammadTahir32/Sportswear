# StrideWear E-Commerce Platform

Welcome to the **StrideWear** codebase. This is a modern, high-performance e-commerce platform built with an emphasis on rich aesthetics, atomic server-side state management, and an exceptional user experience.

## Tech Stack

- **Framework:** React 19 + Vite
- **Routing:** TanStack Router (File-based routing)
- **State Management & Caching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS v4 (with custom utility-first integrations)
- **Backend (BaaS):** Supabase
  - PostgreSQL (Database + RPCs)
  - Auth (Session management)
  - Storage (Image uploads)
  - Edge Functions (Deno-based transactional emails)
- **Testing:** Vitest (Unit testing for business logic)

## Architecture Highlights

1. **Atomic Inventory Management:** Stock decrements and restorations are handled exclusively via PostgreSQL RPCs (`decrement_stock`, `restore_stock`) using `FOR UPDATE` row-level locks. This entirely eliminates race conditions during checkout.
2. **Server-Side Validation:** Review eligibility (ensuring only verified buyers can leave reviews) and order status transitions are strictly validated on the backend.
3. **Optimistic UI Updates:** Wishlist toggles and cart additions use React Query's optimistic updates to provide a zero-latency feel for the user.
4. **Automated Webhooks/Edge Functions:** Transactional emails (Order Confirmation, Low Stock Alerts) are decoupled from the client and processed via Supabase Edge Functions.
5. **Admin Dashboard:** A fully protected `/admin` namespace with advanced charting, real-time stock alerts, and full CRUD capabilities for the product catalog.

## Local Setup

### Prerequisites

- Node.js (v20+)
- npm
- Docker (required for running Supabase locally)
- Supabase CLI (`npm i -g supabase`)

### 1. Clone & Install

\`\`\`bash
git clone <repo-url>
cd Sportswear
npm install
\`\`\`

### 2. Run Supabase Locally

Ensure Docker is running, then start the local Supabase stack:
\`\`\`bash
npx supabase start
\`\`\`
This will automatically spin up the database, run all migrations (including RLS policies and RPCs), and provide you with local API URLs and anon keys.

### 3. Environment Variables

Create a \`.env.local\` file in the root directory and populate it with your local Supabase credentials (printed in your terminal after running `supabase start`):

\`\`\`env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key
\`\`\`

_(Optional)_ For the edge functions to send real emails via Resend, add:
\`\`\`env
RESEND_API_KEY=re_your_api_key
\`\`\`

### 4. Run the Frontend

\`\`\`bash
npm run dev
\`\`\`
The application will be available at \`http://localhost:5173\`.

### 5. Edge Functions

To serve edge functions locally (for the email system):
\`\`\`bash
npx supabase functions serve --no-verify-jwt
\`\`\`

## Testing

Run the Vitest test suite for critical business logic (cart, taxes, shipping, discounts):
\`\`\`bash
npm run test
\`\`\`
_(Or `npx vitest run`)_

## Database Migrations

If you modify the schema locally via the Supabase Studio dashboard (`http://localhost:54323`), generate a new migration file:
\`\`\`bash
npx supabase db diff -f my_new_migration_name
\`\`\`

## Deployment

1. Create a project on [Supabase](https://supabase.com/).
2. Link your local project: `npx supabase link --project-ref your-project-id`.
3. Push migrations: `npx supabase db push`.
4. Deploy edge functions: `npx supabase functions deploy send-email`.
5. Deploy the frontend to Vercel, ensuring you set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel environment variables.

---

_Built with precision and care during the Antigravity session._
