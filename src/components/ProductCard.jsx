import { useCart } from '../context/cart-context'
import { formatPrice } from '../utils/formatPrice'

function ProductCard({ product, onView }) {
  const { addItem, increment, decrement, getQuantity } = useCart()
  const quantity = getQuantity(product.id)

  return (
    <article
      onClick={() => onView?.(product)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-arena bg-white transition-all duration-300 hover:-translate-y-1 hover:border-fuego hover:shadow-[0_22px_40px_-24px_rgba(241,90,36,0.55)]"
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onView?.(product)
        }}
        className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden bg-arena/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fuego"
        aria-label={`Ver detalles de ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-carbon/80 px-3 py-2 text-center text-xs font-semibold text-crema backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
          Ver detalles y agregar nota
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onView?.(product)
          }}
          className="mb-1 cursor-pointer text-left text-base font-semibold text-carbon transition-colors hover:text-fuego-oscuro focus-visible:underline focus-visible:outline-none"
        >
          {product.name}
        </button>
        <p className="mb-4 flex-1 text-sm text-humo">{product.description}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-roble">
            {formatPrice(product.price)}
          </span>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                addItem(product)
              }}
              className="cursor-pointer rounded-lg bg-fuego-oscuro px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-fuego-profundo hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego focus-visible:ring-offset-2"
            >
              Agregar
            </button>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-arena bg-crema px-2 py-1">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  decrement(product.id)
                }}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white font-bold text-carbon transition-colors hover:bg-fuego-oscuro hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
                aria-label={`Quitar uno de ${product.name}`}
              >
                −
              </button>
              <span className="w-4 text-center text-sm font-semibold text-carbon">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  increment(product.id)
                }}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white font-bold text-carbon transition-colors hover:bg-fuego-oscuro hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
                aria-label={`Agregar uno más de ${product.name}`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
