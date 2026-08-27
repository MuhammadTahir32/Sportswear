import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ProductWithDetails, Category, Review } from '@/lib/types'

// ─── Helper: Supabase Storage public URL ─────────────────────────────────────

export function getProductImageUrl(storagePath: string): string {
  if (!storagePath) return '/placeholder-product.jpg'
  // If already a full URL, return as-is
  if (storagePath.startsWith('http')) return storagePath
  const { data } = supabase.storage.from('products').getPublicUrl(storagePath)
  return data.publicUrl
}

// ─── Filter & Sort Types ──────────────────────────────────────────────────────

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'top_rated'

export interface ProductFilters {
  category?: string // category slug
  gender?: string // 'men' | 'women' | 'unisex' | 'kids'
  search?: string // full-text search term
  minPrice?: number
  maxPrice?: number
  sort?: SortOption
  page?: number
  pageSize?: number
}

export interface ProductsResult {
  products: ProductWithDetails[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => ['products', 'list', filters] as const,
  detail: (slug: string) => ['products', 'detail', slug] as const,
  reviews: (productId: string, page: number) => ['products', 'reviews', productId, page] as const,
}

export const categoryKeys = {
  all: ['categories'] as const,
}

// ─── useProducts — paginated list with filters ────────────────────────────────

export function useProducts(filters: ProductFilters = {}) {
  const {
    category,
    gender,
    search,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    pageSize = 12,
  } = filters

  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async (): Promise<ProductsResult> => {
      let query = supabase
        .from('products')
        .select(
          `
          *,
          category:categories(*),
          variants:product_variants(*),
          images:product_images(*)
          `,
          { count: 'exact' }
        )
        .eq('status', 'active')

      // ── Filters ──
      if (gender) query = query.eq('gender', gender)
      if (minPrice !== undefined) query = query.gte('base_price', minPrice)
      if (maxPrice !== undefined) query = query.lte('base_price', maxPrice)

      if (search && search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`)
      }

      if (category) {
        // Join via categories table to filter by slug
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single()
        if (cat) query = query.eq('category_id', cat.id)
      }

      // ── Sort ──
      switch (sort) {
        case 'price_asc':
          query = query.order('base_price', { ascending: true })
          break
        case 'price_desc':
          query = query.order('base_price', { ascending: false })
          break
        case 'top_rated':
          query = query.order('avg_rating', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
      }

      // ── Pagination ──
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw new Error(error.message)

      const total = count ?? 0
      return {
        products: (data ?? []) as unknown as ProductWithDetails[],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  })
}

// ─── useProduct — single product by slug ─────────────────────────────────────

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: async (): Promise<ProductWithDetails | null> => {
      const { data, error } = await supabase
        .from('products')
        .select(
          `
          *,
          category:categories(*),
          variants:product_variants(*),
          images:product_images(* ORDER BY position ASC)
          `
        )
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // not found
        throw new Error(error.message)
      }
      return data as unknown as ProductWithDetails
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  })
}

// ─── useCategories — all categories ──────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw new Error(error.message)
      return (data ?? []) as Category[]
    },
    staleTime: 1000 * 60 * 10,
  })
}

// ─── useProductReviews — paginated reviews for a product ─────────────────────

export interface ReviewWithProfile extends Review {
  profile: { full_name: string | null } | null
}

export interface ReviewsResult {
  reviews: ReviewWithProfile[]
  total: number
  page: number
  totalPages: number
}

export function useProductReviews(productId: string, page = 1, pageSize = 6) {
  return useQuery({
    queryKey: productKeys.reviews(productId, page),
    queryFn: async (): Promise<ReviewsResult> => {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error, count } = await supabase
        .from('reviews')
        .select('*, profile:profiles(full_name)', { count: 'exact' })
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw new Error(error.message)

      const total = count ?? 0
      return {
        reviews: (data ?? []) as unknown as ReviewWithProfile[],
        total,
        page,
        totalPages: Math.ceil(total / pageSize),
      }
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 2,
  })
}

// ─── useRelatedProducts — products in same category ───────────────────────────

export function useRelatedProducts(categoryId: string, excludeId: string) {
  return useQuery({
    queryKey: ['products', 'related', categoryId, excludeId],
    queryFn: async (): Promise<ProductWithDetails[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), variants:product_variants(*), images:product_images(*)')
        .eq('category_id', categoryId)
        .eq('status', 'active')
        .neq('id', excludeId)
        .order('avg_rating', { ascending: false })
        .limit(4)

      if (error) throw new Error(error.message)
      return (data ?? []) as unknown as ProductWithDetails[]
    },
    enabled: !!categoryId && !!excludeId,
    staleTime: 1000 * 60 * 5,
  })
}
