const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const outPath = path.join(__dirname, 'status.json')

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel))
}

function hasFiles(dir, ext) {
  const full = path.join(ROOT, dir)
  if (!fs.existsSync(full)) return false
  return fs.readdirSync(full).some(f => f.endsWith(ext))
}

function hasMigration(keyword) {
  const dir = path.join(ROOT, 'supabase', 'migrations')
  if (!fs.existsSync(dir)) return false
  return fs.readdirSync(dir).some(f => f.includes(keyword))
}

function hasRoute(name) {
  const dir = path.join(ROOT, 'app', 'routes')
  if (!fs.existsSync(dir)) return false
  return fs.readdirSync(dir).some(f => f.includes(name))
}

function hasHook(name) {
  const dir = path.join(ROOT, 'app', 'hooks')
  if (!fs.existsSync(dir)) return false
  return fs.readdirSync(dir).some(f => f.includes(name))
}

function hasEdgeFn(name) {
  const dir = path.join(ROOT, 'supabase', 'functions')
  if (!fs.existsSync(dir)) return false
  return fs.readdirSync(dir).some(f => f.includes(name))
}

function hasEmailTemplate(name) {
  const dir = path.join(ROOT, 'supabase', 'functions')
  if (!fs.existsSync(dir)) return false
  // Check inside edge function dirs for template files
  const fnDirs = fs.readdirSync(dir)
  for (const d of fnDirs) {
    const fnPath = path.join(dir, d)
    if (fs.statSync(fnPath).isDirectory()) {
      const files = fs.readdirSync(fnPath)
      if (files.some(f => f.includes(name))) return true
    }
  }
  return false
}

