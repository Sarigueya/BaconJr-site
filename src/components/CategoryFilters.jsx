import { CATEGORIES } from '../data/products'
import CategoryIcon from './CategoryIcon'

function CategoryFilters({ activeCategory, onChange, variant = 'menu' }) {
  const isHome = variant === 'home'

  return (
    <div
      className={
        isHome
          ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6'
          : 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'
      }
      role="group"
      aria-label="Categorías del menú"
    >
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          aria-pressed={activeCategory === category.id}
          className={
            isHome
              ? 'group flex min-h-24 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-carbon bg-carbon px-3 py-5 text-center text-xs font-semibold leading-tight text-crema shadow-[0_12px_30px_-18px_rgba(28,20,16,0.85)] transition-all duration-300 hover:-translate-y-1 hover:border-fuego hover:bg-carbon-suave hover:text-dorado hover:shadow-[0_20px_36px_-18px_rgba(241,90,36,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego focus-visible:ring-offset-2 focus-visible:ring-offset-crema sm:text-sm md:min-h-28 [&_svg]:h-6 [&_svg]:w-6 [&_svg]:text-dorado [&_svg]:transition-transform [&_svg]:duration-300 group-hover:[&_svg]:scale-110 md:[&_svg]:h-7 md:[&_svg]:w-7'
              : `flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center text-xs font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego focus-visible:ring-offset-2 sm:px-3 sm:text-sm ${
                  activeCategory === category.id
                    ? 'border-carbon bg-carbon text-dorado'
                    : 'border-arena bg-white text-humo hover:border-fuego hover:text-fuego-oscuro'
                }`
          }
        >
          <CategoryIcon id={category.id} />
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  )
}

export default CategoryFilters
