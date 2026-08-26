import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { User, Phone, Lock, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({ to: '/sign-in', search: { redirect: '/profile' } })
    }
  },
  component: ProfilePage,
})

type Tab = 'account' | 'security'

function ProfilePage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('account')

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-black text-[#0D0D0D] uppercase tracking-tight"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          My Profile
        </h1>
        <p className="text-[#9A9A9A] text-sm mt-1">Manage your account details and password.</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-[#F7F7F7] p-1 rounded-[10px] mb-8 w-fit">
        {(['account', 'security'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-2 rounded-[8px] text-sm font-semibold capitalize transition-all duration-200',
              activeTab === tab
                ? 'bg-[#0D0D0D] text-white shadow-sm'
                : 'text-[#9A9A9A] hover:text-[#0D0D0D]'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'account' && <AccountTab />}
      {activeTab === 'security' && <SecurityTab />}
    </div>
  )
}

// ─── Account Tab ──────────────────────────────────────────────────────────────

function AccountTab(): React.JSX.Element {
  const { profile, user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [errors, setErrors] = useState<{ fullName?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const validate = () => {
    const next: typeof errors = {}
    if (!fullName.trim()) next.fullName = 'Full name is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setSaved(false)
    const { error } = await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim() || null,
    })
    setLoading(false)

    if (error) {
      setErrors({ form: error.message })
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4 p-4 bg-[#F7F7F7] rounded-[12px]">
        <div className="w-14 h-14 rounded-full bg-[#C6FF3D] flex items-center justify-center shrink-0">
          <span
            className="text-[#0D0D0D] font-black text-xl uppercase"
            style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
          >
            {fullName.charAt(0) || user?.email?.charAt(0) || '?'}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[#0D0D0D] text-sm truncate">{fullName || 'Your Name'}</p>
          <p className="text-[#9A9A9A] text-xs truncate">{user?.email}</p>
          <p className="text-[10px] uppercase tracking-wider text-[#9A9A9A] mt-0.5 font-medium">
            {profile?.role ?? 'customer'}
          </p>
        </div>
      </div>

      {errors.form && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[8px]">
          <p className="text-red-600 text-sm font-medium">{errors.form}</p>
        </div>
      )}

      <Input
        id="profile-name"
        label="Full Name"
        type="text"
        placeholder="Jane Doe"
        value={fullName}
        onChange={(e) => {
          setFullName(e.target.value)
          if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }))
        }}
        error={errors.fullName}
        icon={<User size={16} />}
      />

      {/* Email (read-only) */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold uppercase tracking-wide text-[#4A4A4A]">
          Email Address
        </label>
        <div className="flex items-center gap-2 w-full rounded-[8px] border border-[#EFEFEF] bg-[#F7F7F7] px-4 py-2.5 text-sm text-[#9A9A9A]">
          <span className="flex-1 truncate">{user?.email}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A9A9A] bg-[#EFEFEF] px-2 py-0.5 rounded">
            Verified
          </span>
        </div>
        <p className="text-[10px] text-[#9A9A9A]">Email cannot be changed here.</p>
      </div>

      <Input
        id="profile-phone"
        label="Phone Number (optional)"
        type="tel"
        placeholder="+1 (555) 000-0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        icon={<Phone size={16} />}
      />

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          icon={saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            Profile updated
          </span>
        )}
      </div>
    </form>
  )
}

// ─── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab(): React.JSX.Element {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<{
    newPassword?: string
    confirmPassword?: string
    form?: string
  }>({})
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const validate = () => {
    const next: typeof errors = {}
    if (!form.newPassword) next.newPassword = 'New password is required'
    else if (form.newPassword.length < 8) next.newPassword = 'Must be at least 8 characters'
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your new password'
    else if (form.newPassword !== form.confirmPassword)
      next.confirmPassword = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const { error } = await updatePassword(form.newPassword)
    setLoading(false)

    if (error) {
      setErrors({ form: error.message })
      return
    }
    setSaved(true)
    setForm({ newPassword: '', confirmPassword: '' })
  }

  if (saved) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-[#C6FF3D]/15 border-2 border-[#C6FF3D]/40 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-[#0D0D0D]" strokeWidth={1.5} />
        </div>
        <h2
          className="text-xl font-black text-[#0D0D0D] uppercase mb-2"
          style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
        >
          Password Updated
        </h2>
        <p className="text-[#9A9A9A] text-sm mb-6">Your password has been changed successfully.</p>
        <Button variant="secondary" size="md" onClick={() => navigate({ to: '/' })}>
          Back to Store
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {errors.form && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[8px]">
          <p className="text-red-600 text-sm font-medium">{errors.form}</p>
        </div>
      )}

      <div>
        <Input
          id="new-password"
          label="New Password"
          type={showNew ? 'text' : 'password'}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={handleChange('newPassword')}
          error={errors.newPassword}
          icon={<Lock size={16} />}
        />
        <div className="mt-1.5 flex justify-end">
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="flex items-center gap-1 text-xs text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors"
          >
            {showNew ? <EyeOff size={12} /> : <Eye size={12} />}
            {showNew ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div>
        <Input
          id="confirm-new-password"
          label="Confirm New Password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repeat your new password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          icon={<Lock size={16} />}
        />
        <div className="mt-1.5 flex justify-end">
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

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          icon={<Save size={16} />}
        >
          Update Password
        </Button>
      </div>
    </form>
  )
}
