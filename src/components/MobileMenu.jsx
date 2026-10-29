import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logos/logoBaconjrv2.svg'
import { CATEGORIES } from '../data/products'

const MAIN_LINKS = [
  { label: 'Inicio', to: '/', isActive: (loc) => loc.pathname === '/' && !loc.hash },
  { label: 'Menú', to: '/menu', isActive: (loc) => loc.pathname === '/menu' },
  { label: 'Ofertas', to: '/#offers', isActive: (loc) => loc.hash === '#offers' },
  { label: 'Nosotros', to: '/#about', isActive: (loc) => loc.hash === '#about' },
]

function MobileMenu({ isOpen, onClose, onOrder }) {
  const location = useLocation()

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Se renderiza en <body> para que el blur de la barra no lo recorte.
  return createPortal(
    <div className={`md:hidden ${isOpen ? '' : 'pointer-events-none'}`}>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-carbon/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        inert={!isOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-carbon text-crema shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <Link to="/" onClick={onClose} aria-label="Bacon Jr. — Inicio">
            <img src={logo} alt="Bacon Jr." className="h-10 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="-mr-2 p-2 text-crema transition-colors hover:text-dorado"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <nav aria-label="Navegación principal">
            <ul className="space-y-1">
              {MAIN_LINKS.map((link) => {
                const active = link.isActive(location)
                return (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={onClose}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                        active
                          ? 'bg-white/10 text-dorado'
                          : 'text-crema hover:bg-white/5 hover:text-dorado'
                      }`}
                    >
                      {link.label}
                      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <p className="mt-6 mb-3 px-3 text-xs font-semibold tracking-wider text-arena/50 uppercase">
            Categorías
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/menu?category=${category.id}`}
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-lg bg-white/5 p-2 text-sm font-medium transition-colors hover:bg-fuego hover:text-white"
                >
                  <img
                    src={category.image}
                    alt=""
                    loading="lazy"
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                  <span className="truncate">{category.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={() => {
              onClose()
              onOrder()
            }}
            className="w-full rounded-lg bg-fuego-oscuro px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-fuego-profundo"
          >
            Ordena ahora
          </button>
          <p className="mt-3 text-center text-xs text-arena/50">
            Abierto todos los días · 12:00 – 22:00
          </p>
        </div>
      </aside>
    </div>,
    document.body
  )
}

export default MobileMenu
