import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/size-chart')({
  component: SizeChartPage,
})

function SizeChartPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center py-20 px-6 bg-white">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="font-[Anton,sans-serif] text-[48px] uppercase tracking-tight text-[#0D0D0D] mb-4">
            Shoelace Size Chart
          </h1>
          <p className="text-[16px] text-[#4A4A4A] leading-relaxed">
            Find the perfect length for your sneakers or boots. For the most accurate fit, we
            recommend measuring your current laces.
          </p>
        </div>

        <div className="overflow-x-auto border border-[#EFEFEF] rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F7F7] border-b border-[#EFEFEF]">
                <th className="p-4 font-[600] text-[#0D0D0D] text-[14px] uppercase tracking-wider">
                  Shoe Size (US)
                </th>
                <th className="p-4 font-[600] text-[#0D0D0D] text-[14px] uppercase tracking-wider">
                  Lace Length
                </th>
                <th className="p-4 font-[600] text-[#0D0D0D] text-[14px] uppercase tracking-wider">
                  Recommended For
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#EFEFEF]">
                <td className="p-4 text-[14px] text-[#4A4A4A]">3–5</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">36" (91 cm)</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">Kids / Low-top sneakers</td>
              </tr>
              <tr className="border-b border-[#EFEFEF]">
                <td className="p-4 text-[14px] text-[#4A4A4A]">5–8</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">45" (114 cm)</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">
                  Low-top sneakers (Vans, Converse)
                </td>
              </tr>
              <tr className="border-b border-[#EFEFEF]">
                <td className="p-4 text-[14px] text-[#4A4A4A]">7–10</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">54" (137 cm)</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">Mid-top sneakers (Nike, Adidas)</td>
              </tr>
              <tr className="border-b border-[#EFEFEF]">
                <td className="p-4 text-[14px] text-[#4A4A4A]">9–12</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">63" (160 cm)</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">High-top sneakers, boots</td>
              </tr>
              <tr>
                <td className="p-4 text-[14px] text-[#4A4A4A]">11–14</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">72" (183 cm)</td>
                <td className="p-4 text-[14px] text-[#4A4A4A]">Large boots, hiking shoes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
