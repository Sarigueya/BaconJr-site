import { useCart } from '../context/CartContext'

function formatPrice(price) {
  return `$${price}`
}

function ProductCard({ product }) {
  const { addItem, increment, decrement, getQuantity } = useCart()
  const quantity = getQuantity(product.id)

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
        <span className="text-neutral-400 text-sm">Imagen del producto</span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-black mb-1">{product.name}</h3>
        <p className="text-sm text-neutral-500 mb-4 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-black">
            {formatPrice(product.price)}
          </span>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addItem(product)}
              className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Agregar
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-neutral-100 rounded-lg px-2 py-1">
              <button
                type="button"
                onClick={() => decrement(product.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
                aria-label={`Quitar uno de ${product.name}`}
              >
                −
              </button>
              <span className="text-sm font-semibold text-black w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => increment(product.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
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