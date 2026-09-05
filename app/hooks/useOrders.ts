import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Order, OrderWithItems, OrderStatusHistory } from '@/lib/types'

// ─── Query Keys ───────────────────────────────────────────────────────────────

const ORDERS_KEY = (userId: string) => ['orders', userId] as const
const ORDER_DETAIL_KEY = (orderId: string) => ['order', orderId] as const
const ORDER_HISTORY_KEY = (orderId: string) => ['order-history', orderId] as const

// ─── List all orders for the current user ────────────────────────────────────

export function useOrders(userId: string | null | undefined) {
  return useQuery({
    queryKey: ORDERS_KEY(userId ?? ''),
    queryFn: async (): Promise<Order[]> => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return (data ?? []) as Order[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// ─── Single order detail with items + variant + product info ─────────────────

export function useOrderDetail(orderId: string | null | undefined) {
  return useQuery({
    queryKey: ORDER_DETAIL_KEY(orderId ?? ''),
    queryFn: async (): Promise<OrderWithItems | null> => {
      if (!orderId) return null

      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items(
            *,
            variant:product_variants(
              *,
              product:products(*)
            )
          )
        `
        )
        .eq('id', orderId)
        .single()

      if (error) throw new Error(error.message)
      return data as OrderWithItems
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 1, // 1 minute
  })
}

// ─── Order status history ────────────────────────────────────────────────────

export function useOrderStatusHistory(orderId: string | null | undefined) {
  return useQuery({
    queryKey: ORDER_HISTORY_KEY(orderId ?? ''),
    queryFn: async (): Promise<OrderStatusHistory[]> => {
      if (!orderId) return []

      const { data, error } = await supabase
        .from('order_status_history')
        .select('*')
        .eq('order_id', orderId)
        .order('changed_at', { ascending: true })

      if (error) throw new Error(error.message)
      return (data ?? []) as OrderStatusHistory[]
    },
    enabled: !!orderId,
    staleTime: 1000 * 60 * 1,
  })
}
