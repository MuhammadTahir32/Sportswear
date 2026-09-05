import { useState } from 'react'
import { Tag, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import type { Coupon } from '@/lib/types'

type CouponInputProps = {
  appliedCoupon: Coupon | null
  onApply: (coupon: Coupon) => void
  onRemove: () => void
}

export function CouponInput({
  appliedCoupon,
  onApply,
  onRemove,
}: CouponInputProps): React.JSX.Element {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleApply() {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      setError('Please enter a coupon code')
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: fetchErr } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', trimmed)
      .single()

    if (fetchErr || !data) {
      setError('Invalid coupon code')
      setLoading(false)
      return
    }

    const coupon = data as Coupon

    if (!coupon.active) {
      setError('This coupon is no longer active')
      setLoading(false)
      return
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      setError('This coupon has expired')
      setLoading(false)
      return
    }

    onApply(coupon)
    setCode('')
    setLoading(false)
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-[#F0FFD4] border border-[#C6FF3D] rounded-[8px] px-4 py-3">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-[#5A8A00]" />
          <span className="text-[13px] font-semibold text-[#0D0D0D]">{appliedCoupon.code}</span>
          <span className="text-[12px] text-[#5A8A00]">
            {appliedCoupon.discount_type === 'percent'
              ? `${appliedCoupon.discount_value}% off`
              : `$${appliedCoupon.discount_value.toFixed(2)} off`}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-[#ddf5a0] rounded-full transition-colors"
          aria-label="Remove coupon"
        >
          <X size={16} className="text-[#5A8A00]" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Coupon code"
            className="w-full h-[42px] pl-10 pr-4 border border-[#E0E0E0] rounded-[8px] text-[13px] font-medium text-[#0D0D0D] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#C6FF3D] focus:ring-1 focus:ring-[#C6FF3D] transition-colors"
            aria-label="Coupon code"
            id="coupon-code-input"
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-5 h-[42px] text-[13px] font-bold"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
        </Button>
      </div>
      {error && <p className="text-[12px] text-red-500 font-medium pl-1">{error}</p>}
    </div>
  )
}
