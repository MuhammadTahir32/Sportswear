import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Eye, Loader2, ShoppingCart } from 'lucide-react'
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

function AdminOrderListPage(): React.JSX.Element {
  const [filters, setFilters] = useState<AdminOrderFilters>({
    sortBy: 'created_at',
    sortDir: 'desc',
  })

  const { data: orders = [], isLoading } = useAdminOrders(filters)

  return (
    <div>
      <div className="pt-2 pb-6">
        <h2 className="text-2xl font-bold text-white">Orders</h2>
        <p className="text-[14px] text-[#9A9A9A] mt-1">Track and manage customer orders.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = (filters.status ?? '') === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setFilters((prev) => ({ ...prev, status: opt.value || undefined }))}
              className={`text-[12px] font-bold uppercase tracking-wider px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                isActive ? 'bg-[#C6FF3D] text-[#0D0D0D]' : 'text-[#9A9A9A] hover:text-white'
              }`}
            >
              {opt.label === 'All Statuses' ? 'All' : opt.label}
            </button>
          )
        })}
      </div>

      {/* Table Container */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[16px] overflow-hidden min-h-[500px] flex flex-col">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <ShoppingCart size={42} className="text-white/10 mb-3" />
            <h3 className="text-[15px] font-bold text-white mb-1">No orders found</h3>
            <p className="text-[13px] text-[#9A9A9A]">You don't have any orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A]">
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => {
                  const date = new Date(order.created_at)
                  const customerName =
                    order.shipping_address?.full_name ?? order.profile?.full_name ?? '—'

                  const bgColors: Record<string, string> = {
                    pending: 'bg-yellow-500/10 text-yellow-500',
                    processing: 'bg-orange-500/10 text-orange-500',
                    shipped: 'bg-blue-500/10 text-blue-500',
                    delivered: 'bg-green-500/10 text-[#C6FF3D]',
                    cancelled: 'bg-red-500/10 text-red-500',
                    refunded: 'bg-gray-500/10 text-gray-500',
                  }
                  const pillClass = bgColors[order.status] || 'bg-white/10 text-white'

                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <Link
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          to={`/admin/orders/${order.id}` as any}
                          className="text-[13px] font-semibold text-[#9A9A9A] hover:text-[#C6FF3D] transition-colors"
                        >
                          #ORD-{order.id.substring(0, 4).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-white font-medium">{customerName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-medium text-white">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-[6px] ${pillClass}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[12px] font-medium text-white">
                          {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          ,{' '}
                          {date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            to={`/admin/orders/${order.id}` as any}
                            className="p-1 text-[#9A9A9A] hover:text-[#C6FF3D] transition-colors"
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
