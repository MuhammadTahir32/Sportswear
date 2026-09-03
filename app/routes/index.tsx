import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
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

/* ── Brand Marquee ──────────────────────────────────────────── */
function BrandMarquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const pausedRef = useRef(false)
  const setWRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    if (!track || !stage) return

    const SPEED = 0.6

    function measure() {
      if (!track) return
      const items = track.querySelectorAll<HTMLElement>('.bi')
      let w = 0
      for (let i = 0; i < BRAND_NAMES.length; i++) {
        w += items[i]?.getBoundingClientRect().width ?? 0
      }
      setWRef.current = w
      xRef.current = 0
      track.style.transform = 'translateX(0px)'
    }

    function tick() {
      if (!pausedRef.current && setWRef.current > 0) {
        xRef.current -= SPEED
        if (xRef.current <= -setWRef.current) xRef.current += setWRef.current
        if (track) track.style.transform = `translateX(${xRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const pause = () => {
      pausedRef.current = true
    }
    const resume = () => {
      pausedRef.current = false
    }

    stage.addEventListener('mouseenter', pause)
    stage.addEventListener('mouseleave', resume)
    stage.addEventListener('touchstart', pause, { passive: true })
    stage.addEventListener('touchend', resume, { passive: true })
    window.addEventListener('resize', measure)

    const timer = setTimeout(() => {
      measure()
      rafRef.current = requestAnimationFrame(tick)
    }, 80)

    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      stage.removeEventListener('mouseenter', pause)
      stage.removeEventListener('mouseleave', resume)
      stage.removeEventListener('touchstart', pause)
      stage.removeEventListener('touchend', resume)
      window.removeEventListener('resize', measure)
    }
  }, [])

  function renderBrandSet(keyPrefix: string) {
    return BRAND_NAMES.map((brand, index) => (
      <a
        key={`${keyPrefix}-${brand}`}
        href={`/products?brand=${encodeURIComponent(brand.toLowerCase())}`}
        className="bi"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          textDecoration: 'none',
          padding: '0 36px',
          height: '72px',
        }}
      >
        <span
          style={{
            fontFamily: '"Anton", sans-serif',
            fontSize: '28px',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: '#9A9A9A',
            transition: 'color 0.18s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = '#0D0D0D'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.color = '#9A9A9A'
          }}
        >
          {brand}
        </span>
        {index !== BRAND_NAMES.length - 1 && (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: '#D9D9D9',
              flexShrink: 0,
              marginLeft: '36px',
            }}
          />
        )}
      </a>
    ))
  }

  return (
    <section
      style={{
        padding: '40px 0',
        borderTop: '1px solid #EFEFEF',
        borderBottom: '1px solid #EFEFEF',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <p
        style={{
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#9A9A9A',
          margin: '0 0 28px',
        }}
      >
        Compatible with Popular Sneaker Brands
      </p>

      {/* stage */}
      <div
        ref={stageRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid #E5E5E5',
          borderBottom: '1px solid #E5E5E5',
        }}
      >
        {/* left fade */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 120,
            background: 'linear-gradient(to right, #ffffff 0%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        {/* right fade */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: 120,
            background: 'linear-gradient(to left, #ffffff 0%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* viewport */}
        <div style={{ display: 'flex', alignItems: 'center', height: 72, userSelect: 'none' }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              willChange: 'transform',
            }}
          >
            {renderBrandSet('a')}
            {renderBrandSet('b')}
            {renderBrandSet('c')}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
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
        <img
          src="/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.10) 100%)',
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-16 py-24 w-full">
          <div className="max-w-[600px]">
            <h1
              className="font-[Anton,sans-serif] text-white uppercase leading-[0.92] tracking-tight"
              style={{
                fontSize: 'clamp(64px, 10vw, 120px)',
                marginLeft: '65px',
                marginBottom: '10px',
              }}
            >
              Level Up Your <span className="text-[#C6FF3D]">Kicks</span>
            </h1>
            <p className="text-white text-[13px] font-semibold uppercase tracking-[3px] mt-10 mb-8">
              <span style={{ marginLeft: '65px' }}>Replacement Laces for Sneakers</span>
            </p>
            <a href="/products?category=laces-by-brand">
              <Button
                variant="primary"
                size="lg"
                className="text-[15px] px-10 py-4 font-bold rounded-[4px]"
                style={{ marginLeft: '65px', padding: '10px', marginTop: '10px' }}
              >
                Shop Shoelaces
                <ArrowUpRight size={18} className="ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── BRAND MARQUEE ───────────────────────────────────────── */}
      <BrandMarquee />

      {/* ── CATEGORY TILES ──────────────────────────────────────── */}
      <section id="categories" className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-24">
        <div className="flex items-end justify-between mb-12">
          <h2
            className="font-[Anton,sans-serif] text-[#0D0D0D] text-[30px] md:text-[50px] uppercase tracking-tight leading-none "
            style={{ marginTop: '65px', marginBottom: '20px', marginLeft: '65px' }}
          >
            Shop by Category
          </h2>
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ marginLeft: '65px', marginBottom: '90px' }}
        >
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
      <section
        id="best-sellers"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-24 border-t border-[#EFEFEF]"
      >
        <div className="flex items-end justify-between mb-12">
          <h2
            className="font-[Anton,sans-serif] text-[#0D0D0D] text-[48px] md:text-[64px] uppercase tracking-tight leading-none"
            style={{ marginLeft: '65px', marginTop: '10px', marginBottom: '20px' }}
          >
            Best Sellers
          </h2>
          <a
            href="/products"
            className="flex items-center gap-2 text-[14px] font-bold text-[#0D0D0D] hover:text-[#C6FF3D] transition-colors group"
          >
            Shop Best Sellers
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          style={{ marginLeft: '65px', marginBottom: '90px' }}
        >
          {BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} {...product} href={`/products/${product.id}`} />
          ))}
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────────────── */}
      <section
        className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-24"
        style={{ marginLeft: '50px', marginBottom: '90px' }}
      >
        <PromoBanner
          kicker="A simple, powerful way to elevate your brand!"
          headline="Custom Sneaker Laces"
          highlightedWord="Sneaker"
          ctaLabel="Explore"
          ctaHref="/custom"
          backgroundImage="/custom_laces_banner.jpg"
        />
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────────────── */}
      <section
        id="new-arrivals"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-24 border-t border-[#EFEFEF] "
        style={{ marginLeft: '65px', marginBottom: '90px' }}
      >
        <div className="flex items-end justify-between mb-12" style={{ marginBottom: '25px' }}>
          <h2 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[48px] md:text-[64px] uppercase tracking-tight leading-none">
            New Arrivals
          </h2>
          <a
            href="/products?sort=newest"
            className="flex items-center gap-2 text-[14px] font-bold text-[#0D0D0D] hover:text-[#C6FF3D] transition-colors group"
          >
            See All New
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
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

      {/* ── WHY CHOOSE US ────────────────────────────────────────── */}
      <section className="why-choose-us">
        <div className="why-choose-us__inner">
          <div className="why-choose-us__header">
            <span className="why-choose-us__kicker">Our Promise</span>
            <h2 className="why-choose-us__title">
              Why Choose <span className="why-choose-us__title-accent">Us</span>
            </h2>
            <p className="why-choose-us__subtitle">
              Trusted by over 50,000 sneaker enthusiasts worldwide
            </p>
          </div>

          <div className="why-choose-us__grid">
            <div className="why-choose-us__card">
              <div className="why-choose-us__icon-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
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
              </div>
              <h3 className="why-choose-us__card-title">Free Shipping</h3>
              <p className="why-choose-us__card-desc">On orders over $50</p>
            </div>

            <div className="why-choose-us__card">
              <div className="why-choose-us__icon-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
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
              </div>
              <h3 className="why-choose-us__card-title">30-Day Returns</h3>
              <p className="why-choose-us__card-desc">Hassle-free returns</p>
            </div>

            <div className="why-choose-us__card">
              <div className="why-choose-us__icon-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="why-choose-us__card-title">50,000+ Reviews</h3>
              <p className="why-choose-us__card-desc">Verified customers</p>
            </div>

            <div className="why-choose-us__card">
              <div className="why-choose-us__icon-wrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
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
              </div>
              <h3 className="why-choose-us__card-title">Secure Checkout</h3>
              <p className="why-choose-us__card-desc">SSL encrypted</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
