import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ShoppingBag, Heart, Share2, Ruler, ChevronRight, Star, AlertCircle } from 'lucide-react'
import {
  useProduct,
  useProductReviews,
  useRelatedProducts,
  getProductImageUrl,
} from '@/hooks/useProducts'
import { ImageGallery } from '@/components/ui/ImageGallery'
import { VariantSelector } from '@/components/ui/VariantSelector'
import { SizeGuideModal } from '@/components/ui/SizeGuideModal'
import { ReviewCard } from '@/components/ui/ReviewCard'
import { RatingBreakdown } from '@/components/ui/RatingBreakdown'
import { Pagination } from '@/components/ui/Pagination'
import { ProductCard } from '@/components/ui/ProductCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

// ─── Route ────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/products/$slug')({
  component: ProductDetailPage,
})

// ─── Page ─────────────────────────────────────────────────────────────────────

function ProductDetailPage(): React.JSX.Element {
  const { slug } = Route.useParams()
  const { data: product, isLoading, isError } = useProduct(slug)

  if (isLoading) return <ProductDetailSkeleton />

  if (isError || !product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-24 text-center">
        <AlertCircle size={40} className="mx-auto text-[#9A9A9A] mb-4" strokeWidth={1.5} />
        <h1
          className="text-2xl font-black text-[#0D0D0D] uppercase mb-2"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          Product Not Found
        </h1>
        <p className="text-[#9A9A9A] text-sm mb-6">
          This product doesn't exist or has been removed.
        </p>
        <Link to="/products">
          <Button variant="primary" size="md">
            Browse All Products
          </Button>
        </Link>
      </div>
    )
  }

  const isOnSale = !!product.sale_price
  const isNew = new Date(product.created_at) > thirtyDaysAgo

  // ── SEO meta ──────────────────────────────────────────────────────────
  const metaTitle = `${product.name} — StrideWear`
  const metaDescription =
    product.description ??
    `Shop ${product.name} at StrideWear. Premium sportswear starting from $${product.base_price.toFixed(2)}.`

  return (
    <>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      {product.images?.[0] && (
        <meta property="og:image" content={getProductImageUrl(product.images[0].storage_path)} />
      )}

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#9A9A9A] mb-8">
          <Link to="/" className="hover:text-[#0D0D0D] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-[#0D0D0D] transition-colors">
            Products
          </Link>
          <ChevronRight size={12} />
          <a
            href={`/products?category=${product.category?.slug ?? ''}`}
            className="hover:text-[#0D0D0D] transition-colors"
          >
            {product.category?.name}
          </a>
          <ChevronRight size={12} />
          <span className="text-[#0D0D0D] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* ── Main product section ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
          {/* Gallery */}
          <ImageGallery images={product.images ?? []} productName={product.name} />

          {/* Info panel */}
          <ProductInfoPanel product={product} isOnSale={isOnSale} isNew={isNew} />
        </div>

        {/* ── Reviews section ──────────────────────────────────────────── */}
        <ReviewsSection productId={product.id} avgRating={product.avg_rating} />

        {/* ── Related products ─────────────────────────────────────────── */}
        {product.category_id && (
          <RelatedProducts categoryId={product.category_id} excludeId={product.id} />
        )}
      </div>
    </>
  )
}

// ─── Product Info Panel ───────────────────────────────────────────────────────

