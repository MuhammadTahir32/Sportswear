import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

type StarRatingProps = {
  rating: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 12, md: 14, lg: 18 }

export function StarRating({
  rating,
  count,
  size = 'md',
  className,
}: StarRatingProps): React.JSX.Element {
  const starSize = sizeMap[size]
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < fullStars
          const half = !filled && i === fullStars && hasHalf
          return (
            <Star
              key={i}
              size={starSize}
              className={cn(
                'transition-colors',
                filled || half ? 'text-[#F5A623]' : 'text-[#EFEFEF]'
              )}
              fill={filled ? '#F5A623' : half ? 'url(#half-star)' : 'none'}
            />
          )
        })}
      </div>
      {count !== undefined && (
        <span className="text-[11px] text-[#9A9A9A] font-medium tabular-nums">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}
