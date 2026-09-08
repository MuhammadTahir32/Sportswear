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
    <div
      className={cn(
        'flex items-center gap-2 rounded-[10px] border border-[#EFEFEF] bg-white',
        'pl-3.5 pr-2 py-2.5 transition-all duration-200',
        'focus-within:border-[#C6FF3D] focus-within:ring-2 focus-within:ring-[#C6FF3D]/20',
        className
      )}
    >
      <Search size={16} className="shrink-0 text-[#9A9A9A]" />
      <input
        ref={inputRef}
        id="product-search"
        type="search"
        defaultValue={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent text-sm text-[#0D0D0D] outline-none placeholder:text-[#9A9A9A]"
      />
      {value && (
        <button
          onClick={handleClear}
          className="shrink-0 p-0.5 text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
