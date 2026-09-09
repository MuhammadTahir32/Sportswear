import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUpPage,
})

interface FormState {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  form?: string
}

function SignUpPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const next: FormErrors = {}

    if (!form.fullName.trim()) next.fullName = 'Full name is required'
    else if (form.fullName.trim().length < 2) next.fullName = 'Name must be at least 2 characters'

    if (!form.email) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'

    if (!form.password) next.password = 'Password is required'
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters'

    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear field error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const { error } = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.fullName.trim(),
    })
    setLoading(false)

    if (error) {
      setErrors({ form: error.message })
      return
    }

    navigate({ to: '/verify', search: { email: form.email } })
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1
          className="text-4xl xl:text-5xl font-black uppercase tracking-tight mb-2 opacity-60 hover:opacity-100 transition-all duration-700 ease-out"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          <span className="text-white hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
            CREATE
          </span>{' '}
          <span className="text-[#C6FF3D] hover:drop-shadow-[0_0_25px_rgba(198,255,61,0.9)]">
            ACCOUNT
          </span>
        </h1>
        <p className="text-[#9A9A9A] text-sm">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="text-[#C6FF3D] font-medium hover:text-white transition-colors flex items-center gap-1 inline-flex"
          >
            Sign in <ArrowRight size={14} />
          </Link>
        </p>
      </div>

      {/* Form error banner */}
      {errors.form && (
        <div className="mb-5 px-4 py-3 bg-red-900/20 border border-red-800 rounded-[8px]">
          <p className="text-red-400 text-sm font-medium">{errors.form}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Input
          id="fullName"
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          autoComplete="name"
          value={form.fullName}
          onChange={handleChange('fullName')}
          error={errors.fullName}
          icon={<User size={16} />}
        />

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

        <div className="flex flex-col gap-1">
          <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            icon={<Lock size={16} />}
            iconPosition="left"
          />
          {/* Toggle password visibility */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors"
            >
              {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat your password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            icon={<Lock size={16} />}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors"
            >
              {showConfirm ? <EyeOff size={12} /> : <Eye size={12} />}
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Password strength hint */}
        {form.password.length > 0 && <PasswordStrength password={form.password} />}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
            icon={<ArrowRight size={18} />}
          >
            Create Account
          </Button>
        </div>

        <p className="text-center text-[10px] text-[#9A9A9A] leading-relaxed">
          By creating an account you agree to our{' '}
          <a href="/terms" className="underline hover:text-white transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-white transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  )
}

// ─── Password Strength Indicator ─────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }): React.JSX.Element {
  const checks = [
    { label: '8+ chars', met: password.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Symbol', met: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.met).length

  const barColor =
    score <= 1
      ? 'bg-red-400'
      : score === 2
        ? 'bg-orange-400'
        : score === 3
          ? 'bg-yellow-400'
          : 'bg-[#C6FF3D]'

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= score ? barColor : 'bg-[#1A1A1A]'}`}
          />
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${c.met ? 'text-[#0D0D0D] bg-[#C6FF3D]' : 'text-[#9A9A9A] bg-[#1A1A1A]'}`}
          >
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}
