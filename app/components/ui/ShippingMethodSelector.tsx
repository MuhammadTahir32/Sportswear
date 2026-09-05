import { Truck, Zap, Check } from 'lucide-react'
import { SHIPPING_METHODS, type ShippingMethodId, formatCurrency } from '@/lib/cartCalculations'

type ShippingMethodSelectorProps = {
  selectedMethod: ShippingMethodId
  onSelect: (method: ShippingMethodId) => void
  subtotal: number
}

const ICONS: Record<ShippingMethodId, React.ReactNode> = {
  standard: <Truck size={22} />,
  express: <Zap size={22} />,
}

export function ShippingMethodSelector({
  selectedMethod,
  onSelect,
  subtotal,
}: ShippingMethodSelectorProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-[16px] font-bold text-[#0D0D0D]">Select shipping method</h3>

      <div className="flex flex-col gap-3">
        {(Object.keys(SHIPPING_METHODS) as ShippingMethodId[]).map((methodId) => {
          const method = SHIPPING_METHODS[methodId]
          const isSelected = selectedMethod === methodId
          const isFree = method.freeThreshold !== null && subtotal >= method.freeThreshold

          return (
            <button
              key={methodId}
              onClick={() => onSelect(methodId)}
              className={`w-full text-left p-4 rounded-[10px] border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-[#C6FF3D] bg-[#FAFFF0]'
                  : 'border-[#E0E0E0] hover:border-[#9A9A9A] bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${
                      isSelected ? 'bg-[#C6FF3D] text-[#0D0D0D]' : 'bg-[#F0F0F0] text-[#4A4A4A]'
                    }`}
                  >
                    {ICONS[methodId]}
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold text-[#0D0D0D] block">
                      {method.label}
                    </span>
                    <span className="text-[12px] text-[#9A9A9A]">{method.description}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    {isFree ? (
                      <>
                        <span className="text-[14px] font-bold text-[#5A8A00]">FREE</span>
                        <span className="block text-[11px] text-[#9A9A9A] line-through">
                          {formatCurrency(method.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[14px] font-bold text-[#0D0D0D]">
                        {formatCurrency(method.price)}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#C6FF3D] flex items-center justify-center flex-shrink-0">
                      <Check size={14} strokeWidth={3} className="text-[#0D0D0D]" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {subtotal < (SHIPPING_METHODS.standard.freeThreshold ?? 0) && (
        <p className="text-[12px] text-[#9A9A9A] text-center">
          Add {formatCurrency((SHIPPING_METHODS.standard.freeThreshold ?? 50) - subtotal)} more for
          free standard shipping
        </p>
      )}
    </div>
  )
}
