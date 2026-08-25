import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Menu', href: '#' },
  { label: 'Ofertas', href: '#offers' },
  { label: 'Nosotros', href: '#about' },
  { label: 'Sucursales', href: '#location' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 -ml-2 text-neutral-600 hover:text-black transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            <a
              href="#"
              className="text-xl font-bold text-black tracking-tight"
            >
              BACON JR.
            </a>
          </div>

          <a
            href="#offers"
            className="inline-flex items-center px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Ordena ahora
          </a>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-neutral-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-neutral-600 hover:text-black transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
