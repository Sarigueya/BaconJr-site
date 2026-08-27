import { useState } from 'react'
import { useCart } from '../context/CartContext'

function formatPrice(price) {
  return `$${price}`
}

function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, increment, decrement, removeItem, totalItems, totalPrice } = useCart()

  return (
    <>
      {/* Panel del carrito */}
      {isOpen && (
        <div
          className="fixed bottom-44 right-6 z-50 w-[92vw] max-w-sm max-h-[60vh] bg-white border border-neutral-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Carrito de compras"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
            <h2 className="text-sm font-bold tracking-wide">TU PEDIDO</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/80 hover:text-white transition-colors"
              aria-label="Cerrar carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-6 py-10">
              <p className="text-sm text-neutral-400 text-center">
                Tu carrito está vacío. Agrega productos desde el menú.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-neutral-50">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-neutral-200 rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black truncate">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {formatPrice(item.price)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 bg-neutral-100 rounded-lg px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => decrement(item.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
                        aria-label={`Quitar uno de ${item.name}`}
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold text-black w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increment(item.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-black font-bold hover:bg-neutral-200 transition-colors"
                        aria-label={`Agregar uno más de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-neutral-400 hover:text-black transition-colors"
                      aria-label={`Quitar ${item.name} del carrito`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="px-4 py-4 border-t border-neutral-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-500">Total</span>
                <span className="text-lg font-bold text-black">{formatPrice(totalPrice)}</span>
              </div>
              <button
                type="button"
                className="w-full py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Continuar pedido
              </button>
            </div>
          )}
        </div>
      )}

      {/* Botón flotante del carrito */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-800 transition-colors"
        aria-label="Carrito de compras"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs font-semibold rounded-full flex items-center justify-center border border-neutral-200">
            {totalItems}
          </span>
        )}
      </button>
    </>
  )
}

export default CartButton