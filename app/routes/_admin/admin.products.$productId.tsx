import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  ImageIcon,
} from 'lucide-react'
import {
  useAdminProductDetail,
  useCreateProduct,
  useUpdateProduct,
  useAdminCategories,
  useCreateVariant,
  useUpdateVariant,
  useDeleteVariant,
  useUploadProductImage,
  useDeleteProductImage,
  type ProductFormData,
} from '@/hooks/useAdminProducts'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type {
  ProductVariant,
  ProductImage,
  ProductStatus,
  Gender,
  ProductWithDetails,
} from '@/lib/types'

export const Route = createFileRoute('/_admin/admin/products/$productId')({
  component: AdminProductEditPage,
})

const LOW_STOCK_THRESHOLD = 5

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function AdminProductEditPage(): React.JSX.Element {
  const { productId } = Route.useParams()
  const isNew = productId === 'new'

  const { data: product, isLoading } = useAdminProductDetail(isNew ? null : productId)
  const { data: categories = [] } = useAdminCategories()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#9A9A9A]" />
      </div>
    )
  }

  return (
    <div>
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        to={'/admin/products' as any}
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <h2 className="text-[20px] font-bold text-[#0D0D0D] mb-6">
        {isNew ? 'New Product' : 'Edit Product'}
      </h2>

      <ProductForm
        productId={isNew ? null : productId}
        product={product ?? null}
        categories={categories}
        isNew={isNew}
      />
    </div>
  )
}

