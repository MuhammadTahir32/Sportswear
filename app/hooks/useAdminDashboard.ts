import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { OrderStatus } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  revenueThisMonth: number
  ordersThisMonth: number
  pendingOrders: number
  lowStockCount: number
}

export interface RecentOrder {
  id: string
  status: OrderStatus
  total: number
  created_at: string
  customerName: string | null
}

export interface TopProduct {
  id: string
  name: string
  base_price: number
  totalSold: number
  revenue: number
  image: string | null
}

export interface LowStockItem {
  id: string
  product_name: string
  variant_info: string
  stock_qty: number
}

export interface RevenueChartData {
  date: string
  label: string
  revenue: number
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const dashboardKeys = {
  stats: ['admin-dashboard', 'stats'] as const,
  recentOrders: ['admin-dashboard', 'recent-orders'] as const,
  topProducts: ['admin-dashboard', 'top-products'] as const,
  lowStock: ['admin-dashboard', 'low-stock'] as const,
  revenueChart: ['admin-dashboard', 'revenue-chart'] as const,
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: async (): Promise<DashboardStats> => {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [ordersRes, productsRes, customersRes, monthOrdersRes, pendingRes, lowStockRes] =
        await Promise.all([
          supabase.from('orders').select('total, created_at'),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('total').gte('created_at', monthStart),
          supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
          supabase.from('product_variants').select('id, stock_qty').lte('stock_qty', 5),
        ])

      const allOrders = ordersRes.data ?? []
      const monthOrders = monthOrdersRes.data ?? []

      const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total ?? 0), 0)
      const revenueThisMonth = monthOrders.reduce((sum, o) => sum + (o.total ?? 0), 0)

      return {
        totalRevenue,
        totalOrders: allOrders.length,
        totalProducts: productsRes.count ?? 0,
        totalCustomers: customersRes.count ?? 0,
        revenueThisMonth,
        ordersThisMonth: monthOrders.length,
        pendingOrders: pendingRes.count ?? 0,
        lowStockCount: (lowStockRes.data ?? []).length,
      }
    },
    staleTime: 1000 * 30,
  })
}

// ─── Recent Orders ────────────────────────────────────────────────────────────

export function useDashboardRecentOrders() {
  return useQuery({
    queryKey: dashboardKeys.recentOrders,
    queryFn: async (): Promise<RecentOrder[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          id,
          status,
          total,
          created_at,
          profile:profiles!orders_user_id_fkey(full_name)
        `
        )
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw new Error(error.message)

      return (data ?? []).map((o) => ({
        id: o.id,
        status: o.status as OrderStatus,
        total: o.total,
        created_at: o.created_at,
        customerName:
          (o.profile as unknown as { full_name: string | null } | null)?.full_name ?? null,
      }))
    },
    staleTime: 1000 * 30,
  })
}

// ─── Top Products ─────────────────────────────────────────────────────────────

export function useDashboardTopProducts() {
  return useQuery({
    queryKey: dashboardKeys.topProducts,
    queryFn: async (): Promise<TopProduct[]> => {
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select('variant_id, quantity, unit_price')

      if (error) throw new Error(error.message)
      if (!orderItems || orderItems.length === 0) return []

      const variantMap = new Map<string, { totalSold: number; revenue: number }>()
      for (const item of orderItems) {
        const existing = variantMap.get(item.variant_id) ?? { totalSold: 0, revenue: 0 }
        existing.totalSold += item.quantity
        existing.revenue += item.unit_price * item.quantity
        variantMap.set(item.variant_id, existing)
      }

      const variantIds = Array.from(variantMap.keys())
      const { data: variants } = await supabase
        .from('product_variants')
        .select('id, product_id, size, color')
        .in('id', variantIds)

      const productIds = [...new Set((variants ?? []).map((v) => v.product_id))]
      const { data: products } = await supabase
        .from('products')
        .select('id, name, base_price')
        .in('id', productIds)

      const { data: images } = await supabase
        .from('product_images')
        .select('product_id, storage_path')
        .in('product_id', productIds)

      const productMap = new Map((products ?? []).map((p) => [p.id, p]))
      const imageMap = new Map((images ?? []).map((img) => [img.product_id, img.storage_path]))

      const productSales = new Map<
        string,
        {
          name: string
          base_price: number
          image: string | null
          totalSold: number
          revenue: number
        }
      >()

      for (const variant of variants ?? []) {
        const stats = variantMap.get(variant.id)
        if (!stats) continue

        const existing = productSales.get(variant.product_id)
        const product = productMap.get(variant.product_id)
        if (!product) continue

        if (existing) {
          existing.totalSold += stats.totalSold
          existing.revenue += stats.revenue
        } else {
          productSales.set(variant.product_id, {
            name: product.name,
            base_price: product.base_price,
            image: imageMap.get(variant.product_id) ?? null,
            totalSold: stats.totalSold,
            revenue: stats.revenue,
          })
        }
      }

      return Array.from(productSales.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
    },
    staleTime: 1000 * 60,
  })
}

// ─── Low Stock Items ──────────────────────────────────────────────────────────

export function useDashboardLowStock() {
  return useQuery({
    queryKey: dashboardKeys.lowStock,
    queryFn: async (): Promise<LowStockItem[]> => {
      const { data, error } = await supabase
        .from('product_variants')
        .select(
          `
          id,
          stock_qty,
          size,
          color,
          product:products(name)
        `
        )
        .lte('stock_qty', 5)
        .order('stock_qty', { ascending: true })
        .limit(10)

      if (error) throw new Error(error.message)

      return (data ?? []).map((v) => ({
        id: v.id,
        product_name: (v.product as unknown as { name: string } | null)?.name ?? 'Unknown',
        variant_info: `${v.color} / ${v.size}`,
        stock_qty: v.stock_qty,
      }))
    },
    staleTime: 1000 * 30,
  })
}

// ─── Revenue Chart ────────────────────────────────────────────────────────────

export function useDashboardRevenueChart() {
  return useQuery({
    queryKey: dashboardKeys.revenueChart,
    queryFn: async (): Promise<RevenueChartData[]> => {
      const now = new Date()
      // Get the date 7 days ago
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('orders')
        .select('total, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw new Error(error.message)

      // Initialize map with last 7 days (0 revenue)
      const dailyMap = new Map<string, RevenueChartData>()
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo)
        d.setDate(d.getDate() + i)
        const dateKey = d.toISOString().split('T')[0] // YYYY-MM-DD
        const label = d.toLocaleDateString('en-US', { weekday: 'short' }) // e.g., 'Mon'
        dailyMap.set(dateKey, { date: dateKey, label, revenue: 0 })
      }

      // Populate with actual order data
      for (const order of data ?? []) {
        const dateKey = order.created_at.split('T')[0]
        const existing = dailyMap.get(dateKey)
        if (existing) {
          existing.revenue += order.total
        }
      }

      return Array.from(dailyMap.values())
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
