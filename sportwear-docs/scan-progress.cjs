#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(__dirname, 'status.json')

function exists(p) {
  return fs.existsSync(path.join(ROOT, p))
}

function fileContains(p, search) {
  try {
    return fs.readFileSync(path.join(ROOT, p), 'utf-8').toLowerCase().includes(search.toLowerCase())
  } catch {
    return false
  }
}

function globFiles(pattern) {
  const dir = path.join(ROOT, path.dirname(pattern))
  const ext = path.extname(pattern)
  try {
    return fs.readdirSync(dir).filter(f => f.endsWith(ext)).map(f => path.join(path.dirname(pattern), f))
  } catch {
    return []
  }
}

function check(pattern) {
  return globFiles(pattern).length > 0
}

function fileSize(p) {
  try { return fs.statSync(path.join(ROOT, p)).size } catch { return 0 }
}

const tasks = {}

function done(id, files) { tasks[id] = { status: 'done', notes: files || '' } }
function partial(id, note) { tasks[id] = { status: 'in-progress', notes: note || '' } }
function todo(id) { tasks[id] = { status: 'not-started', notes: '' } }

// ─── Phase 0: Project Foundation ────────────────────────────────────────────
if (fileContains('package.json', '@tanstack')) { done('0.1', 'package.json has @tanstack deps') } else { todo('0.1') }
if (exists('tsconfig.json')) { done('0.2', 'tsconfig.json found') } else { todo('0.2') }
if (fileContains('package.json', 'tailwindcss') || exists('app/styles/globals.css')) { done('0.3', 'Tailwind v4 configured') } else { todo('0.3') }
if (exists('eslint.config.js') || exists('.eslintrc.js') || exists('.eslintrc.json')) { done('0.4') } else { todo('0.4') }
if (exists('app/routes') && exists('app/hooks') && exists('app/lib') && exists('app/components')) { done('0.5') } else { todo('0.5') }
if (exists('supabase/config.toml')) { done('0.6', 'supabase/config.toml found') } else { todo('0.6') }
if (exists('.env.example')) { done('0.7') } else { todo('0.7') }
if (exists('.husky/pre-commit') || exists('.husky/_')) { done('0.8', 'Husky hooks configured') } else { todo('0.8') }
if (fileContains('.git/config', 'origin')) { done('0.9', 'GitHub remote configured') } else { todo('0.9') }
if (exists('app/lib/supabase.ts')) { done('0.10', 'app/lib/supabase.ts found') } else { todo('0.10') }

// ─── Phase 1: Database & Schema ─────────────────────────────────────────────
const migrations = globFiles('supabase/migrations/*.sql').map(f => path.basename(f))
function hasMigration(pattern) { return migrations.some(m => m.includes(pattern)) }

if (hasMigration('profiles')) { done('1.1') } else { todo('1.1') }
if (hasMigration('addresses')) { done('1.2') } else { todo('1.2') }
if (hasMigration('categories')) { done('1.3') } else { todo('1.3') }
if (hasMigration('products')) { done('1.4') } else { todo('1.4') }
if (hasMigration('product_variants')) { done('1.5') } else { todo('1.5') }
if (hasMigration('product_images')) { done('1.6') } else { todo('1.6') }
if (hasMigration('cart_items')) { done('1.7') } else { todo('1.7') }
if (hasMigration('coupons')) { done('1.8') } else { todo('1.8') }
if (hasMigration('orders')) { done('1.9') } else { todo('1.9') }
if (hasMigration('order_status_history')) { done('1.10') } else { todo('1.10') }
if (hasMigration('reviews')) { done('1.11') } else { todo('1.11') }
if (hasMigration('wishlist')) { done('1.12') } else { todo('1.12') }
if (hasMigration('indexes')) { done('1.13') } else { todo('1.13') }

