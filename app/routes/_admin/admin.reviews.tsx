import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, Eye, Trash2, Star, Package } from 'lucide-react'

export const Route = createFileRoute('/_admin/admin/reviews')({
  component: AdminReviewsPage,
})

const MOCK_REVIEWS = [
  {
    id: 1,
    product: 'Running Shoes',
    customer: 'Jane Doe',
    rating: 5,
    review: 'Great fit and very comfortable!',
    date: 'Sep 1, 2025',
  },
  {
    id: 2,
    product: 'Yoga Mat',
    customer: 'Ahmed Raza',
    rating: 4,
    review: 'Good quality but a bit slippery.',
    date: 'Aug 28, 2025',
  },
  {
    id: 3,
    product: 'Sports Bra',
    customer: 'Sara Khan',
    rating: 5,
    review: 'Love the color and support.',
    date: 'Aug 25, 2025',
  },
  {
    id: 4,
    product: 'Athletic Shorts',
    customer: 'Usman Ali',
    rating: 3,
    review: 'Sizes run a bit small.',
    date: 'Aug 20, 2025',
  },
  {
    id: 5,
    product: 'Water Bottle',
    customer: 'Ali Hassan',
    rating: 5,
    review: 'Keeps water cold for hours.',
    date: 'Aug 18, 2025',
  },
]

function AdminReviewsPage() {
  const [searchInput, setSearchInput] = useState('')

  return (
    <div>
      <div className="pt-2 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Reviews</h2>
          <p className="text-[14px] text-[#9A9A9A] mt-1">
            Monitor and respond to customer reviews.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[16px] overflow-hidden flex flex-col min-h-[500px]">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[320px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search reviews..."
                className="w-full h-[40px] pl-10 pr-4 bg-[#111] rounded-full text-[13px] text-white placeholder:text-[#9A9A9A] focus:outline-none border border-transparent focus:border-[#C6FF3D]/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select className="h-[40px] px-4 bg-transparent border-none text-[13px] font-bold text-white focus:outline-none focus:ring-0 appearance-none cursor-pointer">
              <option value="" className="bg-[#111]">
                All Ratings
              </option>
              <option value="5" className="bg-[#111]">
                5 Stars
              </option>
              <option value="4" className="bg-[#111]">
                4 Stars & Up
              </option>
              <option value="3" className="bg-[#111]">
                3 Stars & Up
              </option>
            </select>

            <select className="h-[40px] px-4 bg-transparent border-none text-[13px] font-bold text-white focus:outline-none focus:ring-0 appearance-none cursor-pointer">
              <option value="" className="bg-[#111]">
                Sort by: Newest
              </option>
              <option value="oldest" className="bg-[#111]">
                Sort by: Oldest
              </option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4 flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A]">
                <th className="px-6 py-4 w-12">
                  <div className="w-4 h-4 border border-[#9A9A9A]/40 rounded-[4px] hover:border-[#C6FF3D] cursor-pointer transition-colors"></div>
                </th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold">Review</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_REVIEWS.map((review) => (
                <tr key={review.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-4 h-4 border border-[#9A9A9A]/40 rounded-[4px] hover:border-[#C6FF3D] cursor-pointer transition-colors"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-[8px] overflow-hidden flex-shrink-0 flex items-center justify-center text-[#9A9A9A]">
                        <Package size={16} />
                      </div>
                      <span className="text-[13px] font-semibold text-white truncate max-w-[150px]">
                        {review.product}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-white font-medium">{review.customer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-[#333] fill-[#333]'
                          }
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-[#9A9A9A] font-medium truncate max-w-[200px] block">
                      {review.review}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] text-[#9A9A9A] font-medium">{review.date}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-[#9A9A9A] hover:text-[#C6FF3D] transition-colors">
                        <Eye size={15} />
                      </button>
                      <button className="p-1.5 text-[#9A9A9A] hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-white/5 text-[12px] font-medium text-[#9A9A9A]">
          Showing 1-5 of 842 reviews
        </div>
      </div>
    </div>
  )
}
