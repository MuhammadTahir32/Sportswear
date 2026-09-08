import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

const SIZE_CHART = [
  { size: '3–5', length: '36" (91 cm)', recommended: 'Kids / Low-top sneakers' },
  { size: '5–8', length: '45" (114 cm)', recommended: 'Low-top sneakers (Vans, Converse)' },
  { size: '7–10', length: '54" (137 cm)', recommended: 'Mid-top sneakers (Nike, Adidas)' },
  { size: '9–12', length: '63" (160 cm)', recommended: 'High-top sneakers, boots' },
  { size: '11–14', length: '72" (183 cm)', recommended: 'Large boots, hiking shoes' },
]

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps): React.JSX.Element | null {
  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Size Guide"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-[16px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EFEFEF]">
          <div>
            <h2
              className="text-xl font-black text-[#0D0D0D] uppercase tracking-tight"
              style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
            >
              Size Guide
            </h2>
            <p className="text-xs text-[#9A9A9A] mt-0.5">Shoelace length by US shoe size</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F7F7F7] transition-colors"
            aria-label="Close size guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {['Shoe Size (US)', 'Lace Length', 'Recommended For'].map((col) => (
                  <th
                    key={col}
                    className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A] border-b-2 border-[#EFEFEF]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row, i) => (
                <tr
                  key={row.size}
                  className={cn(
                    'transition-colors',
                    i % 2 === 0 ? 'bg-white' : 'bg-[#F7F7F7]',
                    'hover:bg-[#C6FF3D]/10'
                  )}
                >
                  <td className="py-3 px-3 font-black text-[#0D0D0D]">{row.size}</td>
                  <td className="py-3 px-3 text-[#4A4A4A]">{row.length}</td>
                  <td className="py-3 px-3 text-[#4A4A4A]">{row.recommended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip */}
        <div className="px-6 pb-6">
          <div className="bg-[#F7F7F7] rounded-[10px] p-4">
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              <span className="font-bold text-[#0D0D0D]">How to measure:</span> The easiest way to
              find your perfect lace length is to remove your current shoelaces and measure them
              from tip to tip. Alternatively, you can use the number of eyelets (holes) on your shoe
              as a guide. If you're between sizes, choose the shorter length for a cleaner look or
              the longer length if you prefer larger bows.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
