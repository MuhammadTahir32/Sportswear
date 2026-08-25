import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

type DrawerProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
}: DrawerProps): React.JSX.Element | null {
  useEffect((): (() => void) => {
    if (!isOpen) return () => undefined
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={cn(
          'relative z-10 flex flex-col bg-white h-full w-full max-w-[420px]',
          'shadow-2xl',
          className
        )}
        style={{ animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) forwards' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFEFEF] flex-shrink-0">
          {title && (
            <h2 className="font-[Anton,sans-serif] text-[20px] uppercase tracking-tight text-[#0D0D0D]">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            id="drawer-close-btn"
            className="ml-auto p-2 hover:bg-[#F7F7F7] rounded-full transition-colors"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Sticky footer */}
        {footer && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-[#EFEFEF] bg-white">{footer}</div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>,
    document.body
  )
}
