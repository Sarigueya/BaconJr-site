import { useLayoutEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import CategoryFilters from './CategoryFilters'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import { refreshScrollTriggers } from '../hooks/useGsapReveal'
import { resolveMenuCategory } from '../utils/menuCategory'
import { PRODUCTS } from '../data/products'

function Menu() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const activeCategory = resolveMenuCategory(searchParams.get('category'))

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS
    return PRODUCTS.filter((product) => product.category === activeCategory)
  }, [activeCategory])

  // Al filtrar cambia la altura de la página; recalcula los triggers para que
  // las secciones animadas que quedan más abajo no se queden invisibles.
  useLayoutEffect(() => {
    refreshScrollTriggers()
  }, [activeCategory])

  const handleCategoryChange = (category) => {
    // Limpia el hash para no dejar anclas apuntando a secciones que se ocultan.
    navigate({
      pathname,
      search: category === 'all' ? '' : `?category=${category}`,
      hash: '',
    })
  }

  return (
    <section id="menu" className="bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="menu-filters" className="mb-8">
          <CategoryFilters
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>

        <div className="text-center mt-10 mb-8">
          <p className="text-humo max-w-md mx-auto">
            Elige una categoría y agrega tus platillos favoritos al carrito.
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-humo">
            No hay productos en esta categoría todavía.
          </p>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  )
}

export default Menu