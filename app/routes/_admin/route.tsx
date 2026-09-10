import {
  createFileRoute,
  Outlet,
  redirect,
  Link,
  useNavigate,
  useLocation,
} from '@tanstack/react-router'
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

  const location = useLocation()
  const currentPath = location.pathname
  const currentRouteName =
    NAV_ITEMS.find((item) => currentPath.startsWith(item.to))?.label || 'Dashboard'

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
          'fixed inset-y-0 left-0 z-30 w-64 bg-[#0D0D0D] flex flex-col transition-transform duration-300',
          'lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
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

        <p className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-semibold">
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
                'text-white/60 hover:text-white hover:bg-white/10',
                '[&.active]:text-[#0D0D0D] [&.active]:bg-[#C6FF3D] [&.active]:font-bold'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="mt-auto border-t border-white/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#C6FF3D] flex items-center justify-center shrink-0">
              <span className="text-[#0D0D0D] text-sm font-black uppercase">
                {profile?.full_name?.charAt(0) ?? '?'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">
                {profile?.full_name ?? 'Admin'}
              </p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">{profile?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#000000]">
        {/* Topbar */}
        <header className="h-[72px] flex items-center px-4 lg:px-8 shrink-0 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#9A9A9A] hover:text-white"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-white mr-2 lg:block hidden">
              {currentRouteName}
            </h1>
            <div className="hidden lg:flex relative w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]"
                size={16}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-[#0D0D0D] text-sm text-white rounded-full py-2 pl-10 pr-4 outline-none border border-white/5 focus:border-[#C6FF3D]/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative text-[#9A9A9A] hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#C6FF3D] rounded-full border-2 border-black" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#C6FF3D] flex items-center justify-center">
              <span className="text-[#0D0D0D] text-xs font-black uppercase">
                {profile?.full_name?.charAt(0) ?? '?'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-4 lg:px-8 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
