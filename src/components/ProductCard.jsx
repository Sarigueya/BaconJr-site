import { useCart } from '../context/cart-context'
import { formatPrice } from '../utils/formatPrice'

function ProductCard({ product }) {
  const { addItem, increment, decrement, getQuantity } = useCart()
  const quantity = getQuantity(product.id)

  return (
    <div className="bg-white border border-arena rounded-lg overflow-hidden hover:shadow-lg hover:border-fuego transition-all flex flex-col">
      <div className="aspect-[4/3] bg-arena/50 flex items-center justify-center">
        <span className="text-humo text-sm">Imagen del producto</span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-carbon mb-1">{product.name}</h3>
        <p className="text-sm text-humo mb-4 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-roble">
            {formatPrice(product.price)}
          </span>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addItem(product)}
              className="px-4 py-2 bg-fuego-oscuro text-white text-sm font-semibold rounded-lg hover:bg-fuego-profundo transition-colors"
            >
              Agregar
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-crema border border-arena rounded-lg px-2 py-1">
              <button
                type="button"
                onClick={() => decrement(product.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-carbon font-bold hover:bg-fuego-oscuro hover:text-white transition-colors"
                aria-label={`Quitar uno de ${product.name}`}
              >
                −
              </button>
              <span className="text-sm font-semibold text-carbon w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => increment(product.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-carbon font-bold hover:bg-fuego-oscuro hover:text-white transition-colors"
                aria-label={`Agregar uno más de ${product.name}`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard