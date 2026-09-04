import type { Coupon } from '@/lib/types'

// ─── Constants ────────────────────────────────────────────────────────────────

export const TAX_RATE = 0.17 // 17% Pakistan GST

export const SHIPPING_METHODS = {
  standard: {
    id: 'standard',
    label: 'Standard Shipping',
    description: '5–7 business days',
    price: 5.99,
    freeThreshold: 50, // Free for orders over $50
  },
  express: {
    id: 'express',
    label: 'Express Shipping',
    description: '2–3 business days',
    price: 9.99,
    freeThreshold: null, // Never free
  },
} as const

export type ShippingMethodId = keyof typeof SHIPPING_METHODS

// ─── Cart Item for Calculations ───────────────────────────────────────────────

export interface CalcCartItem {
  quantity: number
  unit_price: number
}

// ─── Pure Calculation Functions ───────────────────────────────────────────────

/** Sum of (unit_price × quantity) for all items */
export function calcSubtotal(items: CalcCartItem[]): number {
  return items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
}

/** Apply coupon discount to subtotal. Returns discount amount (always ≥ 0). */
export function calcDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon || !coupon.active) return 0

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return 0

  if (coupon.discount_type === 'percent') {
    return Math.round(((subtotal * coupon.discount_value) / 100) * 100) / 100
  }

  // Fixed discount — cannot exceed subtotal
  return Math.min(coupon.discount_value, subtotal)
}

/** Tax on post-discount amount */
export function calcTax(amountAfterDiscount: number, rate: number = TAX_RATE): number {
  return Math.round(amountAfterDiscount * rate * 100) / 100
}

/** Shipping fee based on method and subtotal */
export function calcShipping(subtotal: number, methodId: ShippingMethodId = 'standard'): number {
  const method = SHIPPING_METHODS[methodId]
  if (method.freeThreshold !== null && subtotal >= method.freeThreshold) {
    return 0
  }
  return method.price
}

/** Final order total */
export function calcOrderTotal(
  subtotal: number,
  discount: number,
  tax: number,
  shipping: number
): number {
  return Math.round((subtotal - discount + tax + shipping) * 100) / 100
}

/** Format currency for display */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

/** Full order breakdown from items + coupon + shipping method */
export function calcOrderBreakdown(
  items: CalcCartItem[],
  coupon: Coupon | null,
  shippingMethodId: ShippingMethodId = 'standard'
) {
  const subtotal = calcSubtotal(items)
  const discount = calcDiscount(subtotal, coupon)
  const amountAfterDiscount = Math.max(subtotal - discount, 0)
  const tax = calcTax(amountAfterDiscount)
  const shipping = calcShipping(subtotal, shippingMethodId)
  const total = calcOrderTotal(subtotal, discount, tax, shipping)

  return { subtotal, discount, tax, shipping, total }
}
