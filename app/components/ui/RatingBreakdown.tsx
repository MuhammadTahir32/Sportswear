import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

interface RatingBreakdownProps {
  avgRating: number
  totalCount: number
  /** Distribution per star: index 0 = 1★, index 4 = 5★ */
  distribution?: number[]
  className?: string
}

export function RatingBreakdown({
  avgRating,
  totalCount,
  distribution,
  className,
}: RatingBreakdownProps): React.JSX.Element {
  const dist = distribution ?? [0, 0, 0, 0, 0]

  return (
    <div className={cn('flex gap-6', className)}>
      {/* Score */}
      <div className="flex flex-col items-center justify-center min-w-[80px]">
        <span
          className="text-5xl font-black text-[#0D0D0D] leading-none"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          {avgRating.toFixed(1)}
        </span>
        <div className="flex items-center gap-0.5 mt-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.round(avgRating) ? 'text-[#F5A623]' : 'text-[#EFEFEF]'}
              fill={i < Math.round(avgRating) ? '#F5A623' : 'none'}
            />
          ))}
        </div>
        <span className="text-[11px] text-[#9A9A9A] mt-1">
          {totalCount.toLocaleString()} {totalCount === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = dist[star - 1] ?? 0
          const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
          return (
            <div key={star} className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 w-14 shrink-0">
                <span className="text-xs text-[#4A4A4A] font-medium w-3 text-right">{star}</span>
                <Star size={11} className="text-[#F5A623]" fill="#F5A623" />
              </div>
              <div className="flex-1 h-2 bg-[#EFEFEF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F5A623] rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] text-[#9A9A9A] w-7 text-right shrink-0">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
