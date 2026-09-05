import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, Package, ArrowRight, Copy, Check, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/cartCalculations'
import type { OrderWithItems } from '@/lib/types'

export const Route = createFileRoute('/order-confirmation/$orderId')({
  component: OrderConfirmationPage,
})

function OrderConfirmationPage(): React.JSX.Element {
  const { orderId } = Route.useParams()
  const { user, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (authLoading || !user) return

    async function fetchOrder() {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          *,
          order_items(
            *,
            variant:product_variants(
              *,
              product:products(*)
            )
          )
        `
        )
        .eq('id', orderId)
        .eq('user_id', user!.id)
        .single()

      if (error) {
        console.error('[OrderConfirmation] fetch error:', error.message)
      } else {
        setOrder(data as OrderWithItems)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [orderId, user, authLoading])

  function copyOrderId() {
    navigator.clipboard.writeText(orderId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (authLoading || loading) {
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
        <p className="text-[14px] text-[#9A9A9A]">
          We couldn&apos;t find this order. Please check your email for confirmation.
        </p>
        <a href="/">
          <Button variant="primary" size="md">
            Go Home
          </Button>
        </a>
      </div>
    )
  }

  const shippingAddr = order.shipping_address

  return (
    <>
      <title>Order Confirmed — StrideWear</title>
      <meta name="description" content="Your StrideWear order has been placed successfully" />

      <div className="w-full max-w-[800px] mx-auto px-6 md:px-16 py-16">
        {/* Success header */}
        <div className="text-center mb-12">
          <div
            className="w-[72px] h-[72px] rounded-full bg-[#C6FF3D] flex items-center justify-center mx-auto mb-5"
            style={{ animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
          >
            <CheckCircle2 size={36} strokeWidth={2.5} className="text-[#0D0D0D]" />
          </div>
          <h1 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[32px] md:text-[42px] uppercase tracking-tight leading-none mb-3">
            Order Confirmed!
          </h1>
          <p className="text-[15px] text-[#4A4A4A] max-w-[420px] mx-auto">
            Thank you for your order. Your items will be shipped soon.
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-[#F7F7F7] rounded-[12px] p-5 mb-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] block mb-1">
              Order ID
            </span>
            <span className="text-[15px] font-mono font-bold text-[#0D0D0D]">
              {orderId.substring(0, 8).toUpperCase()}
            </span>
          </div>
          <button
            onClick={copyOrderId}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4A4A4A] hover:text-[#0D0D0D] transition-colors p-2 rounded-[6px] hover:bg-[#EFEFEF]"
          >
            {copied ? <Check size={14} className="text-[#5A8A00]" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* COD Instructions */}
        <div className="bg-[#FAFFF0] border border-[#C6FF3D] rounded-[12px] p-5 mb-8">
          <div className="flex items-start gap-3">
            <Package size={22} className="text-[#5A8A00] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[14px] font-bold text-[#0D0D0D] mb-1">Cash on Delivery</h3>
              <p className="text-[13px] text-[#4A4A4A] leading-relaxed">
                Please have <strong>{formatCurrency(order.total)}</strong> ready in cash when your
                order is delivered. Our delivery partner will collect the payment at your doorstep.
              </p>
            </div>
          </div>
        </div>

        {/* Order details card */}
        <div className="border border-[#E0E0E0] rounded-[12px] overflow-hidden mb-8">
          {/* Items */}
          <div className="p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
              Items Ordered
            </h3>
            <div className="flex flex-col gap-3">
              {order.order_items.map((oi) => (
                <div key={oi.id} className="flex items-center gap-3">
                  <div className="w-[48px] h-[48px] bg-[#F0F0F0] rounded-[6px] flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-[#9A9A9A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#0D0D0D] truncate">
                      {oi.variant.product.name}
                    </p>
                    <p className="text-[11px] text-[#9A9A9A]">
                      {oi.variant.size} / {oi.variant.color} × {oi.quantity}
                    </p>
                  </div>
                  <span className="text-[13px] font-bold text-[#0D0D0D]">
                    {formatCurrency(oi.unit_price * oi.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E0E0E0]" />

          {/* Price breakdown */}
          <div className="p-5 bg-[#FAFAFA]">
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
                <span className="text-[16px] font-bold text-[#0D0D0D]">Total</span>
                <span className="text-[18px] font-bold text-[#0D0D0D]">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E0E0E0]" />

          {/* Shipping address */}
          <div className="p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-2">
              Shipping To
            </h3>
            <p className="text-[14px] font-semibold text-[#0D0D0D]">{shippingAddr.full_name}</p>
            <p className="text-[13px] text-[#4A4A4A]">
              {shippingAddr.line1}
              {shippingAddr.line2 ? `, ${shippingAddr.line2}` : ''}
            </p>
            <p className="text-[13px] text-[#4A4A4A]">
              {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postal_code}
            </p>
            {shippingAddr.phone && (
              <p className="text-[12px] text-[#9A9A9A] mt-1">{shippingAddr.phone}</p>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/products">
            <Button variant="primary" size="lg" className="px-8">
              Continue Shopping
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  )
}
