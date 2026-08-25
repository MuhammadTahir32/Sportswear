import { cn } from '@/lib/cn'

type Logo = {
  id: string
  name: string
  src: string
  alt: string
}

type BrandLogoStripProps = {
  label?: string
  logos: Logo[]
  className?: string
}

export function BrandLogoStrip({
  label,
  logos,
  className,
}: BrandLogoStripProps): React.JSX.Element {
  return (
    <div className={cn('py-10 bg-white', className)}>
      {label && (
        <p className="text-center text-[11px] font-[600] uppercase tracking-[2px] text-[#9A9A9A] mb-6">
          {label}
        </p>
      )}
      <div className="flex items-center justify-center flex-wrap gap-8 md:gap-12 px-6">
        {logos.map((logo) => (
          <div key={logo.id} className="flex-shrink-0">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-8 w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
