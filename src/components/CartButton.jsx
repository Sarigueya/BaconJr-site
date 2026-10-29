import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { formatPrice } from '../utils/formatPrice'
import InvoiceModal from './InvoiceModal'

function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [order, setOrder] = useState(null) // foto del pedido mostrada en la factura
  const { items, increment, decrement, removeItem, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()

  const openInvoice = () => {
    setOrder({
      number: `BJ-${String(Date.now()).slice(-5)}`,
      date: new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' }),
      items: items.map((item) => ({ ...item })),
      totalItems,
      total: totalPrice,
    })
    setIsOpen(false)
  }

  const closeInvoice = () => setOrder(null)

  const goToMenu = () => {
    setOrder(null)
    navigate('/menu?category=all')
  }

  return (
    <>
      {/* Panel del carrito */}
      {isOpen && (
        <div
          className="fixed bottom-44 right-6 z-50 w-[92vw] max-w-sm max-h-[60vh] bg-white border border-arena rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Carrito de compras"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-fuego text-carbon">
            <h2 className="text-sm font-bold tracking-wide">TU PEDIDO</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-carbon/80 hover:text-carbon transition-colors"
              aria-label="Cerrar carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-6 py-10">
              <p className="text-sm text-humo text-center">
                Tu carrito está vacío. Agrega productos desde el menú.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-crema">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white border border-arena rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-carbon truncate">{item.name}</p>
                    <p className="text-xs text-humo">
                      {formatPrice(item.price)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 bg-crema rounded-lg px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => decrement(item.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-carbon font-bold hover:bg-arena transition-colors"
                        aria-label={`Quitar uno de ${item.name}`}
                      >
                        −
                      </button>
                      <span className="text-xs font-semibold text-carbon w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increment(item.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-carbon font-bold hover:bg-arena transition-colors"
                        aria-label={`Agregar uno más de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-humo hover:text-fuego-oscuro transition-colors"
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
            <div className="px-4 py-4 border-t border-arena bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-humo">Total</span>
                <span className="text-lg font-bold text-carbon">{formatPrice(totalPrice)}</span>
              </div>
              <button
                type="button"
                onClick={openInvoice}
                className="w-full py-3 bg-fuego-oscuro text-white text-sm font-semibold rounded-lg hover:bg-fuego-profundo transition-colors"
              >
                Ver factura y confirmar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Botón flotante del carrito */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-fuego text-white rounded-full shadow-lg flex items-center justify-center hover:bg-fuego-oscuro transition-colors"
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
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-carbon text-xs font-semibold rounded-full flex items-center justify-center border border-arena">
            {totalItems}
          </span>
        )}
      </button>

      {order && (
        <InvoiceModal order={order} onClose={closeInvoice} onGoToMenu={goToMenu} />
      )}
    </>
  )
}

export default CartButton