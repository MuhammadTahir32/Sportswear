import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Package, MapPin, Truck, Clock, Loader2, Save } from 'lucide-react'
import {
  useAdminOrderDetail,
  useAdminOrderHistory,
  useUpdateOrderStatus,
} from '@/hooks/useAdminOrders'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/cartCalculations'
import type { OrderStatus, OrderStatusHistory as OrderStatusHistoryType } from '@/lib/types'

export const Route = createFileRoute('/_admin/admin/orders/$orderId')({
  component: AdminOrderDetailPage,
})

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  paid: { label: 'Paid', bg: 'bg-blue-50', text: 'text-blue-700' },
  processing: { label: 'Processing', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  shipped: { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-700' },
  delivered: { label: 'Delivered', bg: 'bg-green-50', text: 'text-green-700' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600' },
  refunded: { label: 'Refunded', bg: 'bg-gray-100', text: 'text-gray-600' },
}

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'processing', 'cancelled'],
  paid: ['processing', 'cancelled', 'refunded'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

// ─── Status History Timeline ──────────────────────────────────────────────────

function AdminStatusTimeline({ history }: { history: OrderStatusHistoryType[] }) {
  if (history.length === 0) return null

  return (
    <div className="mt-5 pt-5 border-t border-[#EFEFEF]">
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
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${isLast ? 'bg-[#C6FF3D]' : 'bg-[#E0E0E0]'}`}
                />
                {!isLast && <div className="w-px flex-1 bg-[#E0E0E0] min-h-[28px]" />}
              </div>
              <div className="pb-4">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}
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
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function AdminOrderDetailPage(): React.JSX.Element {
  const { orderId } = Route.useParams()
  const { data: order, isLoading } = useAdminOrderDetail(orderId)
  const { data: history = [] } = useAdminOrderHistory(orderId)
  const updateStatus = useUpdateOrderStatus()

  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updateError, setUpdateError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-[14px] text-[#9A9A9A]">Order not found</p>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[order.status]
  const addr = order.shipping_address
  const allowedTransitions = ALLOWED_TRANSITIONS[order.status]

  async function handleUpdateStatus() {
    if (!newStatus) return
    setUpdateError(null)

    try {
      await updateStatus.mutateAsync({
        orderId: order!.id,
        status: newStatus,
        trackingNumber: newStatus === 'shipped' && trackingNumber ? trackingNumber : undefined,
      })
      setNewStatus('')
      setTrackingNumber('')
    } catch (err) {
      setUpdateError((err as Error).message)
    }
  }

  return (
    <div>
      {/* Back link */}
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        to={'/admin/orders' as any}
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-[#0D0D0D] mb-1">
            Order #{order.id.substring(0, 8).toUpperCase()}
          </h2>
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}
            >
              {statusConfig.label}
            </span>
            <span className="text-[12px] text-[#9A9A9A]">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
        <span className="text-[22px] font-bold text-[#0D0D0D]">{formatCurrency(order.total)}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {/* Status update card */}
          {allowedTransitions.length > 0 && (
            <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
                Update Status
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {allowedTransitions.map((status) => {
                  const config = STATUS_CONFIG[status]
                  const isSelected = newStatus === status
                  return (
                    <button
                      key={status}
                      onClick={() => setNewStatus(status)}
                      className={`text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'border-[#C6FF3D] bg-[#FAFFF0]'
                          : `border-transparent ${config.bg} ${config.text} hover:border-[#E0E0E0]`
                      }`}
                    >
                      {config.label}
                    </button>
                  )
                })}
              </div>

              {/* Tracking number input (show when shipping) */}
              {newStatus === 'shipped' && (
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-1.5">
                    Tracking Number
                  </label>
                  <div className="relative">
                    <Truck
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]"
                    />
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full h-[38px] pl-10 pr-4 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#0D0D0D] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#C6FF3D] transition-colors"
                    />
                  </div>
                </div>
              )}

              {updateError && (
                <p className="text-[12px] text-red-500 font-medium mb-3">{updateError}</p>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdateStatus}
                disabled={!newStatus || updateStatus.isPending}
                className="w-full justify-center"
              >
                {updateStatus.isPending ? (
                  <Loader2 size={14} className="animate-spin mr-2" />
                ) : (
                  <Save size={14} className="mr-2" />
                )}
                {updateStatus.isPending ? 'Updating…' : 'Update Status'}
              </Button>
            </div>
          )}

          {/* Items */}
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] overflow-hidden">
            <div className="p-5 border-b border-[#EFEFEF]">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                Items ({order.order_items.length})
              </h3>
            </div>
            <div className="divide-y divide-[#EFEFEF]">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5">
                  <div className="w-[48px] h-[48px] bg-[#F0F0F0] rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-[#9A9A9A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#0D0D0D] truncate">
                      {item.variant.product.name}
                    </p>
                    <p className="text-[11px] text-[#9A9A9A]">
                      SKU: {item.variant.sku} · {item.variant.size} / {item.variant.color} ×{' '}
                      {item.quantity}
                    </p>
                  </div>
                  <span className="text-[13px] font-bold text-[#0D0D0D]">
                    {formatCurrency(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status History Timeline */}
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] flex items-center gap-2">
              <Clock size={14} />
              Activity Log
            </h3>
            <AdminStatusTimeline history={history} />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Price breakdown */}
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
              Payment
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
                <span className="text-[14px] font-bold">Total</span>
                <span className="text-[15px] font-bold">{formatCurrency(order.total)}</span>
              </div>
            </div>
            <p className="text-[11px] text-[#9A9A9A] mt-3">Method: Cash on Delivery</p>
          </div>

          {/* Customer / Shipping */}
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-3 flex items-center gap-2">
              <MapPin size={14} />
              Shipping
            </h3>
            <p className="text-[13px] font-semibold text-[#0D0D0D]">{addr.full_name}</p>
            <p className="text-[12px] text-[#4A4A4A]">
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ''}
            </p>
            <p className="text-[12px] text-[#4A4A4A]">
              {addr.city}, {addr.state} {addr.postal_code}
            </p>
            <p className="text-[12px] text-[#4A4A4A]">{addr.country}</p>
            {addr.phone && <p className="text-[11px] text-[#9A9A9A] mt-1">📞 {addr.phone}</p>}
          </div>

          {/* Tracking */}
          {order.tracking_number && (
            <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-2 flex items-center gap-2">
                <Truck size={14} />
                Tracking
              </h3>
              <p className="text-[14px] font-mono font-semibold text-[#0D0D0D]">
                {order.tracking_number}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
