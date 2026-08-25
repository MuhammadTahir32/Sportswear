import { cn } from '@/lib/cn'

type SectionHeaderProps = {
  title: string
  actionLabel?: string
  actionHref?: string
  className?: string
  id?: string
}

export function SectionHeader({
  title,
  actionLabel,
  actionHref = '#',
  className,
  id,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div id={id} className={cn('flex items-end justify-between mb-6', className)}>
      <h2 className="font-[Anton,sans-serif] text-[40px] md:text-[44px] text-[#0D0D0D] uppercase leading-none tracking-tight">
        {title}
      </h2>
      {actionLabel && (
        <a
          href={actionHref}
          className="text-[13px] font-[600] text-[#0D0D0D] uppercase tracking-wide border-b border-[#0D0D0D] hover:text-[#C6FF3D] hover:border-[#C6FF3D] transition-colors duration-200 pb-0.5 flex-shrink-0"
        >
          {actionLabel} →
        </a>
      )}
    </div>
  )
}
