import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/ui/ProductCard'
import { CategoryTile } from '@/components/ui/CategoryTile'
import { PromoBanner } from '@/components/ui/PromoBanner'

export const Route = createFileRoute('/')({
  component: HomePage,
})

/* ── Sample data ────────────────────────────────────────────── */
const SAMPLE_SWATCHES = [
  { id: '1', color: '#0D0D0D', label: 'Black' },
  { id: '2', color: '#C6FF3D', label: 'Lime' },
  { id: '3', color: '#FFFFFF', label: 'White' },
  { id: '4', color: '#FF4545', label: 'Red' },
  { id: '5', color: '#4FACFE', label: 'Blue' },
  { id: '6', color: '#F5A623', label: 'Gold' },
]

const BEST_SELLERS = [
  {
    id: '1',
    name: 'Premium Flat Waxed Shoelaces',
    price: 12.99,
    originalPrice: 18.99,
    rating: 4.8,
    reviewCount: 342,
    image: '/prod_flat.jpg',
    swatches: SAMPLE_SWATCHES.slice(0, 5),
    isSale: true,
  },
  {
    id: '2',
    name: 'Round Athletic Sneaker Laces — 45"',
    price: 9.99,
    rating: 4.6,
    reviewCount: 128,
    image: '/prod_round.jpg',
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
    image: '/prod_notie.jpg',
    swatches: SAMPLE_SWATCHES.slice(1, 6),
    isSale: true,
  },
  {
    id: '4',
    name: 'Fat Chunky Oval Boot Laces',
    price: 16.99,
    rating: 4.9,
    reviewCount: 211,
    image: '/prod_boot.jpg',
    swatches: SAMPLE_SWATCHES.slice(0, 4),
    isNew: true,
  },
]

const NEW_ARRIVALS = [
  {
    id: '5',
    name: 'Reflective 3M Safety Laces',
    price: 11.99,
    rating: 4.7,
    reviewCount: 45,
    image: '/prod_reflective.jpg',
    swatches: SAMPLE_SWATCHES.slice(0, 3),
    isNew: true,
  },
  {
    id: '6',
    name: 'Heavy Duty Work Boot Laces',
    price: 13.99,
    originalPrice: 17.99,
    rating: 4.5,
    reviewCount: 92,
    image: '/prod_workboot.jpg',
    swatches: SAMPLE_SWATCHES.slice(2, 5),
    isSale: true,
  },
  {
    id: '7',
    name: 'Silk Luxury Dress Shoe Laces',
    price: 15.99,
    rating: 4.9,
    reviewCount: 167,
    image: '/prod_silk.jpg',
    swatches: SAMPLE_SWATCHES.slice(1, 4),
    isNew: true,
  },
  {
    id: '8',
    name: 'Colorful Oval Cotton Laces',
    price: 8.99,
    rating: 4.3,
    reviewCount: 54,
    image: '/prod_cotton.jpg',
    swatches: SAMPLE_SWATCHES.slice(3, 6),
    isNew: true,
  },
]

const BRAND_NAMES = ['Nike', 'Adidas', 'New Balance', 'Jordan', 'Hoka', 'Vans', 'Converse', 'Puma']

