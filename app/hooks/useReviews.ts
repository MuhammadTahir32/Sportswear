import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { Review } from '@/lib/types'
import { productKeys } from '@/hooks/useProducts'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const reviewKeys = {
  all: ['user-reviews'] as const,
  eligibility: (productId: string, userId: string) =>
    [...reviewKeys.all, 'eligibility', productId, userId] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useReviewEligibility(productId: string) {
  const { user } = useAuth()

  return useQuery({
    queryKey: reviewKeys.eligibility(productId, user?.id ?? ''),
    queryFn: async () => {
      if (!user) return { canReview: false, existingReview: null }

      // 1. Check if user already has a review
      const { data: existingReview, error: revErr } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (revErr) throw new Error(revErr.message)

      if (existingReview) {
        return { canReview: true, existingReview: existingReview as Review }
      }

      // 2. If no review, check if they purchased it
      const { data: canReview, error: checkErr } = await supabase.rpc('can_review_product', {
        p_user_id: user.id,
        p_product_id: productId,
      })

      if (checkErr) throw new Error(checkErr.message)

      return { canReview: !!canReview, existingReview: null }
    },
    enabled: !!user && !!productId,
    staleTime: 1000 * 60 * 5, // 5 mins
  })
}

export function useSubmitReview() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      comment,
      isEdit,
    }: {
      productId: string
      rating: number
      comment: string
      isEdit: boolean
    }) => {
      if (!user) throw new Error('Must be logged in to review')

      if (isEdit) {
        const { error } = await supabase
          .from('reviews')
          .update({ rating, comment })
          .eq('product_id', productId)
          .eq('user_id', user.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert({ product_id: productId, user_id: user.id, rating, comment })
        if (error) throw new Error(error.message)
      }
    },
    onSuccess: (_data, variables) => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.eligibility(variables.productId, user.id),
        })
      }
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Must be logged in')
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', user.id)
      if (error) throw new Error(error.message)
    },
    onSuccess: (_data, productId) => {
      if (user) {
        queryClient.invalidateQueries({
          queryKey: reviewKeys.eligibility(productId, user.id),
        })
      }
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      })
    },
  })
}
