import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, ArrowRight } from 'lucide-react'

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
      <div className="mb-8 text-center">
        <h1
          className="text-4xl xl:text-5xl font-black uppercase tracking-tight mb-2 opacity-60 hover:opacity-100 transition-all duration-700 ease-out"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif', marginTop: '30px' }}
        >
          <span className="text-white hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
            WELCOME
          </span>{' '}
          <span className="text-[#C6FF3D] hover:drop-shadow-[0_0_25px_rgba(198,255,61,0.9)]">
            BACK
          </span>
        </h1>
        <p className="text-[#9A9A9A] text-sm">
          No account?{' '}
          <Link
            to="/sign-up"
            className="text-[#C6FF3D] font-medium hover:text-white transition-colors flex items-center gap-1 inline-flex"
          >
            Create one free <ArrowRight size={14} />
          </Link>
        </p>
      </div>

      {/* Form error banner */}
      {errors.form && (
        <div className="mb-5 px-4 py-3 bg-red-900/20 border border-red-800 rounded-[8px]">
          <p className="text-red-400 text-sm font-medium">{errors.form}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-5"
        style={{ marginTop: '30px' }}
      >
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          icon={<Mail size={20} />}
          variant="dark"
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
            icon={<Lock size={20} />}
            iconPosition="left"
            variant="dark"
          />
          <div className="mt-3 flex items-center justify-between" style={{ marginTop: '10px' }}>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-4 h-4 rounded-[4px] border border-[#1A1A1A] bg-[#0D0D0D] group-hover:border-[#C6FF3D] flex items-center justify-center transition-colors">
                {showPassword && <div className="w-2.5 h-2.5 rounded-[2px] bg-[#C6FF3D]" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <span className="text-xs text-white font-medium">Show password</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#C6FF3D] font-medium hover:text-white transition-colors"
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
            className="w-full bg-[#C6FF3D] text-[#0D0D0D] hover:bg-[#b3ff00]"
            icon={<ArrowRight size={18} />}
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  )
}
