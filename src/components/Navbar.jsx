import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/brand/logoBaconjrv2.svg'
import MobileMenu from './MobileMenu'
import { scrollToSection } from '../utils/scrollToSection'
import { useAuth } from '../context/AuthProvider'

const NAV_LINKS = [
  { label: 'Menú', to: '/menu' },
  { label: 'Ofertas', to: '/#offers', section: 'offers' },
  { label: 'Nosotros', to: '/#about', section: 'about' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPastHero, setIsPastHero] = useState(false)
  const [isPastMenuFilters, setIsPastMenuFilters] = useState(false)
  const navBarRef = useRef(null)
  const location = useLocation()

  const { currentUser, openAuthModal, logout } = useAuth()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  const isMenuPage = location.pathname === '/menu'

  const handleSectionClick = (event, section) => {
    if (!section) return
    if (location.pathname === '/') {
      event.preventDefault()
      scrollToSection(section)
    }
  }

  useEffect(() => {
    const hero = document.getElementById('hero')

    if (hero) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [location.pathname, isMenuPage])

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
      aria-label="Navegación principal"
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
        <div className="flex h-[var(--navbar-height)] items-center justify-between gap-4">
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className={`-ml-2 cursor-pointer rounded-lg p-2 transition-all duration-200 md:hidden ${
                useDarkOnMenu || !isLight
                  ? 'text-crema hover:bg-white/10 hover:text-dorado'
                  : 'text-humo hover:bg-crema hover:text-fuego-oscuro'
              }`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
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

          <div className="mx-4 hidden flex-1 items-center justify-evenly md:flex lg:mx-10">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={(event) => handleSectionClick(event, link.section)}
                className={({ isActive }) =>
                  `relative py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${getLinkColor(isActive)}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            {currentUser ? (
              <>
                <span
                  className={`max-w-[115px] truncate text-xs font-semibold sm:max-w-[180px] sm:text-sm ${
                    useDarkOnMenu || !isLight ? 'text-crema' : 'text-carbon'
                  }`}
                  title={currentUser.name}
                >
                  {currentUser.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className={`inline-flex cursor-pointer items-center rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm ${
                    useDarkOnMenu || !isLight
                      ? 'border-crema/40 text-crema hover:border-dorado hover:text-dorado'
                      : 'border-arena text-carbon hover:border-fuego-oscuro hover:text-fuego-oscuro'
                  }`}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal({ checkout: false })}
                className="inline-flex cursor-pointer items-center rounded-lg bg-fuego-oscuro px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-fuego-profundo hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onOrder={() => openAuthModal({ checkout: false })}
      />
    </nav>
  )
}

export default Navbar