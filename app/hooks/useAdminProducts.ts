import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type {
  Product,
  ProductWithDetails,
  ProductVariant,
  ProductImage,
  ProductStatus,
  Gender,
  Category,
  Coupon,
} from '@/lib/types'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const adminProductKeys = {
  all: ['admin-products'] as const,
  list: (filters?: AdminProductFilters) => ['admin-products', 'list', filters] as const,
  detail: (id: string) => ['admin-products', 'detail', id] as const,
}

export const adminCategoryKeys = {
  all: ['admin-categories'] as const,
}

export const adminCouponKeys = {
  all: ['admin-coupons'] as const,
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminProductFilters {
  status?: ProductStatus
  category?: string
  search?: string
  sortBy?: 'created_at' | 'name' | 'base_price'
  sortDir?: 'asc' | 'desc'
}

export type ProductFormData = {
  name: string
  slug: string
  description: string | null
  category_id: string
  gender: Gender
  base_price: number
  sale_price: number | null
  status: ProductStatus
}

export type VariantFormData = Omit<ProductVariant, 'id' | 'product_id' | 'created_at'>

export type CouponFormData = Omit<Coupon, 'id' | 'created_at'>

// ─── Product List ─────────────────────────────────────────────────────────────

export function useAdminProducts(filters?: AdminProductFilters) {
  return useQuery({
    queryKey: adminProductKeys.list(filters),
    queryFn: async (): Promise<ProductWithDetails[]> => {
      let query = supabase.from('products').select(`
          *,
          category:categories(*),
          variants:product_variants(*),
          images:product_images(*)
        `)

      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.category) query = query.eq('category_id', filters.category)
      if (filters?.search) query = query.ilike('name', `%${filters.search}%`)

      const sortBy = filters?.sortBy ?? 'created_at'
      const sortDir = filters?.sortDir ?? 'desc'
      query = query.order(sortBy, { ascending: sortDir === 'asc' })

      const { data, error } = await query
      if (error) throw new Error(error.message)
      return (data ?? []) as ProductWithDetails[]
    },
    staleTime: 1000 * 30,
  })
}

// ─── Product Detail ───────────────────────────────────────────────────────────

export function useAdminProductDetail(productId: string | null | undefined) {
  return useQuery({
    queryKey: adminProductKeys.detail(productId ?? ''),
    queryFn: async (): Promise<ProductWithDetails | null> => {
      if (!productId) return null

      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          category:categories(*),
          variants:product_variants(*),
          images:product_images(*)
        `
        )
        .eq('id', productId)
        .single()

      if (error) throw new Error(error.message)
      return data as ProductWithDetails
    },
    enabled: !!productId,
    staleTime: 1000 * 15,
  })
}

// ─── Create Product ───────────────────────────────────────────────────────────

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ProductFormData): Promise<Product> => {
      const { data, error } = await supabase.from('products').insert(payload).select().single()
      if (error) throw new Error(error.message)
      return data as Product
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.all })
    },
  })
}

// ─── Update Product ───────────────────────────────────────────────────────────

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: ProductFormData & { id: string }): Promise<Product> => {
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as Product
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminProductKeys.all })
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(vars.id) })
    },
  })
}

// ─── Delete Product ───────────────────────────────────────────────────────────

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminProductKeys.all })
    },
  })
}

// ─── Variant CRUD ─────────────────────────────────────────────────────────────

export function useCreateVariant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      productId,
      ...payload
    }: VariantFormData & { productId: string }): Promise<ProductVariant> => {
      const { data, error } = await supabase
        .from('product_variants')
        .insert({ ...payload, product_id: productId })
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data as ProductVariant
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(vars.productId) })
    },
  })
}

export function useUpdateVariant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      productId,
      ...payload
    }: Partial<VariantFormData> & { id: string; productId: string }) => {
      void productId
      const { error } = await supabase.from('product_variants').update(payload).eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(vars.productId) })
    },
  })
}

export function useDeleteVariant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, productId }: { id: string; productId: string }) => {
      const { error } = await supabase.from('product_variants').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return productId
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(vars.productId) })
    },
  })
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

export function useUploadProductImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      productId,
      file,
      position,
    }: {
      productId: string
      file: File
      position: number
    }): Promise<ProductImage> => {
      const ext = file.name.split('.').pop()
      const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('products')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadErr) throw new Error(uploadErr.message)

      const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName)

      const { data, error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          storage_path: urlData.publicUrl,
          position,
        })
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as ProductImage
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(vars.productId) })
    },
  })
}

export function useDeleteProductImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      productId,
      storagePath,
    }: {
      id: string
      productId: string
      storagePath: string
    }) => {
      try {
        const url = new URL(storagePath)
        const parts = url.pathname.split('/storage/v1/object/public/products/')
        if (parts[1]) {
          await supabase.storage.from('products').remove([parts[1]])
        }
      } catch {
        // Non-critical: continue even if storage deletion fails
      }

      const { error } = await supabase.from('product_images').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return productId
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(vars.productId) })
    },
  })
}

export function useReorderProductImages() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ productId, imageIds }: { productId: string; imageIds: string[] }) => {
      for (let i = 0; i < imageIds.length; i++) {
        const { error } = await supabase
          .from('product_images')
          .update({ position: i })
          .eq('id', imageIds[i])
        if (error) throw new Error(error.message)
      }
      return productId
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminProductKeys.detail(vars.productId) })
    },
  })
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useAdminCategories() {
  return useQuery({
    queryKey: adminCategoryKeys.all,
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw new Error(error.message)
      return (data ?? []) as Category[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      name: string
      slug: string
      parent_id: string | null
    }): Promise<Category> => {
      const { data, error } = await supabase.from('categories').insert(payload).select().single()
      if (error) throw new Error(error.message)
      return data as Category
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: adminCategoryKeys.all }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: string
      name: string
      slug: string
      parent_id: string | null
    }) => {
      const { error } = await supabase.from('categories').update(payload).eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: adminCategoryKeys.all }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: adminCategoryKeys.all }),
  })
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export function useAdminCoupons() {
  return useQuery({
    queryKey: adminCouponKeys.all,
    queryFn: async (): Promise<Coupon[]> => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return (data ?? []) as Coupon[]
    },
    staleTime: 1000 * 60,
  })
}

export function useCreateCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CouponFormData): Promise<Coupon> => {
      const { data, error } = await supabase.from('coupons').insert(payload).select().single()
      if (error) throw new Error(error.message)
      return data as Coupon
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: adminCouponKeys.all }),
  })
}

export function useUpdateCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: CouponFormData & { id: string }) => {
      const { error } = await supabase.from('coupons').update(payload).eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: adminCouponKeys.all }),
  })
}

export function useDeleteCoupon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('coupons').delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: adminCouponKeys.all }),
  })
}
