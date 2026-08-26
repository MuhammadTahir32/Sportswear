import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Address } from '@/lib/types'

// ─── Query Keys ───────────────────────────────────────────────────────────────

const ADDRESSES_KEY = (userId: string) => ['addresses', userId] as const

// ─── Types ────────────────────────────────────────────────────────────────────

export type AddressFormData = Omit<Address, 'id' | 'user_id' | 'created_at'>

// ─── Fetch all addresses for a user ──────────────────────────────────────────

export function useAddresses(userId: string | null | undefined) {
  return useQuery({
    queryKey: ADDRESSES_KEY(userId ?? ''),
    queryFn: async (): Promise<Address[]> => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) throw new Error(error.message)
      return (data ?? []) as Address[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// ─── Create address ───────────────────────────────────────────────────────────

export function useCreateAddress(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddressFormData) => {
      const { data, error } = await supabase
        .from('addresses')
        .insert({ ...payload, user_id: userId })
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Address
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY(userId) })
    },
  })
}

// ─── Update address ───────────────────────────────────────────────────────────

export function useUpdateAddress(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: AddressFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('addresses')
        .update(payload)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data as Address
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY(userId) })
    },
  })
}

// ─── Delete address ───────────────────────────────────────────────────────────

export function useDeleteAddress(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (addressId: string) => {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId)

      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY(userId) })
    },
  })
}

// ─── Set default address ──────────────────────────────────────────────────────

export function useSetDefaultAddress(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (addressId: string) => {
      // Clear all defaults first, then set the target
      const { error: clearError } = await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId)

      if (clearError) throw new Error(clearError.message)

      const { error: setError } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', userId)

      if (setError) throw new Error(setError.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY(userId) })
    },
  })
}
