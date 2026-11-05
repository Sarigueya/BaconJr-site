import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../context/cart-context'
import { formatPrice } from '../utils/formatPrice'
import { CATEGORIES } from '../data/products'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

function ProductModal({ product, onClose }) {
  if (!product) return null

  return <ProductModalContent key={product.id} product={product} onClose={onClose} />
}

function ProductModalContent({ product, onClose }) {
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const closeButtonRef = useRef(null)
  const { addItem } = useCart()

  useBodyScrollLock()

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const categoryLabel =
    CATEGORIES.find((category) => category.id === product.category)?.label ??
    'Menú'

  const handleAdd = () => {
    addItem(product, { quantity, note })
    onClose()
  }

  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))
  const increaseQuantity = () => setQuantity((prev) => Math.min(20, prev + 1))

  return createPortal(
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-carbon/70 p-4 backdrop-blur-sm animate-[offerFade_200ms_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-[0_30px_80px_-24px_rgba(241,90,36,0.5)] ring-1 ring-fuego/25 animate-[offerPop_320ms_cubic-bezier(0.16,1,0.3,1)] md:grid-cols-2"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-carbon shadow-md backdrop-blur transition-colors hover:bg-fuego hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
          aria-label="Cerrar detalle del producto"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-[4/3] bg-crema md:aspect-auto md:min-h-[26rem]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-carbon/40 to-transparent md:hidden"
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-carbon/85 px-3 py-1 text-xs font-bold tracking-wider text-dorado uppercase backdrop-blur">
            {categoryLabel}
          </span>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-7">
          <div>
            <h2 id="product-modal-title" className="text-2xl font-black text-carbon sm:text-3xl">
              {product.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-humo">
              {product.description}
            </p>
            <p className="mt-4 text-3xl font-black text-fuego-oscuro">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-arena bg-crema px-4 py-3">
            <span className="text-sm font-semibold text-carbon">Cantidad</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity === 1}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white font-bold text-carbon shadow-sm transition-colors hover:bg-fuego-oscuro hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
                aria-label="Quitar una unidad"
              >
                −
              </button>
              <span className="w-6 text-center text-lg font-bold tabular-nums text-carbon">
                {quantity}
              </span>
              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity === 20}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white font-bold text-carbon shadow-sm transition-colors hover:bg-fuego-oscuro hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
                aria-label="Agregar una unidad"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="product-note" className="mb-2 block text-sm font-semibold text-carbon">
              Nota para tu pedido
            </label>
            <textarea
              id="product-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              maxLength={180}
              placeholder="Ej. término medio, sin cebolla, salsa aparte…"
              className="w-full resize-none rounded-xl border border-arena bg-crema px-4 py-3 text-sm text-carbon placeholder-humo transition-colors focus:border-fuego focus:outline-none focus:ring-2 focus:ring-fuego/30"
            />
            <p className="mt-1 text-right text-[11px] text-humo">
              {note.length}/180
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-arena px-5 py-3 text-sm font-semibold text-carbon transition-colors hover:border-fuego hover:text-fuego-oscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
            >
              Seguir viendo
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 cursor-pointer rounded-xl bg-fuego-oscuro px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-fuego-profundo hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            >
              Agregar al carrito · {formatPrice(product.price * quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ProductModal