function ProductForm({
  productId,
  product,
  categories,
  isNew,
}: {
  productId: string | null
  product: ProductWithDetails | null
  categories: { id: string; name: string }[]
  isNew: boolean
}): React.JSX.Element {
  const navigate = useNavigate()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const [form, setForm] = useState<ProductFormData>(() => {
    if (product) {
      return {
        name: product.name,
        slug: product.slug,
        description: product.description ?? '',
        category_id: product.category_id,
        gender: product.gender,
        base_price: product.base_price,
        sale_price: product.sale_price,
        status: product.status,
      }
    }
    return {
      name: '',
      slug: '',
      description: '',
      category_id: '',
      gender: 'unisex',
      base_price: 0,
      sale_price: null,
      status: 'draft',
    }
  })
  const [saveError, setSaveError] = useState<string | null>(null)
  const [autoSlug, setAutoSlug] = useState(true)

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: autoSlug ? slugify(name) : prev.slug,
    }))
  }

  async function handleSave() {
    setSaveError(null)
    try {
      if (isNew) {
        const created = await createProduct.mutateAsync(form)
        navigate({ to: `/admin/products/${created.id}` })
      } else {
        await updateProduct.mutateAsync({ ...form, id: productId! })
      }
    } catch (err) {
      setSaveError((err as Error).message)
    }
  }

  const isSaving = createProduct.isPending || updateProduct.isPending

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div />
        <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 size={14} className="animate-spin mr-1.5" />
          ) : (
            <Save size={14} className="mr-1.5" />
          )}
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 mb-6 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-[13px] text-red-600">{saveError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
              Basic Information
            </h3>
            <div className="flex flex-col gap-4">
              <Input
                label="Product Name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Running Shoes Pro"
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => {
                  setAutoSlug(false)
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }}
                placeholder="running-shoes-pro"
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A]">
                  Description
                </label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Product description…"
                  className="w-full rounded-[8px] border border-[#EFEFEF] bg-white text-sm text-[#0D0D0D] font-[Inter,sans-serif] transition-all duration-200 outline-none placeholder:text-[#9A9A9A] focus:border-[#C6FF3D] focus:ring-2 focus:ring-[#C6FF3D]/20 p-4 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
              Pricing
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Base Price"
                type="number"
                value={form.base_price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, base_price: Number(e.target.value) }))
                }
                min={0}
              />
              <Input
                label="Sale Price (optional)"
                type="number"
                value={form.sale_price ?? ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sale_price: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                min={0}
              />
            </div>
          </div>

          {!isNew && productId && product && (
            <VariantsSection productId={productId} variants={product.variants} />
          )}

          {!isNew && productId && product && (
            <ImagesSection productId={productId} images={product.images} />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A] mb-4">
              Organization
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A]">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value as ProductStatus }))
                  }
                  className="h-[38px] px-4 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#C6FF3D] appearance-none cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A]">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, gender: e.target.value as Gender }))
                  }
                  className="h-[38px] px-4 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#C6FF3D] appearance-none cursor-pointer"
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A]">
                  Category
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                  className="h-[38px] px-4 border border-[#E0E0E0] rounded-[8px] text-[13px] text-[#0D0D0D] bg-white focus:outline-none focus:border-[#C6FF3D] appearance-none cursor-pointer"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function VariantsSection({
  productId,
  variants,
}: {
  productId: string
  variants: ProductVariant[]
}) {
  const createVariant = useCreateVariant()
  const updateVariant = useUpdateVariant()
  const deleteVariant = useDeleteVariant()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({
    sku: '',
    size: '',
    color: '',
    stock_qty: 0,
    price_override: null as number | null,
  })
  const [error, setError] = useState<string | null>(null)

  function resetForm() {
    setForm({ sku: '', size: '', color: '', stock_qty: 0, price_override: null })
    setEditingId(null)
    setShowNew(false)
    setError(null)
  }

  function startEdit(v: ProductVariant) {
    setEditingId(v.id)
    setForm({
      sku: v.sku,
      size: v.size,
      color: v.color,
      stock_qty: v.stock_qty,
      price_override: v.price_override,
    })
    setShowNew(false)
    setError(null)
  }

  async function handleSave() {
    setError(null)
    try {
      if (editingId) {
        await updateVariant.mutateAsync({ id: editingId, productId, ...form })
      } else {
        await createVariant.mutateAsync({ productId, ...form })
      }
      resetForm()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function handleDelete(id: string) {
    await deleteVariant.mutateAsync({ id, productId })
    if (editingId === id) resetForm()
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A]">
          Variants ({variants.length})
        </h3>
        {!showNew && !editingId && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              resetForm()
              setShowNew(true)
            }}
          >
            <Plus size={14} className="mr-1" />
            Add
          </Button>
        )}
      </div>

      <div className="divide-y divide-[#EFEFEF] mb-4">
        {variants.map((v) => {
          const isLow = v.stock_qty <= LOW_STOCK_THRESHOLD
          return (
            <div key={v.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-[#0D0D0D]">
                    {v.color} / {v.size}
                  </p>
                  <p className="text-[11px] text-[#9A9A9A]">
                    SKU: {v.sku} · Stock: {v.stock_qty}
                    {isLow && <AlertTriangle size={12} className="inline ml-1 text-red-500" />}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(v)}
                  className="text-[11px] font-semibold text-[#9A9A9A] hover:text-[#0D0D0D]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="text-[11px] font-semibold text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
        {variants.length === 0 && (
          <p className="text-[13px] text-[#9A9A9A] py-4 text-center">No variants yet</p>
        )}
      </div>

      {(showNew || editingId) && (
        <div className="bg-[#FAFAFA] border border-[#EFEFEF] rounded-[8px] p-4">
          <p className="text-[12px] font-bold text-[#0D0D0D] mb-3">
            {editingId ? 'Edit Variant' : 'New Variant'}
          </p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input
              label="SKU"
              value={form.sku}
              onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
              placeholder="SKU-001"
            />
            <Input
              label="Color"
              value={form.color}
              onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
              placeholder="Black"
            />
            <Input
              label="Size"
              value={form.size}
              onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}
              placeholder="L"
            />
            <Input
              label="Stock"
              type="number"
              value={form.stock_qty}
              onChange={(e) => setForm((p) => ({ ...p, stock_qty: Number(e.target.value) }))}
              min={0}
            />
          </div>
          {error && <p className="text-[12px] text-red-500 mb-2">{error}</p>}
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleSave}>
              {editingId ? 'Update' : 'Create'}
            </Button>
            <Button variant="secondary" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ImagesSection({ productId, images }: { productId: string; images: ProductImage[] }) {
  const uploadImage = useUploadProductImage()
  const deleteImage = useDeleteProductImage()
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadImage.mutateAsync({
        productId,
        file,
        position: images.length,
      })
    } catch {
      // Error handled by mutation
    }
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(img: ProductImage) {
    await deleteImage.mutateAsync({
      id: img.id,
      productId,
      storagePath: img.storage_path,
    })
  }

  return (
    <div className="bg-white border border-[#E0E0E0] rounded-[12px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#9A9A9A]">
          Images ({images.length})
        </h3>
        <label className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0D0D0D] cursor-pointer hover:text-[#C6FF3D]">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Upload
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-[#E0E0E0] rounded-[8px] py-10 text-center">
          <ImageIcon size={24} className="mx-auto text-[#9A9A9A] mb-2" />
          <p className="text-[13px] text-[#9A9A9A]">No images uploaded</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {images
            .slice()
            .sort((a, b) => a.position - b.position)
            .map((img) => (
              <div key={img.id} className="relative group">
                <div className="aspect-square bg-[#F0F0F0] rounded-[8px] overflow-hidden">
                  <img src={img.storage_path} alt="" className="w-full h-full object-contain p-1" />
                </div>
                <button
                  onClick={() => handleDelete(img)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
                <p className="text-[10px] text-[#9A9A9A] mt-1 text-center">#{img.position + 1}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