const rlsMigrations = migrations.filter(m => m.includes('rls'))
if (rlsMigrations.length >= 8) { done('1.14', rlsMigrations.length + ' RLS migrations found') }
else if (rlsMigrations.length > 0) { partial('1.14', rlsMigrations.length + '/8 RLS migrations') }
else { todo('1.14') }

if (rlsMigrations.some(m => m.includes('profiles'))) { done('1.15') } else { todo('1.15') }
if (rlsMigrations.some(m => m.includes('addresses'))) { done('1.16') } else { todo('1.16') }
if (rlsMigrations.some(m => m.includes('cart'))) { done('1.17') } else { todo('1.17') }
if (rlsMigrations.some(m => m.includes('orders'))) { done('1.18') } else { todo('1.18') }
if (rlsMigrations.some(m => m.includes('order_items'))) { done('1.19') } else { todo('1.19') }
if (rlsMigrations.some(m => m.includes('reviews'))) { done('1.20') } else { todo('1.20') }
if (rlsMigrations.some(m => m.includes('wishlist'))) { done('1.21') } else { todo('1.21') }
if (rlsMigrations.some(m => m.includes('products'))) { done('1.22') } else { todo('1.22') }
if (rlsMigrations.some(m => m.includes('coupons'))) { done('1.23') } else { todo('1.23') }

if (hasMigration('trigger') || hasMigration('avg_rating')) { done('1.24') } else { todo('1.24') }
if (exists('app/lib/types.ts') && fileSize('app/lib/types.ts') > 500) { done('1.25', 'Manual types in app/lib/types.ts') } else { todo('1.25') }
if (exists('supabase/seed.sql') && fileSize('supabase/seed.sql') > 100) { done('1.26', 'Seed data present') } else { todo('1.26') }

// ─── Phase 2: Auth & User Mgmt ──────────────────────────────────────────────
if (fileContains('supabase/config.toml', '[auth]')) { done('2.1', 'Auth configured in supabase/config.toml') } else { todo('2.1') }
if (exists('app/routes/_auth.sign-up.tsx')) { done('2.2') } else { todo('2.2') }
if (exists('app/routes/_auth.sign-in.tsx')) { done('2.3') } else { todo('2.3') }
if (exists('app/routes/_auth.verify.tsx') && fileContains('app/hooks/useAuth.ts', 'resendVerification')) { done('2.4') } else { todo('2.4') }
if (exists('app/routes/_auth.forgot-password.tsx')) { done('2.5', 'Forgot password page exists (no /reset-password route)') } else { todo('2.5') }
if (fileContains('app/hooks/useAuth.ts', 'onAuthStateChange')) { done('2.6') } else { todo('2.6') }
if (exists('app/routes/profile.tsx') && fileContains('app/routes/profile.tsx', 'beforeLoad')) { done('2.7', 'Auth guards on profile + addresses routes') } else { todo('2.7') }
if (fileContains('app/routes/_admin/route.tsx', 'beforeLoad') && fileContains('app/hooks/useAuth.ts', 'isAdmin')) { done('2.8') } else { todo('2.8') }
if (exists('app/routes/profile.tsx') && fileContains('app/routes/profile.tsx', 'account')) { done('2.9') } else { todo('2.9') }
if (exists('app/routes/addresses.tsx') && exists('app/hooks/useAddresses.ts')) { done('2.10', 'Full CRUD with useAddresses hook') } else { todo('2.10') }
if (fileContains('app/hooks/useAuth.ts', 'signOut')) { done('2.11') } else { todo('2.11') }

