import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useCartContext } from '@/components/CartProvider'
import { calcOrderBreakdown, type ShippingMethodId } from '@/lib/cartCalculations'
import type { Address, Coupon, ShippingAddressSnapshot } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlaceOrderPayload {
  address: Address
  shippingMethodId: ShippingMethodId
  coupon: Coupon | null
}

export interface PlaceOrderResult {
  orderId: string | null
  error: string | null
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCheckout() {
  const { user } = useAuth()
  const { items, clearCart } = useCartContext()
  const [isPlacing, setIsPlacing] = useState(false)

  const placeOrder = useCallback(
    async ({ address, shippingMethodId, coupon }: PlaceOrderPayload): Promise<PlaceOrderResult> => {
      if (!user) return { orderId: null, error: 'You must be signed in to place an order' }
      if (items.length === 0) return { orderId: null, error: 'Your cart is empty' }

      setIsPlacing(true)

      try {
        // 1. Build calc items for pricing
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

        // 2. Attempt stock decrement via RPC (atomic, with FOR UPDATE locks)
        const stockItems = items.map((item) => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        }))

        const { error: stockErr } = await supabase.rpc('decrement_stock', {
          items: stockItems,
        })

        if (stockErr) {
          setIsPlacing(false)
          // Check if it's a stock error
          if (stockErr.message.includes('Insufficient stock')) {
            return { orderId: null, error: stockErr.message }
          }
          return { orderId: null, error: 'Failed to verify stock availability. Please try again.' }
        }

        // 3. Create shipping address snapshot
        const shippingAddress: ShippingAddressSnapshot = {
          full_name: address.full_name,
          line1: address.line1,
          line2: address.line2 ?? undefined,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
          phone: address.phone ?? undefined,
        }

        // 4. Create order
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            status: 'pending',
            subtotal,
            tax,
            shipping_fee: shipping,
            discount,
            total,
            applied_coupon_id: coupon?.id ?? null,
            shipping_address: shippingAddress,
            tracking_number: null,
          })
          .select('id')
          .single()

        if (orderErr || !order) {
          setIsPlacing(false)
          return { orderId: null, error: 'Failed to create order. Please try again.' }
        }

        // 5. Create order items
        const orderItems = items.map((item) => ({
          order_id: order.id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price:
            item.variant.price_override ??
            item.variant.product.sale_price ??
            item.variant.product.base_price,
        }))

        const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)

        if (itemsErr) {
          console.error('[useCheckout] order_items insert error:', itemsErr.message)
          // Order still created — don't fail, but log
        }

        // 6. Create initial order status history entry
        await supabase.from('order_status_history').insert({
          order_id: order.id,
          status: 'pending',
          changed_at: new Date().toISOString(),
        })

        // 7. Clear cart (Task 4.12)
        await clearCart()

        setIsPlacing(false)
        return { orderId: order.id, error: null }
      } catch (err) {
        setIsPlacing(false)
        console.error('[useCheckout] unexpected error:', err)
        return { orderId: null, error: 'An unexpected error occurred. Please try again.' }
      }
    },
    [user, items, clearCart]
  )

  return { placeOrder, isPlacing }
}
