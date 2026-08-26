import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage(): React.JSX.Element {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = (): boolean => {
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address')
      return false
    }
    setEmailError(undefined)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setFormError(null)
    const { error } = await resetPassword(email)
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
          Email Sent!
        </h1>
        <p className="text-[#4A4A4A] text-sm leading-relaxed mb-2">
          Password reset instructions have been sent to:
        </p>
        <p className="text-[#0D0D0D] font-semibold text-sm bg-[#F7F7F7] rounded-[8px] px-4 py-2 inline-block mb-6">
          {email}
        </p>

        <div className="text-left bg-[#F7F7F7] rounded-[12px] p-4 mb-6 space-y-3">
          {[
            'Check your inbox for an email from StrideWear',
            'Click the reset link inside the email',
            'Set your new password on the next page',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#C6FF3D] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#0D0D0D] font-black text-[9px]">{i + 1}</span>
              </div>
              <p className="text-[#4A4A4A] text-xs leading-relaxed">{step}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-[#9A9A9A] mb-5">
          The link expires in 1 hour. Check your spam folder if you don't see it.
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

  // ── Request Form ───────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1
          className="text-3xl font-black text-[#0D0D0D] uppercase tracking-tight mb-1"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          Reset Password
        </h1>
        <p className="text-[#9A9A9A] text-sm">Enter your email and we'll send you a reset link.</p>
      </div>

      {formError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px]">
          <p className="text-red-600 text-sm font-medium">{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          id="reset-email"
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError(undefined)
          }}
          error={emailError}
          icon={<Mail size={16} />}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
            icon={<ArrowRight size={18} />}
          >
            Send Reset Link
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
