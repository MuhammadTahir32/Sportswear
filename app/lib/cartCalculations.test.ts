import { describe, it, expect } from 'vitest'
import {
  calcSubtotal,
  calcDiscount,
  calcShipping,
  calcTax,
  calcOrderBreakdown,
} from './cartCalculations'
import type { Coupon } from './types'

describe('Cart Calculations', () => {
  const mockItems = [
    { quantity: 2, unit_price: 25.0 }, // 50.0
    { quantity: 1, unit_price: 15.5 }, // 15.5
  ] // Total: 65.5

  describe('calcSubtotal', () => {
    it('calculates the correct subtotal for multiple items', () => {
      expect(calcSubtotal(mockItems)).toBe(65.5)
    })

    it('returns 0 for empty cart', () => {
      expect(calcSubtotal([])).toBe(0)
    })
  })

  describe('calcDiscount', () => {
    it('calculates percentage discounts correctly', () => {
      const percentCoupon: Coupon = {
        id: '1',
        code: 'TEST10',
        discount_type: 'percent',
        discount_value: 10,
        active: true,
        created_at: new Date().toISOString(),
        expires_at: null,
      }
      expect(calcDiscount(100, percentCoupon)).toBe(10)
    })

    it('calculates fixed discounts correctly', () => {
      const fixedCoupon: Coupon = {
        id: '2',
        code: 'FIXED15',
        discount_type: 'fixed',
        discount_value: 15.0,
        active: true,
        created_at: new Date().toISOString(),
        expires_at: null,
      }
      expect(calcDiscount(100, fixedCoupon)).toBe(15)
    })

    it('caps fixed discounts at the subtotal', () => {
      const massiveFixedCoupon: Coupon = {
        id: '3',
        code: 'FIXED100',
        discount_type: 'fixed',
        discount_value: 100.0,
        active: true,
        created_at: new Date().toISOString(),
        expires_at: null,
      }
      expect(calcDiscount(50, massiveFixedCoupon)).toBe(50) // Should not return 100
    })

    it('returns 0 for inactive coupons', () => {
      const inactiveCoupon: Coupon = {
        id: '4',
        code: 'INACTIVE',
        discount_type: 'percent',
        discount_value: 50,
        active: false,
        created_at: new Date().toISOString(),
        expires_at: null,
      }
      expect(calcDiscount(100, inactiveCoupon)).toBe(0)
    })

    it('returns 0 for expired coupons', () => {
      const expiredCoupon: Coupon = {
        id: '5',
        code: 'EXPIRED',
        discount_type: 'percent',
        discount_value: 50,
        active: true,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      }
      expect(calcDiscount(100, expiredCoupon)).toBe(0)
    })

    it('returns 0 when no coupon is provided', () => {
      expect(calcDiscount(100, null)).toBe(0)
    })
  })

  describe('calcShipping', () => {
    it('returns standard shipping fee for orders under threshold', () => {
      expect(calcShipping(40, 'standard')).toBe(5.99)
    })

    it('returns 0 for standard shipping for orders over threshold', () => {
      expect(calcShipping(55, 'standard')).toBe(0)
      expect(calcShipping(50, 'standard')).toBe(0) // Exact threshold
    })

    it('always charges for express shipping regardless of threshold', () => {
      expect(calcShipping(100, 'express')).toBe(9.99)
      expect(calcShipping(10, 'express')).toBe(9.99)
    })
  })

  describe('calcTax', () => {
    it('calculates tax based on the post-discount amount', () => {
      expect(calcTax(100)).toBe(17.0) // 100 * 0.17
      expect(calcTax(0)).toBe(0)
    })
  })

  describe('calcOrderBreakdown', () => {
    it('calculates the full breakdown correctly without a coupon', () => {
      const breakdown = calcOrderBreakdown(mockItems, null, 'standard')
      // Subtotal: 65.5
      // Discount: 0
      // Tax: 65.5 * 0.17 = 11.135 -> 11.14
      // Shipping: 0 (subtotal > 50)
      // Total: 65.5 + 11.14 = 76.64

      expect(breakdown.subtotal).toBe(65.5)
      expect(breakdown.discount).toBe(0)
      expect(breakdown.tax).toBe(11.14)
      expect(breakdown.shipping).toBe(0)
      expect(breakdown.total).toBe(76.64)
    })

    it('calculates the full breakdown correctly with a coupon and express shipping', () => {
      const percentCoupon: Coupon = {
        id: '1',
        code: 'TEST10',
        discount_type: 'percent',
        discount_value: 10,
        active: true,
        created_at: new Date().toISOString(),
        expires_at: null,
      }

      const breakdown = calcOrderBreakdown(mockItems, percentCoupon, 'express')
      // Subtotal: 65.5
      // Discount: 6.55
      // Amount After Discount: 58.95
      // Tax: 58.95 * 0.17 = 10.0215 -> 10.02
      // Shipping: 9.99 (express)
      // Total: 65.5 - 6.55 + 10.02 + 9.99 = 78.96

      expect(breakdown.subtotal).toBe(65.5)
      expect(breakdown.discount).toBe(6.55)
      expect(breakdown.tax).toBe(10.02)
      expect(breakdown.shipping).toBe(9.99)
      expect(breakdown.total).toBe(78.96)
    })
  })
})
