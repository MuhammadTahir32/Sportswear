import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'light' | 'dark'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon, iconPosition = 'left', variant = 'light', className, id, ...props },
    ref
  ): React.JSX.Element => {
    const isDark = variant === 'dark'
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'text-xs font-semibold uppercase tracking-wide',
              isDark ? 'text-white' : 'text-[#4A4A4A]'
            )}
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center gap-2 rounded-[8px] border',
            'transition-all duration-200',
            isDark
              ? 'bg-black border-[#1A1A1A] focus-within:border-[#C6FF3D] focus-within:ring-1 focus-within:ring-[#C6FF3D]'
              : 'bg-white border-[#EFEFEF] focus-within:border-[#C6FF3D] focus-within:ring-2 focus-within:ring-[#C6FF3D]/20',
            error && !isDark
              ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-200'
              : '',
            error && isDark
              ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500'
              : ''
          )}
        >
          {icon && iconPosition === 'left' && (
            <span className="shrink-0 pl-4 text-[#9A9A9A]">{icon}</span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'min-w-0 flex-1 bg-transparent text-sm font-[Inter,sans-serif]',
              isDark
                ? 'text-white placeholder:text-[#4A4A4A]'
                : 'text-[#0D0D0D] placeholder:text-[#9A9A9A]',
              'outline-none',
              'py-3.5',
              icon && iconPosition === 'left' ? 'pr-4' : '',
              icon && iconPosition === 'right' ? 'pl-4' : '',
              !icon ? 'px-4' : '',
              className
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="shrink-0 pr-4 text-[#9A9A9A]">{icon}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
