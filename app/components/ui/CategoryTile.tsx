import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

type CategoryTileProps = {
  image: string
  label: string
  href?: string
  aspectRatio?: '4/5' | '3/4' | '16/9'
  imageStyle?: React.CSSProperties
  className?: string
}

export function CategoryTile({
  image,
  label,
  href = '#',
  aspectRatio = '4/5',
  imageStyle,
  className,
}: CategoryTileProps): React.JSX.Element {
  const aspectMap = {
    '4/5': 'aspect-[4/5]',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-[16/9]',
  }

  return (
    <a
      href={href}
      id={`category-tile-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={cn(
        'card-img-wrap group relative block overflow-hidden rounded-[10px]',
        aspectMap[aspectRatio],
        className
      )}
      aria-label={`Browse ${label}`}
    >
      {/* Background image */}
      <img
        src={image}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover"
        style={imageStyle}
        loading="lazy"
      />

      {/* Dark gradient scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Bottom overlay content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
        <h3 className="font-[Anton,sans-serif] text-white text-[32px] md:text-[40px] uppercase tracking-wide leading-tight max-w-[80%]">
          {label}
        </h3>
        <div className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
          <Button
            variant="icon-circle"
            aria-label={`Browse ${label}`}
            className="bg-white/90 hover:bg-[#C6FF3D]"
          >
            <ArrowUpRight size={18} />
          </Button>
        </div>
      </div>
    </a>
  )
}
