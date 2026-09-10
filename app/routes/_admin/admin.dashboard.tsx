import { createFileRoute, Link } from '@tanstack/react-router'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Clock,
  TrendingUp,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import {
  useDashboardStats,
  useDashboardRecentOrders,
  useDashboardTopProducts,
  useDashboardLowStock,
  useDashboardRevenueChart,
  type RecentOrder,
  type TopProduct,
  type LowStockItem,
} from '@/hooks/useAdminDashboard'
import { formatCurrency } from '@/lib/cartCalculations'
import { getProductImageUrl } from '@/lib/supabase'
import type { OrderStatus } from '@/lib/types'

export const Route = createFileRoute('/_admin/admin/dashboard')({
  component: AdminDashboardPage,
})

const STATUS_BADGES: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  paid: { label: 'Paid', bg: 'bg-blue-50', text: 'text-blue-700' },
  processing: { label: 'Processing', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  shipped: { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-700' },
  delivered: { label: 'Delivered', bg: 'bg-green-50', text: 'text-green-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600' },
  refunded: { label: 'Refunded', bg: 'bg-gray-100', text: 'text-gray-600' },
}

function AdminDashboardPage(): React.JSX.Element {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: recentOrders = [], isLoading: ordersLoading } = useDashboardRecentOrders()
  const { data: topProducts = [], isLoading: productsLoading } = useDashboardTopProducts()
  const { data: lowStock = [], isLoading: stockLoading } = useDashboardLowStock()
  const { data: chartData = [], isLoading: chartLoading } = useDashboardRevenueChart()

  const isLoading = statsLoading || ordersLoading || productsLoading || stockLoading || chartLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
      </div>
    )
  }

  return (
    <div>
      <div className="pt-2 pb-6">
        <h2 className="text-xl text-white flex items-center gap-2">Good morning, Tahir 👋</h2>
        <p className="text-[13px] text-[#9A9A9A] mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<DollarSign size={20} />}
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          sub={`+${formatCurrency(stats?.revenueThisMonth ?? 0)}`}
          color="text-[#C6FF3D]"
        />
        <StatCard
          icon={<ShoppingCart size={20} />}
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          sub={`+${stats?.ordersThisMonth ?? 0}`}
          color="text-[#C6FF3D]"
        />
        <StatCard
          icon={<Package size={20} />}
          label="Products"
          value={stats?.totalProducts ?? 0}
          sub={`${stats?.pendingOrders ?? 0} pending orders`}
          color="text-[#C6FF3D]"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Customers"
          value={stats?.totalCustomers ?? 0}
          sub={stats?.lowStockCount ? `${stats.lowStockCount} low stock alerts` : 'All stock OK'}
          color="text-[#C6FF3D]"
          alert={(stats?.lowStockCount ?? 0) > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Recent Orders */}
          <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5">
              <h3 className="text-[14px] font-semibold text-white">Recent Orders</h3>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/orders' as any}
                className="text-[12px] font-semibold text-[#9A9A9A] hover:text-[#C6FF3D] flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center flex-1 flex flex-col items-center justify-center">
                <ShoppingCart size={32} className="mx-auto text-white/10 mb-3" />
                <p className="text-[13px] text-[#9A9A9A]">No recent orders found</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentOrders.map((order: RecentOrder) => {
                  const badge = STATUS_BADGES[order.status]
                  return (
                    <Link
                      key={order.id}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      to={`/admin/orders/${order.id}` as any}
                      className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate mb-1">
                          {order.customerName ?? 'Guest'}
                        </p>
                        <p className="text-[11px] text-[#9A9A9A]">
                          #{order.id.substring(0, 8).toUpperCase()} ·{' '}
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[14px] font-bold text-white">
                          {formatCurrency(order.total)}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-[4px] ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5">
              <h3 className="text-[14px] font-semibold text-white">Top Products</h3>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/products' as any}
                className="text-[12px] font-semibold text-[#9A9A9A] hover:text-[#C6FF3D] flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {topProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Package size={32} className="mx-auto text-white/10 mb-3" />
                <p className="text-[13px] text-[#9A9A9A]">No sales data yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {topProducts.map((product: TopProduct, idx: number) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-[12px] font-bold text-[#9A9A9A] w-5 text-center">
                      {idx + 1}
                    </span>
                    <div className="w-[44px] h-[44px] bg-[#1A1A1A] rounded-[8px] overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <img
                          src={getProductImageUrl(product.image) || ''}
                          alt=""
                          className="w-full h-full object-contain p-0.5"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={14} className="text-[#9A9A9A]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 ml-2">
                      <p className="text-[13px] font-semibold text-white truncate mb-1">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-[#9A9A9A]">{product.totalSold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold text-white mb-1">
                        {formatCurrency(product.revenue)}
                      </p>
                      <p className="text-[11px] text-[#9A9A9A]">
                        {formatCurrency(product.base_price)} ea
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Revenue Summary */}
          <div className="bg-[#0D0D0D] border-l-2 border-l-[#C6FF3D] border-t border-b border-r border-white/5 rounded-[12px] p-5 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[14px] font-semibold text-white">Sales Overview</h3>
              <select className="bg-transparent text-[#9A9A9A] text-[12px] outline-none border-none cursor-pointer">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-[28px] font-black text-white">
                  {formatCurrency(stats?.totalRevenue ?? 0)}
                </span>
                <span className="text-[12px] text-[#C6FF3D] font-bold">+12%</span>
              </div>
            </div>
            {/* Revenue Chart */}
            <div className="mt-4">
              <RevenueChart data={chartData} />
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div
            className={`bg-[#0D0D0D] border ${lowStock.length > 0 ? 'border-l-2 border-l-red-500 border-white/5' : 'border-white/5'} rounded-[12px] overflow-hidden`}
          >
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5">
              <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                Low Stock
              </h3>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/products' as any}
                className="text-[12px] font-semibold text-[#0D0D0D] hover:text-[#C6FF3D] flex items-center gap-1 transition-colors"
              >
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            {lowStock.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <TrendingUp size={28} className="text-[#9A9A9A] mb-3" />
                <p className="text-[13px] text-[#9A9A9A]">All stock levels OK</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {lowStock.map((item: LowStockItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white truncate mb-1">
                        {item.product_name}
                      </p>
                      <p className="text-[11px] text-[#9A9A9A]">{item.variant_info}</p>
                    </div>
                    <span
                      className={`text-[12px] font-bold px-2 py-1 rounded-[4px] ${
                        item.stock_qty === 0
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {item.stock_qty} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-5 md:p-6">
            <h3 className="text-[14px] font-semibold text-white mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/products/new' as any}
                className="flex items-center gap-4 p-3 rounded-[8px] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 rounded-[8px] bg-[#C6FF3D]/10 flex items-center justify-center">
                  <Package size={16} className="text-[#C6FF3D]" />
                </div>
                <span className="text-[13px] font-semibold text-white">Add New Product</span>
              </Link>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/orders' as any}
                className="flex items-center gap-4 p-3 rounded-[8px] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 rounded-[8px] bg-[#C6FF3D]/10 flex items-center justify-center">
                  <Clock size={16} className="text-[#C6FF3D]" />
                </div>
                <span className="text-[13px] font-semibold text-white">
                  {stats?.pendingOrders ? `Review ${stats.pendingOrders} Pending` : 'View Orders'}
                </span>
              </Link>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/categories' as any}
                className="flex items-center gap-4 p-3 rounded-[8px] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
              >
                <div className="w-10 h-10 rounded-[8px] bg-[#C6FF3D]/10 flex items-center justify-center">
                  <TrendingUp size={16} className="text-[#C6FF3D]" />
                </div>
                <span className="text-[13px] font-semibold text-white">Manage Categories</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  alert,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub: string
  color: string
  alert?: boolean
}) {
  return (
    <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-5 h-[140px] flex flex-col justify-between hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-[8px] bg-[#C6FF3D]/10 flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-[#9A9A9A]">{label}</span>
          <p className="text-[28px] font-bold text-white mt-1 leading-none tracking-tight">
            {value}
          </p>
        </div>
      </div>
      <p className={`text-[12px] ${alert ? 'text-red-500 font-semibold' : 'text-[#C6FF3D]'}`}>
        {sub}
      </p>
    </div>
  )
}

// ─── Revenue Chart ────────────────────────────────────────────────────────────

function RevenueChart({ data }: { data: { label: string; revenue: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[120px] bg-[#FAFAFA] rounded-[8px] flex items-center justify-center text-[12px] text-[#9A9A9A]">
        No data
      </div>
    )
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 100) // minimum scale of 100

  return (
    <div className="h-[140px] flex items-end justify-between gap-1 w-full pb-2">
      {data.map((item, idx) => {
        const heightPct = Math.max((item.revenue / maxRevenue) * 100, 4) // min 4% height so it's visible
        return (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center gap-2 group w-full h-full justify-end relative"
          >
            {/* Tooltip */}
            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#C6FF3D] text-[#0D0D0D] text-[11px] font-bold py-1.5 px-3 rounded-[4px] pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-lg">
              {formatCurrency(item.revenue)}
            </div>

            <div
              className="w-full bg-[#C6FF3D]/20 hover:bg-[#C6FF3D] rounded-t-[4px] transition-all duration-300 ease-out relative group-hover:z-10"
              style={{ height: `${heightPct}%` }}
            />
            <span className="text-[10px] font-semibold text-[#4A4A4A] mt-1">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
