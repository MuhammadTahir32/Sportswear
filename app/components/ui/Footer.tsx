import { Facebook, Instagram, ArrowUpRight } from 'lucide-react'

const FOOTER_LINKS = {
  'Shoe Laces': [
    { label: 'Round Shoelaces', href: '/products?category=round-laces' },
    { label: 'Flat Shoelaces', href: '/products?category=flat-laces' },
    { label: 'Oval Shoelaces', href: '/products?category=oval-laces' },
    { label: 'Waxed Laces', href: '/products?category=waxed-laces' },
    { label: 'No-Tie Shoelaces', href: '/products?category=no-tie-laces' },
    { label: 'Fat Shoelaces', href: '/products?category=fat-laces' },
    { label: 'Chunky Laces', href: '/products' },
    { label: 'Fun Shoelaces', href: '/products' },
    { label: 'Dress Shoe Laces', href: '/products' },
    { label: 'Boot Laces', href: '/products' },
  ],
  'Customer Service': [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Order Tracking', href: '/tracking' },
    { label: 'Size Chart', href: '/size-chart' },
  ],
  Information: [
    { label: 'About StrideWear', href: '/about' },
    { label: 'Our Story', href: '/story' },
    { label: 'Blog & News', href: '/blog' },
    { label: 'Custom Orders', href: '/custom' },
    { label: 'Wholesale', href: '/wholesale' },
    { label: 'Partnerships', href: '/partnerships' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer(): React.JSX.Element {
  return (
    <footer id="main-footer" className="bg-[#0D0D0D] text-white lime-glow-top">
      <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-8">
        {/* Top Row: Logo + Social */}
        <div
          className="flex items-center justify-between mb-12 border-b border-white/10 pb-10"
          style={{ marginLeft: '50px' }}
        >
          <a href="/" aria-label="StrideWear home" className="group">
            <span className="font-[Anton,sans-serif] text-[30px] uppercase tracking-tight text-white group-hover:text-[#C6FF3D] transition-colors duration-200">
              StrideWear
            </span>
          </a>
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              id="footer-facebook"
              aria-label="Follow us on Facebook"
              className="p-2 rounded-full border border-white/20 hover:border-[#C6FF3D] hover:text-[#C6FF3D] transition-all duration-200"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              id="footer-instagram"
              aria-label="Follow us on Instagram"
              className="p-2 rounded-full border border-white/20 hover:border-[#C6FF3D] hover:text-[#C6FF3D] transition-all duration-200"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Link Grid (3-col + brand blurb) */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
          style={{ marginLeft: '50px', marginBottom: '100px', marginTop: '20px' }}
        >
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-[Anton,sans-serif] text-[14px] uppercase tracking-widest text-white mb-4">
                {category}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-[#9A9A9A] hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Brand Blurb */}
          <div>
            <h3 className="font-[Anton,sans-serif] text-[14px] uppercase tracking-widest text-white mb-4">
              StrideWear
            </h3>
            <p className="text-[13px] text-[#9A9A9A] leading-relaxed mb-4">
              Premium replacement shoelaces and sneaker accessories. Engineered for performance,
              styled for the streets. Upgrade your kicks with the finest laces in the game.
            </p>
            <a
              href="/custom"
              className="inline-flex items-center gap-1.5 text-[12px] font-[600] text-[#C6FF3D] uppercase tracking-wide hover:underline"
            >
              Custom Orders <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Full-width bottom bar */}
      <div className="border-t border-[#EFEFEF] bg-[#1A1A1A] py-6 text-center">
        <p className="text-[13px] text-[#9A9A9A] uppercase tracking-widest font-medium">
          © {new Date().getFullYear()} StrideWear. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
