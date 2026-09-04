import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItemWithVariant } from '@/lib/types'
import { formatCurrency } from '@/lib/cartCalculations'

type CartItemRowProps = {
  item: CartItemWithVariant
  onUpdateQuantity: (variantId: string, quantity: number) => void
  onRemove: (variantId: string) => void
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps): React.JSX.Element {
  const { variant } = item
  const product = variant.product
  const image = product.images?.[0]

  const unitPrice = variant.price_override ?? product.sale_price ?? product.base_price
  const lineTotal = unitPrice * item.quantity
  const maxQty = variant.stock_qty

  return (
    <div
      className="flex gap-4 py-4 border-b border-[#EFEFEF] last:border-b-0"
      id={`cart-item-${item.variant_id}`}
    >
      {/* Thumbnail */}
      <a
        href={`/products/${product.slug}`}
        className="flex-shrink-0 w-[80px] h-[80px] bg-[#F7F7F7] rounded-[8px] overflow-hidden"
      >
        {image ? (
          <img
            src={image.storage_path}
            alt={product.name}
            className="w-full h-full object-contain p-1"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9A9A9A] text-[11px]">
            No image
          </div>
        )}
      </a>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <a
          href={`/products/${product.slug}`}
          className="text-[13px] font-semibold text-[#0D0D0D] line-clamp-2 leading-tight hover:text-[#C6FF3D] transition-colors"
        >
          {product.name}
        </a>

        <p className="text-[12px] text-[#9A9A9A]">
          {variant.size} / {variant.color}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Quantity stepper */}
          <div className="flex items-center border border-[#E0E0E0] rounded-[6px] h-[32px]">
            <button
              onClick={() => onUpdateQuantity(item.variant_id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className="w-[30px] h-full flex items-center justify-center text-[#0D0D0D] disabled:text-[#D0D0D0] hover:bg-[#F7F7F7] transition-colors rounded-l-[6px]"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-[36px] text-center text-[13px] font-semibold text-[#0D0D0D] select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.variant_id, Math.min(maxQty, item.quantity + 1))}
              disabled={item.quantity >= maxQty}
              className="w-[30px] h-full flex items-center justify-center text-[#0D0D0D] disabled:text-[#D0D0D0] hover:bg-[#F7F7F7] transition-colors rounded-r-[6px]"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Price + Remove */}
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-[#0D0D0D]">
              {formatCurrency(lineTotal)}
            </span>
            <button
              onClick={() => onRemove(item.variant_id)}
              className="p-1.5 text-[#9A9A9A] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              aria-label={`Remove ${product.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
