import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ReviewWithProfile } from '@/hooks/useProducts'

interface ReviewCardProps {
  review: ReviewWithProfile
  className?: string
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function ReviewCard({ review, className }: ReviewCardProps): React.JSX.Element {
  const authorName = review.profile?.full_name ?? 'Anonymous'
  const initials = getInitials(review.profile?.full_name)

  return (
    <div className={cn('p-5 bg-[#F7F7F7] rounded-[12px]', className)}>
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#0D0D0D] flex items-center justify-center shrink-0">
          <span className="text-[#C6FF3D] text-xs font-black">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0D0D0D] truncate">{authorName}</p>
          <p className="text-[10px] text-[#9A9A9A]">{formatDate(review.created_at)}</p>
        </div>
        {/* Star rating */}
        <div className="flex items-center gap-0.5 shrink-0">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={13}
              className={i < review.rating ? 'text-[#F5A623]' : 'text-[#EFEFEF]'}
              fill={i < review.rating ? '#F5A623' : 'none'}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      {review.comment && <p className="text-sm text-[#4A4A4A] leading-relaxed">{review.comment}</p>}
    </div>
  )
}
