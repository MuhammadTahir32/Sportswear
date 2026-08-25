import { cn } from '@/lib/cn'

type Swatch = {
  id: string
  color: string
  image?: string
  label: string
}

type SwatchGroupProps = {
  swatches: Swatch[]
  maxVisible?: number
  selected?: string
  onSelect?: (id: string) => void
  className?: string
}

export function SwatchGroup({
  swatches,
  maxVisible = 4,
  selected,
  onSelect,
  className,
}: SwatchGroupProps): React.JSX.Element {
  const visible = swatches.slice(0, maxVisible)
  const overflow = swatches.length - maxVisible

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {visible.map((swatch) => (
        <button
          key={swatch.id}
          title={swatch.label}
          onClick={() => onSelect?.(swatch.id)}
          className={cn(
            'w-5 h-5 rounded-sm border-2 transition-all duration-150 cursor-pointer flex-shrink-0',
            selected === swatch.id
              ? 'border-[#0D0D0D] scale-110 shadow-sm'
              : 'border-[#EFEFEF] hover:border-[#9A9A9A]'
          )}
          style={
            swatch.image
              ? { backgroundImage: `url(${swatch.image})`, backgroundSize: 'cover' }
              : { backgroundColor: swatch.color }
          }
        />
      ))}
      {overflow > 0 && (
        <span className="text-[10px] text-[#9A9A9A] font-semibold bg-[#F7F7F7] border border-[#EFEFEF] rounded-sm px-1.5 py-0.5 leading-none">
          +{overflow}
        </span>
      )}
    </div>
  )
}
