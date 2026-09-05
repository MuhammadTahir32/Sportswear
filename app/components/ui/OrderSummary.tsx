import type { CartItemWithVariant, Coupon } from '@/lib/types'
import type { ShippingMethodId } from '@/lib/cartCalculations'
import { calcOrderBreakdown, formatCurrency } from '@/lib/cartCalculations'
import { CouponInput } from '@/components/ui/CouponInput'

type OrderSummaryProps = {
  items: CartItemWithVariant[]
  shippingMethodId: ShippingMethodId
  coupon: Coupon | null
  onApplyCoupon: (coupon: Coupon) => void
  onRemoveCoupon: () => void
  showCoupon?: boolean
}

export function OrderSummary({
  items,
  shippingMethodId,
  coupon,
  onApplyCoupon,
  onRemoveCoupon,
  showCoupon = true,
}: OrderSummaryProps): React.JSX.Element {
  // Build calc items from cart items
  const calcItems = items.map((item) => ({
    quantity: item.quantity,
    unit_price:
      item.variant.price_override ??
      item.variant.product.sale_price ??
      item.variant.product.base_price,
  }))

  const { subtotal, discount, tax, shipping, total } = calcOrderBreakdown(
    calcItems,
    coupon,
    shippingMethodId
  )

  return (
    <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-[12px] p-6">
      <h3 className="font-[Anton,sans-serif] text-[20px] uppercase tracking-tight text-[#0D0D0D] mb-5">
        Order Summary
      </h3>

      {/* Item list (compact) */}
      <div className="flex flex-col gap-3 mb-5 max-h-[280px] overflow-y-auto pr-1">
        {items.map((item) => {
          const price =
            item.variant.price_override ??
            item.variant.product.sale_price ??
            item.variant.product.base_price
          const image = item.variant.product.images?.[0]

          return (
            <div key={item.variant_id} className="flex items-center gap-3">
              <div className="w-[48px] h-[48px] bg-[#F0F0F0] rounded-[6px] overflow-hidden flex-shrink-0">
                {image ? (
                  <img
                    src={image.storage_path}
                    alt={item.variant.product.name}
                    className="w-full h-full object-contain p-0.5"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#9A9A9A]">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#0D0D0D] truncate">
                  {item.variant.product.name}
                </p>
                <p className="text-[11px] text-[#9A9A9A]">
                  {item.variant.size} / {item.variant.color} × {item.quantity}
                </p>
              </div>
              <span className="text-[13px] font-bold text-[#0D0D0D] flex-shrink-0">
                {formatCurrency(price * item.quantity)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E0E0E0] mb-4" />

      {/* Coupon input */}
      {showCoupon && (
        <div className="mb-4">
          <CouponInput appliedCoupon={coupon} onApply={onApplyCoupon} onRemove={onRemoveCoupon} />
        </div>
      )}

      {/* Price breakdown */}
      <div className="flex flex-col gap-2 text-[13px]">
        <div className="flex justify-between">
          <span className="text-[#4A4A4A]">Subtotal</span>
          <span className="font-semibold text-[#0D0D0D]">{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[#5A8A00]">
            <span>Discount</span>
            <span className="font-semibold">−{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-[#4A4A4A]">Tax (17% GST)</span>
          <span className="font-semibold text-[#0D0D0D]">{formatCurrency(tax)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-[#4A4A4A]">Shipping</span>
          <span className="font-semibold text-[#0D0D0D]">
            {shipping === 0 ? (
              <span className="text-[#5A8A00]">FREE</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E0E0E0] my-2" />

        <div className="flex justify-between">
          <span className="text-[16px] font-bold text-[#0D0D0D]">Total</span>
          <span className="text-[18px] font-bold text-[#0D0D0D]">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
