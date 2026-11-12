import { useCallback, useEffect, useRef, useState } from 'react'
import logo from '../assets/brand/logoBaconjrv2.svg'
import { useCart } from '../context/cart-context'
import { useAuth } from '../context/AuthProvider'
import { formatPrice } from '../utils/formatPrice'
import { LOCATION_STORAGE_KEY, NEARBY_STORES } from '../data/stores'
import { FULFILLMENT_OPTIONS, PAYMENT_METHODS } from '../data/checkout'
import SocialLinks from './SocialLinks'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

const PANEL_WIDTH = {
  invoice: 'sm:max-w-3xl',
  fulfillment: 'sm:max-w-xl',
  payment: 'sm:max-w-xl',
  processing: 'sm:max-w-md',
  confirmCancel: 'sm:max-w-md',
  success: 'sm:max-w-lg',
  cancelled: 'sm:max-w-lg',
}

function readStoredLocation() {
  try {
    const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed?.lat === 'number') return parsed
  } catch {
    // Si el navegador bloquea localStorage, el checkout funciona igual.
  }
  return null
}

function InvoiceModal({ order, onClose, onGoToMenu }) {
  const { currentUser, isAuthModalOpen, openAuthModal } = useAuth()
  const [storedLocation] = useState(readStoredLocation)
  const [step, setStep] = useState('invoice')
  const [fulfillment, setFulfillment] = useState(null)
  const [deliveryName, setDeliveryName] = useState(
    currentUser?.name ?? storedLocation?.name ?? ''
  )
  const [deliveryAddress, setDeliveryAddress] = useState(
    (currentUser?.address ?? storedLocation?.address ?? '').slice(0, 140)
  )
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [pickupStoreId, setPickupStoreId] = useState(
    storedLocation?.storeId ?? NEARBY_STORES[0].id
  )
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id)
  const { clearCart } = useCart()
  const panelRef = useRef(null)
  const paymentTimerRef = useRef(null)

  useBodyScrollLock()

  // Cuando el usuario inicia sesión o crea cuenta desde la factura, se cargan su nombre y dirección
  useEffect(() => {
    if (!currentUser) return
    setDeliveryName(currentUser.name || '')
    setDeliveryAddress((currentUser.address || '').slice(0, 140))
    setIsEditingAddress(false)
  }, [currentUser])

  const pickupStore =
    NEARBY_STORES.find((store) => store.id === pickupStoreId) ?? NEARBY_STORES[0]

  const trimmedDeliveryName = deliveryName.trim()
  const trimmedDeliveryAddress = deliveryAddress.trim()

  const addressError = !trimmedDeliveryAddress
    ? 'Escribe tu dirección de entrega.'
    : trimmedDeliveryAddress.length < 5
      ? 'La dirección debe tener al menos 5 caracteres.'
      : !/\d/.test(trimmedDeliveryAddress)
        ? 'Incluye al menos un número (altura o número de casa).'
        : ''

  const nameError = trimmedDeliveryName.length < 2 ? 'Escribe el nombre de quien recibe.' : ''

  const isDeliveryValid = !addressError && !nameError
  const isFulfillmentValid =
    fulfillment === 'delivery' ? isDeliveryValid : fulfillment === 'pickup' && Boolean(pickupStoreId)

  const handleContinueFromInvoice = () => {
    if (!currentUser) {
      openAuthModal({ checkout: true })
      return
    }
    setStep('fulfillment')
  }

  const handleCancel = () => {
    clearCart()
    setStep('cancelled')
  }

  const handlePayment = () => {
    if (step !== 'payment') return
    if (!currentUser) {
      openAuthModal({ checkout: true })
      return
    }
    setStep('processing')
    window.clearTimeout(paymentTimerRef.current)
    paymentTimerRef.current = window.setTimeout(() => {
      clearCart()
      setStep('success')
    }, 1400)
  }

  const dismiss = useCallback(() => {
    if (isAuthModalOpen) return
    if (step === 'processing') return
    if (step === 'confirmCancel') {
      setStep('invoice')
      return
    }
    onClose()
  }, [isAuthModalOpen, step, onClose])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [dismiss])

  useEffect(() => () => window.clearTimeout(paymentTimerRef.current), [])

  useEffect(() => {
    panelRef.current?.focus()
  }, [step])

  const titleId = 'invoice-modal-title'
  const paymentLabel =
    PAYMENT_METHODS.find((method) => method.id === paymentMethod)?.label ?? 'Pago'

  const fulfillmentSummary =
    fulfillment === 'delivery'
      ? {
          label: 'Entrega a domicilio',
          detail: `${trimmedDeliveryName} · ${trimmedDeliveryAddress}`,
        }
      : {
          label: 'Recoger en sucursal',
          detail: `${pickupStore.name} · ${pickupStore.address}`,
        }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-carbon/75 p-4 backdrop-blur-sm animate-[offerFade_250ms_ease-out]"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl bg-crema text-carbon shadow-[0_30px_80px_-20px_rgba(241,90,36,0.55)] ring-1 ring-fuego/30 outline-none animate-[offerPop_350ms_cubic-bezier(0.16,1,0.3,1)] ${PANEL_WIDTH[step]}`}
      >
        {step !== 'processing' && (
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-3 right-3 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-carbon text-crema shadow-md transition-colors hover:bg-fuego focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            aria-label="Cerrar"
          >
            <CloseIcon />
          </button>
        )}

        {step === 'invoice' && (
          <InvoiceStep
            titleId={titleId}
            order={order}
            currentUser={currentUser}
            deliveryAddress={deliveryAddress}
            onDeliveryAddressChange={setDeliveryAddress}
            isEditingAddress={isEditingAddress}
            onToggleEditAddress={() => setIsEditingAddress((prev) => !prev)}
            addressError={addressError}
            onOpenAuth={() => openAuthModal({ checkout: true })}
            onAskCancel={() => setStep('confirmCancel')}
            onContinue={handleContinueFromInvoice}
          />
        )}

        {step === 'fulfillment' && (
          <FulfillmentStep
            titleId={titleId}
            fulfillment={fulfillment}
            onSelect={setFulfillment}
            deliveryName={deliveryName}
            deliveryAddress={deliveryAddress}
            onDeliveryNameChange={setDeliveryName}
            onDeliveryAddressChange={setDeliveryAddress}
            pickupStoreId={pickupStoreId}
            onPickupStoreChange={setPickupStoreId}
            onBack={() => setStep('invoice')}
            onContinue={() => setStep('payment')}
            isValid={isFulfillmentValid}
            addressError={fulfillment === 'delivery' ? addressError : ''}
            nameError={fulfillment === 'delivery' ? nameError : ''}
          />
        )}

        {step === 'payment' && (
          <PaymentStep
            titleId={titleId}
            order={order}
            fulfillment={fulfillment}
            deliveryName={trimmedDeliveryName}
            deliveryAddress={trimmedDeliveryAddress}
            pickupStore={pickupStore}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onBack={() => setStep('fulfillment')}
            onPay={handlePayment}
          />
        )}

        {step === 'processing' && <ProcessingStep titleId={titleId} order={order} />}

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
            message="Pago confirmado. Ya estamos preparando tu pedido. ¡Gracias por elegir Bacon Jr.!"
            fulfillment={fulfillmentSummary}
            paymentLabel={paymentLabel}
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

function DeliveryIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17.5" cy="18" r="1.5" />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10 5 4h14l2 6M4 10v9h16v-9M4 10h16M9 19v-5h6v5" />
    </svg>
  )
}

function CheckoutProgress({ current }) {
  const steps = ['Entrega', 'Pago', 'Confirmación']

  return (
    <ol className="flex items-center gap-2" aria-label="Progreso del pedido">
      {steps.map((label, index) => {
        const isDone = index < current
        const isCurrent = index === current

        return (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                isDone || isCurrent ? 'bg-fuego-oscuro text-white' : 'bg-arena text-humo'
              }`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {isDone ? '✓' : index + 1}
            </span>
            <span
              className={`truncate text-[10px] font-bold tracking-wider uppercase ${
                isCurrent ? 'text-carbon' : 'text-humo'
              }`}
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <span className="h-px flex-1 bg-arena" aria-hidden="true" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

function InvoiceStep({
  titleId,
  order,
  currentUser,
  deliveryAddress,
  onDeliveryAddressChange,
  isEditingAddress,
  onToggleEditAddress,
  addressError,
  onOpenAuth,
  onAskCancel,
  onContinue,
}) {
  return (
    <>
      {/* Encabezado */}
      <div className="relative bg-carbon px-6 py-5 text-crema">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-fuego/25 blur-3xl"
        />
        <div className="relative flex items-center gap-4">
          <img src={logo} alt="Bacon Jr." className="h-12 w-auto" />
          <div className="border-l border-crema/20 pl-4">
            <h2 id={titleId} className="text-xs font-bold tracking-[0.2em] text-dorado uppercase">
              Resumen del pedido
            </h2>
            <p className="mt-1 text-lg font-black">{order.number}</p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="flex min-h-0 flex-1 flex-col">
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

          {/* Bloque de Cliente y Dirección guardada (o invitación a iniciar sesión) */}
          <div className="border-b border-arena bg-white/80 px-6 py-3.5">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-wider text-humo uppercase">
                      Cliente y dirección de entrega
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-carbon">
                      {currentUser.name}{' '}
                      {currentUser.phone && (
                        <span className="font-normal text-xs text-humo">· {currentUser.phone}</span>
                      )}
                    </p>
                    {!isEditingAddress && (
                      <p className="mt-0.5 text-xs text-humo">{deliveryAddress}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onToggleEditAddress}
                    className="shrink-0 cursor-pointer rounded-lg border border-arena bg-crema px-2.5 py-1 text-xs font-semibold text-fuego-oscuro transition-colors hover:border-fuego"
                  >
                    {isEditingAddress ? 'Listo' : 'Cambiar dirección'}
                  </button>
                </div>

                {isEditingAddress && (
                  <div>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => onDeliveryAddressChange(e.target.value)}
                      maxLength={140}
                      placeholder="Nueva dirección de entrega..."
                      className="w-full rounded-lg border border-arena bg-crema px-3 py-2 text-xs text-carbon focus:border-fuego focus:outline-none"
                    />
                    {addressError && (
                      <p className="mt-1 text-[11px] font-medium text-brasa">{addressError}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-humo">
                  Inicia sesión o crea una cuenta para usar tu dirección guardada y confirmar el pedido.
                </p>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="shrink-0 cursor-pointer rounded-lg bg-carbon px-3 py-1.5 text-xs font-bold text-dorado transition-colors hover:bg-fuego-oscuro hover:text-white"
                >
                  Iniciar sesión
                </button>
              </div>
            )}
          </div>

          {/* Detalle de productos */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <div className="mb-2 grid grid-cols-[1fr_auto] gap-4 text-[11px] font-bold tracking-wider text-humo uppercase">
              <span>Detalle</span>
              <span>Subtotal</span>
            </div>

            <ul className="divide-y divide-arena/80">
              {order.items.map((item) => (
                <li
                  key={item.lineId ?? item.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="h-14 w-14 rounded-lg border border-arena bg-white object-cover"
                    />
                  ) : (
                    <span
                      className="h-14 w-14 rounded-lg border border-arena bg-white"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-humo">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                    {item.note && (
                      <p className="mt-1 text-xs italic break-words text-fuego-oscuro">
                        Nota: {item.note}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-roble">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Resumen y acciones */}
        <aside className="flex shrink-0 flex-col justify-between border-t border-dashed border-arena bg-white md:w-72 md:border-t-0 md:border-l lg:w-80">
          <div className="px-6 py-5">
            <span className="text-xs font-semibold tracking-wider text-humo uppercase">
              Total a pagar
            </span>
            <span className="mt-1 block text-4xl font-black text-carbon">
              {formatPrice(order.total)}
            </span>
            <p className="mt-2 text-xs text-humo">
              {order.totalItems}{' '}
              {order.totalItems === 1 ? 'producto' : 'productos'} en tu pedido
            </p>
          </div>

          <div className="space-y-3 px-6 pb-5">
            <button
              type="button"
              onClick={onContinue}
              disabled={Boolean(currentUser && isEditingAddress && addressError)}
              className="w-full cursor-pointer rounded-xl bg-fuego-oscuro px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-dorado focus-visible:outline-none"
            >
              {currentUser ? 'Confirmar pedido' : 'Iniciar sesión para confirmar'}
            </button>
            <button
              type="button"
              onClick={onAskCancel}
              className="w-full cursor-pointer rounded-xl border border-arena px-4 py-3 text-sm font-semibold text-carbon transition-colors hover:border-brasa hover:text-brasa focus-visible:ring-2 focus-visible:ring-fuego focus-visible:outline-none"
            >
              Cancelar pedido
            </button>
          </div>
        </aside>
      </div>

      {/* Redes */}
      <div className="flex items-center justify-center gap-4 border-t border-arena bg-crema px-6 py-3">
        <span className="text-xs font-semibold tracking-wider text-humo uppercase">Síguenos</span>
        <SocialLinks variant="light" />
      </div>
    </>
  )
}

function FulfillmentStep({
  titleId,
  fulfillment,
  onSelect,
  deliveryName,
  deliveryAddress,
  onDeliveryNameChange,
  onDeliveryAddressChange,
  pickupStoreId,
  onPickupStoreChange,
  onBack,
  onContinue,
  isValid,
  addressError,
  nameError,
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-arena bg-white px-6 py-4">
        <h2 id={titleId} className="text-lg font-black text-carbon sm:text-xl">
          ¿Cómo quieres recibir tu pedido?
        </h2>
        <p className="mt-1 text-xs text-humo">
          Elige entrega a domicilio o recoger en sucursal.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        <CheckoutProgress current={0} />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FULFILLMENT_OPTIONS.map((option) => {
            const isSelected = fulfillment === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                aria-pressed={isSelected}
                className={`rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego ${
                  isSelected
                    ? 'border-fuego bg-fuego/10 shadow-sm'
                    : 'border-arena bg-white hover:border-fuego/60 hover:bg-crema'
                }`}
              >
                <span
                  className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${
                    isSelected ? 'bg-fuego-oscuro text-white' : 'bg-crema text-fuego-oscuro'
                  }`}
                  aria-hidden="true"
                >
                  {option.id === 'delivery' ? <DeliveryIcon /> : <StoreIcon />}
                </span>
                <span className="block text-sm font-bold text-carbon">{option.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-humo">
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>

        {fulfillment === 'delivery' && (
          <div className="mt-4 space-y-3 rounded-2xl border border-arena bg-white p-4">
            <div>
              <label
                htmlFor="checkout-address"
                className="mb-1 block text-xs font-semibold text-humo"
              >
                Dirección de entrega (precargada de tu cuenta)
              </label>
              <textarea
                id="checkout-address"
                value={deliveryAddress}
                onChange={(event) => onDeliveryAddressChange(event.target.value)}
                rows={2}
                maxLength={140}
                required
                minLength={5}
                autoComplete="street-address"
                aria-invalid={Boolean(addressError)}
                placeholder="Calle, número, barrio y referencias…"
                className={`w-full resize-none rounded-xl border bg-crema px-3 py-2 text-sm text-carbon placeholder-humo transition-colors focus:border-fuego focus:outline-none focus:ring-2 focus:ring-fuego/30 ${
                  addressError ? 'border-brasa' : 'border-arena'
                }`}
              />
              {addressError && (
                <p role="alert" className="mt-1 text-xs font-medium text-brasa">
                  {addressError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-name"
                className="mb-1 block text-xs font-semibold text-humo"
              >
                ¿A nombre de quién?
              </label>
              <input
                id="checkout-name"
                type="text"
                value={deliveryName}
                onChange={(event) => onDeliveryNameChange(event.target.value)}
                maxLength={60}
                required
                minLength={2}
                autoComplete="name"
                placeholder="Nombre de quien recibe"
                className={`w-full rounded-xl border bg-crema px-3 py-2 text-sm text-carbon placeholder-humo transition-colors focus:border-fuego focus:outline-none focus:ring-2 focus:ring-fuego/30 ${
                  nameError ? 'border-brasa' : 'border-arena'
                }`}
              />
              {nameError && (
                <p role="alert" className="mt-1 text-xs font-medium text-brasa">
                  {nameError}
                </p>
              )}
            </div>
          </div>
        )}

        {fulfillment === 'pickup' && (
          <div className="mt-4 rounded-2xl border border-arena bg-white p-4">
            <p className="mb-2 text-xs font-semibold tracking-wider text-humo uppercase">
              Sucursal para recoger
            </p>
            <div className="space-y-2">
              {NEARBY_STORES.map((store) => {
                const isSelected = store.id === pickupStoreId

                return (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => onPickupStoreChange(store.id)}
                    aria-pressed={isSelected}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego ${
                      isSelected
                        ? 'border-fuego bg-fuego/10'
                        : 'border-arena bg-crema hover:border-fuego/60'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-carbon">
                        {store.name}
                      </span>
                      <span className="block truncate text-xs text-humo">{store.address}</span>
                    </span>
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                        isSelected
                          ? 'border-fuego-oscuro bg-fuego-oscuro text-white'
                          : 'border-arena bg-white'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-arena bg-white px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-xl border border-arena px-5 py-2.5 text-sm font-semibold text-carbon transition-colors hover:border-fuego focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!isValid}
          className="cursor-pointer rounded-xl bg-fuego-oscuro px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
        >
          Ir a pagar
        </button>
      </div>
    </div>
  )
}

function PaymentStep({
  titleId,
  order,
  fulfillment,
  deliveryName,
  deliveryAddress,
  pickupStore,
  paymentMethod,
  onPaymentMethodChange,
  onBack,
  onPay,
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-arena bg-white px-6 py-4">
        <h2 id={titleId} className="text-lg font-black text-carbon sm:text-xl">
          Pago del pedido
        </h2>
        <p className="mt-1 text-xs text-humo">
          Este es un pago de demostración: no se realizará ningún cobro real.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        <CheckoutProgress current={1} />

        <div className="mt-4 rounded-2xl border border-arena bg-white p-4">
          <p className="text-[11px] font-bold tracking-wider text-humo uppercase">Entrega</p>
          <p className="mt-1 text-sm font-semibold text-carbon">
            {fulfillment === 'delivery'
              ? `Para llevar a ${deliveryName}`
              : `Recoger en ${pickupStore.name}`}
          </p>
          <p className="mt-1 text-xs text-humo">
            {fulfillment === 'delivery' ? deliveryAddress : pickupStore.address}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-bold tracking-wider text-humo uppercase">
            Método de pago
          </p>
          <div className="mt-2 space-y-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = method.id === paymentMethod

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onPaymentMethodChange(method.id)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego ${
                    isSelected
                      ? 'border-fuego bg-fuego/10'
                      : 'border-arena bg-white hover:border-fuego/60'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-carbon">
                      {method.label}
                    </span>
                    <span className="block text-xs leading-relaxed text-humo">
                      {method.description}
                    </span>
                  </span>
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                      isSelected
                        ? 'border-fuego-oscuro bg-fuego-oscuro text-white'
                        : 'border-arena bg-white'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-arena bg-crema px-4 py-3">
          <span className="text-sm text-humo">Total a pagar</span>
          <span className="text-2xl font-black text-carbon">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-arena bg-white px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-xl border border-arena px-5 py-2.5 text-sm font-semibold text-carbon transition-colors hover:border-fuego focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onPay}
          className="cursor-pointer rounded-xl bg-fuego-oscuro px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
        >
          Pagar {formatPrice(order.total)}
        </button>
      </div>
    </div>
  )
}

function ProcessingStep({ titleId, order }) {
  return (
    <div
      className="flex flex-col items-center gap-4 px-6 py-10 text-center"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-12 w-12 animate-spin rounded-full border-4 border-arena border-t-fuego-oscuro motion-reduce:animate-none"
        aria-hidden="true"
      />
      <div>
        <h2 id={titleId} className="text-lg font-black text-carbon">
          Procesando tu pago…
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-humo">
          Estamos confirmando tu pedido {order.number}. No cierres esta ventana.
        </p>
      </div>
    </div>
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

function ResultStep({
  titleId,
  tone,
  title,
  order,
  message,
  fulfillment,
  paymentLabel,
  onGoToMenu,
}) {
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
        <div className="w-full space-y-2 rounded-xl border border-arena bg-white px-4 py-3 text-left text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-humo">
              {order.totalItems} {order.totalItems === 1 ? 'producto' : 'productos'}
            </span>
            <span className="font-black">{formatPrice(order.total)}</span>
          </div>
          {fulfillment && (
            <div className="border-t border-arena pt-2 text-xs">
              <p className="font-bold text-carbon">{fulfillment.label}</p>
              <p className="text-humo">{fulfillment.detail}</p>
            </div>
          )}
          {paymentLabel && (
            <p className="border-t border-arena pt-2 text-xs text-humo">
              Método de pago: <span className="font-semibold text-carbon">{paymentLabel}</span>
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onGoToMenu}
        className="mt-2 w-full cursor-pointer rounded-xl bg-fuego-oscuro px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo focus-visible:ring-2 focus-visible:ring-dorado focus-visible:outline-none"
      >
        Volver al menú
      </button>
    </div>
  )
}

export default InvoiceModal