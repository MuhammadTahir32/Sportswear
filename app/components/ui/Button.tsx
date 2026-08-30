import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'icon-circle'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#C6FF3D] text-[#0D0D0D] font-bold hover:bg-[#A6E62D] active:scale-[0.97] shadow-sm',
  secondary:
    'bg-transparent border border-[#0D0D0D] text-[#0D0D0D] font-semibold hover:bg-[#0D0D0D] hover:text-white',
  'icon-circle':
    'bg-white text-[#0D0D0D] border border-[#EFEFEF] rounded-full hover:bg-[#C6FF3D] hover:border-[#C6FF3D] hover:scale-110 shadow-sm',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-[13px] px-5 py-2.5 gap-1.5 font-bold',
  md: 'text-[15px] px-7 py-3.5 gap-2 font-bold',
  lg: 'text-[17px] px-9 py-4.5 gap-2.5 font-bold',
}

const radiusStyles: Record<ButtonVariant, string> = {
  primary: 'rounded-[24px]',
  secondary: 'rounded-[8px]',
  'icon-circle': 'rounded-full p-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        variant !== 'icon-circle' && sizeStyles[size],
        radiusStyles[variant],
        className
      )}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {children}
          {icon && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  )
}
