import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Package, Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react'
import {
  useAdminProducts,
  useDeleteProduct,
  useAdminCategories,
  type AdminProductFilters,
} from '@/hooks/useAdminProducts'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/cartCalculations'
import { getProductImageUrl } from '@/lib/supabase'
import type { ProductStatus } from '@/lib/types'

export const Route = createFileRoute('/_admin/admin/products')({
  component: AdminProductListPage,
})

function AdminProductListPage(): React.JSX.Element {
  const [filters, setFilters] = useState<AdminProductFilters>({
    sortBy: 'created_at',
    sortDir: 'desc',
  })
  const [searchInput, setSearchInput] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: products = [], isLoading } = useAdminProducts(filters)
  const { data: categories = [] } = useAdminCategories()
  const deleteProduct = useDeleteProduct()

  function handleSearch() {
    setFilters((prev) => ({ ...prev, search: searchInput || undefined }))
  }

  async function handleDelete(id: string) {
    await deleteProduct.mutateAsync(id)
    setDeleteId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Products</h2>
          <p className="text-[13px] text-[#9A9A9A]">Manage your product inventory and details.</p>
          <h2 className="text-2xl font-bold text-white">Products</h2>
          <p className="text-[14px] text-[#9A9A9A] mt-1">
            Manage your product inventory and details.
          </p>
        </div>
        <Link
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          to={'/admin/products/new' as any}
        >
          <Button className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-4 py-2 rounded-[8px] h-auto flex items-center shadow-[0_0_15px_rgba(198,255,61,0.2)]">
            <Plus size={16} className="mr-1.5 stroke-[3px]" />
            Add Product
          </Button>
        </Link>
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search products..."
                className="w-full h-[40px] pl-10 pr-4 bg-[#111] rounded-full text-[13px] text-white placeholder:text-[#9A9A9A] focus:outline-none border border-transparent focus:border-[#C6FF3D]/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <select
              value={filters.category ?? ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  category: e.target.value || undefined,
                }))
              }
              className="h-[40px] px-4 bg-transparent border-none text-[13px] font-bold text-white focus:outline-none focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#111]">
                All Categories
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={filters.status ?? ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: (e.target.value || undefined) as ProductStatus | undefined,
                }))
              }
              className="h-[40px] px-4 bg-transparent border-none text-[13px] font-bold text-white focus:outline-none focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#111]">
                All Status
              </option>
              <option value="active" className="bg-[#111]">
                Published
              </option>
              <option value="draft" className="bg-[#111]">
                Draft
              </option>
              <option value="archived" className="bg-[#111]">
                Archived
              </option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <Package size={48} className="text-white/10 mb-4" />
            <h3 className="text-[16px] font-bold text-white mb-1">No products found</h3>
            <p className="text-[13px] text-[#9A9A9A] mb-6">
              Get started by adding your first product.
            </p>
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={'/admin/products/new' as any}
            >
              <Button className="bg-[#C6FF3D] hover:bg-[#b0e633] text-[#0D0D0D] text-[13px] font-bold px-4 py-2 rounded-[8px] h-auto flex items-center">
                <Plus size={16} className="mr-1.5" />
                Add Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-[#9A9A9A]">
                  <th className="px-6 py-4 w-12">
                    <div className="w-4 h-4 border border-[#9A9A9A]/40 rounded-[4px] hover:border-[#C6FF3D] cursor-pointer transition-colors"></div>
                  </th>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => {
                  const totalStock = product.variants.reduce((sum, v) => sum + v.stock_qty, 0)
                  const image = product.images?.[0]

                  const isPublished = product.status === 'active'

                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="w-4 h-4 border border-[#9A9A9A]/40 rounded-[4px] hover:border-[#C6FF3D] cursor-pointer transition-colors"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded-[8px] overflow-hidden flex-shrink-0">
                            {image ? (
                              <img
                                src={getProductImageUrl(image.storage_path) || ''}
                                alt=""
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#9A9A9A]">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex flex-col justify-center">
                            <Link
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              to={`/admin/products/${product.id}` as any}
                              className="text-[13px] font-bold text-white hover:text-[#C6FF3D] transition-colors truncate block"
                            >
                              {product.name}
                            </Link>
                            <p className="text-[11px] font-medium text-[#9A9A9A]">
                              {product.category?.name ?? '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-white">
                            {formatCurrency(product.sale_price ?? product.base_price)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[12px] font-medium text-[#9A9A9A]">
                          In Stock ({totalStock})
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-[6px] ${
                            isPublished
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          {isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            to={`/admin/products/${product.id}` as any}
                            className="p-1.5 text-[#9A9A9A] hover:text-[#C6FF3D] hover:bg-white/10 rounded-[6px] transition-colors"
                          >
                            <Edit size={14} />
                          </Link>
                          {deleteId === product.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDelete(product.id)}
                                disabled={deleteProduct.isPending}
                                className="text-[11px] text-red-500 font-semibold hover:text-red-400"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-[11px] text-[#9A9A9A] font-semibold hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(product.id)}
                              className="p-1.5 text-[#9A9A9A] hover:text-red-500 hover:bg-red-500/10 rounded-[6px] transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
