import { useState } from 'react'
import { Star, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSubmitReview, useDeleteReview } from '@/hooks/useReviews'
import type { Review } from '@/lib/types'

export function ReviewForm({
  productId,
  existingReview,
}: {
  productId: string
  existingReview: Review | null
}) {
  const [rating, setRating] = useState(existingReview?.rating ?? 5)
  const [comment, setComment] = useState(existingReview?.comment ?? '')
  const [hoverRating, setHoverRating] = useState(0)

  const submitReview = useSubmitReview()
  const deleteReview = useDeleteReview()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    await submitReview.mutateAsync({
      productId,
      rating,
      comment: comment.trim(),
      isEdit: !!existingReview,
    })
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete your review?')) {
      await deleteReview.mutateAsync(productId)
    }
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-[#0D0D0D]">
          {existingReview ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        {existingReview && (
          <button
            onClick={handleDelete}
            disabled={deleteReview.isPending}
            className="text-[12px] font-semibold text-red-500 hover:underline flex items-center gap-1"
          >
            <Trash2 size={14} />
            {deleteReview.isPending ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      {submitReview.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-[13px] rounded-[8px] font-medium border border-red-200">
          {submitReview.error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Selection */}
        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'text-[#C6FF3D] fill-[#C6FF3D]'
                      : 'text-[#E0E0E0] fill-transparent'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-2">
            Review (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="What did you like or dislike about this product?"
            className="w-full rounded-[8px] border border-[#EFEFEF] bg-white text-sm text-[#0D0D0D] px-4 py-3 outline-none focus:border-[#C6FF3D] focus:ring-2 focus:ring-[#C6FF3D]/20 transition-all placeholder:text-[#9A9A9A] resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={submitReview.isPending || rating === 0}
          >
            {submitReview.isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            {existingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  )
}
