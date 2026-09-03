import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

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
  ctaLabel = 'Explore',
  ctaHref = '#',
  backgroundImage,
  className,
}: PromoBannerProps): React.JSX.Element {
  return (
    <section id="promo-banner" className={cn('promo-banner', className)}>
      {/* Background image — covers entire banner */}
      <img
        src={backgroundImage}
        alt="Custom Sneaker Laces"
        className="promo-banner__bg"
        loading="lazy"
      />

      {/* Subtle gradient overlay for text readability on right */}
      <div className="promo-banner__overlay" />

      {/* Small top-left kicker text */}
      {kicker && <p className="promo-banner__kicker">{kicker}</p>}

      {/* Right-aligned headline + CTA */}
      <div className="promo-banner__content">
        <h2 className="promo-banner__headline">
          <span className="promo-banner__headline-word promo-banner__headline-word--white">
            Custom
          </span>
          <span className="promo-banner__headline-word promo-banner__headline-word--lime">
            Sneaker
          </span>
          <span className="promo-banner__headline-word promo-banner__headline-word--white">
            Laces
          </span>
        </h2>
        <a href={ctaHref} className="promo-banner__cta">
          {ctaLabel}
          <ArrowUpRight size={18} strokeWidth={2.5} />
        </a>
      </div>
    </section>
  )
}
