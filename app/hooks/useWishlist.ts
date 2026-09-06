import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const wishlistKeys = {
  all: ['wishlist'] as const,
  items: (userId: string) => [...wishlistKeys.all, userId] as const,
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WishlistProduct {
  id: string
  product_id: string
  product: {
    id: string
    name: string
    slug: string
    base_price: number
    sale_price: number | null
    avg_rating: number
    images: { storage_path: string }[]
  }
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useWishlistItems() {
  const { user } = useAuth()

  return useQuery({
    queryKey: wishlistKeys.items(user?.id ?? ''),
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from('wishlist_items')
        .select(
          `
          id,
          product_id,
          product:products (
            id,
            name,
            slug,
            base_price,
            sale_price,
            avg_rating,
            images:product_images (storage_path)
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)

      return (data ?? []).map((item) => ({
        ...item,
        product: Array.isArray(item.product) ? item.product[0] : item.product,
      })) as WishlistProduct[]
    },
    enabled: !!user,
  })
}

export function useToggleWishlist() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      productId,
      isWishlisted,
    }: {
      productId: string
      isWishlisted: boolean
    }) => {
      if (!user) throw new Error('Must be logged in to modify wishlist')

      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase.from('wishlist_items').insert({
          user_id: user.id,
          product_id: productId,
        })
        if (error) throw new Error(error.message)
      }
    },
    onMutate: async ({ productId, isWishlisted }) => {
      if (!user) return

      await queryClient.cancelQueries({ queryKey: wishlistKeys.items(user.id) })
      const previousItems = queryClient.getQueryData<WishlistProduct[]>(wishlistKeys.items(user.id))

      queryClient.setQueryData<WishlistProduct[]>(wishlistKeys.items(user.id), (old = []) => {
        if (isWishlisted) {
          return old.filter((item) => item.product_id !== productId)
        } else {
          return [
            {
              id: 'temp-' + Date.now(),
              product_id: productId,
              product: {
                id: productId,
                name: 'Loading...',
                slug: '',
                base_price: 0,
                sale_price: null,
                avg_rating: 0,
                images: [],
              },
            },
            ...old,
          ]
        }
      })

      return { previousItems }
    },
    onError: (_err, _newVal, context) => {
      if (user && context?.previousItems) {
        queryClient.setQueryData(wishlistKeys.items(user.id), context.previousItems)
      }
    },
    onSettled: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: wishlistKeys.items(user.id) })
      }
    },
  })
}
