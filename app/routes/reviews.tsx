import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { Star } from 'lucide-react'

export const Route = createFileRoute('/reviews')({
  component: ReviewsPage,
})

function ReviewsPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-32 px-6 bg-[#F7F7F7]">
      <div className="max-w-2xl text-center">
        <div className="flex justify-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="fill-[#C6FF3D] text-[#C6FF3D]" size={32} />
          ))}
        </div>
        <h1 className="font-[Anton,sans-serif] text-[48px] uppercase tracking-tight text-[#0D0D0D] mb-6">
          Customer Reviews
        </h1>
        <p className="text-[16px] text-[#4A4A4A] leading-relaxed mb-10">
          See why thousands of sneakerheads trust StrideWear for their replacement laces. We're
          currently migrating our reviews system. Check back soon!
        </p>
        <a href="/products">
          <Button variant="primary" size="lg">
            Shop Top Rated
          </Button>
        </a>
      </div>
    </div>
  )
}
