import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Package, Plus, Search, Filter, ArrowUpDown, Edit, Trash2, Loader2 } from 'lucide-react'
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

const STATUS_COLORS: Record<ProductStatus, string> = {
  active: 'bg-green-500/10 text-green-500',
  draft: 'bg-yellow-500/10 text-yellow-500',
  archived: 'bg-white/10 text-[#9A9A9A]',
}

const LOW_STOCK_THRESHOLD = 5

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

  function toggleSort(field: 'created_at' | 'name' | 'base_price') {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDir: prev.sortBy === field && prev.sortDir === 'desc' ? 'asc' : 'desc',
    }))
  }

  async function handleDelete(id: string) {
    await deleteProduct.mutateAsync(id)
    setDeleteId(null)
  }

  // Stats
  const totalProducts = products.length
  const activeCount = products.filter((p) => p.status === 'active').length
  const lowStockCount = products.filter((p) =>
    p.variants.some((v) => v.stock_qty <= LOW_STOCK_THRESHOLD)
  ).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Products</h2>
          <p className="text-[13px] text-[#9A9A9A]">Manage your product inventory and details.</p>
        </div>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-5 border-l-2 border-l-[#C6FF3D]">
          <p className="text-[12px] text-[#9A9A9A] mb-1">Total Products</p>
          <p className="text-[24px] font-bold text-white leading-none">{totalProducts}</p>
        </div>
        <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] p-5 border-l-2 border-l-green-500">
          <p className="text-[12px] text-[#9A9A9A] mb-1">Active</p>
          <p className="text-[24px] font-bold text-white leading-none">{activeCount}</p>
        </div>
        <div
          className={`bg-[#0D0D0D] border rounded-[12px] p-5 border-l-2 ${lowStockCount > 0 ? 'border-l-red-500 border-white/5' : 'border-l-white/5 border-white/5'}`}
        >
          <p className="text-[12px] text-[#9A9A9A] mb-1">Low Stock</p>
          <p
            className={`text-[24px] font-bold leading-none ${lowStockCount > 0 ? 'text-red-500' : 'text-white'}`}
          >
            {lowStockCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search products…"
            className="w-full h-[40px] pl-10 pr-4 bg-[#0D0D0D] border border-white/5 rounded-[8px] text-[13px] text-white placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#C6FF3D]/50 transition-colors"
          />
        </div>

        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
          <select
            value={filters.status ?? ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: (e.target.value || undefined) as ProductStatus | undefined,
              }))
            }
            className="h-[40px] pl-9 pr-8 bg-[#0D0D0D] border border-white/5 rounded-[8px] text-[13px] text-white focus:outline-none focus:border-[#C6FF3D]/50 appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <select
          value={filters.category ?? ''}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              category: e.target.value || undefined,
            }))
          }
          className="h-[40px] px-4 bg-[#0D0D0D] border border-white/5 rounded-[8px] text-[13px] text-white focus:outline-none focus:border-[#C6FF3D]/50 appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0D0D0D] border border-white/5 rounded-[12px] overflow-hidden">
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
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Product
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Status
                  </th>
                  <th
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] cursor-pointer hover:text-white"
                    onClick={() => toggleSort('base_price')}
                  >
                    <span className="flex items-center gap-1">
                      Price <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Stock
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Category
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => {
                  const totalStock = product.variants.reduce((sum, v) => sum + v.stock_qty, 0)
                  const hasLowStock = product.variants.some(
                    (v) => v.stock_qty <= LOW_STOCK_THRESHOLD
                  )
                  const image = product.images[0]

                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-[48px] h-[48px] bg-[#1A1A1A] rounded-[8px] overflow-hidden flex-shrink-0">
                            {image ? (
                              <img
                                src={getProductImageUrl(image.storage_path) || ''}
                                alt=""
                                className="w-full h-full object-contain p-0.5"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={16} className="text-[#9A9A9A]" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-white truncate max-w-[200px] mb-0.5">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-[#9A9A9A]">
                              {product.variants.length} variants
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px] ${STATUS_COLORS[product.status]}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          {product.sale_price ? (
                            <>
                              <span className="text-[13px] font-semibold text-[#C6FF3D]">
                                {formatCurrency(product.sale_price)}
                              </span>
                              <span className="text-[11px] line-through text-[#9A9A9A]">
                                {formatCurrency(product.base_price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-[13px] font-semibold text-white">
                              {formatCurrency(product.base_price)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[13px] font-semibold ${hasLowStock ? 'text-red-500' : 'text-white'}`}
                          >
                            {totalStock}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[12px] text-[#9A9A9A]">
                          {product.category?.name ?? '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            to={`/admin/products/${product.id}` as any}
                            className="p-2 text-[#9A9A9A] hover:text-[#C6FF3D] hover:bg-white/10 rounded-[6px] transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </Link>
                          {deleteId === product.id ? (
                            <div className="flex items-center gap-2 mr-2">
                              <button
                                onClick={() => handleDelete(product.id)}
                                disabled={deleteProduct.isPending}
                                className="text-[11px] font-semibold text-red-500 hover:text-red-400"
                              >
                                {deleteProduct.isPending ? '…' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-[11px] font-semibold text-[#9A9A9A] hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(product.id)}
                              className="p-2 text-[#9A9A9A] hover:text-red-500 hover:bg-red-500/10 rounded-[6px] transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
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
