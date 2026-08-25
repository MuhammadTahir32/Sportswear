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
        <div className="relative flex items-center">
          {icon && iconPosition === 'left' && (
            <span className="absolute left-3 flex items-center text-[#9A9A9A]">{icon}</span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-[8px] border bg-white text-sm text-[#0D0D0D] font-[Inter,sans-serif]',
              'transition-all duration-200 outline-none placeholder:text-[#9A9A9A]',
              'border-[#EFEFEF] focus:border-[#C6FF3D] focus:ring-2 focus:ring-[#C6FF3D]/20',
              'py-2.5',
              icon && iconPosition === 'left' ? 'pl-10 pr-4' : '',
              icon && iconPosition === 'right' ? 'pr-10 pl-4' : '',
              !icon ? 'px-4' : '',
              error ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : '',
              className
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <span className="absolute right-3 flex items-center text-[#9A9A9A]">{icon}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
