import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/_auth')({
  // Redirect authenticated users away from auth pages (sign-in, sign-up, etc.)
  beforeLoad: async ({ location }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      // Already logged in — send them home (or to their intended destination)
      const redirectTo = (location.search as Record<string, string>)?.redirect ?? '/'
      throw redirect({ to: redirectTo })
    }
  },
  component: AuthLayout,
})

function AuthLayout(): React.JSX.Element {
  return (
    <div className="min-h-screen flex">
      {/* ── Left: Brand Panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-[#0D0D0D] flex-col justify-between p-12 relative overflow-hidden">
        {/* Lime radial glow */}
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #C6FF3D 0%, transparent 70%)',
            transform: 'translate(-30%, 30%)',
          }}
        />
        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[#C6FF3D] font-black text-3xl tracking-tight uppercase"
              style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
            >
              STRIDE
            </span>
            <span
              className="text-white font-black text-3xl tracking-tight uppercase"
              style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
            >
              WEAR
            </span>
          </div>
          <p className="text-[#9A9A9A] text-xs uppercase tracking-widest mt-1 font-medium">
            Premium Sportswear
          </p>
        </div>

        {/* Middle: tagline */}
        <div className="relative z-10">
          <h2
            className="text-white text-5xl xl:text-6xl font-black uppercase leading-none tracking-tight"
            style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
          >
            LEVEL UP
            <br />
            <span className="text-[#C6FF3D]">YOUR GAME</span>
          </h2>
          <p className="text-[#9A9A9A] text-sm mt-4 leading-relaxed max-w-xs">
            Join thousands of athletes who trust StrideWear for performance gear that moves with
            you.
          </p>
        </div>

        {/* Bottom: social proof */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: '50K+', label: 'Athletes' },
            { value: '4.9★', label: 'Rating' },
            { value: 'Free', label: 'Returns' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[#C6FF3D] font-black text-lg">{stat.value}</p>
              <p className="text-[#4A4A4A] text-xs uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Form Panel ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-baseline gap-1 mb-8">
          <span
            className="text-[#C6FF3D] font-black text-2xl uppercase"
            style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
          >
            STRIDE
          </span>
          <span
            className="text-[#0D0D0D] font-black text-2xl uppercase"
            style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
          >
            WEAR
          </span>
        </div>

        <div className="w-full max-w-[420px]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
