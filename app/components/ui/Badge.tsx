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
  black: 'bg-[#0D0D0D] text-white font-bold',
  outline: 'bg-transparent border border-[#0D0D0D] text-[#0D0D0D] font-bold',
  gold: 'bg-[#F5A623] text-white font-bold',
}

export function Badge({ variant = 'lime', children, className }: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[14px] font-bold uppercase tracking-wider leading-none',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
