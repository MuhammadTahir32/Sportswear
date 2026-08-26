export type UserRole = 'customer' | 'admin' | 'super_admin'
export type Gender = 'men' | 'women' | 'unisex' | 'kids'
export type ProductStatus = 'draft' | 'active' | 'archived'
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type DiscountType = 'percent' | 'fixed'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: UserRole
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string | null
  full_name: string
  line1: string
  line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string | null
  is_default: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string
  gender: Gender
  base_price: number
  sale_price: number | null
  status: ProductStatus
  avg_rating: number
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  size: string
  color: string
  stock_qty: number
  price_override: number | null
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  storage_path: string
  position: number
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  variant_id: string
  quantity: number
  updated_at: string
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  discount_type: DiscountType
  discount_value: number
  expires_at: string | null
  active: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  subtotal: number
  tax: number
  shipping_fee: number
  discount: number
  total: number
  applied_coupon_id: string | null
  shipping_address: ShippingAddressSnapshot
  stripe_session_id: string | null
  tracking_number: string | null
  created_at: string
}

export interface ShippingAddressSnapshot {
  full_name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
}

export interface OrderItem {
  id: string
  order_id: string
  variant_id: string
  quantity: number
  unit_price: number
  created_at: string
}

export interface OrderStatusHistory {
  id: string
  order_id: string
  status: OrderStatus
  changed_at: string
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

// Joined / enriched types used in queries
export interface ProductWithDetails extends Product {
  category: Category
  variants: ProductVariant[]
  images: ProductImage[]
}

export interface CartItemWithVariant extends CartItem {
  variant: ProductVariant & { product: Product & { images: ProductImage[] } }
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { variant: ProductVariant & { product: Product } })[]
}
