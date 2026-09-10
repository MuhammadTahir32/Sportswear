import { createFileRoute, Outlet, redirect, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Star,
  Settings,
  Menu,
  Search,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/cn'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw redirect({ to: '/sign-in', search: { redirect: '/admin' } })
    }

    // Verify admin role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      throw redirect({ to: '/' })
    }
  },
  component: AdminLayout,
})

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'Products', icon: Package, to: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, to: '/admin/orders' },
  { label: 'Customers', icon: Users, to: '/admin/customers' },
  { label: 'Coupons', icon: Tag, to: '/admin/coupons' },
  { label: 'Reviews', icon: Star, to: '/admin/reviews' },
  { label: 'Settings', icon: Settings, to: '/admin/settings' },
] as const

function AdminLayout(): React.JSX.Element {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate({ to: '/sign-in' })
  }

  return (
    <div className="flex h-screen overflow-hidden text-white" style={{ background: '#0A0F0A' }}>
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-[260px] flex flex-col transition-transform duration-300',
          'lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: 'linear-gradient(180deg, #0A0F0A 0%, #0D120D 50%, #111A11 100%)',
        }}
      >
        {/* Logo */}
        <div className="px-7 pt-7 pb-2">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[#C6FF3D] font-black text-[28px] uppercase tracking-tight leading-none"
              style={{ fontFamily: '"Anton", Impact, "Arial Black", sans-serif' }}
            >
              STRIDE
            </span>
            <span
              className="text-white font-black text-[28px] uppercase tracking-tight leading-none"
              style={{ fontFamily: '"Anton", Impact, "Arial Black", sans-serif' }}
            >
              WEAR
            </span>
          </div>
          <span className="text-[#6A6A6A] text-[9px] uppercase tracking-[3px] font-bold mt-1 block">
            Premium Sportswear
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-8 space-y-1 overflow-y-auto z-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={item.to as any}
              className="flex items-center gap-3.5 mx-5 px-4 py-3 text-[14px] font-semibold transition-all duration-200 rounded-[10px] text-[#8A8A8A] hover:text-white hover:bg-white/5"
              activeProps={{
                className: '!text-[#0D0D0D] !bg-[#C6FF3D] !font-bold hover:!bg-[#b8e830]',
              }}
            >
              <item.icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Stronger Every Day Graphic */}
        <div className="mt-auto relative z-0 h-[180px] overflow-hidden">
          {/* Green Glow Aura */}
          <div
            className="absolute bottom-[-40px] left-[-40px] w-[220px] h-[220px] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(198,255,61,0.12) 0%, rgba(198,255,61,0.04) 40%, transparent 70%)',
            }}
          />

          <div className="absolute bottom-8 left-7 pointer-events-none">
            <div
              className="text-[#C6FF3D] font-bold leading-[0.95]"
              style={{
                fontSize: '30px',
                fontFamily: '"Caveat", "Dancing Script", cursive, sans-serif',
                transform: 'rotate(-8deg)',
                textShadow: '0 0 20px rgba(198,255,61,0.5), 0 0 40px rgba(198,255,61,0.2)',
              }}
            >
              Stronger
              <br />
              Every Day
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
        style={{ background: '#0A0F0A' }}
      >
        {/* Topbar */}
        <header
          className="h-[64px] flex items-center px-4 lg:px-8 shrink-0 justify-between"
          style={{ background: '#0A0F0A' }}
        >
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#9A9A9A] hover:text-white bg-white/5 rounded-[8px]"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex relative w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]"
                size={14}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-[#111811] text-[13px] text-white rounded-full py-2.5 pl-9 pr-4 outline-none border border-white/10 focus:border-[#C6FF3D]/50 transition-colors placeholder:text-[#6A6A6A]"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="text-[#9A9A9A] hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#C6FF3D] rounded-full border-2 border-[#0A0F0A]" />
            </button>

            <button
              onClick={handleLogout}
              title="Logout"
              className="w-8 h-8 rounded-full bg-[#C6FF3D] flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <span className="text-[#0D0D0D] text-[13px] font-black uppercase">
                {profile?.full_name?.charAt(0) ?? 'A'}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-4 lg:px-8 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
