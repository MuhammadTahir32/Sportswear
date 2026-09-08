import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon, iconPosition = 'left', className, id, ...props },
    ref
  ): React.JSX.Element => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A]"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center gap-2 rounded-[8px] border bg-white',
            'transition-all duration-200',
            'border-[#EFEFEF] focus-within:border-[#C6FF3D] focus-within:ring-2 focus-within:ring-[#C6FF3D]/20',
            error ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-200' : ''
          )}
        >
          {icon && iconPosition === 'left' && (
            <span className="shrink-0 pl-3 text-[#9A9A9A]">{icon}</span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'min-w-0 flex-1 bg-transparent text-sm text-[#0D0D0D] font-[Inter,sans-serif]',
              'outline-none placeholder:text-[#9A9A9A]',
              'py-2.5',
              icon && iconPosition === 'left' ? 'pr-4' : '',
              icon && iconPosition === 'right' ? 'pl-4' : '',
              !icon ? 'px-4' : '',
              className
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="shrink-0 pr-3 text-[#9A9A9A]">{icon}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
