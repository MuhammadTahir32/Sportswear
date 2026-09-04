# Security Requirements Document

## StrideWear — Sportwear E-Commerce Web Application

---

## 1. Authentication & Authorization

- All auth handled by Supabase Auth (bcrypt-hashed passwords, never handled manually)
- Enforce email verification before allowing checkout
- Role-based access via `profiles.role`, checked in both RLS policies **and** server-side in Edge Functions (defense in depth — never trust client-sent role claims alone)
- Session tokens (JWT) stored via Supabase client's secure storage; never logged

## 2. Row Level Security (RLS)

- RLS **enabled on every table**, no exceptions, including lookup tables
- Default-deny: no policy = no access
- Every policy reviewed against: "what happens if a malicious user calls this table directly with the anon key and a stolen-but-valid session token?"
- Service-role key used **only** inside Edge Functions / trusted server context — never bundled into frontend code or `.env` files that ship to the client

## 3. Input Validation

- All forms validated client-side (UX) **and** server-side/DB-side (security) — e.g., check constraints on `reviews.rating`, quantity > 0 on cart/order items
- Sanitize/validate coupon codes, search queries before querying
- File upload (product images, admin only): restrict MIME types (`image/jpeg`, `image/png`, `image/webp`), max size (e.g., 5MB), validate on both client and Storage policy

## 4. Payments

- Cash on Delivery (COD) — no online payment processing
- Order creation happens directly in Supabase (RLS-protected)
- Stock decrement uses DB transactions to prevent race conditions

## 5. OWASP Top 10 Checklist (Applied)

| Risk                      | Mitigation                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| Broken Access Control     | RLS on all tables + server-side role checks on Edge Functions                                |
| Cryptographic Failures    | TLS everywhere (Supabase + Vercel enforce HTTPS); no sensitive data stored unencrypted       |
| Injection                 | Supabase client uses parameterized queries by default; no raw SQL string concatenation       |
| Insecure Design           | Threat-modeled checkout flow (stock race conditions, duplicate orders) before implementation |
| Security Misconfiguration | Separate `dev`/`prod` Supabase projects; secrets in environment variables, never committed   |
| Vulnerable Components     | Dependabot/`npm audit` run regularly on frontend deps                                        |
| Auth Failures             | Rely on Supabase Auth (rate-limited, secure by default) rather than custom auth              |
| Data Integrity Failures   | Webhook signature checks; DB constraints (foreign keys, check constraints)                   |
| Logging Failures          | Log Edge Function errors (without PII/card data) for debugging                               |
| SSRF                      | Edge Functions only call known, allow-listed external hosts (email provider)                 |

## 6. Secrets Management

| Secret                    | Location                                    |
| ------------------------- | ------------------------------------------- |
| Supabase anon key         | Frontend env var (safe — RLS protects data) |
| Supabase service-role key | Edge Function / server env only             |
| Email provider API key    | Edge Function env only                      |

## 7. Data Privacy

- Collect only necessary customer data (name, email, shipping address, phone)
- Provide account deletion path (cascade-delete or anonymize `profiles` row and related data on request)
- No third-party analytics/trackers that leak PII without disclosure
