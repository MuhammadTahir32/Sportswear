import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'lime' | 'black' | 'outline' | 'gold'

type BadgeProps = {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  lime: 'bg-[#C6FF3D] text-[#0D0D0D] font-bold',
  black: 'bg-[#0D0D0D] text-white font-semibold',
  outline: 'bg-transparent border border-[#0D0D0D] text-[#0D0D0D] font-semibold',
  gold: 'bg-[#F5A623] text-white font-bold',
}

export function Badge({ variant = 'lime', children, className }: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wide leading-none',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
