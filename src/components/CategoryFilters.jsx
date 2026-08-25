import { useState } from 'react'

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'meats', label: 'Carnes' },
  { id: 'drinks', label: 'Bebidas' },
  { id: 'desserts', label: 'Postres' },
  { id: 'sides', label: 'Acompañantes' },
  { id: 'sauces', label: 'Salsas' },
]

function CategoryFilters() {
  const [activeCategory, setActiveCategory] = useState('all')

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryFilters
