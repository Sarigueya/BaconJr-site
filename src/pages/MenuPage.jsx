import { useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Menu from '../components/Menu'
import Cocktails from '../components/Cocktails'
import { useGsapReveal } from '../hooks/useGsapReveal'
import { resolveMenuCategory, showsCocktails } from '../utils/menuCategory'

function MenuPage() {
  const headerRef = useRef(null)
  const [searchParams] = useSearchParams()
  const activeCategory = resolveMenuCategory(searchParams.get('category'))

  useGsapReveal(headerRef, {
    from: { autoAlpha: 0, y: 14 },
    to: { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' },
  })

  return (
    <>
      <section
        className="bg-carbon pt-[calc(var(--navbar-height)+0.25rem)] text-crema"
        aria-labelledby="menu-page-title"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div ref={headerRef}>
            <h1
              id="menu-page-title"
              className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-crema"
            >
              Menú
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-arena">
              Cortes, bebidas y acompañantes preparados al carbón.
            </p>
          </div>
        </div>
      </section>

      <Menu />
      {/* La coctelería solo aplica a "Todo" y "Bebidas". */}
      {showsCocktails(activeCategory) && <Cocktails />}
    </>
  )
}

export default MenuPage
