import { cn } from '@/lib/cn'
import { ArrowUpDown } from 'lucide-react'
import type { SortOption } from '@/hooks/useProducts'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'top_rated', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

interface SortDropdownProps {
  value: SortOption
  onChange: (sort: SortOption) => void
  className?: string
}

export function SortDropdown({ value, onChange, className }: SortDropdownProps): React.JSX.Element {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ArrowUpDown size={14} className="text-[#9A9A9A] shrink-0" />
      <span className="text-xs text-[#9A9A9A] font-medium uppercase tracking-wide shrink-0">
        Sort:
      </span>
      <div className="relative">
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className={cn(
            'appearance-none bg-white border border-[#EFEFEF] rounded-[8px]',
            'text-sm text-[#0D0D0D] font-medium pl-3 pr-8 py-2',
            'focus:outline-none focus:border-[#C6FF3D] focus:ring-2 focus:ring-[#C6FF3D]/20',
            'cursor-pointer transition-all duration-200'
          )}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A9A9A]"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