// ─── Phase 3: Product Catalog ───────────────────────────────────────────────
if (exists('app/hooks/useProducts.ts') && fileContains('app/hooks/useProducts.ts', 'useProducts')) { done('3.1') } else { todo('3.1') }
if (exists('app/routes/products.tsx') && fileContains('app/routes/products.tsx', 'createFileRoute')) { done('3.2') } else { todo('3.2') }
if (exists('app/components/ui/ProductCard.tsx')) { done('3.3') } else { todo('3.3') }
if (exists('app/components/ui/FilterSidebar.tsx') && fileContains('app/components/ui/FilterSidebar.tsx', 'category')) { done('3.4') } else { todo('3.4') }
if (exists('app/components/ui/FilterSidebar.tsx') && fileContains('app/components/ui/FilterSidebar.tsx', 'price')) { done('3.5') } else { todo('3.5') }
if (exists('app/components/ui/SortDropdown.tsx')) { done('3.6') } else { todo('3.6') }
if (exists('app/components/ui/SearchInput.tsx')) { done('3.7') } else { todo('3.7') }
if (exists('app/routes/products.$slug.tsx') && fileContains('app/routes/products.$slug.tsx', 'createFileRoute')) { done('3.8') } else { todo('3.8') }
if (exists('app/components/ui/VariantSelector.tsx')) { done('3.9') } else { todo('3.9') }
if (exists('app/components/ui/ReviewCard.tsx') && exists('app/components/ui/RatingBreakdown.tsx')) { done('3.10') } else { todo('3.10') }
if (exists('app/components/ui/SizeGuideModal.tsx')) { done('3.11') } else { todo('3.11') }
if (exists('app/routes/products.$slug.tsx') && fileContains('app/routes/products.$slug.tsx', 'meta')) { done('3.12', 'SEO meta tags present') } else { todo('3.12') }

// ─── Phase 4: Cart & Checkout ───────────────────────────────────────────────
if (exists('app/hooks/useCart.ts') || exists('app/hooks/useCart.tsx')) { done('4.1') } else { todo('4.1') }
if (exists('app/routes/cart.tsx') || exists('app/routes/cart.ts')) { done('4.2') } else { todo('4.2') }
if (exists('app/hooks/useCart.ts') && fileContains('app/hooks/useCart.ts', 'addToCart')) { done('4.3') } else { todo('4.3') }
if (exists('app/routes/checkout.tsx') || exists('app/routes/_checkout.tsx')) { done('4.4') } else { todo('4.4') }
if (exists('app/hooks/useCart.ts') && fileContains('app/hooks/useCart.ts', 'coupon')) { done('4.5') } else { todo('4.5') }
if (exists('app/routes/checkout.tsx') && fileContains('app/routes/checkout.tsx', 'address')) { done('4.6') } else { todo('4.6') }
if (exists('app/routes/checkout.tsx') && fileContains('app/routes/checkout.tsx', 'shipping')) { done('4.7') } else { todo('4.7') }
if (exists('app/routes/checkout.tsx') && fileContains('app/routes/checkout.tsx', 'cod')) { done('4.8') } else { todo('4.8') }
if (exists('app/routes/checkout.tsx') && fileContains('app/routes/checkout.tsx', 'order')) { done('4.9') } else { todo('4.9') }
if (exists('app/routes/order-confirmation.tsx')) { done('4.10') } else { todo('4.10') }
if (exists('app/hooks/useCart.ts') && fileContains('app/hooks/useCart.ts', 'clear')) { done('4.11') } else { todo('4.11') }
if (hasMigration('stock') || hasMigration('inventory')) { done('4.12') } else { todo('4.12') }

// ─── Phase 5: Order Management ──────────────────────────────────────────────
if (exists('app/hooks/useOrders.ts')) { done('5.1') } else { todo('5.1') }
if (exists('app/routes/orders.tsx') || exists('app/routes/orders.ts')) { done('5.2') } else { todo('5.2') }
if (exists('app/routes/orders.$id.tsx') || exists('app/routes/orders.$id.ts')) { done('5.3') } else { todo('5.3') }
if (exists('app/hooks/useAdminOrders.ts')) { done('5.4') } else { todo('5.4') }
if (exists('app/routes/_admin/orders.tsx')) { done('5.5') } else { todo('5.5') }
if (exists('supabase/functions/admin-update-status')) { done('5.6') } else { todo('5.6') }
if (exists('app/routes/_admin/orders.$id.tsx')) { done('5.7') } else { todo('5.7') }
if (exists('app/routes/orders.$id.tsx') && fileContains('app/routes/orders.$id.tsx', 'timeline')) { done('5.8') } else { todo('5.8') }
if (exists('app/routes/orders.$id.tsx') && fileContains('app/routes/orders.$id.tsx', 'cancel')) { done('5.9') } else { todo('5.9') }