/* ─── Page ────────────────────────────────────────────────────── */
function HomePage(): React.JSX.Element {
  return (
    <>
      <title>StrideWear — Premium Replacement Shoelaces & Sneaker Accessories</title>
      <meta
        name="description"
        content="Shop premium replacement shoelaces for Nike, Adidas, Jordan, New Balance and more. Flat laces, round laces, waxed, no-tie and custom shoelaces in 100+ colors."
      />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-[600px] md:min-h-[720px] flex items-center overflow-hidden"
      >
        {/* Real photo background */}
        <img
          src="/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient scrim — left side */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.10) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 py-24 w-full">
          <div className="max-w-[640px]">
            <h1
              className="font-[Anton,sans-serif] text-white uppercase leading-[0.92] tracking-tight mb-8"
              style={{ fontSize: 'clamp(64px, 10vw, 120px)' }}
            >
              Level Up Your <span className="text-[#C6FF3D]">Kicks</span>
            </h1>
            <p className="text-white text-[14px] md:text-[16px] font-semibold uppercase tracking-[3px] mt-12 mb-6">
              Replacement Laces for Sneakers
            </p>
            <a href="/products?category=laces-by-brand">
              <Button
                variant="primary"
                size="lg"
                className="text-[16px] px-10 py-5 font-bold rounded-[4px]"
              >
                Shop Shoelaces
                <ArrowUpRight size={18} className="ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── BRAND STRIP ─────────────────────────────────────────── */}
      <section className="py-16 border-y border-[#EFEFEF] bg-white overflow-hidden mt-4">
        <p className="text-center text-[12px] font-bold uppercase tracking-[3px] text-[#9A9A9A] mb-8">
          Compatible with Popular Sneaker Brands
        </p>
        <div className="flex items-center justify-center flex-wrap gap-x-12 gap-y-6 px-6">
          {BRAND_NAMES.map((brand) => (
            <a
              key={brand}
              href={`/products?brand=${brand.toLowerCase()}`}
              className="font-[Anton,sans-serif] text-[24px] md:text-[32px] uppercase tracking-wide text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors duration-200"
            >
              {brand}
            </a>
          ))}
        </div>
      </section>

      {/* ── CATEGORY TILES ──────────────────────────────────────── */}
      <section id="categories" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-20 mt-8">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[48px] md:text-[64px] uppercase tracking-tight leading-none">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CategoryTile
            label="Laces by Brand"
            image="/cat_brand.jpg"
            href="/products?category=laces-by-brand"
            aspectRatio="4/5"
          />
          <CategoryTile
            label="Laces by Sport"
            image="/cat_sport.jpg"
            href="/products?category=laces-by-sport"
            aspectRatio="4/5"
            imageStyle={{ objectPosition: 'center' }}
          />
          <CategoryTile
            label="Accessories"
            image="/cat_accessories.jpg"
            href="/products?category=accessories"
            aspectRatio="4/5"
            imageStyle={{ objectPosition: 'center' }}
          />
        </div>
      </section>

      {/* ── BEST SELLERS ────────────────────────────────────────── */}
      <section id="best-sellers" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-20 mt-8">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[48px] md:text-[64px] uppercase tracking-tight leading-none">
            Best Sellers
          </h2>
          <a
            href="/products"
            className="flex items-center gap-2 text-[15px] font-bold text-[#0D0D0D] hover:text-[#C6FF3D] transition-colors group"
          >
            Shop Best Sellers
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} {...product} href={`/products/${product.id}`} />
          ))}
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────────────── */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-20">
        <PromoBanner
          kicker="Limited Time Offer"
          headline="Custom Sneaker"
          highlightedWord="Laces"
          ctaLabel="Customise Now"
          ctaHref="/custom"
          backgroundImage="https://placehold.co/1440x480/111111/333333?text=Custom+Sneaker+Laces"
        />
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────────────── */}
      <section id="new-arrivals" className="w-full max-w-[1440px] mx-auto px-6 md:px-10 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[48px] md:text-[64px] uppercase tracking-tight leading-none">
            New Arrivals
          </h2>
          <a
            href="/products?sort=newest"
            className="flex items-center gap-2 text-[15px] font-bold text-[#0D0D0D] hover:text-[#C6FF3D] transition-colors group"
          >
            See All New
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {NEW_ARRIVALS.map((product) => (
            <ProductCard
              key={`new-${product.id}`}
              {...product}
              id={`new-${product.id}`}
              href={`/products/${product.id}`}
            />
          ))}
        </div>
      </section>
      {/* ── WHY CHOOSE US (TRUST STRIP) ────────────────────────── */}
      <section className="bg-white py-20 w-full mt-8 border-t border-[#EFEFEF]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <h2 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[48px] md:text-[64px] uppercase tracking-tight leading-none text-center mb-16">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="flex flex-col items-center text-center gap-4">
              <span className="text-[#C6FF3D] mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                  <circle cx="17" cy="18" r="2" />
                  <circle cx="7" cy="18" r="2" />
                </svg>
              </span>
              <p className="text-[#0D0D0D] font-bold text-[18px] uppercase tracking-wide">
                Free Shipping
              </p>
              <p className="text-[#9A9A9A] text-[15px]">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <span className="text-[#C6FF3D] mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </span>
              <p className="text-[#0D0D0D] font-bold text-[18px] uppercase tracking-wide">
                30-Day Returns
              </p>
              <p className="text-[#9A9A9A] text-[15px]">Hassle-free returns</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <span className="text-[#C6FF3D] mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <p className="text-[#0D0D0D] font-bold text-[18px] uppercase tracking-wide">
                50,000+ Reviews
              </p>
              <p className="text-[#9A9A9A] text-[15px]">Verified customers</p>
            </div>
            <div className="flex flex-col items-center text-center gap-4">
              <span className="text-[#C6FF3D] mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 6 2a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <p className="text-[#0D0D0D] font-bold text-[18px] uppercase tracking-wide">
                Secure Checkout
              </p>
              <p className="text-[#9A9A9A] text-[15px]">SSL encrypted</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
