import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, Truck, Award } from 'lucide-react'

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
    <div className="min-h-screen flex bg-[#090909] text-white">
      {/* ── Left: Brand Panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(13,13,13,0.2), rgba(9,9,9,1)), url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
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
        <div className="relative z-10 flex flex-col items-start text-left mt-12">
          <p className="text-[10px] tracking-[0.2em] text-[#9A9A9A] uppercase mb-4 font-semibold">
            GEAR UP <span className="text-[#C6FF3D]">/</span> MOVE FORWARD{' '}
            <span className="text-[#C6FF3D]">/</span> BE BETTER
          </p>
          <h2
            className="text-white text-6xl xl:text-7xl font-black uppercase leading-none tracking-tight"
            style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
          >
            LEVEL UP
            <br />
            <span className="text-[#C6FF3D]">YOUR GAME</span>
          </h2>
          <p className="text-[#9A9A9A] text-sm mt-6 leading-relaxed max-w-sm">
            Join thousands of athletes who trust StrideWear for performance gear that moves with
            you.
          </p>
        </div>

        {/* Bottom: social proof */}
        <div className="relative z-10 flex gap-10 justify-start w-full mt-12">
          {[
            { icon: <ShieldCheck size={28} />, label: 'PREMIUM\nQUALITY' },
            { icon: <Truck size={28} />, label: 'FAST & RELIABLE\nSHIPPING' },
            { icon: <Award size={28} />, label: 'ATHLETE\nAPPROVED' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2.5">
              <div className="w-14 h-14 rounded-full border border-[#C6FF3D]/30 flex items-center justify-center text-[#C6FF3D]">
                {stat.icon}
              </div>
              <p className="text-white text-[10px] uppercase font-bold tracking-wider leading-tight whitespace-pre-line">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* "Stronger Every Day" script text */}
        <div className="absolute bottom-10 left-10 z-10 pointer-events-none">
          <p
            className="text-[#C6FF3D] text-3xl xl:text-4xl leading-tight opacity-80"
            style={{ fontFamily: '"Dancing Script", "Brush Script MT", cursive' }}
          >
            Stronger
            <br />
            Every Day
          </p>
        </div>
      </div>

      {/* ── Right: Form Panel ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[#090909] border-l border-[#1A1A1A]">
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
