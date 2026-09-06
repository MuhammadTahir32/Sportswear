import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import {
  useAdminProducts,
  useDeleteProduct,
  useAdminCategories,
  type AdminProductFilters,
} from '@/hooks/useAdminProducts'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/cartCalculations'
import type { ProductStatus } from '@/lib/types'

export const Route = createFileRoute('/_admin/admin/products')({
  component: AdminProductListPage,
})

const STATUS_COLORS: Record<ProductStatus, string> = {
  active: 'bg-green-50 text-green-700',
  draft: 'bg-yellow-50 text-yellow-700',
  archived: 'bg-gray-100 text-gray-600',
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
        <h2 className="text-[20px] font-bold text-[#0D0D0D]">Products</h2>
        <Link
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          to={'/admin/products/new' as any}
        >
          <Button variant="primary" size="sm">
            <Plus size={16} className="mr-1.5" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-[10px] border border-[#E0E0E0] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-1">
            Total Products
          </p>
          <p className="text-[24px] font-bold text-[#0D0D0D]">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-[10px] border border-[#E0E0E0] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-1">
            Active
          </p>
          <p className="text-[24px] font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-[10px] border border-[#E0E0E0] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-1">
            Low Stock
          </p>
          <p
            className={`text-[24px] font-bold ${lowStockCount > 0 ? 'text-red-500' : 'text-[#0D0D0D]'}`}
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
            className="w-full h-[38px] pl-10 pr-4 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#0D0D0D] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#C6FF3D] transition-colors"
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
            className="h-[38px] pl-9 pr-8 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#C6FF3D] appearance-none cursor-pointer"
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
          className="h-[38px] px-4 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#C6FF3D] appearance-none cursor-pointer"
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
      <div className="bg-white border border-[#E0E0E0] rounded-[12px] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[14px] text-[#9A9A9A]">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EFEFEF] bg-[#FAFAFA]">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Product
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A]">
                    Status
                  </th>
                  <th
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#9A9A9A] cursor-pointer hover:text-[#0D0D0D]"
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
              <tbody className="divide-y divide-[#EFEFEF]">
                {products.map((product) => {
                  const totalStock = product.variants.reduce((sum, v) => sum + v.stock_qty, 0)
                  const hasLowStock = product.variants.some(
                    (v) => v.stock_qty <= LOW_STOCK_THRESHOLD
                  )
                  const image = product.images[0]

                  return (
                    <tr key={product.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-[44px] h-[44px] bg-[#F0F0F0] rounded-[6px] overflow-hidden flex-shrink-0">
                            {image ? (
                              <img
                                src={image.storage_path}
                                alt=""
                                className="w-full h-full object-contain p-0.5"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-[#9A9A9A]">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-[#0D0D0D] truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-[#9A9A9A]">
                              {product.variants.length} variants
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[product.status]}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[13px] font-semibold text-[#0D0D0D]">
                          {formatCurrency(product.base_price)}
                        </span>
                        {product.sale_price && (
                          <span className="text-[11px] text-[#5A8A00] ml-1">
                            {formatCurrency(product.sale_price)}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-semibold text-[#0D0D0D]">
                            {totalStock}
                          </span>
                          {hasLowStock && <AlertTriangle size={14} className="text-red-500" />}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-[#4A4A4A]">
                          {product.category?.name ?? '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            to={`/admin/products/${product.id}` as any}
                            className="p-1.5 text-[#9A9A9A] hover:text-[#C6FF3D] hover:bg-[#F0F0F0] rounded-[6px] transition-colors"
                          >
                            <Edit size={15} />
                          </Link>
                          {deleteId === product.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(product.id)}
                                disabled={deleteProduct.isPending}
                                className="text-[11px] font-semibold text-red-600 hover:underline"
                              >
                                {deleteProduct.isPending ? '…' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setDeleteId(null)}
                                className="text-[11px] font-semibold text-[#9A9A9A] hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteId(product.id)}
                              className="p-1.5 text-[#9A9A9A] hover:text-red-500 hover:bg-red-50 rounded-[6px] transition-colors"
                            >
                              <Trash2 size={15} />
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
