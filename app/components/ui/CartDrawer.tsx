import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { CartItemRow } from '@/components/ui/CartItemRow'
import { Button } from '@/components/ui/Button'
import { useCartContext } from '@/components/CartProvider'
import { formatCurrency } from '@/lib/cartCalculations'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps): React.JSX.Element | null {
  const { items, isLoading, itemCount, subtotal, updateQuantity, removeItem } = useCartContext()

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
      <div className="w-[80px] h-[80px] rounded-full bg-[#F7F7F7] flex items-center justify-center">
        <ShoppingBag size={32} className="text-[#9A9A9A]" />
      </div>
      <div>
        <p className="text-[16px] font-bold text-[#0D0D0D] mb-1">Your cart is empty</p>
        <p className="text-[13px] text-[#9A9A9A]">Add some items to get started</p>
      </div>
      <a href="/products" onClick={onClose}>
        <Button variant="primary" size="md">
          Continue Shopping
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </a>
    </div>
  )

  const footer =
    itemCount > 0 ? (
      <div className="flex flex-col gap-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#4A4A4A]">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="text-[18px] font-bold text-[#0D0D0D]">{formatCurrency(subtotal)}</span>
        </div>

        <p className="text-[11px] text-[#9A9A9A]">Tax and shipping calculated at checkout</p>

        {/* Checkout CTA */}
        <a href="/checkout" onClick={onClose} className="w-full">
          <Button
            variant="primary"
            size="lg"
            className="w-full justify-center text-[14px] font-bold"
          >
            Proceed to Checkout
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </a>

        {/* Continue shopping */}
        <a
          href="/products"
          onClick={onClose}
          className="text-center text-[13px] font-semibold text-[#0D0D0D] hover:text-[#C6FF3D] transition-colors py-1"
        >
          Continue Shopping
        </a>
      </div>
    ) : undefined

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Your Cart (${itemCount})`} footer={footer}>
      {isLoading ? (
        <div className="flex flex-col gap-4 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-[80px] h-[80px] bg-[#EFEFEF] rounded-[8px]" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 bg-[#EFEFEF] rounded w-3/4" />
                <div className="h-3 bg-[#EFEFEF] rounded w-1/2" />
                <div className="h-6 bg-[#EFEFEF] rounded w-1/3 mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        emptyState
      ) : (
        <div className="flex flex-col">
          {items.map((item) => (
            <CartItemRow
              key={item.variant_id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
      )}
    </Drawer>
  )
}
