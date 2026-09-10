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
  X,
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
    <div className="flex h-screen bg-[#000000] overflow-hidden text-white">
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
          'fixed inset-y-0 left-0 z-30 w-64 bg-[#0A0A0A] flex flex-col transition-transform duration-300 border-r border-white/5',
          'lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 pb-2 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-[#C6FF3D] font-black text-[24px] uppercase tracking-tight leading-none"
                style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
              >
                STRIDE
              </span>
              <span
                className="text-white font-black text-[24px] uppercase tracking-tight leading-none"
                style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
              >
                WEAR
              </span>
            </div>
            <span className="text-[#9A9A9A] text-[9px] uppercase tracking-widest font-bold mt-1">
              Premium Sportswear
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#9A9A9A] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 space-y-2 overflow-y-auto z-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={item.to as any}
              className={cn(
                'flex items-center gap-3 mx-4 px-4 py-3 text-[13px] font-semibold transition-all duration-300 rounded-[12px] border border-transparent',
                'text-[#9A9A9A] hover:text-white hover:bg-white/5',
                '[&.active]:border-[#C6FF3D] [&.active]:text-[#C6FF3D] [&.active]:bg-gradient-to-r [&.active]:from-[#C6FF3D]/10 [&.active]:to-transparent [&.active]:shadow-[0_0_15px_rgba(198,255,61,0.15)]'
              )}
            >
              <item.icon size={18} className={cn('stroke-[1.5]')} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Stronger Every Day Graphic */}
        <div className="mt-auto relative z-0">
          {/* Neon Glow Aura */}
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[radial-gradient(circle_at_bottom_left,rgba(198,255,61,0.25)_0%,transparent_70%)] pointer-events-none"></div>

          <div className="p-6 pb-12 pt-16 relative">
            <div
              className="text-[#C6FF3D] font-bold leading-[1.1] ml-4 pointer-events-none"
              style={{
                fontSize: '34px',
                fontFamily: '"Caveat", "Dancing Script", cursive',
                transform: 'rotate(-12deg)',
                transformOrigin: 'bottom left',
                textShadow: '0 0 15px rgba(198,255,61,0.5)',
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#000000]">
        {/* Topbar */}
        <header className="h-[64px] flex items-center px-4 lg:px-8 shrink-0 justify-between">
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
                className="w-full bg-[#111111] text-[13px] text-white rounded-full py-2 pl-9 pr-4 outline-none border border-transparent focus:border-[#C6FF3D]/50 transition-colors"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="text-[#9A9A9A] hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#C6FF3D] rounded-full border-2 border-[#000000]" />
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
