import { useState, useEffect } from 'react'
import { Search, User, ShoppingBag, ChevronDown, X, Menu } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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

export function Navbar({ cartCount = 0 }: NavbarProps): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect((): (() => void) => {
    const handleScroll = (): void => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      id="main-navbar"
      className={cn(
        'sticky top-0 z-30 bg-white transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between gap-6">
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
          <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#9A9A9A] -mt-0.5">
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

          {/* Account */}
          <a
            href="/account"
            id="nav-account"
            className="p-2 hover:bg-[#F7F7F7] rounded-full transition-colors duration-200"
            aria-label="My account"
          >
            <User size={20} />
          </a>

          {/* Cart */}
          <a
            href="/cart"
            id="nav-cart"
            className="relative p-2 hover:bg-[#F7F7F7] rounded-full transition-colors duration-200"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#C6FF3D] text-[#0D0D0D] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </a>

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
        </nav>
      </div>
    </header>
  )
}
