import { useState } from 'react'
import { cn } from '@/lib/cn'
import { getProductImageUrl } from '@/hooks/useProducts'
import type { ProductImage } from '@/lib/types'
import { ZoomIn } from 'lucide-react'

interface ImageGalleryProps {
  images: ProductImage[]
  productName: string
  className?: string
}

export function ImageGallery({
  images,
  productName,
  className,
}: ImageGalleryProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const sorted = [...images].sort((a, b) => a.position - b.position)
  const activeImg = sorted[activeIndex]

  if (!activeImg) {
    return (
      <div
        className={cn(
          'aspect-square bg-[#F7F7F7] rounded-[12px] flex items-center justify-center',
          className
        )}
      >
        <span className="text-[#9A9A9A] text-sm">No image</span>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Main image */}
      <div
        className="relative card-img-wrap aspect-square bg-[#F7F7F7] rounded-[12px] overflow-hidden group cursor-zoom-in"
        onClick={() => setZoomed(true)}
      >
        <img
          src={getProductImageUrl(activeImg.storage_path)}
          alt={`${productName} — image ${activeIndex + 1}`}
          className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
            <ZoomIn size={15} className="text-[#0D0D0D]" />
          </div>
        </div>
        {/* Image counter */}
        <div className="absolute bottom-3 left-3 bg-[#0D0D0D]/70 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
          {activeIndex + 1} / {sorted.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              className={cn(
                'shrink-0 w-16 h-16 rounded-[8px] bg-[#F7F7F7] overflow-hidden border-2 transition-all duration-150',
                idx === activeIndex
                  ? 'border-[#C6FF3D] ring-2 ring-[#C6FF3D]/30'
                  : 'border-transparent hover:border-[#0D0D0D]/20'
              )}
            >
              <img
                src={getProductImageUrl(img.storage_path)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-contain p-1"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <img
            src={getProductImageUrl(activeImg.storage_path)}
            alt={productName}
            className="max-w-full max-h-full object-contain rounded-[8px]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