const tasks = {
  // Phase 0: Project Foundation
  '0.1': exists('app/main.tsx'),
  '0.2': exists('tsconfig.json'),
  '0.3': exists('app/styles/globals.css'),
  '0.4': exists('eslint.config.js') || exists('.eslintrc.js') || exists('.eslintrc.json'),
  '0.5': exists('app/components/ui') && hasFiles('app/components/ui', '.tsx'),
  '0.6': exists('supabase/config.toml'),
  '0.7': exists('.env.example'),
  '0.8': exists('.husky/pre-commit'),
  '0.9': (() => { try { const { execSync } = require('child_process'); const remote = execSync('git remote -v', { cwd: ROOT, encoding: 'utf8' }); return remote.includes('github.com') } catch { return false } })(),
  '0.10': exists('app/lib/supabase.ts'),

  // Phase 1: Database & Schema — Migrations
  '1.1': hasMigration('profiles'),
  '1.2': hasMigration('addresses'),
  '1.3': hasMigration('categories'),
  '1.4': hasMigration('products'),
  '1.5': hasMigration('product_variants') || hasMigration('variants'),
  '1.6': hasMigration('product_images') || hasMigration('images'),
  '1.7': hasMigration('cart_items') || hasMigration('cart'),
  '1.8': hasMigration('coupons'),
  '1.9': hasMigration('orders') && hasMigration('order_items'),
  '1.10': hasMigration('order_status_history'),
  '1.11': hasMigration('reviews'),
  '1.12': hasMigration('wishlist'),
  '1.13': hasMigration('indexes') || hasMigration('idx'),
  '1.14': hasMigration('rls') || hasMigration('enable_rls'),
  '1.15': hasMigration('rls_profiles') || hasMigration('profiles_rls'),
  '1.16': hasMigration('rls_addresses') || hasMigration('addresses_rls'),
  '1.17': hasMigration('rls_cart') || hasMigration('cart_rls'),
  '1.18': hasMigration('rls_orders') || hasMigration('orders_rls'),
  '1.19': hasMigration('rls_order_items') || hasMigration('order_items_rls'),
  '1.20': hasMigration('rls_reviews') || hasMigration('reviews_rls'),
  '1.22': hasMigration('rls_products') || hasMigration('products_rls'),
  '1.23': hasMigration('rls_coupons') || hasMigration('coupons_rls'),
  '1.24': hasMigration('trigger') || hasMigration('avg_rating'),
  '1.25': exists('app/lib/types.ts') || exists('app/types.ts') || exists('supabase/types.ts'),
  '1.26': hasMigration('seed') || exists('supabase/seed.sql'),

  // Phase 1: Missing items that need explicit check
  '1.21': hasMigration('rls_wishlist') || hasMigration('wishlist_rls'),

  // Phase 2: Auth & User Management
  '2.1': exists('app/lib/supabase.ts') && exists('.env.example'),
  '2.2': hasRoute('sign-up') || hasRoute('signup') || hasRoute('register'),
  '2.3': hasRoute('sign-in') || hasRoute('signin') || hasRoute('login'),
  '2.4': hasRoute('verify') || hasRoute('email'),
  '2.5': hasRoute('reset') || hasRoute('forgot'),
  '2.6': hasHook('auth') || exists('app/hooks/useAuth.ts'),
  '2.7': hasRoute('_auth') || hasRoute('auth'),
  '2.8': hasRoute('_admin') || hasRoute('admin'),
  '2.9': hasRoute('profile') || hasRoute('account'),
  '2.10': hasRoute('addresses') || hasHook('addresses'),
  '2.11': hasHook('logout') || hasHook('auth'),

  // Phase 3: Product Catalog
  '3.1': hasHook('products') || hasHook('useProducts'),
  '3.2': hasRoute('products') || hasRoute('shop'),
  '3.3': exists('app/components/ui/ProductCard.tsx'),
  '3.4': hasRoute('categories') || hasHook('categories'),
  '3.5': hasHook('filter') || hasRoute('products'),
  '3.6': hasHook('sort') || hasRoute('products'),
  '3.7': hasHook('search') || hasHook('useDebounce'),
  '3.8': hasRoute('products.$') || hasRoute('product-detail') || hasRoute('products._id'),
  '3.9': exists('app/components/ui/VariantSelector.tsx') || hasHook('variants'),
  '3.10': hasRoute('reviews') || hasHook('reviews'),
  '3.11': exists('app/components/ui/SizeGuide.tsx') || hasRoute('size-guide'),
  '3.12': exists('public/robots.txt') || exists('public/sitemap.xml'),

  // Phase 4: Cart & Checkout
  '4.1': hasHook('cart') || hasHook('useCart'),
  '4.2': hasRoute('cart'),
  '4.3': hasHook('cart') || hasRoute('cart'),
  '4.4': exists('app/components/ui/CartItem.tsx') || exists('app/components/CartItem.tsx'),
  '4.5': hasHook('cart') || hasRoute('cart'),
  '4.6': hasRoute('cart') || hasHook('coupon'),
  '4.7': hasRoute('checkout'),
  '4.8': hasRoute('checkout'),
  '4.9': hasEdgeFn('create-checkout-session') || hasEdgeFn('checkout'),
  '4.10': hasRoute('checkout') || hasRoute('payment'),
  '4.11': hasEdgeFn('stripe-webhook') || hasEdgeFn('webhook'),
  '4.12': hasEdgeFn('stripe-webhook') || hasEdgeFn('webhook'),
  '4.13': hasEdgeFn('stripe-webhook') || hasEdgeFn('webhook'),
  '4.14': hasRoute('order-confirmation') || hasRoute('confirmation') || hasRoute('orders.$'),
  '4.15': hasHook('cart') || hasRoute('checkout'),

  // Phase 5: Order Management
  '5.1': hasHook('orders') || hasHook('useOrders'),
  '5.2': hasRoute('orders'),
  '5.3': hasRoute('orders.$') || hasRoute('order-detail'),
  '5.4': hasHook('admin-orders') || hasHook('useAdminOrders'),
  '5.5': hasRoute('admin/orders') || hasRoute('admin-orders'),
  '5.6': hasEdgeFn('admin-update-status') || hasEdgeFn('update-order-status'),
  '5.7': hasRoute('admin/orders') || hasRoute('admin-order-detail'),
  '5.8': hasRoute('orders.$') || hasHook('orders'),
  '5.9': hasRoute('orders.$') || hasHook('orders'),

  // Phase 6: Admin Products
  '6.1': hasHook('admin-products') || hasHook('useAdminProducts'),
  '6.2': hasRoute('admin/products') || hasRoute('admin-products'),
  '6.3': hasRoute('admin/products') || hasRoute('product-form'),
  '6.4': hasEdgeFn('upload') || hasHook('upload'),
  '6.5': hasRoute('admin/products') || hasHook('variants'),
  '6.6': hasHook('stock') || hasRoute('admin/products'),
  '6.7': hasHook('stock') || hasEdgeFn('low-stock'),
  '6.8': hasRoute('admin/categories') || hasHook('categories'),
  '6.9': hasRoute('admin/coupons') || hasHook('coupons'),

  // Phase 7: Reviews & Wishlist
  '7.1': hasHook('reviews') || hasHook('useReviews'),
  '7.2': exists('app/components/ui/ReviewForm.tsx') || hasRoute('review'),
  '7.3': hasHook('reviews') || hasRoute('reviews'),
  '7.4': hasHook('wishlist') || hasHook('useWishlist'),
  '7.5': hasRoute('wishlist'),
  '7.6': exists('app/components/ui/WishlistButton.tsx') || hasHook('wishlist'),

  // Phase 8: Notifications
  '8.1': hasEdgeFn('send-order-email') || hasEdgeFn('send-email'),
  '8.2': exists('.env') && fs.readFileSync(path.join(ROOT, '.env'), 'utf8').includes('RESEND'),
  '8.3': hasEmailTemplate('confirmation') || hasEdgeFn('send-order-email'),
  '8.4': hasEmailTemplate('shipped') || hasEdgeFn('send-order-email'),
  '8.5': hasEmailTemplate('delivered') || hasEdgeFn('send-order-email'),
  '8.6': hasEmailTemplate('cancelled') || hasEdgeFn('send-order-email'),
  '8.7': hasEdgeFn('send-order-email') || hasEdgeFn('stripe-webhook'),
  '8.8': hasEdgeFn('low-stock') || hasEdgeFn('send-email'),

  // Phase 9: Analytics
  '9.1': hasRoute('admin') || hasRoute('dashboard'),
  '9.2': hasRoute('admin') || hasRoute('analytics'),
  '9.3': hasRoute('admin') || hasRoute('analytics'),
  '9.4': hasRoute('admin') || hasRoute('analytics'),
  '9.5': hasRoute('admin') || hasRoute('analytics'),

  // Phase 10: Polish & Deploy
  '10.1': exists('vitest.config.ts') || exists('vitest.config.js') || hasFiles('app', '.test.ts') || hasFiles('app', '.spec.ts'),
  '10.2': hasFiles('app', '.test.tsx') || hasFiles('app', '.spec.tsx'),
  '10.3': hasFiles('app', '.test.ts') || hasFiles('tests', '.test.ts'),
  '10.4': exists('tests/e2e') || exists('e2e') || exists('playwright.config.ts'),
  '10.5': exists('tests/e2e') || exists('e2e') || exists('playwright.config.ts'),
  '10.6': false, // manual verification
  '10.7': false, // manual audit
  '10.8': exists('lighthouserc.json') || exists('.lighthouserc.js'),
  '10.9': false, // manual testing
  '10.10': false, // manual testing
  '10.11': exists('supabase/config.toml'),
  '10.12': hasEdgeFn('create-checkout-session') || hasEdgeFn('stripe-webhook'),
  '10.13': exists('vercel.json') || exists('netlify.toml'),
  '10.14': hasEdgeFn('stripe-webhook') || hasEdgeFn('webhook'),
  '10.15': false, // manual smoke test
  '10.16': false, // manual — production Supabase
  '10.17': false, // manual deployment
  '10.18': false, // manual smoke test
  '10.19': exists('README.md') && exists('CHANGELOG.md'),
}

const status = { _v: 2, _generated: new Date().toISOString() }
for (const [id, done] of Object.entries(tasks)) {
  status[id] = { status: done ? 'done' : 'not-started', notes: '' }
}

fs.writeFileSync(outPath, JSON.stringify(status, null, 2))
console.log(`Generated ${outPath}`)
console.log(`Done: ${Object.values(tasks).filter(Boolean).length}/${Object.keys(tasks).length}`)
