import { useState, useEffect, useRef } from 'react'
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  ChevronDown,
  X,
  Menu,
  LogOut,
  UserCircle,
  LayoutDashboard,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CartDrawer } from '@/components/ui/CartDrawer'
import { useCartContext } from '@/components/CartProvider'
import { useAuth } from '@/hooks/useAuth'

type NavLink = {
  label: string
  href: string
  hasDropdown?: boolean
}

const NAV_LINKS: NavLink[] = [
  { label: 'Laces by Shoe Brand', href: '/brands', hasDropdown: true },
  { label: 'Shoe Laces', href: '/laces', hasDropdown: true },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Custom Shoelaces', href: '/custom' },
  { label: 'Size Chart', href: '/size-chart' },
  { label: 'Reviews', href: '/reviews' },
]

type NavbarProps = {
  cartCount?: number
}

export function Navbar({ cartCount: _cartCount }: NavbarProps): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { itemCount } = useCartContext()
  const cartCount = itemCount || _cartCount || 0
  const { isAuthenticated, isAdmin, user, profile, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = (): void => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
  }

  const userInitial = (profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase()

  return (
    <header
      id="main-navbar"
      className={cn(
        'sticky top-0 z-30 bg-white transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between gap-6 relative left-12">
        {/* Logo */}
        <a
          href="/"
          id="nav-logo"
          className="flex flex-col leading-none flex-shrink-0 group ml-2 md:ml-6"
          aria-label="StrideWear Home"
        >
          <span className="font-[Anton,sans-serif] text-[32px] tracking-[-0.5px] uppercase text-[#0D0D0D] group-hover:text-[#C6FF3D] transition-colors duration-200">
            StrideWear
          </span>
          <span
            className="text-[12px] font-bold uppercase tracking-[3px] text-[#9A9A9A] -mt-1"
            style={{ marginTop: '5px' }}
          >
            Athletic Gear
          </span>
        </a>

        {/* Center Nav Links (desktop) */}
        <nav
          id="main-nav-links"
          className="hidden lg:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1 text-[15px] font-[700] text-[#0D0D0D] uppercase tracking-wide hover:text-[#C6FF3D] transition-colors duration-200 group relative"
            >
              {link.label}
              {link.hasDropdown && (
                <ChevronDown
                  size={15}
                  className="text-[#9A9A9A] group-hover:text-[#C6FF3D] transition-colors"
                />
              )}
              <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#C6FF3D] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Utilities */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Currency selector */}
          <select
            id="currency-selector"
            className="hidden md:block text-[12px] font-[500] text-[#4A4A4A] bg-transparent border-none outline-none cursor-pointer hover:text-[#0D0D0D] transition-colors"
            aria-label="Currency selector"
          >
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="GBP">GBP £</option>
          </select>

          {/* Search */}
          <button
            id="nav-search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors duration-200"
            aria-label="Toggle search"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* Account - with dropdown when authenticated */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 pr-3 hover:bg-[#F7F7F7] rounded-full transition-colors duration-200"
                aria-label="Account menu"
                aria-expanded={userMenuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-[#C6FF3D] flex items-center justify-center">
                  <span
                    className="text-[#0D0D0D] text-[11px] font-black uppercase"
                    style={{ fontFamily: '"Anton", "Archivo Black", sans-serif' }}
                  >
                    {userInitial}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    'text-[#9A9A9A] transition-transform duration-200',
                    userMenuOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#EFEFEF] rounded-[12px] shadow-lg py-2 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-[#EFEFEF]">
                    <p className="text-sm font-semibold text-[#0D0D0D] truncate">
                      {profile?.full_name || 'Account'}
                    </p>
                    <p className="text-xs text-[#9A9A9A] truncate">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <a
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0D0D0D] hover:bg-[#F7F7F7] transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircle size={16} className="text-[#9A9A9A]" />
                      My Profile
                    </a>
                    <a
                      href="/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0D0D0D] hover:bg-[#F7F7F7] transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <ShoppingBag size={16} className="text-[#9A9A9A]" />
                      My Orders
                    </a>
                    <a
                      href="/wishlist"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0D0D0D] hover:bg-[#F7F7F7] transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Heart size={16} className="text-[#9A9A9A]" />
                      Wishlist
                    </a>
                    {isAdmin && (
                      <a
                        href="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0D0D0D] hover:bg-[#F7F7F7] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} className="text-[#9A9A9A]" />
                        Admin Panel
                      </a>
                    )}
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-[#EFEFEF] pt-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/sign-in"
              id="nav-account"
              className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors duration-200"
              aria-label="Sign in"
            >
              <User size={20} />
            </a>
          )}

          {/* Wishlist */}
          <a
            href="/wishlist"
            id="nav-wishlist"
            className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors duration-200"
            aria-label="My wishlist"
          >
            <Heart size={20} />
          </a>

          {/* Cart */}
          <button
            id="nav-cart"
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:bg-[#F7F7F7] rounded-full transition-colors duration-200"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#C6FF3D] text-[#0D0D0D] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

          {/* Mobile menu toggle */}
          <button
            id="nav-mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 hover:bg-[#F7F7F7] rounded-full transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Bar (slide down) */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 border-t border-[#EFEFEF]',
          searchOpen ? 'max-h-20 py-3' : 'max-h-0'
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <Input
            id="global-search-input"
            type="search"
            placeholder="Search laces, brands, styles…"
            icon={<Search size={16} />}
            autoFocus={searchOpen}
            aria-label="Search products"
          />
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 border-t border-[#EFEFEF] bg-white',
          mobileOpen ? 'max-h-screen pb-4' : 'max-h-0'
        )}
      >
        <nav className="flex flex-col px-6 pt-3 gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center justify-between py-3 text-[14px] font-[500] uppercase tracking-wide text-[#0D0D0D] border-b border-[#F7F7F7] last:border-0 hover:text-[#C6FF3D] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              {link.hasDropdown && <ChevronDown size={16} />}
            </a>
          ))}
          <div className="pt-3">
            <Button variant="primary" size="sm" className="w-full">
              Shop Now ↗
            </Button>
          </div>
          <a
            href="/wishlist"
            className="flex items-center gap-2 py-3 text-[14px] font-[500] uppercase tracking-wide text-[#0D0D0D] hover:text-[#C6FF3D] transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <Heart size={16} />
            My Wishlist
          </a>
          {isAdmin && (
            <a
              href="/admin/dashboard"
              className="flex items-center gap-2 py-3 text-[14px] font-[500] uppercase tracking-wide text-[#0D0D0D] hover:text-[#C6FF3D] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard size={16} />
              Admin Panel
            </a>
          )}
          {/* Mobile sign out */}
          {isAuthenticated && (
            <button
              onClick={() => {
                handleSignOut()
                setMobileOpen(false)
              }}
              className="flex items-center gap-2 py-3 text-[14px] font-[500] uppercase tracking-wide text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
