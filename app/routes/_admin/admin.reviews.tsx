import { createFileRoute } from '@tanstack/react-router'
import { Star } from 'lucide-react'

export const Route = createFileRoute('/_admin/admin/reviews')({
  component: AdminReviewsPage,
})

function AdminReviewsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Reviews</h2>
          <p className="text-[13px] text-[#9A9A9A]">Manage customer reviews and ratings.</p>
        </div>
      </div>
      <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-24 text-center flex flex-col items-center">
        <Star size={48} className="text-white/10 mb-4" />
        <h3 className="text-[16px] font-bold text-white mb-2">Reviews Module</h3>
        <p className="text-[13px] text-[#9A9A9A] max-w-sm">
          This feature is coming soon. You'll be able to moderate, respond to, and manage product
          reviews here.
        </p>
      </div>
    </div>
  )
}