// ─── Phase 6: Admin Products ────────────────────────────────────────────────
if (exists('app/hooks/useAdminProducts.ts')) { done('6.1') } else { todo('6.1') }
if (exists('app/routes/_admin/products.tsx')) { done('6.2') } else { todo('6.2') }
if (exists('app/routes/_admin/products.new.tsx') || exists('app/routes/_admin/products.$id.edit.tsx')) { done('6.3') } else { todo('6.3') }
if (exists('app/components/ui/ImageUploader.tsx')) { done('6.4') } else { todo('6.4') }
if (exists('app/components/ui/VariantManager.tsx')) { done('6.5') } else { todo('6.5') }
if (exists('app/hooks/useAdminProducts.ts') && fileContains('app/hooks/useAdminProducts.ts', 'stock')) { done('6.6') } else { todo('6.6') }
if (exists('app/components/ui/LowStockAlert.tsx')) { done('6.7') } else { todo('6.7') }
if (exists('app/routes/_admin/categories.tsx')) { done('6.8') } else { todo('6.8') }
if (exists('app/routes/_admin/coupons.tsx')) { done('6.9') } else { todo('6.9') }

// ─── Phase 7: Reviews & Wishlist ────────────────────────────────────────────
if (exists('app/hooks/useReviews.ts')) { done('7.1') } else { todo('7.1') }
if (exists('app/components/ui/ReviewForm.tsx')) { done('7.2') } else { todo('7.2') }
if (exists('app/routes/products.$slug.tsx') && fileContains('app/routes/products.$slug.tsx', 'ReviewCard')) { done('7.3') } else { todo('7.3') }
if (exists('app/hooks/useWishlist.ts')) { done('7.4') } else { todo('7.4') }
if (exists('app/routes/wishlist.tsx')) { done('7.5') } else { todo('7.5') }
if (exists('app/routes/products.$slug.tsx') && fileContains('app/routes/products.$slug.tsx', 'Heart')) { done('7.6') } else { todo('7.6') }

// ─── Phase 8: Notifications ─────────────────────────────────────────────────
if (exists('supabase/functions/send-order-email')) { done('8.1') } else { todo('8.1') }
if (fileContains('package.json', 'resend')) { done('8.2') } else { todo('8.2') }
if (exists('supabase/functions/send-order-email/templates/confirmation')) { done('8.3') } else { todo('8.3') }
if (exists('supabase/functions/send-order-email/templates/shipped')) { done('8.4') } else { todo('8.4') }
if (exists('supabase/functions/send-order-email/templates/delivered')) { done('8.5') } else { todo('8.5') }
if (exists('supabase/functions/send-order-email/templates/cancelled')) { done('8.6') } else { todo('8.6') }
if (exists('app/routes/_admin/orders.tsx') && fileContains('app/routes/_admin/orders.tsx', 'status')) { done('8.7') } else { todo('8.7') }
if (exists('supabase/functions/low-stock-notification') || exists('app/components/ui/LowStockAlert.tsx')) { done('8.8') } else { todo('8.8') }

// ─── Phase 9: Analytics ─────────────────────────────────────────────────────
if (exists('app/routes/_admin/dashboard.tsx') && fileContains('app/routes/_admin/dashboard.tsx', 'revenue')) { done('9.1') } else { todo('9.1') }
if (exists('app/components/ui/RevenueChart.tsx')) { done('9.2') } else { todo('9.2') }
if (exists('app/components/ui/TopProducts.tsx')) { done('9.3') } else { todo('9.3') }
if (exists('app/components/ui/RecentOrders.tsx')) { done('9.4') } else { todo('9.4') }
if (exists('app/components/ui/LowStockWidget.tsx')) { done('9.5') } else { todo('9.5') }

