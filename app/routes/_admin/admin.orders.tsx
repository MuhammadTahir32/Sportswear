import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Filter, ArrowUpDown, Eye, Loader2, ShoppingCart } from 'lucide-react'
import { useAdminOrders, type AdminOrderFilters } from '@/hooks/useAdminOrders'
import { formatCurrency } from '@/lib/cartCalculations'
import type { OrderStatus } from '@/lib/types'

export const Route = createFileRoute('/_admin/admin/orders')({
  component: AdminOrderListPage,
})

const STATUS_OPTIONS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  paid: 'bg-blue-500/10 text-blue-500',
  processing: 'bg-indigo-500/10 text-indigo-500',
  shipped: 'bg-purple-500/10 text-purple-500',
  delivered: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
  refunded: 'bg-white/10 text-[#9A9A9A]',
}

function AdminOrderListPage(): React.JSX.Element {
  const [filters, setFilters] = useState<AdminOrderFilters>({
    sortBy: 'created_at',
    sortDir: 'desc',
  })
  const [searchInput, setSearchInput] = useState('')

  const { data: orders = [], isLoading } = useAdminOrders(filters)

  function handleSearch() {
    setFilters((prev) => ({ ...prev, search: searchInput || undefined }))
  }

  function toggleSort(field: 'created_at' | 'total') {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDir: prev.sortBy === field && prev.sortDir === 'desc' ? 'asc' : 'desc',
    }))
  }

  // Stats
  const totalOrders = orders.length
  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Orders</h2>
          <p className="text-[13px] text-[#9A9A9A]">Track and manage customer orders.</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-5 border-l-2 border-l-[#C6FF3D]">
          <p className="text-[12px] text-[#9A9A9A] mb-1">Total Orders</p>
          <p className="text-[24px] font-bold text-white leading-none">{totalOrders}</p>
        </div>
        <div
          className={`bg-[#0D0D0D] border rounded-[12px] p-5 border-l-2 ${pendingCount > 0 ? 'border-l-yellow-500 border-white/5' : 'border-l-white/5 border-white/5'}`}
        >
          <p className="text-[12px] text-[#9A9A9A] mb-1">Pending</p>
          <p
            className={`text-[24px] font-bold leading-none ${pendingCount > 0 ? 'text-yellow-500' : 'text-white'}`}
          >
            {pendingCount}
          </p>
        </div>
        <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-5 border-l-2 border-l-green-500">
          <p className="text-[12px] text-[#9A9A9A] mb-1">Revenue</p>
          <p className="text-[24px] font-bold text-white leading-none">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by order ID or customer name…"
            className="w-full h-[40px] pl-10 pr-4 bg-[#0D0D0D] border border-white/5 rounded-[8px] text-[13px] text-white placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#C6FF3D]/50 transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
          <select
            value={filters.status ?? ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: (e.target.value || undefined) as OrderStatus | undefined,
              }))
            }
            className="h-[40px] pl-9 pr-8 bg-[#0D0D0D] border border-white/5 rounded-[8px] text-[13px] text-white focus:outline-none focus:border-[#C6FF3D]/50 appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <ShoppingCart size={48} className="text-white/10 mb-4" />
            <h3 className="text-[16px] font-bold text-white mb-1">No orders found</h3>
            <p className="text-[13px] text-[#9A9A9A]">You don't have any orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Order
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Status
                  </th>
                  <th
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] cursor-pointer select-none hover:text-white"
                    onClick={() => toggleSort('total')}
                  >
                    <span className="flex items-center gap-1">
                      Total
                      <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] cursor-pointer select-none hover:text-white"
                    onClick={() => toggleSort('created_at')}
                  >
                    <span className="flex items-center gap-1">
                      Date
                      <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => {
                  const date = new Date(order.created_at)
                  const customerName =
                    order.shipping_address?.full_name ?? order.profile?.full_name ?? '—'

                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-5 py-4">
                        <span className="text-[13px] font-mono font-semibold text-white">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[13px] text-white font-medium">{customerName}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px] ${STATUS_COLORS[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[13px] font-bold text-white">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[12px] text-[#9A9A9A]">
                          {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            to={`/admin/orders/${order.id}` as any}
                            className="p-2 text-[#9A9A9A] hover:text-[#C6FF3D] hover:bg-white/10 rounded-[6px] transition-colors"
                            title="View Order"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
