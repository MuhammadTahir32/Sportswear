import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

type PromoBannerProps = {
  kicker?: string
  headline: string
  highlightedWord?: string
  ctaLabel?: string
  ctaHref?: string
  backgroundImage: string
  className?: string
}

export function PromoBanner({
  kicker,
  headline,
  highlightedWord,
  ctaLabel = 'Shop Now',
  ctaHref = '#',
  backgroundImage,
  className,
}: PromoBannerProps): React.JSX.Element {
  const words = headline.split(' ')
  const mainWords = highlightedWord ? words.filter((w) => w !== highlightedWord) : words

  return (
    <section
      id="promo-banner"
      className={cn(
        'relative overflow-hidden rounded-[10px] min-h-[380px] md:min-h-[480px] flex items-center',
        className
      )}
    >
      {/* Background image */}
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Gradient overlay (left to right) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-14 py-12 max-w-[640px]">
        {kicker && (
          <p className="text-[#C6FF3D] text-[11px] font-[600] uppercase tracking-[3px] mb-4">
            {kicker}
          </p>
        )}
        <h2 className="font-[Anton,sans-serif] text-white text-[52px] md:text-[68px] uppercase leading-[0.95] tracking-tight mb-6">
          {highlightedWord ? (
            <>
              {mainWords.join(' ')} <span className="text-[#C6FF3D]">{highlightedWord}</span>
            </>
          ) : (
            headline
          )}
        </h2>
        <Button
          variant="primary"
          size="lg"
          icon={<ArrowUpRight size={18} />}
          onClick={() => {
            window.location.href = ctaHref
          }}
        >
          {ctaLabel}
        </Button>
      </div>
    </section>
  )
}
