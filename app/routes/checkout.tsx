import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCartContext } from '@/components/CartProvider'
import { useCheckout } from '@/hooks/useCheckout'
import { Button } from '@/components/ui/Button'
import { CheckoutSteps } from '@/components/ui/CheckoutSteps'
import { AddressSelector } from '@/components/ui/AddressSelector'
import { ShippingMethodSelector } from '@/components/ui/ShippingMethodSelector'
import { OrderSummary } from '@/components/ui/OrderSummary'
import type { Address, Coupon } from '@/lib/types'
import type { ShippingMethodId } from '@/lib/cartCalculations'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage(): React.JSX.Element {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { items, isLoading: cartLoading, itemCount } = useCartContext()
  const { placeOrder, isPlacing } = useCheckout()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>('standard')
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)

  // Loading state
  if (authLoading || cartLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#9A9A9A]" />
      </div>
    )
  }

  // Not authenticated → redirect to sign-in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
        <ShieldCheck size={48} className="text-[#9A9A9A]" />
        <div className="text-center">
          <h2 className="text-[24px] font-bold text-[#0D0D0D] mb-2">Sign in to checkout</h2>
          <p className="text-[14px] text-[#9A9A9A]">You need to be signed in to place an order</p>
        </div>
        <a href="/sign-in">
          <Button variant="primary" size="lg">
            Sign In
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </a>
      </div>
    )
  }

  // Empty cart
  if (itemCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
        <div className="text-center">
          <h2 className="text-[24px] font-bold text-[#0D0D0D] mb-2">Your cart is empty</h2>
          <p className="text-[14px] text-[#9A9A9A]">Add some items before proceeding to checkout</p>
        </div>
        <a href="/products">
          <Button variant="primary" size="lg">
            Browse Products
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </a>
      </div>
    )
  }

  // Navigation
  function goNext() {
    if (step === 1 && !selectedAddress) return
    if (step < 3) setStep(step + 1)
  }

  function goBack() {
    if (step > 1) setStep(step - 1)
  }

  async function handlePlaceOrder() {
    if (!selectedAddress) return
    setOrderError(null)

    const { orderId, error } = await placeOrder({
      address: selectedAddress,
      shippingMethodId: shippingMethod,
      coupon,
    })

    if (error) {
      setOrderError(error)
      return
    }

    if (orderId) {
      navigate({ to: '/order-confirmation/$orderId', params: { orderId } })
    }
  }

  // Subtotal for shipping calculations
  const subtotal = items.reduce((sum, item) => {
    const price =
      item.variant.price_override ??
      item.variant.product.sale_price ??
      item.variant.product.base_price
    return sum + price * item.quantity
  }, 0)

  return (
    <>
      <title>Checkout — StrideWear</title>
      <meta name="description" content="Complete your StrideWear order" />

      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-16 py-12">
        {/* Header */}
        <h1 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[36px] md:text-[48px] uppercase tracking-tight leading-none mb-8">
          Checkout
        </h1>

        {/* Steps indicator */}
        <CheckoutSteps currentStep={step} />

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Left: Step content */}
          <div className="min-h-[300px]">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <AddressSelector
                selectedId={selectedAddress?.id ?? null}
                onSelect={setSelectedAddress}
              />
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <ShippingMethodSelector
                selectedMethod={shippingMethod}
                onSelect={setShippingMethod}
                subtotal={subtotal}
              />
            )}

            {/* Step 3: Review & Place Order */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                <h3 className="text-[16px] font-bold text-[#0D0D0D]">Review your order</h3>

                {/* Selected address summary */}
                {selectedAddress && (
                  <div className="p-4 border border-[#E0E0E0] rounded-[10px] bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                        Shipping Address
                      </span>
                      <button
                        onClick={() => setStep(1)}
                        className="text-[12px] font-semibold text-[#C6FF3D] hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-[14px] font-semibold text-[#0D0D0D]">
                      {selectedAddress.full_name}
                    </p>
                    <p className="text-[13px] text-[#4A4A4A]">
                      {selectedAddress.line1}
                      {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}
                    </p>
                    <p className="text-[13px] text-[#4A4A4A]">
                      {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                    </p>
                  </div>
                )}

                {/* Payment method (COD only) */}
                <div className="p-4 border border-[#E0E0E0] rounded-[10px] bg-white">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#9A9A9A] block mb-2">
                    Payment Method
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[8px] bg-[#F0F0F0] flex items-center justify-center">
                      <ShieldCheck size={20} className="text-[#4A4A4A]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0D0D0D]">Cash on Delivery</p>
                      <p className="text-[12px] text-[#9A9A9A]">Pay when your order is delivered</p>
                    </div>
                  </div>
                </div>

                {/* Order error */}
                {orderError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-[10px]">
                    <p className="text-[13px] font-semibold text-red-600">{orderError}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#EFEFEF]">
              {step > 1 ? (
                <Button variant="secondary" size="md" onClick={goBack}>
                  <ArrowLeft size={16} className="mr-2" />
                  Back
                </Button>
              ) : (
                <a href="/products">
                  <Button variant="secondary" size="md">
                    <ArrowLeft size={16} className="mr-2" />
                    Continue Shopping
                  </Button>
                </a>
              )}

              {step < 3 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={goNext}
                  disabled={step === 1 && !selectedAddress}
                >
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="px-8"
                >
                  {isPlacing ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      Place Order (COD)
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Right: Order Summary sidebar */}
          <div className="lg:sticky lg:top-[100px] lg:self-start">
            <OrderSummary
              items={items}
              shippingMethodId={shippingMethod}
              coupon={coupon}
              onApplyCoupon={setCoupon}
              onRemoveCoupon={() => setCoupon(null)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
