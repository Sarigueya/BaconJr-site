import { useEffect, useRef, useState } from 'react'
import logo from '../assets/logos/logoBaconjrv2.svg'
import { useCart } from '../context/cart-context'
import { formatPrice } from '../utils/formatPrice'
import SocialLinks from './SocialLinks'

// Pasos del modal:
// 'invoice'       -> factura con el detalle del pedido
// 'confirmCancel' -> "¿Seguro que quieres cancelar?"
// 'success'       -> pedido exitoso
// 'cancelled'     -> pedido cancelado
//
// `order` es una "foto" del carrito tomada al abrir la factura:
// { number, date, items, totalItems, total }. Así el resumen se sigue
// viendo aunque el carrito ya se haya limpiado.
function InvoiceModal({ order, onClose, onGoToMenu }) {
  const [step, setStep] = useState('invoice')
  const { clearCart } = useCart()
  const panelRef = useRef(null)

  const handleConfirm = () => {
    clearCart()
    setStep('success')
  }

  const handleCancel = () => {
    clearCart()
    setStep('cancelled')
  }

  // Cierra / retrocede según el paso (Escape y clic en el fondo).
  const dismiss = () => {
    if (step === 'confirmCancel') {
      setStep('invoice')
    } else {
      onClose()
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (step === 'confirmCancel') {
        setStep('invoice')
      } else {
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [step, onClose])

  // Al cambiar de paso, el foco pasa al panel para lectores de pantalla y teclado.
  useEffect(() => {
    panelRef.current?.focus()
  }, [step])

  const titleId = 'invoice-modal-title'

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-carbon/75 p-4 backdrop-blur-sm animate-[offerFade_250ms_ease-out]"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        key={step}
        ref={panelRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl bg-crema text-carbon shadow-[0_30px_80px_-20px_rgba(241,90,36,0.55)] ring-1 ring-fuego/30 outline-none animate-[offerPop_350ms_cubic-bezier(0.16,1,0.3,1)] data-[step=invoice]:max-w-lg data-[step=success]:max-w-md data-[step=cancelled]:max-w-md data-[step=confirmCancel]:max-w-sm"
        data-step={step}
      >
        {step === 'invoice' && (
          <InvoiceStep
            titleId={titleId}
            order={order}
            onClose={onClose}
            onAskCancel={() => setStep('confirmCancel')}
            onConfirm={handleConfirm}
          />
        )}

        {step === 'confirmCancel' && (
          <ConfirmCancelStep
            titleId={titleId}
            onBack={() => setStep('invoice')}
            onCancel={handleCancel}
          />
        )}

        {step === 'success' && (
          <ResultStep
            titleId={titleId}
            tone="success"
            title="¡Pedido exitoso!"
            order={order}
            message="Recibimos tu pedido y ya lo estamos preparando. ¡Gracias por elegir Bacon Jr.!"
            onClose={onClose}
            onGoToMenu={onGoToMenu}
          />
        )}

        {step === 'cancelled' && (
          <ResultStep
            titleId={titleId}
            tone="cancelled"
            title="Pedido cancelado"
            order={order}
            message="Tu carrito quedó vacío. Cuando quieras, puedes armar un nuevo pedido desde el menú."
            onClose={onClose}
            onGoToMenu={onGoToMenu}
          />
        )}
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function InvoiceStep({ titleId, order, onClose, onAskCancel, onConfirm }) {
  return (
    <>
      {/* Encabezado */}
      <div className="relative bg-carbon px-6 py-5 text-crema">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-fuego/25 blur-3xl"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-carbon-suave text-crema transition-colors hover:bg-fuego focus-visible:ring-2 focus-visible:ring-dorado focus-visible:outline-none"
          aria-label="Cerrar factura"
        >
          <CloseIcon />
        </button>

        <div className="relative flex items-center gap-4">
          <img src={logo} alt="Bacon Jr." className="h-12 w-auto" />
          <div className="border-l border-crema/20 pl-4">
            <h2 id={titleId} className="text-xs font-bold tracking-[0.2em] text-dorado uppercase">
              Factura de pedido
            </h2>
            <p className="mt-1 text-lg font-black">{order.number}</p>
          </div>
        </div>
      </div>

      {/* Datos del pedido */}
      <div className="flex items-center justify-between gap-4 border-b border-dashed border-arena px-6 py-3 text-xs text-humo">
        <span>
          <span className="font-semibold text-carbon">Fecha: </span>
          {order.date}
        </span>
        <span>
          <span className="font-semibold text-carbon">Productos: </span>
          {order.totalItems}
        </span>
      </div>

      {/* Detalle */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mb-2 grid grid-cols-[1fr_auto] gap-4 text-[11px] font-bold tracking-wider text-humo uppercase">
          <span>Detalle</span>
          <span>Subtotal</span>
        </div>

        <ul className="divide-y divide-arena/80">
          {order.items.map((item) => (
            <li key={item.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3">
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className="h-12 w-12 rounded-lg border border-arena bg-white object-cover"
                />
              ) : (
                <span className="h-12 w-12 rounded-lg border border-arena bg-white" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-humo">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <span className="text-sm font-bold text-roble">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total */}
      <div className="border-t border-dashed border-arena bg-white px-6 py-4">
        <div className="flex items-end justify-between">
          <span className="text-sm font-semibold tracking-wider text-humo uppercase">Total a pagar</span>
          <span className="text-3xl font-black text-carbon">{formatPrice(order.total)}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onAskCancel}
            className="cursor-pointer rounded-xl border border-arena px-4 py-3 text-sm font-semibold text-carbon transition-colors hover:border-brasa hover:text-brasa focus-visible:ring-2 focus-visible:ring-fuego focus-visible:outline-none"
          >
            Cancelar pedido
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded-xl bg-fuego-oscuro px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo focus-visible:ring-2 focus-visible:ring-dorado focus-visible:outline-none"
          >
            Confirmar pedido
          </button>
        </div>
      </div>

      {/* Redes */}
      <div className="flex items-center justify-center gap-4 border-t border-arena bg-crema px-6 py-3">
        <span className="text-xs font-semibold tracking-wider text-humo uppercase">Síguenos</span>
        <SocialLinks variant="light" />
      </div>
    </>
  )
}

function ConfirmCancelStep({ titleId, onBack, onCancel }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brasa/10 text-brasa">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
          />
        </svg>
      </span>

      <div>
        <h2 id={titleId} className="text-xl font-black">
          ¿Seguro que quieres cancelar?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-humo">
          Se vaciará tu carrito y perderás los productos que seleccionaste.
        </p>
      </div>

      <div className="mt-2 grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-xl border border-arena bg-white px-4 py-3 text-sm font-semibold text-carbon transition-colors hover:border-fuego focus-visible:ring-2 focus-visible:ring-fuego focus-visible:outline-none"
        >
          No, volver
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-xl bg-brasa px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brasa/85 focus-visible:ring-2 focus-visible:ring-dorado focus-visible:outline-none"
        >
          Sí, cancelar
        </button>
      </div>
    </div>
  )
}

function ResultStep({ titleId, tone, title, order, message, onClose, onGoToMenu }) {
  const isSuccess = tone === 'success'

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          isSuccess ? 'bg-dorado/20 text-fuego-oscuro' : 'bg-arena text-roble'
        }`}
      >
        {isSuccess ? (
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </span>

      <div>
        <h2 id={titleId} className="text-2xl font-black">
          {title}
        </h2>
        <p className="mt-1 text-sm font-semibold text-fuego-oscuro">{order.number}</p>
        <p className="mt-3 text-sm leading-relaxed text-humo">{message}</p>
      </div>

      {isSuccess && (
        <div className="flex w-full items-center justify-between rounded-xl border border-arena bg-white px-4 py-3 text-sm">
          <span className="text-humo">
            {order.totalItems} {order.totalItems === 1 ? 'producto' : 'productos'}
          </span>
          <span className="font-black">{formatPrice(order.total)}</span>
        </div>
      )}

      <div className="mt-1 grid w-full grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-xl border border-arena bg-white px-4 py-3 text-sm font-semibold text-carbon transition-colors hover:border-fuego focus-visible:ring-2 focus-visible:ring-fuego focus-visible:outline-none"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={onGoToMenu}
          className="cursor-pointer rounded-xl bg-fuego-oscuro px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo focus-visible:ring-2 focus-visible:ring-dorado focus-visible:outline-none"
        >
          {isSuccess ? 'Hacer otro pedido' : 'Volver al menú'}
        </button>
      </div>

      <div className="mt-2 flex items-center gap-4 border-t border-arena pt-4">
        <span className="text-xs font-semibold tracking-wider text-humo uppercase">Síguenos</span>
        <SocialLinks variant="light" />
      </div>
    </div>
  )
}

export default InvoiceModal