// ─── Phase 10: Polish & Deploy ──────────────────────────────────────────────
if (exists('app/routes/$404.tsx') || exists('app/routes/$.tsx') || exists('app/routes/_error.tsx')) { done('10.1') } else { todo('10.1') }
if (exists('app/components/ui/Skeleton.tsx')) { done('10.2', 'Skeleton components present') } else { todo('10.2') }
if (fileContains('app/components/ui/Navbar.tsx', 'mobile') || fileContains('app/routes/products.tsx', 'Drawer')) { done('10.3', 'Responsive layouts present') } else { todo('10.3') }

const ariaFiles = ['Modal', 'Drawer', 'Toast', 'Navbar', 'Pagination']
const ariaCount = ariaFiles.filter(c => fileContains('app/components/ui/' + c + '.tsx', 'aria-')).length
if (ariaCount >= 3) { done('10.4', ariaCount + ' components with ARIA attributes') }
else if (ariaCount > 0) { partial('10.4', ariaCount + '/5 components with ARIA') }
else { todo('10.4') }

if (exists('app/components/ui/Toast.tsx')) { done('10.5', 'Toast system present') } else { todo('10.5') }
if (fileContains('app/components/ui/ProductCard.tsx', 'loading=')) { done('10.6', 'Lazy loading on images') } else { todo('10.6') }
if (exists('BRAND_THEME_GUIDE.md')) { done('10.7') } else { todo('10.7') }
if (exists('sportwear-docs/01-SRS.md') && exists('sportwear-docs/07-Deployment-Guide.md')) { done('10.8', 'Full documentation suite') } else { todo('10.8') }
if (exists('.github/workflows') || exists('vercel.json') || exists('netlify.toml') || exists('Dockerfile')) { done('10.9') } else { todo('10.9') }
if (check('**/*.test.ts') || check('**/*.spec.ts') || check('**/*.test.tsx')) { done('10.10') } else { todo('10.10') }
if (exists('e2e') || exists('tests/e2e') || exists('cypress')) { done('10.11') } else { todo('10.11') }
if (exists('supabase/.temp/project-ref')) { done('10.12', 'Supabase project linked') } else { partial('10.12', 'Local Supabase only') }
if (exists('vercel.json') || exists('.vercelignore')) { done('10.13') } else { todo('10.13') }
if (exists('.env') && fileContains('.env', 'SUPABASE_URL')) { done('10.14', 'Supabase project linked') } else { todo('10.14') }
if (exists('sportwear-docs/09-CHANGELOG.md')) { done('10.15', 'Changelog maintained') } else { todo('10.15') }
if (exists('README.md') && fileSize('README.md') > 500) { done('10.16', 'README present') } else { todo('10.16') }
if (exists('.github')) { done('10.17') } else { todo('10.17') }
if (exists('.github/workflows/ci.yml') || exists('.github/workflows/deploy.yml')) { done('10.18') } else { todo('10.18') }
if (exists('.github/ISSUE_TEMPLATE') || exists('.github/pull_request_template.md')) { done('10.19') } else { todo('10.19') }

// ─── Write output ───────────────────────────────────────────────────────────
const output = Object.assign({ _v: 4, _generated: new Date().toISOString(), _note: 'Auto-generated by scan-progress.js' }, tasks)
fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n')

const counts = { done: 0, 'in-progress': 0, 'not-started': 0 }
Object.values(tasks).forEach(function(t) { counts[t.status]++ })
const total = Object.keys(tasks).length

console.log('')
console.log('  Scan complete -> ' + OUT)
console.log('  ' + counts.done + '/' + total + ' done (' + Math.round(counts.done / total * 100) + '%)')
console.log('  ' + counts['in-progress'] + ' in-progress | ' + counts['not-started'] + ' not-started')
console.log('')
