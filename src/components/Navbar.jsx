import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logos/logoBaconjrv2.svg'
import AuthModal from './AuthModal'

const NAV_LINKS = [
  { label: 'Menú', to: '/menu' },
  { label: 'Ofertas', to: '/#offers' },
  { label: 'Nosotros', to: '/#about' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navBarRef = useRef(null)
  const location = useLocation()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)
  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  useEffect(() => {
    const updateNavbar = () => {
      const hero = document.getElementById('hero')
      const navHeight = navBarRef.current?.offsetHeight ?? 80
      const heroBottom = hero
        ? hero.offsetTop + hero.offsetHeight
        : window.innerHeight

      setIsScrolled(window.scrollY > heroBottom - navHeight)
    }

    updateNavbar()
    window.addEventListener('scroll', updateNavbar, { passive: true })
    window.addEventListener('resize', updateNavbar)

    return () => {
      window.removeEventListener('scroll', updateNavbar)
      window.removeEventListener('resize', updateNavbar)
    }
  }, [location.pathname])

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        isScrolled
          ? 'border-arena bg-white/95 shadow-sm backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={navBarRef}
          className="flex items-center justify-between h-[var(--navbar-height)]"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`p-2 -ml-2 transition-colors ${
                isScrolled
                  ? 'text-humo hover:text-fuego-oscuro'
                  : 'text-white hover:text-dorado'
              }`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-7 h-7"
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

            <Link to="/" className="flex shrink-0 items-center" aria-label="Bacon Jr. — Inicio">
              <img src={logo} alt="Bacon Jr." className="h-12 w-auto sm:h-16" />
            </Link>
          </div>

          <button
            type="button"
            onClick={openAuthModal}
            className="hidden sm:inline-flex items-center px-6 py-2.5 bg-fuego-oscuro text-white text-sm font-semibold rounded-lg hover:bg-fuego-profundo transition-colors"
          >
            Ordena ahora
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className={`border-t transition-colors duration-300 ${
            isScrolled
              ? 'border-arena bg-white'
              : 'border-white/10 bg-carbon/95 backdrop-blur'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-humo hover:text-fuego-oscuro'
                    : 'text-crema hover:text-dorado'
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                closeMenu()
                openAuthModal()
              }}
              className="w-full px-4 py-2.5 bg-fuego-oscuro text-white text-sm font-semibold rounded-lg hover:bg-fuego-profundo transition-colors sm:hidden"
            >
              Ordena ahora
            </button>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </nav>
  )
}

export default Navbar