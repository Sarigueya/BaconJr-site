import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/logos/logoBaconjrv2.svg'
import AuthModal from './AuthModal'
import MobileMenu from './MobileMenu'

const NAV_LINKS = [
  { label: 'Menú', to: '/menu' },
  { label: 'Ofertas', to: '/#offers' },
  { label: 'Nosotros', to: '/#about' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isPastHero, setIsPastHero] = useState(false)
  const [isPastMenuFilters, setIsPastMenuFilters] = useState(false)
  const navBarRef = useRef(null)
  const location = useLocation()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  const isMenuPage = location.pathname === '/menu'

  useEffect(() => {
    const hero = document.getElementById('hero')

    if (hero) {
      setIsPastHero(false)

      const navHeight = navBarRef.current?.offsetHeight ?? 80

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return
          const hasPassed =
            !entry.isIntersecting || entry.boundingClientRect.bottom <= navHeight
          setIsPastHero(hasPassed)
        },
        {
          threshold: [0, 0.01],
          rootMargin: `-${navHeight}px 0px 0px 0px`,
        }
      )

      observer.observe(hero)

      return () => {
        observer.disconnect()
      }
    }

    setIsPastHero(true)
  }, [location.pathname])

  useEffect(() => {
    const menuFilters = document.getElementById('menu-filters')

    if (isMenuPage && menuFilters) {
      setIsPastMenuFilters(false)

      const navHeight = navBarRef.current?.offsetHeight ?? 80

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return
          const hasPassed =
            !entry.isIntersecting || entry.boundingClientRect.bottom <= navHeight
          setIsPastMenuFilters(hasPassed)
        },
        {
          threshold: [0, 0.01],
          rootMargin: `-${navHeight}px 0px 0px 0px`,
        }
      )

      observer.observe(menuFilters)

      return () => {
        observer.disconnect()
      }
    }

    setIsPastMenuFilters(true)
  }, [location.pathname])

  const useDarkOnMenu = isMenuPage && !isPastMenuFilters
  const isLight = useDarkOnMenu ? false : isPastHero
  const isFixed = isMenuPage || isPastHero

  const getLinkColor = (isActive) => {
    if (useDarkOnMenu) {
      return isActive ? 'text-dorado' : 'text-crema hover:text-dorado'
    }
    if (isLight) {
      return isActive
        ? 'text-fuego-oscuro'
        : 'text-humo hover:text-fuego-oscuro'
    }
    return isActive ? 'text-dorado' : 'text-crema hover:text-dorado'
  }

  return (
    <nav
      ref={navBarRef}
      className={`inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        isFixed ? 'fixed' : 'absolute'
      } ${
        useDarkOnMenu
          ? 'border-transparent bg-carbon'
          : isLight
            ? 'border-arena bg-white/95 shadow-sm backdrop-blur'
            : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={navBarRef}
          className="flex h-[var(--navbar-height)] items-center justify-between gap-4"
        >
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className={`md:hidden p-2 -ml-2 transition-colors ${
                useDarkOnMenu || !isLight
                  ? 'text-crema hover:text-dorado'
                  : 'text-humo hover:text-fuego-oscuro'
              }`}
              onClick={toggleMenu}
              aria-label="Abrir menú de navegación"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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

            <Link
              to="/"
              className="flex shrink-0 items-center"
              aria-label="Bacon Jr. — Inicio"
            >
              <img src={logo} alt="Bacon Jr." className="h-12 w-auto sm:h-14 md:h-16" />
            </Link>
          </div>

          <nav
            className="hidden md:flex flex-1 items-center justify-evenly mx-4 lg:mx-10"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${getLinkColor(isActive)}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end">
            <button
              type="button"
              onClick={openAuthModal}
              className="inline-flex items-center rounded-lg bg-fuego-oscuro px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-fuego-profundo sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Ordena ahora
            </button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} onOrder={openAuthModal} />

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </nav>
  )
}

export default Navbar