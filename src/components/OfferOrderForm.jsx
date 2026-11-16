import { useId } from 'react'
import { formatPrice } from '../utils/formatPrice'
import useLineOrder from '../hooks/useLineOrder'

function OfferOrderForm({ offer, onAdded }) {
  const {
    note,
    setNote,
    quantity,
    isInCart,
    canSubmit,
    decreaseQuantity,
    increaseQuantity,
    submit,
  } = useLineOrder(offer, 1)
  const noteId = useId()

  const isRemoval = quantity === 0 && isInCart
  const submitLabel = isRemoval
    ? 'Quitar del carrito'
    : isInCart
      ? 'Actualizar en el carrito'
      : 'Agregar al carrito'

  const handleAdd = () => {
    if (!submit()) return

    onAdded?.()
  }

  const handleDecrease = () => {
    if (quantity <= 0) return
    decreaseQuantity()
  }

  const handleIncrease = () => {
    if (quantity >= 20) return
    increaseQuantity()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-arena bg-white px-3 py-2">
        <span className="text-xs font-semibold text-carbon">Cantidad</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-crema font-bold text-carbon transition-colors hover:bg-fuego-oscuro hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
            aria-label="Quitar una unidad"
          >
            −
          </button>
          <span className="w-5 text-center text-sm font-bold tabular-nums text-carbon">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= 20}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-crema font-bold text-carbon transition-colors hover:bg-fuego-oscuro hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
            aria-label="Agregar una unidad"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor={noteId}
          className="mb-1.5 block text-xs font-semibold tracking-wider text-humo uppercase"
        >
          Comentario para tu pedido
        </label>
        <textarea
          id={noteId}
          value={note}
          onChange={setNote}
          rows={2}
          maxLength={180}
          placeholder="Ej. sin cebolla, salsa aparte, término medio…"
          autoComplete="off"
          aria-describedby={`${noteId}-count`}
          className="w-full resize-none rounded-xl border border-arena bg-white px-3 py-2 text-sm text-carbon placeholder-humo transition-colors focus:border-fuego focus:outline-none focus:ring-2 focus:ring-fuego/30"
        />
        <p id={`${noteId}-count`} className="mt-1 text-right text-[11px] text-humo">
          {note.length}/180
        </p>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!canSubmit}
        className="w-full rounded-xl bg-fuego-oscuro px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-fuego-profundo hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitLabel}
        {quantity > 0 ? ` · ${formatPrice(offer.price * quantity)}` : ''}
      </button>
    </div>
  )
}

export default OfferOrderForm
