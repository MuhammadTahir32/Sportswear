import { useState, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastVariant = 'success' | 'error' | 'info'

type Toast = {
  id: string
  variant: ToastVariant
  message: string
  duration?: number
}

type ToastItemProps = {
  toast: Toast
  onDismiss: (id: string) => void
}

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle size={18} className="text-[#C6FF3D] flex-shrink-0" />,
  error: <XCircle size={18} className="text-red-400 flex-shrink-0" />,
  info: <Info size={18} className="text-blue-400 flex-shrink-0" />,
}

const borderColors: Record<ToastVariant, string> = {
  success: 'border-l-[#C6FF3D]',
  error: 'border-l-red-400',
  info: 'border-l-blue-400',
}

function ToastItem({ toast, onDismiss }: ToastItemProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'toast-enter flex items-start gap-3 bg-[#0D0D0D] text-white',
        'rounded-[8px] shadow-2xl px-4 py-3 border-l-4 min-w-[300px] max-w-sm',
        borderColors[toast.variant]
      )}
      role="alert"
      aria-live="polite"
    >
      {icons[toast.variant]}
      <p className="flex-1 text-[13px] font-[500] leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 hover:text-[#C6FF3D] transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  )
}

type ToastContainerProps = {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastContainer({
  toasts,
  onDismiss,
}: ToastContainerProps): React.JSX.Element | null {
  if (toasts.length === 0) return null

  return createPortal(
    <div
      id="toast-container"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  )
}

type UseToast = {
  toasts: Toast[]
  toast: (message: string, variant?: ToastVariant, duration?: number) => void
  dismiss: (id: string) => void
}

export function useToast(): UseToast {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'success', duration = 4000): void => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
      setToasts((prev) => [...prev, { id, variant, message, duration }])
      setTimeout(() => dismiss(id), duration)
    },
    [dismiss]
  )

  return { toasts, toast, dismiss }
}
