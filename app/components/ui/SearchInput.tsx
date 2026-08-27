import { useRef, useEffect, type ChangeEvent } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search products…',
  className,
}: SearchInputProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync external value to DOM input (for URL-driven state)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value
    }
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search size={15} className="absolute left-3.5 text-[#9A9A9A] pointer-events-none" />
      <input
        ref={inputRef}
        id="product-search"
        type="search"
        defaultValue={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          'w-full rounded-[10px] border border-[#EFEFEF] bg-white text-sm text-[#0D0D0D]',
          'pl-10 pr-9 py-2.5 outline-none transition-all duration-200',
          'placeholder:text-[#9A9A9A]',
          'focus:border-[#C6FF3D] focus:ring-2 focus:ring-[#C6FF3D]/20'
        )}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
