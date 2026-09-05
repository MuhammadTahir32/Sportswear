import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Order, OrderWithItems, OrderStatus, OrderStatusHistory } from '@/lib/types'

// ─── Query Keys ───────────────────────────────────────────────────────────────

const ADMIN_ORDERS_KEY = ['admin-orders'] as const
const ADMIN_ORDER_DETAIL_KEY = (orderId: string) => ['admin-order', orderId] as const
const ADMIN_ORDER_HISTORY_KEY = (orderId: string) => ['admin-order-history', orderId] as const

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminOrderFilters {
  status?: OrderStatus
  search?: string
  sortBy?: 'created_at' | 'total'
  sortDir?: 'asc' | 'desc'
}

export interface OrderWithProfile extends Order {
  profile: { full_name: string | null; phone: string | null } | null
}

// ─── List all orders (admin) ─────────────────────────────────────────────────

export function useAdminOrders(filters?: AdminOrderFilters) {
  return useQuery({
    queryKey: [...ADMIN_ORDERS_KEY, filters],
    queryFn: async (): Promise<OrderWithProfile[]> => {
      let query = supabase.from('orders').select(`
          *,
          profile:profiles!orders_user_id_fkey(full_name, phone)
        `)

      // Apply status filter
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      // Apply search (by order id prefix or customer name)
      if (filters?.search) {
        query = query.or(
          `id.ilike.%${filters.search}%,shipping_address->>full_name.ilike.%${filters.search}%`
        )
      }

      // Apply sorting
      const sortBy = filters?.sortBy ?? 'created_at'
      const sortDir = filters?.sortDir ?? 'desc'
      query = query.order(sortBy, { ascending: sortDir === 'asc' })

      const { data, error } = await query

      if (error) throw new Error(error.message)
      return (data ?? []) as OrderWithProfile[]
    },
    staleTime: 1000 * 30, // 30 seconds (admin needs fresh data)
  })
}

// ─── Admin order detail ──────────────────────────────────────────────────────

export function useAdminOrderDetail(orderId: string | null | undefined) {
  return useQuery({
    queryKey: ADMIN_ORDER_DETAIL_KEY(orderId ?? ''),
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
    staleTime: 1000 * 15,
  })
}

// ─── Admin order status history ──────────────────────────────────────────────

export function useAdminOrderHistory(orderId: string | null | undefined) {
  return useQuery({
    queryKey: ADMIN_ORDER_HISTORY_KEY(orderId ?? ''),
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
    staleTime: 1000 * 15,
  })
}

// ─── Update order status (admin) ─────────────────────────────────────────────

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      trackingNumber,
    }: {
      orderId: string
      status: OrderStatus
      trackingNumber?: string | null
    }) => {
      // Update order
      const updates: Record<string, unknown> = { status }
      if (trackingNumber !== undefined) {
        updates.tracking_number = trackingNumber
      }

      const { error: orderErr } = await supabase.from('orders').update(updates).eq('id', orderId)

      if (orderErr) throw new Error(orderErr.message)

      // Add status history entry
      const { error: histErr } = await supabase.from('order_status_history').insert({
        order_id: orderId,
        status,
        changed_at: new Date().toISOString(),
      })

      if (histErr) throw new Error(histErr.message)
    },
    onSuccess: (_data, variables) => {
      // Invalidate all admin order queries
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_KEY })
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDER_DETAIL_KEY(variables.orderId) })
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDER_HISTORY_KEY(variables.orderId) })
      // Also invalidate customer-side queries
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['order-history', variables.orderId] })
    },
  })
}
