import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps): React.JSX.Element | null {
  if (totalPages <= 1) return null

  const getPages = (): (number | '…')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '…')[] = [1]
    if (page > 3) pages.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push('…')
    pages.push(totalPages)
    return pages
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1.5', className)}
    >
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={cn(
          'flex items-center gap-1 px-3 py-2 rounded-[8px] text-sm font-medium transition-all duration-150',
          page === 1
            ? 'text-[#9A9A9A] cursor-not-allowed'
            : 'text-[#0D0D0D] hover:bg-[#F7F7F7] border border-[#EFEFEF]'
        )}
      >
        <ChevronLeft size={15} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-[#9A9A9A] select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'w-9 h-9 rounded-[8px] text-sm font-semibold transition-all duration-150',
              p === page
                ? 'bg-[#0D0D0D] text-white'
                : 'text-[#4A4A4A] hover:bg-[#F7F7F7] border border-[#EFEFEF]'
            )}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={cn(
          'flex items-center gap-1 px-3 py-2 rounded-[8px] text-sm font-medium transition-all duration-150',
          page === totalPages
            ? 'text-[#9A9A9A] cursor-not-allowed'
            : 'text-[#0D0D0D] hover:bg-[#F7F7F7] border border-[#EFEFEF]'
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={15} />
      </button>
    </nav>
  )
}
