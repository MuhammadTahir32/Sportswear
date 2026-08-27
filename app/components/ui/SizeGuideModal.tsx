import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

const SIZE_CHART = [
  { size: 'XS', chest: '32–34"', waist: '24–26"', hip: '34–36"', inseam: '30"' },
  { size: 'S', chest: '35–37"', waist: '27–29"', hip: '37–39"', inseam: '30"' },
  { size: 'M', chest: '38–40"', waist: '30–32"', hip: '40–42"', inseam: '31"' },
  { size: 'L', chest: '41–43"', waist: '33–35"', hip: '43–45"', inseam: '32"' },
  { size: 'XL', chest: '44–46"', waist: '36–38"', hip: '46–48"', inseam: '32"' },
  { size: 'XXL', chest: '47–49"', waist: '39–41"', hip: '49–51"', inseam: '33"' },
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
            <p className="text-xs text-[#9A9A9A] mt-0.5">Measurements in inches</p>
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
                {['Size', 'Chest', 'Waist', 'Hip', 'Inseam'].map((col) => (
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
                  <td className="py-3 px-3 text-[#4A4A4A]">{row.chest}</td>
                  <td className="py-3 px-3 text-[#4A4A4A]">{row.waist}</td>
                  <td className="py-3 px-3 text-[#4A4A4A]">{row.hip}</td>
                  <td className="py-3 px-3 text-[#4A4A4A]">{row.inseam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip */}
        <div className="px-6 pb-6">
          <div className="bg-[#F7F7F7] rounded-[10px] p-4">
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              <span className="font-bold text-[#0D0D0D]">How to measure:</span> Chest — measure
              around the fullest part. Waist — measure around your natural waistline. Hip — measure
              around the fullest part of your hips. If you're between sizes, size up for a relaxed
              fit.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
