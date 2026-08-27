import { useState } from 'react'
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Category } from '@/lib/types'
import type { ProductFilters } from '@/hooks/useProducts'
import type { Gender } from '@/lib/types'

interface FilterSidebarProps {
  filters: ProductFilters
  categories: Category[]
  onChange: (filters: Partial<ProductFilters>) => void
  onReset: () => void
  className?: string
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' },
]

const PRICE_PRESETS = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100 – $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200, max: undefined },
]

function FilterPanel({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}): React.JSX.Element {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#EFEFEF] pb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#0D0D0D]">{title}</span>
        {open ? (
          <ChevronUp size={14} className="text-[#9A9A9A]" />
        ) : (
          <ChevronDown size={14} className="text-[#9A9A9A]" />
        )}
      </button>
      {open && <div className="space-y-1">{children}</div>}
    </div>
  )
}

export function FilterSidebar({
  filters,
  categories,
  onChange,
  onReset,
  className,
}: FilterSidebarProps): React.JSX.Element {
  const activeCount = [
    filters.category,
    filters.gender,
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
  ].filter(Boolean).length

  return (
    <aside className={cn('w-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-[#0D0D0D]" />
          <span className="text-sm font-bold text-[#0D0D0D] uppercase tracking-wide">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-[#C6FF3D] text-[#0D0D0D] text-[10px] font-black rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors font-medium"
          >
            <X size={11} />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-0">
        {/* Category */}
        <FilterPanel title="Category">
          <button
            onClick={() => onChange({ category: undefined, page: 1 })}
            className={cn(
              'w-full text-left py-1.5 px-2 rounded-[6px] text-sm transition-colors',
              !filters.category
                ? 'text-[#0D0D0D] font-semibold bg-[#F7F7F7]'
                : 'text-[#9A9A9A] hover:text-[#0D0D0D] hover:bg-[#F7F7F7]'
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ category: cat.slug, page: 1 })}
              className={cn(
                'w-full text-left py-1.5 px-2 rounded-[6px] text-sm transition-colors',
                filters.category === cat.slug
                  ? 'text-[#0D0D0D] font-semibold bg-[#F7F7F7]'
                  : 'text-[#9A9A9A] hover:text-[#0D0D0D] hover:bg-[#F7F7F7]'
              )}
            >
              {cat.name}
            </button>
          ))}
        </FilterPanel>

        {/* Gender */}
        <FilterPanel title="Gender">
          <button
            onClick={() => onChange({ gender: undefined, page: 1 })}
            className={cn(
              'w-full text-left py-1.5 px-2 rounded-[6px] text-sm transition-colors',
              !filters.gender
                ? 'text-[#0D0D0D] font-semibold bg-[#F7F7F7]'
                : 'text-[#9A9A9A] hover:text-[#0D0D0D] hover:bg-[#F7F7F7]'
            )}
          >
            All
          </button>
          {GENDERS.map((g) => (
            <button
              key={g.value}
              onClick={() => onChange({ gender: g.value, page: 1 })}
              className={cn(
                'w-full text-left py-1.5 px-2 rounded-[6px] text-sm transition-colors',
                filters.gender === g.value
                  ? 'text-[#0D0D0D] font-semibold bg-[#F7F7F7]'
                  : 'text-[#9A9A9A] hover:text-[#0D0D0D] hover:bg-[#F7F7F7]'
              )}
            >
              {g.label}
            </button>
          ))}
        </FilterPanel>

        {/* Price */}
        <FilterPanel title="Price Range">
          <button
            onClick={() => onChange({ minPrice: undefined, maxPrice: undefined, page: 1 })}
            className={cn(
              'w-full text-left py-1.5 px-2 rounded-[6px] text-sm transition-colors',
              filters.minPrice === undefined && filters.maxPrice === undefined
                ? 'text-[#0D0D0D] font-semibold bg-[#F7F7F7]'
                : 'text-[#9A9A9A] hover:text-[#0D0D0D] hover:bg-[#F7F7F7]'
            )}
          >
            Any Price
          </button>
          {PRICE_PRESETS.map((p) => {
            const isActive = filters.minPrice === p.min && filters.maxPrice === p.max
            return (
              <button
                key={p.label}
                onClick={() => onChange({ minPrice: p.min, maxPrice: p.max, page: 1 })}
                className={cn(
                  'w-full text-left py-1.5 px-2 rounded-[6px] text-sm transition-colors',
                  isActive
                    ? 'text-[#0D0D0D] font-semibold bg-[#F7F7F7]'
                    : 'text-[#9A9A9A] hover:text-[#0D0D0D] hover:bg-[#F7F7F7]'
                )}
              >
                {p.label}
              </button>
            )
          })}
        </FilterPanel>
      </div>
    </aside>
  )
}
