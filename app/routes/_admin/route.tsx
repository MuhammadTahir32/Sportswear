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
  LogOut,
  ChevronRight,
  Menu,
  X,
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
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
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
    <div className="flex h-screen bg-[#F7F7F7] overflow-hidden">
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
          'fixed inset-y-0 left-0 z-30 w-64 bg-[#0D0D0D] flex flex-col transition-transform duration-300',
          'lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-baseline gap-1">
            <span
              className="text-[#C6FF3D] font-black text-xl uppercase tracking-tight"
              style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
            >
              STRIDE
            </span>
            <span
              className="text-white font-black text-xl uppercase tracking-tight"
              style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
            >
              WEAR
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#9A9A9A] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <p className="px-6 py-2 text-[10px] uppercase tracking-widest text-[#4A4A4A] font-semibold">
          Admin Panel
        </p>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={item.to as any}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-all duration-150',
                'text-[#9A9A9A] hover:text-white hover:bg-white/10',
                '[&.active]:text-[#0D0D0D] [&.active]:bg-[#C6FF3D] [&.active]:font-bold'
              )}
            >
              <item.icon size={18} />
              {item.label}
              <ChevronRight size={14} className="ml-auto opacity-40" />
            </Link>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#C6FF3D] flex items-center justify-center">
              <span className="text-[#0D0D0D] text-xs font-black uppercase">
                {profile?.full_name?.charAt(0) ?? '?'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">
                {profile?.full_name ?? 'Admin'}
              </p>
              <p className="text-[#4A4A4A] text-[10px] uppercase tracking-wider">{profile?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-[#9A9A9A] hover:text-white hover:bg-white/10 transition-colors duration-150"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-[#EFEFEF] flex items-center px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 text-[#4A4A4A] hover:text-[#0D0D0D]"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold text-[#0D0D0D] flex-1">Admin Dashboard</h1>
          <Link
            to="/"
            className="text-xs text-[#9A9A9A] hover:text-[#0D0D0D] transition-colors font-medium"
          >
            ← View Store
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
