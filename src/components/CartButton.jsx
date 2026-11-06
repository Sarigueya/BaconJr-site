import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { formatPrice } from '../utils/formatPrice'
import InvoiceModal from './InvoiceModal'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'

function CartButton({ isOpen, onOpenChange }) {
  const [order, setOrder] = useState(null) // foto del pedido mostrada en la factura
  const [confirmClear, setConfirmClear] = useState(false)
  const panelRef = useRef(null)
  const floatButtonRef = useRef(null)
  const { items, removeItem, clearCart, totalItems, totalPrice, setItemQuantity } = useCart()

  const closeCart = useCallback(() => {
    setConfirmClear(false)
    onOpenChange(false)
  }, [onOpenChange])

  useBodyScrollLock(isOpen)
  useFocusTrap(panelRef, isOpen)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCart()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeCart])

  const navigate = useNavigate()

  const openCheckout = () => {
    setOrder({
      number: `BJ-${String(Date.now()).slice(-5)}`,
      date: new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' }),
      items: items.map((item) => ({ ...item })),
      totalItems,
      total: totalPrice,
    })
    closeCart()
  }

  const closeCheckout = () => setOrder(null)

  const goToMenu = () => {
    setOrder(null)
    navigate('/menu?category=all')
  }

  return (
    <>
      {/* Backdrop + panel del carrito */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-carbon/30 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            tabIndex={-1}
            className="fixed bottom-44 right-6 z-50 flex max-h-[calc(100vh-13rem)] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-arena bg-white shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-fuego"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-panel-title"
          >
            <div className="flex items-center justify-between bg-carbon px-4 py-3 text-crema">
              <h2
                id="cart-panel-title"
                className="text-sm font-bold tracking-[0.2em] text-dorado uppercase"
              >
                TU PEDIDO
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-full p-1 text-crema/70 transition-colors hover:text-dorado focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
                aria-label="Cerrar carrito"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center px-6 py-10">
                <p className="text-center text-sm text-humo">
                  Tu carrito está vacío. Agrega productos desde el menú.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto bg-crema px-4 py-3">
                  {items.map((item) => {
                    const lineId = item.lineId ?? item.id
                    return (
                      <div
                        key={lineId}
                        className="flex items-center justify-between rounded-lg border border-arena bg-white px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-carbon">{item.name}</p>
                          <p className="text-xs text-humo">{formatPrice(item.price)} c/u</p>
                          {item.note && (
                            <p className="mt-1 line-clamp-2 text-xs italic text-fuego-oscuro">
                              Nota: {item.note}
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <div className="flex items-center gap-1.5 rounded-lg bg-crema px-1.5 py-1">
                            <button
                              type="button"
                              onClick={() => setItemQuantity(item, item.quantity - 1, { note: item.note })}
                              className="flex h-6 w-6 items-center justify-center rounded-md bg-white font-bold text-carbon transition-colors hover:bg-arena"
                              aria-label={`Quitar uno de ${item.name}`}
                            >
                              −
                            </button>
                            <span className="w-4 text-center text-xs font-semibold text-carbon">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setItemQuantity(item, item.quantity + 1, { note: item.note })}
                              className="flex h-6 w-6 items-center justify-center rounded-md bg-white font-bold text-carbon transition-colors hover:bg-arena"
                              aria-label={`Agregar uno más de ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(lineId)}
                            className="p-1 text-humo transition-colors hover:text-fuego-oscuro"
                            aria-label={`Quitar ${item.name} del carrito`}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {confirmClear ? (
                  <div className="space-y-3 border-t border-arena bg-white px-4 py-4">
                    <p className="text-sm font-bold text-carbon">¿Vaciar tu carrito?</p>
                    <p className="text-xs leading-relaxed text-humo">
                      Se eliminarán todos los productos que agregaste. Esta acción no se puede deshacer.
                    </p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="flex-1 cursor-pointer rounded-lg border border-arena px-4 py-2.5 text-sm font-semibold text-carbon transition-colors hover:border-fuego focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          clearCart()
                          setConfirmClear(false)
                        }}
                        className="flex-1 cursor-pointer rounded-lg bg-brasa px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brasa/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
                      >
                        Sí, vaciar
                      </button>
                    </div>
                  </div>
                ) : (
                  items.length > 0 && (
                    <div className="space-y-3 border-t border-arena bg-white px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setConfirmClear(true)}
                        className="w-full cursor-pointer rounded-lg border border-arena px-4 py-2 text-xs font-semibold text-humo transition-colors hover:border-brasa hover:text-brasa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
                      >
                        Vaciar carrito
                      </button>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-humo">Total</span>
                        <span className="text-lg font-bold text-carbon">{formatPrice(totalPrice)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={openCheckout}
                        className="w-full cursor-pointer rounded-lg bg-fuego-oscuro px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
                      >
                        Hacer pedido
                      </button>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Botón flotante del carrito */}
      <button
        ref={floatButtonRef}
        type="button"
        onClick={() => onOpenChange(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-fuego text-white shadow-lg transition-colors hover:bg-fuego-oscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
        aria-label="Carrito de compras"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-arena bg-white text-xs font-semibold text-carbon">
            {totalItems}
          </span>
        )}
      </button>

      {order && (
        <InvoiceModal order={order} onClose={closeCheckout} onGoToMenu={goToMenu} />
      )}
    </>
  )
}

export default CartButton
