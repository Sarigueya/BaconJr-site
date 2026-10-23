import { useState, useMemo } from 'react'
import CategoryFilters from './CategoryFilters'
import ProductCard from './ProductCard'
import { PRODUCTS } from '../data/products'

function Menu() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS
    return PRODUCTS.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  return (
    <section id="menu" className="bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-carbon mb-3">
            Nuestro menú
          </h2>
          <p className="text-humo max-w-md mx-auto">
            Elige una categoría y agrega tus platillos favoritos al carrito.
          </p>
        </div>

        <CategoryFilters activeCategory={activeCategory} onChange={setActiveCategory} />

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-humo mt-10">
            No hay productos en esta categoría todavía.
          </p>
        )}
      </div>
    </section>
  )
}

export default Menu