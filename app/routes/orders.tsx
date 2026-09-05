import { createFileRoute } from '@tanstack/react-router'
import { Package, ArrowRight, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/cartCalculations'
import type { OrderStatus } from '@/lib/types'

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
})

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  paid: { label: 'Paid', bg: 'bg-blue-50', text: 'text-blue-700' },
  processing: { label: 'Processing', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  shipped: { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-700' },
  delivered: { label: 'Delivered', bg: 'bg-green-50', text: 'text-green-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600' },
  refunded: { label: 'Refunded', bg: 'bg-gray-100', text: 'text-gray-600' },
}

function OrdersPage(): React.JSX.Element {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: orders = [], isLoading: ordersLoading } = useOrders(user?.id)

  const isLoading = authLoading || ordersLoading

  // Not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
        <Package size={48} className="text-[#9A9A9A]" />
        <div className="text-center">
          <h2 className="text-[24px] font-bold text-[#0D0D0D] mb-2">Sign in to view orders</h2>
          <p className="text-[14px] text-[#9A9A9A]">
            You need to be signed in to view your order history
          </p>
        </div>
        <a href="/sign-in">
          <Button variant="primary" size="lg">
            Sign In
          </Button>
        </a>
      </div>
    )
  }

  return (
    <>
      <title>My Orders — StrideWear</title>
      <meta
        name="description"
        content="View your StrideWear order history and track your deliveries"
      />

      <div className="w-full max-w-[900px] mx-auto px-6 md:px-16 py-12">
        <h1 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[36px] md:text-[48px] uppercase tracking-tight leading-none mb-8">
          My Orders
        </h1>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-[120px] bg-[#F7F7F7] rounded-[12px]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
            <div className="w-[80px] h-[80px] rounded-full bg-[#F7F7F7] flex items-center justify-center">
              <Package size={32} className="text-[#9A9A9A]" />
            </div>
            <div>
              <p className="text-[18px] font-bold text-[#0D0D0D] mb-1">No orders yet</p>
              <p className="text-[14px] text-[#9A9A9A]">
                Your order history will appear here once you place your first order
              </p>
            </div>
            <a href="/products">
              <Button variant="primary" size="md">
                Start Shopping
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status]
              const date = new Date(order.created_at)
              const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })

              return (
                <a
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block p-5 bg-white border border-[#E0E0E0] rounded-[12px] hover:border-[#C6FF3D] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[14px] font-bold text-[#0D0D0D]">
                          Order #{order.id.substring(0, 8).toUpperCase()}
                        </span>
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${status.bg} ${status.text}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-[#9A9A9A]">
                        <Clock size={12} />
                        {formattedDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[18px] font-bold text-[#0D0D0D]">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping address summary */}
                  <div className="text-[12px] text-[#9A9A9A] mb-3">
                    Ship to: {order.shipping_address.full_name}, {order.shipping_address.city}
                  </div>

                  {/* Tracking */}
                  {order.tracking_number && (
                    <div className="text-[12px] text-[#5A8A00] font-medium">
                      Tracking: {order.tracking_number}
                    </div>
                  )}

                  <div className="flex items-center justify-end mt-2">
                    <span className="text-[12px] font-semibold text-[#9A9A9A] group-hover:text-[#C6FF3D] transition-colors flex items-center gap-1">
                      View Details
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
