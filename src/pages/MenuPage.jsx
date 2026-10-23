import { Link } from 'react-router-dom'
import Menu from '../components/Menu'

function MenuPage() {
  return (
    <>
      <section
        className="bg-carbon pt-[var(--navbar-height)] text-crema"
        aria-labelledby="menu-page-title"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-arena">
            <Link to="/" className="transition-colors hover:text-dorado">
              Inicio
            </Link>
            <span className="mx-2 text-humo">/</span>
            <span className="text-dorado">Menú</span>
          </nav>

          <h1
            id="menu-page-title"
            className="mt-4 text-3xl md:text-5xl font-bold text-crema"
          >
            Menú
          </h1>
          <p className="mt-3 max-w-xl text-sm md:text-base text-arena">
            Cortes, bebidas y acompañantes preparados al carbón.
          </p>
        </div>
      </section>

      <Menu />
    </>
  )
}

export default MenuPage
