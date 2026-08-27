import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { LayoutGrid, List, PackageSearch } from 'lucide-react'
import {
  useProducts,
  useCategories,
  type ProductFilters,
  type SortOption,
} from '@/hooks/useProducts'
import { getProductImageUrl } from '@/hooks/useProducts'
import { FilterSidebar } from '@/components/ui/FilterSidebar'
import { SortDropdown } from '@/components/ui/SortDropdown'
import { SearchInput } from '@/components/ui/SearchInput'
import { Pagination } from '@/components/ui/Pagination'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { cn } from '@/lib/cn'
import type { Gender } from '@/lib/types'

// ─── Route Definition ─────────────────────────────────────────────────────────

export const Route = createFileRoute('/products')({
  component: ProductsPage,
})

// ─── Page ─────────────────────────────────────────────────────────────────────

type ViewMode = 'grid' | 'list'

const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

function ProductsPage(): React.JSX.Element {
  // ── URL-driven filter state from search params ──────────────────────────
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  )

  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') ?? undefined,
    gender: (searchParams.get('gender') as Gender) ?? undefined,
    search: searchParams.get('q') ?? undefined,
    sort: (searchParams.get('sort') as SortOption) ?? 'newest',
    minPrice: searchParams.get('min') ? Number(searchParams.get('min')) : undefined,
    maxPrice: searchParams.get('max') ? Number(searchParams.get('max')) : undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: 12,
  })

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Debounced search
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchInput, setSearchInput] = useState(filters.search ?? '')

  // ── Sync filters → URL ──────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.gender) params.set('gender', filters.gender)
    if (filters.search) params.set('q', filters.search)
    if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort)
    if (filters.minPrice !== undefined) params.set('min', String(filters.minPrice))
    if (filters.maxPrice !== undefined) params.set('max', String(filters.maxPrice))
    if (filters.page && filters.page > 1) params.set('page', String(filters.page))
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
  }, [filters])

  // ── Update helpers ──────────────────────────────────────────────────────
  const updateFilters = useCallback((partial: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
  }, [])

  const resetFilters = useCallback(() => {
    setSearchInput('')
    setFilters({ sort: 'newest', page: 1, pageSize: 12 })
  }, [])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value)
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = setTimeout(() => {
        updateFilters({ search: value || undefined, page: 1 })
      }, 300)
    },
    [updateFilters]
  )

  // ── Data ────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useProducts(filters)
  const { data: categories = [] } = useCategories()

  const products = data?.products ?? []
  const totalPages = data?.totalPages ?? 1
  const total = data?.total ?? 0

  const activeFilterCount = [
    filters.category,
    filters.gender,
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
  ].filter(Boolean).length

  return (
    <>
      {/* ── SEO ──────────────────────────────────────────────────────── */}
      <title>Shop All Products — StrideWear</title>
      <meta
        name="description"
        content="Browse StrideWear's full collection of premium sportswear for men, women, kids and more. Filter by category, gender, price and sort by top rated."
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-xs text-[#9A9A9A] mb-6">
          <Link to="/" className="hover:text-[#0D0D0D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#0D0D0D] font-medium">Products</span>
        </nav>

        {/* ── Page title ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-black text-[#0D0D0D] uppercase tracking-tight"
            style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
          >
            {filters.category
              ? (categories.find((c) => c.slug === filters.category)?.name ?? 'Products')
              : 'All Products'}
          </h1>
          {total > 0 && !isLoading && (
            <p className="text-[#9A9A9A] text-sm mt-1">
              {total.toLocaleString()} {total === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar (desktop) ─────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
            <FilterSidebar
              filters={filters}
              categories={categories}
              onChange={updateFilters}
              onReset={resetFilters}
            />
          </aside>

          {/* ── Main content ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Search */}
              <div className="flex-1 min-w-[180px] max-w-sm">
                <SearchInput
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Search products…"
                />
              </div>

              {/* Mobile filters button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden"
              >
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>

              <div className="flex items-center gap-3 ml-auto">
                {/* Sort */}
                <SortDropdown
                  value={filters.sort ?? 'newest'}
                  onChange={(sort) => updateFilters({ sort, page: 1 })}
                />

                {/* View toggle */}
                <div className="hidden sm:flex items-center border border-[#EFEFEF] rounded-[8px] overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2.5 transition-colors',
                      viewMode === 'grid'
                        ? 'bg-[#0D0D0D] text-white'
                        : 'bg-white text-[#9A9A9A] hover:text-[#0D0D0D]'
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2.5 transition-colors',
                      viewMode === 'list'
                        ? 'bg-[#0D0D0D] text-white'
                        : 'bg-white text-[#9A9A9A] hover:text-[#0D0D0D]'
                    )}
                    aria-label="List view"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {filters.category && (
                  <FilterChip
                    label={`Category: ${categories.find((c) => c.slug === filters.category)?.name ?? filters.category}`}
                    onRemove={() => updateFilters({ category: undefined, page: 1 })}
                  />
                )}
                {filters.gender && (
                  <FilterChip
                    label={`Gender: ${filters.gender}`}
                    onRemove={() => updateFilters({ gender: undefined, page: 1 })}
                  />
                )}
                {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                  <FilterChip
                    label={`Price: ${filters.minPrice !== undefined ? `$${filters.minPrice}` : ''}–${filters.maxPrice !== undefined ? `$${filters.maxPrice}` : '+'}`}
                    onRemove={() =>
                      updateFilters({ minPrice: undefined, maxPrice: undefined, page: 1 })
                    }
                  />
                )}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="py-16 text-center">
                <p className="text-red-500 text-sm font-medium mb-4">
                  Failed to load products. Please try again.
                </p>
                <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && (
              <div
                className={cn(
                  'grid gap-5',
                  viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
                )}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F7F7F7] flex items-center justify-center mb-4">
                  <PackageSearch size={30} className="text-[#9A9A9A]" strokeWidth={1.5} />
                </div>
                <h2
                  className="text-xl font-black text-[#0D0D0D] uppercase mb-2"
                  style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
                >
                  No Products Found
                </h2>
                <p className="text-[#9A9A9A] text-sm mb-5 max-w-xs">
                  Try adjusting your filters or search term.
                </p>
                <Button variant="primary" size="sm" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Product grid */}
            {!isLoading && products.length > 0 && (
              <div
                className={cn(
                  'grid gap-5',
                  viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2'
                )}
              >
                {products.map((product) => {
                  const firstImage = product.images?.[0]
                  const swatches = [
                    ...new Map(
                      (product.variants ?? []).map((v) => [
                        v.color,
                        { id: v.id, color: v.color, label: v.color },
                      ])
                    ).values(),
                  ].slice(0, 6)

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.sale_price ?? product.base_price}
                      originalPrice={product.sale_price ? product.base_price : undefined}
                      rating={product.avg_rating ?? 0}
                      reviewCount={undefined}
                      image={
                        firstImage
                          ? getProductImageUrl(firstImage.storage_path)
                          : '/placeholder-product.jpg'
                      }
                      swatches={swatches}
                      isNew={new Date(product.created_at) > thirtyDaysAgo}
                      isSale={!!product.sale_price}
                      href={`/products/${product.slug}`}
                    />
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  page={filters.page ?? 1}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    updateFilters({ page })
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filters Drawer ─────────────────────────────────── */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filters"
      >
        <FilterSidebar
          filters={filters}
          categories={categories}
          onChange={(f) => {
            updateFilters(f)
            setMobileFiltersOpen(false)
          }}
          onReset={() => {
            resetFilters()
            setMobileFiltersOpen(false)
          }}
        />
      </Drawer>
    </>
  )
}

// ─── Filter chip ─────────────────────────────────────────────────────────────

function FilterChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#0D0D0D] text-white text-xs font-medium px-3 py-1.5 rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-[#C6FF3D] transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  )
}
