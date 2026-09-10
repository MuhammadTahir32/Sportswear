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

  const isLoading = statsLoading || ordersLoading || productsLoading || stockLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
      </div>
    )
  }

  return (
    <div>
      <div className="pt-2 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Good morning, Tahir 👋
          </h2>
          <p className="text-[14px] text-[#9A9A9A] mt-1">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="text-[13px] text-[#9A9A9A] font-medium pr-2">Today, Sep 9, 2025</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<DollarSign size={18} strokeWidth={2.5} />}
          label="Total Sales"
          value={formatCurrency(2843)}
          trend="+ 12%"
          color="text-[#C6FF3D]"
        />
        <StatCard
          icon={<ShoppingCart size={18} strokeWidth={2.5} />}
          label="Orders"
          value={124}
          trend="+ 8%"
          color="text-[#C6FF3D]"
        />
        <StatCard
          icon={<Users size={18} strokeWidth={2.5} />}
          label="Total Customers"
          value={1204}
          trend="+ 15%"
          color="text-[#C6FF3D]"
        />
        <StatCard
          icon={<TrendingUp size={18} strokeWidth={2.5} />}
          label="Conversion Rate"
          value="3.24%"
          trend="+ 2%"
          color="text-[#C6FF3D]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Sales Overview */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[16px] p-6 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[15px] font-bold text-white">Sales Overview</h3>
              <div className="flex items-center gap-2 text-[#9A9A9A] text-[12px] font-semibold">
                Last: <span className="text-white">7 days</span>
              </div>
            </div>

            {/* Y-axis and Chart */}
            <div className="flex-1 flex gap-4 relative">
              <div className="flex flex-col justify-between text-[11px] font-bold text-[#9A9A9A] pb-6">
                <span>$800</span>
                <span>$600</span>
                <span>$400</span>
                <span>$200</span>
                <span>$0</span>
              </div>
              <div className="flex-1 relative border-b border-white/5">
                <svg
                  viewBox="0 0 800 300"
                  className="w-full h-full preserveAspectRatio-none"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  <line
                    x1="0"
                    y1="0"
                    x2="800"
                    y2="0"
                    stroke="rgba(255,255,255,0.02)"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="75"
                    x2="800"
                    y2="75"
                    stroke="rgba(255,255,255,0.02)"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="150"
                    x2="800"
                    y2="150"
                    stroke="rgba(255,255,255,0.02)"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1="225"
                    x2="800"
                    y2="225"
                    stroke="rgba(255,255,255,0.02)"
                    strokeWidth="1"
                  />

                  {/* Area Chart */}
                  <path
                    d="M 0 300 L 0 250 Q 100 200 200 220 T 400 150 T 600 180 T 800 100 L 800 300 Z"
                    fill="url(#salesGrad)"
                    opacity="0.3"
                  />
                  <path
                    d="M 0 250 Q 100 200 200 220 T 400 150 T 600 180 T 800 100"
                    fill="none"
                    stroke="#C6FF3D"
                    strokeWidth="3"
                  />
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* X-axis labels */}
                <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[11px] font-bold text-[#9A9A9A]">
                  <span>Sep 3</span>
                  <span>Sep 4</span>
                  <span>Sep 5</span>
                  <span>Sep 6</span>
                  <span>Sep 7</span>
                  <span>Sep 8</span>
                  <span>Sep 9</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-[#141414] rounded-[16px] flex flex-col min-h-[300px] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-transparent">
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

        {/* Right Column - Recent Orders */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[16px] flex flex-col h-[400px] overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-transparent">
              <h3 className="text-[15px] font-bold text-white">Recent Orders</h3>
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
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {recentOrders.map((order: RecentOrder) => {
                  const badge = STATUS_BADGES[order.status]
                  // Hardcode some colors for the pill background instead of light classes
                  const bgColors: Record<string, string> = {
                    pending: 'bg-yellow-500/10 text-yellow-500',
                    processing: 'bg-orange-500/10 text-orange-500',
                    shipped: 'bg-blue-500/10 text-blue-500',
                    delivered: 'bg-green-500/10 text-[#C6FF3D]',
                  }
                  const pillClass = bgColors[order.status] || 'bg-white/10 text-white'

                  return (
                    <Link
                      key={order.id}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      to={`/admin/orders/${order.id}` as any}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-[8px] bg-white/5 flex items-center justify-center shrink-0">
                        <Package size={20} className="text-[#9A9A9A]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-white truncate mb-1">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-[#9A9A9A] font-semibold truncate">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          ,{' '}
                          {new Date(order.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-[13px] font-bold text-white">
                          {formatCurrency(order.total)}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-[6px] ${pillClass}`}
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

          {/* Low Stock Alerts */}
          <div
            className={`bg-[#141414] ${lowStock.length > 0 ? 'border-l-2 border-l-red-500' : ''} rounded-[16px] overflow-hidden`}
          >
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5">
              <h3 className="text-[14px] font-semibold text-white flex items-center gap-2">
                Low Stock
              </h3>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={'/admin/products' as any}
                className="text-[12px] font-semibold text-[#9A9A9A] hover:text-[#C6FF3D] flex items-center gap-1 transition-colors"
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
          <div className="bg-[#141414] rounded-[16px] p-5 md:p-6">
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
  trend,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  trend: string
  color: string
}) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[16px] p-5 h-[120px] flex items-center justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className="flex items-start gap-4 z-10">
        <div
          className={`w-[42px] h-[42px] rounded-[10px] bg-[#C6FF3D]/10 flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
        <div className="flex flex-col mt-[-2px]">
          <span className="text-[12px] font-bold text-[#9A9A9A] mb-1">{label}</span>
          <p className="text-[24px] font-bold text-white leading-none tracking-tight mb-2">
            {value}
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} className="text-[#C6FF3D]" strokeWidth={3} />
            <span className="text-[11px] font-bold text-[#C6FF3D]">{trend}</span>
          </div>
        </div>
      </div>

      {/* Sparkline placeholder */}
      <div className="absolute right-0 bottom-0 w-[45%] h-[60%] opacity-80 pointer-events-none">
        <svg
          viewBox="0 0 100 50"
          className="w-full h-full preserveAspectRatio-none"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 50 L 0 35 Q 20 20 40 30 T 80 15 L 100 5 L 100 50 Z"
            fill="url(#sparkGrad)"
            opacity="0.3"
          />
          <path
            d="M 0 35 Q 20 20 40 30 T 80 15 L 100 5"
            fill="none"
            stroke="#C6FF3D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C6FF3D" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#C6FF3D" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
