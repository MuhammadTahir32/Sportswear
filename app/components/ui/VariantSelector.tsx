import { cn } from '@/lib/cn'
import type { ProductVariant } from '@/lib/types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariantId: string | null
  onSelect: (variantId: string) => void
}

// Derive unique sizes and colors from variant list
function getUniqueSizes(variants: ProductVariant[]): string[] {
  return [...new Set(variants.map((v) => v.size))].sort()
}

function getUniqueColors(variants: ProductVariant[]): string[] {
  return [...new Set(variants.map((v) => v.color))]
}

function isVariantAvailable(variants: ProductVariant[], size: string, color: string): boolean {
  return variants.some((v) => v.size === size && v.color === color && v.stock_qty > 0)
}

function findVariant(
  variants: ProductVariant[],
  size: string,
  color: string
): ProductVariant | undefined {
  return variants.find((v) => v.size === size && v.color === color)
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps): React.JSX.Element {
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null

  const sizes = getUniqueSizes(variants)
  const colors = getUniqueColors(variants)

  const selectedSize = selectedVariant?.size ?? null
  const selectedColor = selectedVariant?.color ?? null

  const handleSizeClick = (size: string) => {
    // Keep the current color if the size/color combo exists
    if (selectedColor) {
      const v = findVariant(variants, size, selectedColor)
      if (v) {
        onSelect(v.id)
        return
      }
    }
    // Otherwise pick the first available color for this size
    const first = variants.find((v) => v.size === size && v.stock_qty > 0)
    if (first) onSelect(first.id)
  }

  const handleColorClick = (color: string) => {
    if (selectedSize) {
      const v = findVariant(variants, selectedSize, color)
      if (v) {
        onSelect(v.id)
        return
      }
    }
    const first = variants.find((v) => v.color === color && v.stock_qty > 0)
    if (first) onSelect(first.id)
  }

  return (
    <div className="space-y-5">
      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0D0D0D]">
              Size
              {selectedSize && (
                <span className="ml-2 text-[#9A9A9A] font-medium normal-case tracking-normal">
                  — {selectedSize}
                </span>
              )}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = selectedColor
                ? isVariantAvailable(variants, size, selectedColor)
                : variants.some((v) => v.size === size && v.stock_qty > 0)
              const isSelected = selectedSize === size

              return (
                <button
                  key={size}
                  onClick={() => handleSizeClick(size)}
                  disabled={!available}
                  aria-label={`Size ${size}${!available ? ' — out of stock' : ''}`}
                  className={cn(
                    'min-w-[44px] h-10 px-3 rounded-[8px] text-sm font-semibold transition-all duration-150 border',
                    isSelected
                      ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                      : available
                        ? 'bg-white text-[#0D0D0D] border-[#EFEFEF] hover:border-[#0D0D0D]'
                        : 'bg-[#F7F7F7] text-[#9A9A9A] border-[#EFEFEF] cursor-not-allowed relative',
                    !available &&
                      'before:content-[""] before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-[#9A9A9A]/40 before:rotate-[-15deg]'
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div>
          <div className="mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0D0D0D]">
              Color
              {selectedColor && (
                <span className="ml-2 text-[#9A9A9A] font-medium normal-case tracking-normal">
                  — {selectedColor}
                </span>
              )}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const available = selectedSize
                ? isVariantAvailable(variants, selectedSize, color)
                : variants.some((v) => v.color === color && v.stock_qty > 0)
              const isSelected = selectedColor === color

              return (
                <button
                  key={color}
                  onClick={() => handleColorClick(color)}
                  disabled={!available}
                  aria-label={`Color: ${color}${!available ? ' — out of stock' : ''}`}
                  className={cn(
                    'px-4 h-9 rounded-[8px] text-xs font-semibold transition-all duration-150 border',
                    isSelected
                      ? 'bg-[#0D0D0D] text-white border-[#0D0D0D]'
                      : available
                        ? 'bg-white text-[#4A4A4A] border-[#EFEFEF] hover:border-[#0D0D0D]'
                        : 'bg-[#F7F7F7] text-[#9A9A9A] border-[#EFEFEF] cursor-not-allowed line-through'
                  )}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock status */}
      {selectedVariant && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              selectedVariant.stock_qty > 10
                ? 'bg-green-500'
                : selectedVariant.stock_qty > 0
                  ? 'bg-orange-400'
                  : 'bg-red-400'
            )}
          />
          <span className="text-xs text-[#4A4A4A] font-medium">
            {selectedVariant.stock_qty > 10
              ? 'In Stock'
              : selectedVariant.stock_qty > 0
                ? `Only ${selectedVariant.stock_qty} left`
                : 'Out of Stock'}
          </span>
          {selectedVariant.sku && (
            <span className="text-[10px] text-[#9A9A9A] ml-auto font-mono">
              SKU: {selectedVariant.sku}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
