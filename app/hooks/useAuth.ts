import { useState, useEffect, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile, UserRole } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}

export interface SignUpPayload {
  email: string
  password: string
  fullName: string
}

export interface SignInPayload {
  email: string
  password: string
}

export interface AuthError {
  message: string
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    isSuperAdmin: false,
  })

  // ── Fetch profile row from `profiles` table ──────────────────────────────
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (error) {
      console.error('[useAuth] fetchProfile error:', error.message)
      return null
    }
    return data as Profile
  }, [])

  // ── Derive admin flags from profile role ─────────────────────────────────
  const deriveFlags = useCallback(
    (role: UserRole | undefined) => ({
      isAdmin: role === 'admin' || role === 'super_admin',
      isSuperAdmin: role === 'super_admin',
    }),
    []
  )

  // ── Bootstrap session on mount & subscribe to auth changes ───────────────
  useEffect(() => {
    let mounted = true

    // 1. Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return

      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({
          user: session.user,
          session,
          profile,
          isLoading: false,
          isAuthenticated: true,
          ...deriveFlags(profile?.role),
        })
      } else {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    })

    // 2. Subscribe to future auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({
          user: session.user,
          session,
          profile,
          isLoading: false,
          isAuthenticated: true,
          ...deriveFlags(profile?.role),
        })
      } else {
        // Signed out or session expired
        setState({
          user: null,
          session: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          isSuperAdmin: false,
        })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile, deriveFlags])

  // ── Sign up ──────────────────────────────────────────────────────────────
  const signUp = useCallback(
    async ({ email, password, fullName }: SignUpPayload): Promise<{ error: AuthError | null }> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })

      if (error) return { error: { message: error.message } }

      // Upsert profile row in case the DB trigger hasn't fired yet
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          role: 'customer',
        })
      }

      return { error: null }
    },
    []
  )

  // ── Sign in ──────────────────────────────────────────────────────────────
  const signIn = useCallback(
    async ({ email, password }: SignInPayload): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: { message: error.message } }
      return { error: null }
    },
    []
  )

  // ── Sign out ─────────────────────────────────────────────────────────────
  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut()
  }, [])

  // ── Reset password (send email) ───────────────────────────────────────────
  const resetPassword = useCallback(async (email: string): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) return { error: { message: error.message } }
    return { error: null }
  }, [])

  // ── Resend verification email ─────────────────────────────────────────────
  const resendVerification = useCallback(
    async (email: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      if (error) return { error: { message: error.message } }
      return { error: null }
    },
    []
  )

  // ── Update profile ────────────────────────────────────────────────────────
  const updateProfile = useCallback(
    async (
      updates: Partial<Pick<Profile, 'full_name' | 'phone'>>
    ): Promise<{ error: AuthError | null }> => {
      if (!state.user) return { error: { message: 'Not authenticated' } }

      const { error } = await supabase.from('profiles').update(updates).eq('id', state.user.id)

      if (error) return { error: { message: error.message } }

      // Optimistically update local profile state
      setState((prev) => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : prev.profile,
      }))

      return { error: null }
    },
    [state.user]
  )

  // ── Update password ───────────────────────────────────────────────────────
  const updatePassword = useCallback(
    async (newPassword: string): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) return { error: { message: error.message } }
      return { error: null }
    },
    []
  )

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendVerification,
    updateProfile,
    updatePassword,
  }
}