function ProductInfoPanel({
  product,
  isOnSale,
  isNew,
}: {
  product: NonNullable<ReturnType<typeof useProduct>['data']>
  isOnSale: boolean
  isNew: boolean
}): React.JSX.Element {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id ?? null
  )
  const [quantity, setQuantity] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId) ?? null
  const price = selectedVariant?.price_override ?? product.sale_price ?? product.base_price
  const originalPrice = isOnSale ? product.base_price : undefined
  const isOutOfStock = selectedVariant ? selectedVariant.stock_qty === 0 : false

  const handleAddToCart = () => {
    if (!selectedVariantId || isOutOfStock) return
    // Cart integration comes in Phase 4 — stub for now
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        {isNew && <Badge variant="black">New Arrival</Badge>}
        {isOnSale && <Badge variant="lime">Sale</Badge>}
        {product.category && <Badge variant="outline">{product.category.name}</Badge>}
      </div>

      {/* Title */}
      <div>
        <h1
          className="text-3xl md:text-4xl font-black text-[#0D0D0D] uppercase leading-tight tracking-tight"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          {product.name}
        </h1>

        {/* Rating */}
        {(product.avg_rating ?? 0) > 0 && (
          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={product.avg_rating} size="md" />
            <span className="text-sm text-[#9A9A9A]">{product.avg_rating.toFixed(1)}</span>
            <a href="#reviews" className="text-xs text-[#9A9A9A] underline hover:text-[#0D0D0D]">
              See reviews
            </a>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-[#0D0D0D]">${price.toFixed(2)}</span>
        {originalPrice && (
          <span className="text-lg text-[#9A9A9A] line-through font-medium">
            ${originalPrice.toFixed(2)}
          </span>
        )}
        {isOnSale && originalPrice && (
          <span className="text-sm font-bold text-[#C6FF3D] bg-[#0D0D0D] px-2 py-0.5 rounded">
            −{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-[#4A4A4A] text-sm leading-relaxed">{product.description}</p>
      )}

      <div className="w-full h-px bg-[#EFEFEF]" />

      {/* Variant selector */}
      {(product.variants?.length ?? 0) > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0D0D0D]">
              Select Variant
            </span>
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="flex items-center gap-1 text-xs text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors underline underline-offset-2"
            >
              <Ruler size={12} />
              Size Guide
            </button>
          </div>
          <VariantSelector
            variants={product.variants!}
            selectedVariantId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />
        </>
      )}

      {/* Quantity */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#0D0D0D] block mb-3">
          Quantity
        </span>
        <div className="flex items-center border border-[#EFEFEF] rounded-[10px] w-fit overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-lg font-bold text-[#0D0D0D] hover:bg-[#F7F7F7] transition-colors disabled:opacity-30"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-semibold text-[#0D0D0D]">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(q + 1, selectedVariant?.stock_qty ?? 99))}
            disabled={selectedVariant ? quantity >= selectedVariant.stock_qty : false}
            className="w-10 h-10 flex items-center justify-center text-lg font-bold text-[#0D0D0D] hover:bg-[#F7F7F7] transition-colors disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <Button
          id="add-to-cart-btn"
          variant="primary"
          size="lg"
          disabled={!selectedVariantId || isOutOfStock}
          loading={addedToCart}
          onClick={handleAddToCart}
          className="flex-1"
        >
          {!addedToCart && !isOutOfStock && <ShoppingBag size={18} className="mr-1" />}
          {isOutOfStock ? 'Out of Stock' : addedToCart ? '✓ Added!' : 'Add to Cart'}
        </Button>

        <Button
          variant="icon-circle"
          onClick={() => setWishlisted((w) => !w)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn('!rounded-[10px] !p-3', wishlisted && '!bg-[#C6FF3D] !border-[#C6FF3D]')}
        >
          <Heart
            size={18}
            className={wishlisted ? 'text-[#0D0D0D]' : 'text-[#0D0D0D]'}
            fill={wishlisted ? '#0D0D0D' : 'none'}
          />
        </Button>

        <Button
          variant="icon-circle"
          onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
          aria-label="Share product"
          className="!rounded-[10px] !p-3"
        >
          <Share2 size={18} />
        </Button>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-4 pt-2">
        {['🚚 Free shipping over $75', '↩️ 30-day returns', '🔒 Secure checkout'].map((b) => (
          <span key={b} className="text-[11px] text-[#9A9A9A] font-medium">
            {b}
          </span>
        ))}
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  )
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

function ReviewsSection({
  productId,
  avgRating,
}: {
  productId: string
  avgRating: number
}): React.JSX.Element {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useProductReviews(productId, page)

  const reviews = data?.reviews ?? []
  const totalPages = data?.totalPages ?? 1
  const total = data?.total ?? 0

  return (
    <section id="reviews" className="mb-16 scroll-mt-8">
      <h2
        className="text-2xl font-black text-[#0D0D0D] uppercase tracking-tight mb-6"
        style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
      >
        Customer Reviews
        {total > 0 && (
          <span className="text-[#9A9A9A] font-medium text-lg normal-case tracking-normal ml-3">
            ({total})
          </span>
        )}
      </h2>

      {/* Rating breakdown */}
      {avgRating > 0 && (
        <div className="mb-8 p-6 bg-[#F7F7F7] rounded-[12px]">
          <RatingBreakdown avgRating={avgRating} totalCount={total} />
        </div>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 bg-[#F7F7F7] rounded-[12px] space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center bg-[#F7F7F7] rounded-[12px]">
          <Star size={28} className="mx-auto text-[#9A9A9A] mb-3" strokeWidth={1.5} />
          <p className="text-[#9A9A9A] text-sm">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="mt-6">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </section>
  )
}

// ─── Related Products ─────────────────────────────────────────────────────────

function RelatedProducts({
  categoryId,
  excludeId,
}: {
  categoryId: string
  excludeId: string
}): React.JSX.Element {
  const { data: related = [], isLoading } = useRelatedProducts(categoryId, excludeId)

  if (!isLoading && related.length === 0) return <></>

  return (
    <section className="mb-16">
      <h2
        className="text-2xl font-black text-[#0D0D0D] uppercase tracking-tight mb-6"
        style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
      >
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-square rounded-[10px]" />
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          : related.map((p) => {
              const firstImg = p.images?.[0]
              return (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.sale_price ?? p.base_price}
                  originalPrice={p.sale_price ? p.base_price : undefined}
                  rating={p.avg_rating ?? 0}
                  image={
                    firstImg
                      ? getProductImageUrl(firstImg.storage_path)
                      : '/placeholder-product.jpg'
                  }
                  isSale={!!p.sale_price}
                  href={`/products/${p.slug}`}
                />
              )
            })}
      </div>
    </section>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProductDetailSkeleton(): React.JSX.Element {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-2 mb-8">
        {[60, 80, 100, 140].map((w, i) => (
          <Skeleton key={i} className="h-3" width={`${w}px`} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Skeleton className="w-full aspect-square rounded-[12px]" />
        <div className="space-y-5">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-14 rounded-[8px]" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-[24px]" />
        </div>
      </div>
    </div>
  )
}
