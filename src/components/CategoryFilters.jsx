import { CATEGORIES } from '../data/products'
import combofamiliar from '../assets/img/combofamiliar.png'
import ribeye from '../assets/img/ribeye.png'
import limonadanatural from '../assets/img/limonadanatural.png'
import cheesecake from '../assets/img/cheesecake.png'
import papasfrancesa from '../assets/img/papasfrancesa.png'
import bbqsalsa from '../assets/img/bbqsalsa.png'

// Foto y color de cada categoría. Para cambiar una, edítala aquí.
const CATEGORY_STYLES = {
  all: { image: combofamiliar, card: 'bg-carbon text-dorado' },
  meats: { image: ribeye, card: 'bg-brasa text-crema' },
  drinks: { image: limonadanatural, card: 'bg-fuego-oscuro text-crema' },
  desserts: { image: cheesecake, card: 'bg-roble text-crema' },
  sides: { image: papasfrancesa, card: 'bg-dorado text-carbon' },
  sauces: { image: bbqsalsa, card: 'bg-fuego-profundo text-crema' },
}

function CategoryFilters({ activeCategory, onChange, variant = 'menu' }) {
  const ringOffset = variant === 'home' ? 'ring-offset-crema' : 'ring-offset-white'

  return (
    <div
      className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:gap-4 lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Categorías del menú"
    >
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category.id
        const style = CATEGORY_STYLES[category.id] ?? CATEGORY_STYLES.all

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            aria-pressed={isActive}
            className={`group flex w-28 shrink-0 cursor-pointer snap-start flex-col items-center justify-center gap-2 rounded-[1.75rem] px-2 pt-4 pb-3 shadow-[0_10px_24px_-16px_rgba(28,20,16,0.8)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_-16px_rgba(241,90,36,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego focus-visible:ring-offset-2 sm:w-32 lg:w-auto lg:flex-1 ${ringOffset} ${style.card} ${
              isActive ? `-translate-y-1 ring-2 ring-fuego ring-offset-2` : ''
            }`}
          >
            <span className="block h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/25 sm:h-20 sm:w-20">
              <img
                src={style.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </span>
            <span className="text-center text-xs font-bold leading-tight sm:text-sm">
              {category.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilters
