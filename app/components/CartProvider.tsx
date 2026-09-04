import { createContext, useContext, type ReactNode } from 'react'
import { useCart } from '@/hooks/useCart'

// ─── Types ────────────────────────────────────────────────────────────────────

type CartContextValue = ReturnType<typeof useCart>

const CartContext = createContext<CartContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const cart = useCart()

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCartContext must be used within a <CartProvider />')
  }
  return ctx
}
