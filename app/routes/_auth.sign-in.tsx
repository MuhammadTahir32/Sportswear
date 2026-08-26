import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInPage,
})

interface FormState {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  form?: string
}

function SignInPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  // Read redirect param from URL search string directly
  const redirectTo = new URLSearchParams(window.location.search).get('redirect') ?? '/'

  const [form, setForm] = useState<FormState>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!form.email) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.password) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const { error } = await signIn({ email: form.email, password: form.password })
    setLoading(false)

    if (error) {
      // Surface common Supabase errors with friendly messages
      const msg =
        error.message.toLowerCase().includes('invalid') ||
        error.message.toLowerCase().includes('credentials')
          ? 'Incorrect email or password. Please try again.'
          : error.message
      setErrors({ form: msg })
      return
    }

    // Redirect to intended destination or home
    navigate({ to: redirectTo as string, replace: true })
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-black text-[#0D0D0D] uppercase tracking-tight mb-1"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          Welcome Back
        </h1>
        <p className="text-[#9A9A9A] text-sm">
          No account?{' '}
          <Link
            to="/sign-up"
            className="text-[#0D0D0D] font-semibold underline underline-offset-2 hover:text-[#C6FF3D] transition-colors"
          >
            Create one free
          </Link>
        </p>
      </div>

      {/* Form error banner */}
      {errors.form && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-[8px]">
          <p className="text-red-600 text-sm font-medium">{errors.form}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          icon={<Mail size={16} />}
        />

        <div>
          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            icon={<Lock size={16} />}
          />
          <div className="mt-1.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors"
            >
              {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
              {showPassword ? 'Hide' : 'Show'} password
            </button>
            <Link
              to="/forgot-password"
              className="text-xs text-[#9A9A9A] font-medium hover:text-[#0D0D0D] transition-colors underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
            icon={<ArrowRight size={18} />}
          >
            Sign In
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#EFEFEF]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[11px] text-[#9A9A9A] uppercase tracking-wider font-medium">
            Secure sign-in
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 text-[10px] text-[#9A9A9A] uppercase tracking-wider">
        {['256-bit SSL', 'GDPR Compliant', 'Never Spammed'].map((badge) => (
          <span key={badge} className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#C6FF3D] inline-block" />
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}
