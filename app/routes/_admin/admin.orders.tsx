import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Filter, ArrowUpDown, Eye, Loader2 } from 'lucide-react'
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
  pending: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-blue-50 text-blue-700',
  processing: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
  refunded: 'bg-gray-100 text-gray-600',
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
        <h2 className="text-[20px] font-bold text-[#0D0D0D]">Orders</h2>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-[10px] border border-[#E0E0E0] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-1">
            Total Orders
          </p>
          <p className="text-[24px] font-bold text-[#0D0D0D]">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-[10px] border border-[#E0E0E0] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-1">
            Pending
          </p>
          <p className="text-[24px] font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-[10px] border border-[#E0E0E0] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-1">
            Revenue
          </p>
          <p className="text-[24px] font-bold text-[#5A8A00]">{formatCurrency(totalRevenue)}</p>
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
            className="w-full h-[38px] pl-10 pr-4 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#0D0D0D] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#C6FF3D] transition-colors"
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
            className="h-[38px] pl-9 pr-8 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#C6FF3D] appearance-none cursor-pointer"
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
      <div className="bg-white border border-[#E0E0E0] rounded-[12px] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[14px] text-[#9A9A9A]">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EFEFEF] bg-[#FAFAFA]">
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
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] cursor-pointer select-none hover:text-[#0D0D0D]"
                    onClick={() => toggleSort('total')}
                  >
                    <span className="flex items-center gap-1">
                      Total
                      <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] cursor-pointer select-none hover:text-[#0D0D0D]"
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
              <tbody className="divide-y divide-[#EFEFEF]">
                {orders.map((order) => {
                  const date = new Date(order.created_at)
                  const customerName =
                    order.shipping_address?.full_name ?? order.profile?.full_name ?? '—'

                  return (
                    <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-[13px] font-mono font-semibold text-[#0D0D0D]">
                          #{order.id.substring(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[13px] text-[#0D0D0D]">{customerName}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[13px] font-semibold text-[#0D0D0D]">
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
                        <Link
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          to={`/admin/orders/${order.id}` as any}
                          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#9A9A9A] hover:text-[#C6FF3D] transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </Link>
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
