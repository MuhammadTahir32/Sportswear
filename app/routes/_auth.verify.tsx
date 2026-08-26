import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Mail, RefreshCw, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/_auth/verify')({
  component: VerifyPage,
})

function VerifyPage(): React.JSX.Element {
  const { resendVerification } = useAuth()

  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  const email = new URLSearchParams(window.location.search).get('email') ?? ''

  const handleResend = async () => {
    if (!email || loading || countdown > 0) return

    setLoading(true)
    setError(null)
    const { error: err } = await resendVerification(email)
    setLoading(false)

    if (err) {
      setError(err.message)
      return
    }

    setResent(true)
    // 60-second cooldown
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="w-full text-center">
      {/* Animated envelope illustration */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-[#C6FF3D]/10 border-2 border-[#C6FF3D]/30 flex items-center justify-center">
            <Mail size={44} className="text-[#0D0D0D]" strokeWidth={1.5} />
          </div>
          {/* Notification dot */}
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C6FF3D] rounded-full flex items-center justify-center">
            <span className="text-[#0D0D0D] font-black text-[9px]">1</span>
          </span>
        </div>
      </div>

      {/* Header */}
      <h1
        className="text-3xl font-black text-[#0D0D0D] uppercase tracking-tight mb-2"
        style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
      >
        Check Your Inbox
      </h1>
      <p className="text-[#4A4A4A] text-sm leading-relaxed mb-2">
        We've sent a verification link to:
      </p>
      {email && (
        <p className="text-[#0D0D0D] font-semibold text-sm mb-5 bg-[#F7F7F7] rounded-[8px] px-4 py-2 inline-block">
          {email}
        </p>
      )}

      {/* Steps */}
      <div className="text-left bg-[#F7F7F7] rounded-[12px] p-4 mb-6 space-y-3">
        {[
          'Open the email from StrideWear',
          'Click the "Confirm your email" button',
          "You'll be signed in automatically",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#C6FF3D] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[#0D0D0D] font-black text-[9px]">{i + 1}</span>
            </div>
            <p className="text-[#4A4A4A] text-xs leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      {/* Success state after resend */}
      {resent && (
        <div className="flex items-center gap-2 justify-center text-sm text-green-600 font-medium mb-4">
          <CheckCircle2 size={16} />
          Email resent successfully!
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}

      {/* Resend button */}
      <Button
        variant="secondary"
        size="md"
        loading={loading}
        disabled={countdown > 0 || !email}
        onClick={handleResend}
        className="w-full mb-4"
        icon={<RefreshCw size={15} />}
      >
        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
      </Button>

      {/* Spam note */}
      <p className="text-[10px] text-[#9A9A9A] leading-relaxed mb-4">
        Don't see it? Check your spam or promotions folder.
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
