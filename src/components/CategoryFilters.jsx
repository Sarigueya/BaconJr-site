import { CATEGORIES } from '../data/products'

function CategoryFilters({ activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category.id
                            ? 'bg-carbon text-dorado'
              : 'bg-white text-humo border border-arena hover:border-fuego hover:text-fuego-oscuro'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilters