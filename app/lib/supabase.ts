import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getProductImageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  const { data } = supabase.storage.from('products').getPublicUrl(path)
  return data.publicUrl
}
