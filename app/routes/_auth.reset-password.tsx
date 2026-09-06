import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/_auth/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage(): React.JSX.Element {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [confirmError, setConfirmError] = useState<string | undefined>()
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { tokenReady, tokenError } = useMemo(() => {
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      return { tokenReady: true, tokenError: null }
    }
    return {
      tokenReady: false,
      tokenError: 'Invalid or expired reset link. Please request a new one.',
    }
  }, [])

  const validate = (): boolean => {
    let valid = true

    if (!password) {
      setPasswordError('Password is required')
      valid = false
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      valid = false
    } else {
      setPasswordError(undefined)
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your password')
      valid = false
    } else if (password !== confirmPassword) {
      setConfirmError('Passwords do not match')
      valid = false
    } else {
      setConfirmError(undefined)
    }

    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setFormError(null)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setFormError(error.message)
      return
    }

    setSubmitted(true)
  }

  // ── Success State ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-[#C6FF3D]/10 border-2 border-[#C6FF3D]/40 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-[#0D0D0D]" strokeWidth={1.5} />
          </div>
        </div>

        <h1
          className="text-3xl font-black text-[#0D0D0D] uppercase tracking-tight mb-2"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          Password Updated!
        </h1>
        <p className="text-[#4A4A4A] text-sm leading-relaxed mb-6">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>

        <Link
          to="/sign-in"
          className="text-xs text-[#9A9A9A] font-medium hover:text-[#0D0D0D] transition-colors underline underline-offset-2"
        >
          ← Back to Sign In
        </Link>
      </div>
    )
  }

  // ── Invalid Token State ────────────────────────────────────────────────────
  if (tokenError) {
    return (
      <div className="w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center">
            <AlertCircle size={40} className="text-red-500" strokeWidth={1.5} />
          </div>
        </div>

        <h1
          className="text-3xl font-black text-[#0D0D0D] uppercase tracking-tight mb-2"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          Invalid Link
        </h1>
        <p className="text-[#4A4A4A] text-sm leading-relaxed mb-6">{tokenError}</p>

        <Link
          to="/forgot-password"
          className="text-xs text-[#9A9A9A] font-medium hover:text-[#0D0D0D] transition-colors underline underline-offset-2"
        >
          ← Request a new reset link
        </Link>
      </div>
    )
  }

  // ── Reset Form ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1
          className="text-3xl font-black text-[#0D0D0D] uppercase tracking-tight mb-1"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          Set New Password
        </h1>
        <p className="text-[#9A9A9A] text-sm">Enter your new password below.</p>
      </div>

      {formError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px]">
          <p className="text-red-600 text-sm font-medium">{formError}</p>
        </div>
      )}

      {!tokenReady && (
        <div className="mb-5 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-[8px]">
          <p className="text-yellow-700 text-sm font-medium">Loading reset token...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="relative">
          <Input
            id="new-password"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (passwordError) setPasswordError(undefined)
            }}
            error={passwordError}
            icon={<Lock size={16} />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="relative">
          <Input
            id="confirm-password"
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (confirmError) setConfirmError(undefined)
            }}
            error={confirmError}
            icon={<Lock size={16} />}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-[38px] text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={!tokenReady}
            className="w-full"
          >
            Update Password
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/sign-in"
          className="text-xs text-[#9A9A9A] font-medium hover:text-[#0D0D0D] transition-colors underline underline-offset-2"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  )
}
