import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProductCard } from '@/components/ui/ProductCard'
import { CategoryTile } from '@/components/ui/CategoryTile'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StarRating } from '@/components/ui/StarRating'
import { SwatchGroup } from '@/components/ui/SwatchGroup'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Drawer } from '@/components/ui/Drawer'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { ToastContainer, useToast } from '@/components/ui/Toast'
import { BrandLogoStrip } from '@/components/ui/BrandLogoStrip'
import { PromoBanner } from '@/components/ui/PromoBanner'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

/* ── Sample data ──────────────────────────────────────────────── */
const SAMPLE_SWATCHES = [
  { id: '1', color: '#0D0D0D', label: 'Black' },
  { id: '2', color: '#C6FF3D', label: 'Lime' },
  { id: '3', color: '#FFFFFF', label: 'White' },
  { id: '4', color: '#FF4545', label: 'Red' },
  { id: '5', color: '#4FACFE', label: 'Blue' },
  { id: '6', color: '#F5A623', label: 'Gold' },
]

const SAMPLE_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Flat Waxed Shoelaces',
    price: 12.99,
    originalPrice: 18.99,
    rating: 4.8,
    reviewCount: 342,
    image: 'https://placehold.co/400x400/F7F7F7/9A9A9A?text=Shoelace',
    swatches: SAMPLE_SWATCHES.slice(0, 5),
    isSale: true,
    isNew: false,
  },
  {
    id: '2',
    name: 'Round Athletic Sneaker Laces — 45"',
    price: 9.99,
    rating: 4.6,
    reviewCount: 128,
    image: 'https://placehold.co/400x400/F7F7F7/9A9A9A?text=Laces',
    swatches: SAMPLE_SWATCHES.slice(0, 3),
    isNew: true,
  },
  {
    id: '3',
    name: 'No-Tie Elastic Curly Shoelaces',
    price: 14.99,
    originalPrice: 19.99,
    rating: 4.4,
    reviewCount: 87,
    image: 'https://placehold.co/400x400/F7F7F7/9A9A9A?text=NoTie',
    swatches: SAMPLE_SWATCHES.slice(1, 6),
    isSale: true,
  },
  {
    id: '4',
    name: 'Fat Chunky Oval Boot Laces',
    price: 16.99,
    rating: 4.9,
    reviewCount: 211,
    image: 'https://placehold.co/400x400/F7F7F7/9A9A9A?text=BootLace',
    swatches: SAMPLE_SWATCHES.slice(0, 4),
    isNew: true,
  },
]

const CATEGORY_TILES = [
  {
    label: 'Laces by Brand',
    image: 'https://placehold.co/480x600/111111/C6FF3D?text=BY+BRAND',
    href: '/brands',
  },
  {
    label: 'Laces by Sport',
    image: 'https://placehold.co/480x600/1a1a2e/C6FF3D?text=BY+SPORT',
    href: '/sport',
  },
  {
    label: 'Accessories',
    image: 'https://placehold.co/480x600/0d0d0d/FFFFFF?text=ACCESSORIES',
    href: '/accessories',
  },
]

const BRAND_LOGOS = [
  {
    id: 'nike',
    name: 'Nike',
    src: 'https://placehold.co/120x40/F7F7F7/9A9A9A?text=NIKE',
    alt: 'Nike',
  },
  {
    id: 'adidas',
    name: 'Adidas',
    src: 'https://placehold.co/120x40/F7F7F7/9A9A9A?text=ADIDAS',
    alt: 'Adidas',
  },
  {
    id: 'nb',
    name: 'New Balance',
    src: 'https://placehold.co/120x40/F7F7F7/9A9A9A?text=NEW+BALANCE',
    alt: 'New Balance',
  },
  {
    id: 'puma',
    name: 'Puma',
    src: 'https://placehold.co/120x40/F7F7F7/9A9A9A?text=PUMA',
    alt: 'Puma',
  },
  {
    id: 'vans',
    name: 'Vans',
    src: 'https://placehold.co/120x40/F7F7F7/9A9A9A?text=VANS',
    alt: 'Vans',
  },
  {
    id: 'converse',
    name: 'Converse',
    src: 'https://placehold.co/120x40/F7F7F7/9A9A9A?text=CONVERSE',
    alt: 'Converse',
  },
]

