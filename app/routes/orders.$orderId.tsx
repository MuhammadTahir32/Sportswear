import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOrderDetail, useOrderStatusHistory } from '@/hooks/useOrders'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/cartCalculations'
import { supabase } from '@/lib/supabase'
import type { OrderStatus } from '@/lib/types'

export const Route = createFileRoute('/orders/$orderId')({
  component: OrderDetailPage,
})

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: <Clock size={16} />,
  },
  paid: {
    label: 'Paid',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: <CheckCircle2 size={16} />,
  },
  processing: {
    label: 'Processing',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    icon: <Package size={16} />,
  },
  shipped: {
    label: 'Shipped',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: <Truck size={16} />,
  },
  delivered: {
    label: 'Delivered',
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: <CheckCircle2 size={16} />,
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-50',
    text: 'text-red-600',
    icon: <XCircle size={16} />,
  },
  refunded: {
    label: 'Refunded',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    icon: <XCircle size={16} />,
  },
}

const STATUS_FLOW: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered']

// ─── Status Timeline Component (Task 5.8) ─────────────────────────────────────

function StatusTimeline({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const { data: history = [] } = useOrderStatusHistory(orderId)

  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'refunded'

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-6">
      <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-6">
        Order Progress
      </h3>

      {/* Visual progress bar */}
      {!isCancelled && (
        <div className="flex items-center mb-8">
          {STATUS_FLOW.map((status, idx) => {
            const currentIdx = STATUS_FLOW.indexOf(currentStatus)
            const isCompleted = idx <= currentIdx
            const isLast = idx === STATUS_FLOW.length - 1
            const config = STATUS_CONFIG[status]

            return (
              <div key={status} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-[#C6FF3D] text-[#0D0D0D]' : 'bg-[#F0F0F0] text-[#9A9A9A]'
                    }`}
                  >
                    {config.icon}
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${
                      isCompleted ? 'text-[#0D0D0D]' : 'text-[#9A9A9A]'
                    }`}
                  >
                    {config.label}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 h-[3px] mx-2 rounded-full mt-[-18px] ${
                      idx < currentIdx ? 'bg-[#C6FF3D]' : 'bg-[#E0E0E0]'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Cancelled badge */}
      {isCancelled && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-[10px] mb-6">
          <XCircle size={20} className="text-red-500" />
          <span className="text-[14px] font-semibold text-red-600">
            This order has been {currentStatus}
          </span>
        </div>
      )}

      {/* Detailed history log */}
      {history.length > 0 && (
        <div className="border-t border-[#EFEFEF] pt-5">
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
            Status History
          </h4>
          <div className="flex flex-col gap-0">
            {history.map((entry, idx) => {
              const config = STATUS_CONFIG[entry.status]
              const date = new Date(entry.changed_at)
              const isLast = idx === history.length - 1

              return (
                <div key={entry.id} className="flex gap-3">
                  {/* Timeline dot + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                        isLast ? 'bg-[#C6FF3D]' : 'bg-[#E0E0E0]'
                      }`}
                    />
                    {!isLast && <div className="w-px flex-1 bg-[#E0E0E0] min-h-[28px]" />}
                  </div>

                  {/* Content */}
                  <div className="pb-4">
                    <span
                      className={`text-[12px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}
                    >
                      {config.label}
                    </span>
                    <p className="text-[11px] text-[#9A9A9A] mt-1">
                      {date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' at '}
                      {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Order Detail Page ────────────────────────────────────────────────────────

function OrderDetailPage(): React.JSX.Element {
  const { orderId } = Route.useParams()
  const { user, isLoading: authLoading } = useAuth()
  const { data: order, isLoading: orderLoading, refetch } = useOrderDetail(orderId)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const isLoading = authLoading || orderLoading

  // Task 5.9 — Cancel order
  async function handleCancelOrder() {
    if (!order || !user) return
    if (order.status !== 'pending') {
      setCancelError('Only pending orders can be cancelled')
      return
    }

    setCancelling(true)
    setCancelError(null)

    // Update order status
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', order.id)
      .eq('user_id', user.id)

    if (updateErr) {
      setCancelError('Failed to cancel order. Please try again.')
      setCancelling(false)
      return
    }

    // Add status history entry
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      status: 'cancelled',
      changed_at: new Date().toISOString(),
    })

    // Restore stock for each item
    for (const item of order.order_items) {
      await supabase
        .from('product_variants')
        .update({ stock_qty: item.variant.stock_qty + item.quantity })
        .eq('id', item.variant_id)
    }

    setCancelling(false)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#9A9A9A]" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <h2 className="text-[24px] font-bold text-[#0D0D0D]">Order not found</h2>
        <a href="/orders">
          <Button variant="primary" size="md">
            Back to Orders
          </Button>
        </a>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[order.status]
  const addr = order.shipping_address

  return (
    <>
      <title>Order #{order.id.substring(0, 8).toUpperCase()} — StrideWear</title>

      <div className="w-full max-w-[900px] mx-auto px-6 md:px-16 py-12">
        {/* Back link */}
        <a
          href="/orders"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </a>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[28px] md:text-[36px] uppercase tracking-tight leading-none mb-2">
              Order #{order.id.substring(0, 8).toUpperCase()}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}
              >
                {statusConfig.label}
              </span>
              <span className="text-[13px] text-[#9A9A9A]">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
          <span className="text-[24px] font-bold text-[#0D0D0D]">
            {formatCurrency(order.total)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Status Timeline (Task 5.8) */}
            <StatusTimeline orderId={order.id} currentStatus={order.status} />

            {/* Items */}
            <div className="bg-white border border-[#E0E0E0] rounded-[12px] overflow-hidden">
              <div className="p-5 border-b border-[#EFEFEF]">
                <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                  Items ({order.order_items.length})
                </h3>
              </div>
              <div className="divide-y divide-[#EFEFEF]">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-5">
                    <div className="w-[56px] h-[56px] bg-[#F0F0F0] rounded-[8px] flex items-center justify-center flex-shrink-0">
                      <Package size={20} className="text-[#9A9A9A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#0D0D0D] truncate">
                        {item.variant.product.name}
                      </p>
                      <p className="text-[12px] text-[#9A9A9A]">
                        {item.variant.size} / {item.variant.color} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-[14px] font-bold text-[#0D0D0D]">
                      {formatCurrency(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Price breakdown */}
            <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
                Payment Summary
              </h3>
              <div className="flex flex-col gap-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#4A4A4A]">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[#5A8A00]">
                    <span>Discount</span>
                    <span className="font-semibold">−{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#4A4A4A]">Tax</span>
                  <span className="font-semibold">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A4A4A]">Shipping</span>
                  <span className="font-semibold">
                    {order.shipping_fee === 0 ? 'FREE' : formatCurrency(order.shipping_fee)}
                  </span>
                </div>
                <div className="h-px bg-[#E0E0E0] my-1" />
                <div className="flex justify-between">
                  <span className="text-[15px] font-bold text-[#0D0D0D]">Total</span>
                  <span className="text-[16px] font-bold text-[#0D0D0D]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#EFEFEF]">
                <p className="text-[12px] text-[#9A9A9A]">Payment: Cash on Delivery</p>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-3 flex items-center gap-2">
                <MapPin size={14} />
                Shipping Address
              </h3>
              <p className="text-[14px] font-semibold text-[#0D0D0D]">{addr.full_name}</p>
              <p className="text-[13px] text-[#4A4A4A]">
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ''}
              </p>
              <p className="text-[13px] text-[#4A4A4A]">
                {addr.city}, {addr.state} {addr.postal_code}
              </p>
              {addr.phone && <p className="text-[12px] text-[#9A9A9A] mt-1">{addr.phone}</p>}
            </div>

            {/* Tracking */}
            {order.tracking_number && (
              <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
                <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-3 flex items-center gap-2">
                  <Truck size={14} />
                  Tracking
                </h3>
                <p className="text-[14px] font-mono font-semibold text-[#0D0D0D]">
                  {order.tracking_number}
                </p>
              </div>
            )}

            {/* Cancel button (Task 5.9) */}
            {order.status === 'pending' && (
              <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[13px] text-[#4A4A4A]">
                    You can cancel this order while it's still pending
                  </p>
                </div>
                {cancelError && (
                  <p className="text-[12px] text-red-500 font-medium mb-3">{cancelError}</p>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
                >
                  {cancelling ? (
                    <Loader2 size={14} className="animate-spin mr-2" />
                  ) : (
                    <XCircle size={14} className="mr-2" />
                  )}
                  {cancelling ? 'Cancelling…' : 'Cancel Order'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
