import { createFileRoute, Link } from '@tanstack/react-router'
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Clock,
  AlertTriangle,
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
} from '@/hooks/useAdminDashboard'
import { formatCurrency } from '@/lib/cartCalculations'
import type { OrderStatus } from '@/lib/types'

export const Route = createFileRoute('/_admin/dashboard')({
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
      <h2
        className="text-[22px] font-black text-[#0D0D0D] uppercase tracking-tight mb-6"
        style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
      >
        Dashboard
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<DollarSign size={20} />}
          label="Total Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          sub={`${formatCurrency(stats?.revenueThisMonth ?? 0)} this month`}
          color="text-[#5A8A00]"
        />
        <StatCard
          icon={<ShoppingCart size={20} />}
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          sub={`${stats?.ordersThisMonth ?? 0} this month`}
          color="text-[#0D0D0D]"
        />
        <StatCard
          icon={<Package size={20} />}
          label="Products"
          value={stats?.totalProducts ?? 0}
          sub={`${stats?.pendingOrders ?? 0} pending orders`}
          color="text-[#0D0D0D]"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Customers"
          value={stats?.totalCustomers ?? 0}
          sub={stats?.lowStockCount ? `${stats.lowStockCount} low stock alerts` : 'All stock OK'}
          color="text-[#0D0D0D]"
          alert={(stats?.lowStockCount ?? 0) > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Recent Orders */}
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#EFEFEF]">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                Recent Orders
              </h3>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/orders' as any}
                className="text-[12px] font-semibold text-[#0D0D0D] hover:text-[#C6FF3D] flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={12} />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart size={24} className="mx-auto text-[#E0E0E0] mb-2" />
                <p className="text-[13px] text-[#9A9A9A]">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[#EFEFEF]">
                {recentOrders.map((order) => {
                  const badge = STATUS_BADGES[order.status]
                  return (
                    <Link
                      key={order.id}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      to={`/admin/orders/${order.id}` as any}
                      className="flex items-center justify-between px-5 py-3 hover:bg-[#FAFAFA] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0D0D0D] truncate">
                          {order.customerName ?? 'Guest'}
                        </p>
                        <p className="text-[11px] text-[#9A9A9A]">
                          #{order.id.substring(0, 8).toUpperCase()} ·{' '}
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                        <span className="text-[13px] font-bold text-[#0D0D0D]">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#EFEFEF]">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                Top Products
              </h3>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/products' as any}
                className="text-[12px] font-semibold text-[#0D0D0D] hover:text-[#C6FF3D] flex items-center gap-1 transition-colors"
              >
                View All <ArrowRight size={12} />
              </Link>
            </div>
            {topProducts.length === 0 ? (
              <div className="p-8 text-center">
                <Package size={24} className="mx-auto text-[#E0E0E0] mb-2" />
                <p className="text-[13px] text-[#9A9A9A]">No sales data yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[#EFEFEF]">
                {topProducts.map((product, idx) => (
                  <div key={product.id} className="flex items-center gap-4 px-5 py-3">
                    <span className="text-[12px] font-bold text-[#9A9A9A] w-5 text-center">
                      {idx + 1}
                    </span>
                    <div className="w-[40px] h-[40px] bg-[#F0F0F0] rounded-[6px] overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          className="w-full h-full object-contain p-0.5"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={14} className="text-[#9A9A9A]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#0D0D0D] truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-[#9A9A9A]">{product.totalSold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#0D0D0D]">
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
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
              Revenue Summary
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#4A4A4A]">All Time</span>
                <span className="text-[15px] font-bold text-[#0D0D0D]">
                  {formatCurrency(stats?.totalRevenue ?? 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#4A4A4A]">This Month</span>
                <span className="text-[15px] font-bold text-[#5A8A00]">
                  {formatCurrency(stats?.revenueThisMonth ?? 0)}
                </span>
              </div>
              <div className="h-px bg-[#EFEFEF]" />
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#4A4A4A]">Avg. Order Value</span>
                <span className="text-[13px] font-semibold text-[#0D0D0D]">
                  {(stats?.totalOrders ?? 0) > 0
                    ? formatCurrency((stats?.totalRevenue ?? 0) / (stats?.totalOrders ?? 1))
                    : '$0.00'}
                </span>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="mt-6 pt-6 border-t border-[#EFEFEF]">
              <h4 className="text-[12px] font-bold text-[#9A9A9A] uppercase tracking-wider mb-4">
                Last 7 Days
              </h4>
              <RevenueChart data={chartData} />
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#EFEFEF]">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500" />
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
              <div className="p-8 text-center">
                <TrendingUp size={24} className="mx-auto text-green-400 mb-2" />
                <p className="text-[13px] text-[#9A9A9A]">All stock levels OK</p>
              </div>
            ) : (
              <div className="divide-y divide-[#EFEFEF]">
                {lowStock.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#0D0D0D] truncate">
                        {item.product_name}
                      </p>
                      <p className="text-[11px] text-[#9A9A9A]">{item.variant_info}</p>
                    </div>
                    <span
                      className={`text-[13px] font-bold ${
                        item.stock_qty === 0 ? 'text-red-500' : 'text-yellow-600'
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
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/products/new' as any}
                className="flex items-center gap-3 p-3 rounded-[8px] hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#C6FF3D]/20 flex items-center justify-center">
                  <Package size={14} className="text-[#0D0D0D]" />
                </div>
                <span className="text-[13px] font-semibold text-[#0D0D0D]">Add New Product</span>
              </Link>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/orders' as any}
                className="flex items-center gap-3 p-3 rounded-[8px] hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#C6FF3D]/20 flex items-center justify-center">
                  <Clock size={14} className="text-[#0D0D0D]" />
                </div>
                <span className="text-[13px] font-semibold text-[#0D0D0D]">
                  {stats?.pendingOrders ? `Review ${stats.pendingOrders} Pending` : 'View Orders'}
                </span>
              </Link>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/categories' as any}
                className="flex items-center gap-3 p-3 rounded-[8px] hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#C6FF3D]/20 flex items-center justify-center">
                  <TrendingUp size={14} className="text-[#0D0D0D]" />
                </div>
                <span className="text-[13px] font-semibold text-[#0D0D0D]">Manage Categories</span>
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
    <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-[10px] bg-[#F0F0F0] flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
          {label}
        </span>
      </div>
      <p className="text-[24px] font-bold text-[#0D0D0D] mb-1">{value}</p>
      <p className={`text-[12px] ${alert ? 'text-red-500 font-semibold' : 'text-[#9A9A9A]'}`}>
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
    <div className="h-[120px] flex items-end justify-between gap-2">
      {data.map((item, idx) => {
        const heightPct = Math.max((item.revenue / maxRevenue) * 100, 4) // min 4% height so it's visible
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full flex-1 flex items-end rounded-t-[4px] relative">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0D0D0D] text-white text-[10px] font-bold py-1 px-2 rounded-[4px] pointer-events-none transition-opacity z-10 whitespace-nowrap">
                {formatCurrency(item.revenue)}
              </div>

              <div
                className="w-full bg-[#C6FF3D] rounded-[4px] transition-all duration-500 ease-out group-hover:bg-[#b0e633]"
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-[#9A9A9A]">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}
