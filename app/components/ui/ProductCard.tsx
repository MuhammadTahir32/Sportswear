import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { StarRating } from '@/components/ui/StarRating'
import { SwatchGroup } from '@/components/ui/SwatchGroup'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type Swatch = {
  id: string
  color: string
  image?: string
  label: string
}

type ProductCardProps = {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount?: number
  image: string
  swatches?: Swatch[]
  isNew?: boolean
  isSale?: boolean
  href?: string
  className?: string
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  image,
  swatches = [],
  isNew = false,
  isSale = false,
  href = '#',
  className,
}: ProductCardProps): React.JSX.Element {
  const [selectedSwatch, setSelectedSwatch] = useState<string | undefined>(swatches[0]?.id)

  return (
    <article id={`product-card-${id}`} className={cn('group flex flex-col gap-3', className)}>
      {/* Image */}
      <a
        href={href}
        className="card-img-wrap relative block bg-[#F7F7F7] aspect-square rounded-[10px]"
      >
        <img src={image} alt={name} className="w-full h-full object-contain p-4" loading="lazy" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && <Badge variant="black">New</Badge>}
          {isSale && <Badge variant="lime">Sale</Badge>}
        </div>
        {/* Quick view arrow */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button variant="icon-circle" aria-label={`Quick view ${name}`}>
            <ArrowUpRight size={16} />
          </Button>
        </div>
      </a>

      {/* Info */}
      <div className="flex flex-col gap-1.5 px-0.5">
        <a href={href} className="hover:text-[#C6FF3D] transition-colors duration-150">
          <h3 className="text-[14px] font-[600] text-[#0D0D0D] line-clamp-2 leading-snug">
            {name}
          </h3>
        </a>

        <StarRating rating={rating} count={reviewCount} size="sm" />

        <div className="flex items-center gap-2">
          <span className="text-[14px] font-[700] text-[#111111]">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-[12px] text-[#9A9A9A] line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {swatches.length > 0 && (
          <SwatchGroup
            swatches={swatches}
            maxVisible={4}
            selected={selectedSwatch}
            onSelect={setSelectedSwatch}
          />
        )}
      </div>
    </article>
  )
}