/* ── Page component ───────────────────────────────────────────── */
function HomePage(): React.JSX.Element {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedSwatch, setSelectedSwatch] = useState<string>('1')
  const { toasts, toast, dismiss } = useToast()

  return (
    <>
      {/* ── HERO SECTION ────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a1a 50%, #111 100%)',
        }}
      >
        {/* Lime glow background accent */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 w-[55%] h-full opacity-10"
          style={{
            background: 'radial-gradient(ellipse at 80% 40%, #C6FF3D 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-[1440px] mx-auto px-6 py-20 w-full">
          <div className="max-w-[560px]">
            <p className="text-[#C6FF3D] text-[11px] font-[600] uppercase tracking-[4px] mb-4">
              Premium Shoelaces & Accessories
            </p>
            <h1
              className="font-[Anton,sans-serif] text-white uppercase leading-[0.92] tracking-tight mb-6"
              style={{ fontSize: 'clamp(56px, 8vw, 88px)' }}
            >
              Level Up Your <span className="text-[#C6FF3D]">Kicks</span>
            </h1>
            <p className="text-[#9A9A9A] text-[15px] font-[400] uppercase tracking-[1px] leading-relaxed mb-8 max-w-[420px]">
              Premium replacement laces engineered for performance, styled for the streets.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" icon={<ArrowUpRight size={20} />}>
                Shop Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="text-white border-white/40 hover:bg-white hover:text-[#0D0D0D]"
              >
                View Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND LOGO STRIP ────────────────────────────────── */}
      <BrandLogoStrip label="Replacement Shoelaces for Popular Brands" logos={BRAND_LOGOS} />

      {/* ── CATEGORY TILES ──────────────────────────────────── */}
      <section id="categories" className="max-w-[1440px] mx-auto px-6 py-24">
        <SectionHeader title="Shop by Category" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[22px]">
          {CATEGORY_TILES.map((tile) => (
            <CategoryTile
              key={tile.label}
              label={tile.label}
              image={tile.image}
              href={tile.href}
              aspectRatio="4/5"
            />
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ────────────────────────────────────── */}
      <section id="best-sellers" className="max-w-[1440px] mx-auto px-6 pb-24">
        <SectionHeader title="Best Sellers" actionLabel="View All" actionHref="/laces" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[22px]">
          {SAMPLE_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* ── PROMO BANNER ────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 pb-24">
        <PromoBanner
          kicker="Limited Time Offer"
          headline="Custom Sneaker"
          highlightedWord="Laces"
          ctaLabel="Customise Now"
          ctaHref="/custom"
          backgroundImage="https://placehold.co/1440x480/111111/333333?text=Custom+Sneaker+Laces+Banner"
        />
      </section>

      {/* ── NEW ARRIVALS ────────────────────────────────────── */}
      <section id="new-arrivals" className="max-w-[1440px] mx-auto px-6 pb-24">
        <SectionHeader title="New Arrivals" actionLabel="See All New" actionHref="/new" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[22px]">
          {[...SAMPLE_PRODUCTS].reverse().map((product) => (
            <ProductCard
              key={`new-${product.id}`}
              {...product}
              id={`new-${product.id}`}
              isNew
              isSale={false}
            />
          ))}
        </div>
      </section>

      {/* ── DESIGN SYSTEM SHOWCASE (dev reference) ──────────── */}
      <section
        id="design-system-showcase"
        className="max-w-[1440px] mx-auto px-6 pb-24"
        aria-label="Design System Component Showcase"
      >
        <div className="border border-[#EFEFEF] rounded-[12px] p-8 bg-[#F7F7F7]">
          <h2 className="font-[Anton,sans-serif] text-[32px] uppercase mb-8 text-[#0D0D0D]">
            Design System Showcase
          </h2>

          {/* Colors */}
          <div className="mb-10">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Brand Colors
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                ['#0D0D0D', 'Black'],
                ['#C6FF3D', 'Lime'],
                ['#A6E62D', 'Lime Dark'],
                ['#F7F7F7', 'Gray-50'],
                ['#EFEFEF', 'Gray-100'],
                ['#9A9A9A', 'Gray-400'],
                ['#4A4A4A', 'Gray-700'],
                ['#F5A623', 'Star Gold'],
              ].map(([hex, name]) => (
                <div key={hex} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-12 h-12 rounded-[8px] border border-[#EFEFEF] shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="text-[10px] text-[#4A4A4A] font-[500]">{name}</span>
                  <span className="text-[9px] text-[#9A9A9A] font-mono">{hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="mb-10">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Typography
            </h3>
            <div className="bg-white rounded-[8px] p-6 border border-[#EFEFEF] space-y-3">
              <p className="font-[Anton,sans-serif] text-[64px] uppercase leading-none text-[#0D0D0D]">
                HERO H1 — Anton
              </p>
              <p className="font-[Anton,sans-serif] text-[40px] uppercase leading-none text-[#0D0D0D]">
                SECTION H2 — Anton
              </p>
              <p className="font-[Anton,sans-serif] text-[22px] uppercase text-[#0D0D0D]">
                CATEGORY TILE — Anton
              </p>
              <p className="text-[16px] font-[400] text-[#4A4A4A]">
                Body copy (Inter) — Regular weight, used for descriptions and paragraphs
              </p>
              <p className="text-[14px] font-[600] text-[#0D0D0D]">
                Product title (Inter Semibold) — StrideWear Premium Flat Laces
              </p>
              <p className="text-[14px] font-[700] text-[#111]">Price (Inter Bold) — $12.99</p>
              <p className="text-[11px] font-[500] uppercase tracking-[0.5px] text-[#9A9A9A]">
                Micro / Meta text — Uppercase, 11px, letter-spacing
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-10">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Buttons
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary CTA ↗</Button>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="primary" loading>
                Loading
              </Button>
              <Button variant="icon-circle">
                <ArrowUpRight size={18} />
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-10">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Badges
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="lime">Sale</Badge>
              <Badge variant="black">New</Badge>
              <Badge variant="outline">Limited</Badge>
              <Badge variant="gold">Best Seller</Badge>
            </div>
          </div>

          {/* Star Ratings */}
          <div className="mb-10">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Star Ratings
            </h3>
            <div className="flex flex-col gap-2">
              <StarRating rating={5} count={342} size="lg" />
              <StarRating rating={4.5} count={128} size="md" />
              <StarRating rating={3.5} count={56} size="sm" />
            </div>
          </div>

          {/* Swatch Group */}
          <div className="mb-10">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Swatch Group
            </h3>
            <SwatchGroup
              swatches={SAMPLE_SWATCHES}
              maxVisible={4}
              selected={selectedSwatch}
              onSelect={setSelectedSwatch}
            />
          </div>

          {/* Inputs */}
          <div className="mb-10">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Inputs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input id="input-default" label="Default Input" placeholder="Enter value..." />
              <Input
                id="input-search"
                label="Search Input"
                placeholder="Search products..."
                icon={<Search size={15} />}
              />
              <Input
                id="input-error"
                label="Error State"
                placeholder="Invalid value"
                defaultValue="bad@"
                error="Please enter a valid email address"
              />
            </div>
          </div>

          {/* Select */}
          <div className="mb-10">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Select
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              <Select
                id="select-currency"
                label="Currency"
                options={[
                  { value: 'USD', label: 'USD — US Dollar' },
                  { value: 'EUR', label: 'EUR — Euro' },
                  { value: 'GBP', label: 'GBP — British Pound' },
                ]}
                placeholder="Select currency"
              />
              <Select
                id="select-size"
                label="Lace Length"
                options={[
                  { value: '27', label: '27" (Kids)' },
                  { value: '36', label: '36" (Low Top)' },
                  { value: '45', label: '45" (Standard)' },
                  { value: '54', label: '54" (High Top)' },
                  { value: '72', label: '72" (Boots)' },
                ]}
                placeholder="Select length"
              />
            </div>
          </div>

          {/* Skeleton */}
          <div className="mb-10">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Skeleton Loaders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[22px]">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Modal + Drawer + Toast triggers */}
          <div className="mb-2">
            <h3 className="text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-4">
              Overlays & Notifications
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Open Modal
              </Button>
              <Button
                variant="secondary"
                onClick={() => setDrawerOpen(true)}
                icon={<ShoppingBag size={16} />}
              >
                Open Cart Drawer
              </Button>
              <Button variant="primary" onClick={() => toast('Item added to cart!', 'success')}>
                Toast — Success
              </Button>
              <Button variant="secondary" onClick={() => toast('Something went wrong.', 'error')}>
                Toast — Error
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast('New collection available.', 'info')}
              >
                Toast — Info
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL ──────────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Size Chart">
        <div className="space-y-4">
          <p className="text-[14px] text-[#4A4A4A]">
            Use the chart below to find the right lace length for your shoe type.
          </p>
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#F7F7F7]">
                <th className="text-left p-3 font-[600] border border-[#EFEFEF]">Shoe Type</th>
                <th className="text-left p-3 font-[600] border border-[#EFEFEF]">Eyelets</th>
                <th className="text-left p-3 font-[600] border border-[#EFEFEF]">Length</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Low Top Sneaker', '4–5', '36"'],
                ['Standard Sneaker', '6–7', '45"'],
                ['High Top Sneaker', '7–8', '54"'],
                ['Boot', '8–12', '63"–72"'],
              ].map(([type, eyelets, length]) => (
                <tr key={type} className="hover:bg-[#F7F7F7] transition-colors">
                  <td className="p-3 border border-[#EFEFEF]">{type}</td>
                  <td className="p-3 border border-[#EFEFEF]">{eyelets}</td>
                  <td className="p-3 border border-[#EFEFEF] font-[600] text-[#0D0D0D]">
                    {length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* ── CART DRAWER ─────────────────────────────────────── */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Your Cart"
        footer={
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-[500] text-[#4A4A4A]">Subtotal</span>
              <span className="font-[700] text-[#0D0D0D]">$38.97</span>
            </div>
            <Button variant="primary" size="md" className="w-full">
              Checkout ↗
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setDrawerOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {SAMPLE_PRODUCTS.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="flex gap-3 py-3 border-b border-[#EFEFEF] last:border-0"
            >
              <div className="w-16 h-16 bg-[#F7F7F7] rounded-[8px] flex-shrink-0 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-[600] text-[#0D0D0D] line-clamp-2 leading-snug">
                  {product.name}
                </p>
                <p className="text-[12px] text-[#9A9A9A] mt-0.5">Qty: 1</p>
                <p className="text-[13px] font-[700] text-[#111] mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      {/* ── TOAST CONTAINER ─────────────────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  )
}
