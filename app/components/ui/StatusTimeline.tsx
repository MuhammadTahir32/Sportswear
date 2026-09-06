import { Clock, CheckCircle2, Package, Truck, XCircle } from 'lucide-react'
import { useOrderStatusHistory } from '@/hooks/useOrders'
import type { OrderStatus, OrderStatusHistory } from '@/lib/types'

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

export function StatusTimeline({
  orderId,
  currentStatus,
  isAdmin = false,
  historyData,
}: {
  orderId: string
  currentStatus: OrderStatus
  isAdmin?: boolean
  historyData?: OrderStatusHistory[]
}) {
  const { data: fetchHistory = [] } = useOrderStatusHistory(!historyData ? orderId : null)
  const history = historyData || fetchHistory

  const isCancelled = currentStatus === 'cancelled' || currentStatus === 'refunded'

  return (
    <div className={`bg-white border border-[#E0E0E0] rounded-[12px] p-6 ${isAdmin ? 'p-5' : ''}`}>
      <h3
        className={`font-bold uppercase tracking-wider text-[#9A9A9A] ${isAdmin ? 'text-[13px] mb-4' : 'text-[14px] mb-6'} flex items-center gap-2`}
      >
        {isAdmin && <Clock size={14} />}
        {isAdmin ? 'Activity Log' : 'Order Progress'}
      </h3>

      {/* Visual progress bar (only for customer view typically, but we can show it for admin if desired. The original admin just showed history. We'll show it for both if not cancelled) */}
      {!isAdmin && !isCancelled && (
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
      {!isAdmin && isCancelled && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-[10px] mb-6">
          <XCircle size={20} className="text-red-500" />
          <span className="text-[14px] font-semibold text-red-600">
            This order has been {currentStatus}
          </span>
        </div>
      )}

      {/* Detailed history log */}
      {history.length > 0 && (
        <div className={isAdmin ? 'mt-0' : 'border-t border-[#EFEFEF] pt-5'}>
          {!isAdmin && (
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
              Status History
            </h4>
          )}
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
      )}
    </div>
  )
}
