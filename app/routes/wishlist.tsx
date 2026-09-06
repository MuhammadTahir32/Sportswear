import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Heart, Loader2 } from 'lucide-react'
import { useWishlistItems } from '@/hooks/useWishlist'
import { getProductImageUrl } from '@/hooks/useProducts'
import { ProductCard } from '@/components/ui/ProductCard'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/wishlist')({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({ to: '/' })
    }
  },
  component: WishlistPage,
})

function WishlistPage(): React.JSX.Element {
  const { data: items = [], isLoading } = useWishlistItems()

  return (
    <>
      <title>My Wishlist — StrideWear</title>
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-16 py-12">
        <h1 className="font-[Anton,sans-serif] text-[#0D0D0D] text-[32px] md:text-[40px] uppercase tracking-tight leading-none mb-8">
          My Wishlist
        </h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#9A9A9A]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-[#FAFAFA] rounded-[16px] border border-[#E0E0E0]">
            <Heart size={48} className="mx-auto text-[#9A9A9A] mb-4" strokeWidth={1.5} />
            <h2 className="text-[20px] font-bold text-[#0D0D0D] mb-2">Your wishlist is empty</h2>
            <p className="text-[#4A4A4A] text-sm mb-6 max-w-md mx-auto">
              Save your favorite items here to easily find them later.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-12 px-8 bg-[#0D0D0D] text-white font-bold text-[13px] uppercase tracking-wider hover:bg-[#C6FF3D] hover:text-[#0D0D0D] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
            {items.map(({ id, product }) => {
              const firstImg = product.images?.[0]
              return (
                <div key={id} className="relative group">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.sale_price ?? product.base_price}
                    originalPrice={product.sale_price ? product.base_price : undefined}
                    rating={product.avg_rating ?? 0}
                    image={
                      firstImg
                        ? getProductImageUrl(firstImg.storage_path)
                        : '/placeholder-product.jpg'
                    }
                    isSale={!!product.sale_price}
                    href={`/products/${product.slug}`}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
