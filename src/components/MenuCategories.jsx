import { useNavigate } from 'react-router-dom'
import CategoryFilters from './CategoryFilters'

function MenuCategories() {
  const navigate = useNavigate()

  return (
    <section
      aria-label="Categorías del menú"
      className="relative isolate overflow-hidden border-y border-arena/80 bg-crema py-8 md:py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(241,90,36,0.12),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dorado/70 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategoryFilters
          activeCategory={null}
          variant="home"
          onChange={(category) => navigate(`/menu?category=${category}`)}
        />
      </div>
    </section>
  )
}

export default MenuCategories
