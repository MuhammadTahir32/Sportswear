import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import type { CartItemWithVariant } from '@/lib/types'
import { useAuth } from '@/hooks/useAuth'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GuestCartItem {
  variant_id: string
  quantity: number
}

export interface CartState {
  items: CartItemWithVariant[]
  isLoading: boolean
  itemCount: number
  subtotal: number
}

const GUEST_CART_KEY = 'stridewear_guest_cart'

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

function getGuestCart(): GuestCartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setGuestCart(items: GuestCartItem[]): void {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

function clearGuestCart(): void {
  localStorage.removeItem(GUEST_CART_KEY)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItemWithVariant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  // ── Fetch cart items ──────────────────────────────────────────────────────

  useEffect(() => {
    if (authLoading) return

    let cancelled = false

    async function loadCart() {
      setIsLoading(true)

      if (isAuthenticated && user) {
        // Fetch from DB with joins
        const { data, error } = await supabase
          .from('cart_items')
          .select(
            `
            *,
            variant:product_variants(
              *,
              product:products(
                *,
                images:product_images(*)
              )
            )
          `
          )
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (!cancelled) {
          if (error) {
            console.error('[useCart] fetch error:', error.message)
            setItems([])
          } else {
            setItems((data as CartItemWithVariant[]) || [])
          }
          setIsLoading(false)
        }
      } else {
        // Guest: load from localStorage and fetch variant details
        const guestItems = getGuestCart()

        if (guestItems.length === 0) {
          if (!cancelled) {
            setItems([])
            setIsLoading(false)
          }
          return
        }

        const variantIds = guestItems.map((gi) => gi.variant_id)
        const { data: variants, error } = await supabase
          .from('product_variants')
          .select(
            `
            *,
            product:products(
              *,
              images:product_images(*)
            )
          `
          )
          .in('id', variantIds)

        if (!cancelled) {
          if (error || !variants) {
            setItems([])
          } else {
            // Map guest items to CartItemWithVariant shape
            const mapped: CartItemWithVariant[] = guestItems
              .map((gi) => {
                const variant = variants.find((v) => v.id === gi.variant_id)
                if (!variant) return null
                return {
                  id: `guest-${gi.variant_id}`,
                  user_id: 'guest',
                  variant_id: gi.variant_id,
                  quantity: gi.quantity,
                  updated_at: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  variant,
                } as CartItemWithVariant
              })
              .filter(Boolean) as CartItemWithVariant[]
            setItems(mapped)
          }
          setIsLoading(false)
        }
      }
    }

    loadCart()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, user, authLoading, refreshKey])

  // ── Sync guest cart → DB on login ─────────────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated || !user || authLoading) return

    const guestItems = getGuestCart()
    if (guestItems.length === 0) return

    async function mergeGuestCart() {
      for (const gi of guestItems) {
        // Upsert: if variant already in DB cart, add quantity
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', user!.id)
          .eq('variant_id', gi.variant_id)
          .single()

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + gi.quantity })
            .eq('id', existing.id)
        } else {
          await supabase
            .from('cart_items')
            .insert({ user_id: user!.id, variant_id: gi.variant_id, quantity: gi.quantity })
        }
      }

      clearGuestCart()
      refresh()
    }

    mergeGuestCart()
  }, [isAuthenticated, user, authLoading, refresh])

  // ── Add to cart ───────────────────────────────────────────────────────────

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (isAuthenticated && user) {
        // Check if variant already in cart
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', user.id)
          .eq('variant_id', variantId)
          .single()

        if (existing) {
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id)
        } else {
          await supabase
            .from('cart_items')
            .insert({ user_id: user.id, variant_id: variantId, quantity })
        }
      } else {
        // Guest cart
        const cart = getGuestCart()
        const idx = cart.findIndex((i) => i.variant_id === variantId)
        if (idx >= 0) {
          cart[idx].quantity += quantity
        } else {
          cart.push({ variant_id: variantId, quantity })
        }
        setGuestCart(cart)
      }

      refresh()
    },
    [isAuthenticated, user, refresh]
  )

  // ── Update quantity ───────────────────────────────────────────────────────

  const updateQuantity = useCallback(
    async (variantId: string, quantity: number) => {
      if (quantity < 1) return

      if (isAuthenticated && user) {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('variant_id', variantId)
      } else {
        const cart = getGuestCart()
        const idx = cart.findIndex((i) => i.variant_id === variantId)
        if (idx >= 0) {
          cart[idx].quantity = quantity
          setGuestCart(cart)
        }
      }

      refresh()
    },
    [isAuthenticated, user, refresh]
  )

  // ── Remove item ───────────────────────────────────────────────────────────

  const removeItem = useCallback(
    async (variantId: string) => {
      if (isAuthenticated && user) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('variant_id', variantId)
      } else {
        const cart = getGuestCart().filter((i) => i.variant_id !== variantId)
        setGuestCart(cart)
      }

      refresh()
    },
    [isAuthenticated, user, refresh]
  )

  // ── Clear cart ────────────────────────────────────────────────────────────

  const clearCart = useCallback(async () => {
    if (isAuthenticated && user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id)
    }
    clearGuestCart()
    setItems([])
  }, [isAuthenticated, user])

  // ── Derived values ────────────────────────────────────────────────────────

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price =
          item.variant.price_override ??
          item.variant.product.sale_price ??
          item.variant.product.base_price
        return sum + price * item.quantity
      }, 0),
    [items]
  )

  return {
    items,
    isLoading,
    itemCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refresh,
  }
}
