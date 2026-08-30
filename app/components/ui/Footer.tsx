import { Facebook, Instagram, ArrowUpRight } from 'lucide-react'

const FOOTER_LINKS = {
  'Shoe Laces': [
    'Round Shoelaces',
    'Flat Shoelaces',
    'Oval Shoelaces',
    'Waxed Laces',
    'No-Tie Shoelaces',
    'Fat Shoelaces',
    'Chunky Laces',
    'Fun Shoelaces',
    'Dress Shoe Laces',
    'Boot Laces',
  ],
  'Customer Service': [
    'Contact Us',
    'FAQ',
    'Shipping Info',
    'Returns & Exchanges',
    'Order Tracking',
    'Size Chart',
  ],
  Information: [
    'About StrideWear',
    'Our Story',
    'Blog & News',
    'Custom Orders',
    'Wholesale',
    'Partnerships',
    'Privacy Policy',
    'Terms of Service',
  ],
}

export function Footer(): React.JSX.Element {
  return (
    <footer id="main-footer" className="bg-[#0D0D0D] text-white lime-glow-top">
      <div className="max-w-[1440px] mx-auto px-6 pt-16 pb-8">
        {/* Top Row: Logo + Social */}
        <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-10">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-[Anton,sans-serif] text-[14px] uppercase tracking-widest text-white mb-4">
                {category}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-[#9A9A9A] hover:text-white transition-colors duration-150"
                    >
                      {link}
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

        {/* Bottom Bar */}
        <div className="border-t border-[#EFEFEF] pt-8 pb-4 bg-[#1A1A1A] -mx-6 md:-mx-10 px-6 md:px-10 text-center mt-8">
          <p className="text-[13px] text-[#9A9A9A] uppercase tracking-widest font-medium">
            © {new Date().getFullYear()} StrideWear. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
