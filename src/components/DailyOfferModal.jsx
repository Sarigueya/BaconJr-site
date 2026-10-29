import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { formatPrice } from '../utils/formatPrice'
import ofertaCostillas from '../assets/img/Oferta de costillas BBQ.png'

// Oferta de ejemplo. Cambia estos datos para mostrar otra promoción.
const DAILY_OFFER = {
  id: 'offer-daily',
  name: 'Costillas BBQ para dos',
  description:
    'Dos porciones de costillas de cerdo ahumadas al barril, bañadas en nuestra salsa BBQ de la casa, con papas a la francesa.',
  originalPrice: 490,
  price: 245,
  image: ofertaCostillas,
}

const STORAGE_KEY = 'baconjr-daily-offer-seen'
const OPEN_DELAY_MS = 900

function getTimeUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const totalSeconds = Math.max(0, Math.floor((midnight - now) / 1000))
  const pad = (n) => String(n).padStart(2, '0')
  return [
    pad(Math.floor(totalSeconds / 3600)),
    pad(Math.floor((totalSeconds % 3600) / 60)),
    pad(totalSeconds % 60),
  ]
}

function wasSeenThisSession() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markAsSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Si el navegador bloquea el almacenamiento, el modal simplemente vuelve a salir.
  }
}

function DailyOfferModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight)
  const closeButtonRef = useRef(null)
  const { addItem } = useCart()
  const navigate = useNavigate()

  const discount = Math.round(
    (1 - DAILY_OFFER.price / DAILY_OFFER.originalPrice) * 100
  )

  // Se abre una sola vez por sesión, poco después de cargar la página.
  useEffect(() => {
    if (wasSeenThisSession()) return
    const timer = setTimeout(() => setIsOpen(true), OPEN_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const close = useCallback(() => {
    markAsSeen()
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }
    const interval = setInterval(() => setTimeLeft(getTimeUntilMidnight()), 1000)

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      clearInterval(interval)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  if (!isOpen) return null

  const handleAddToCart = () => {
    addItem({
      id: DAILY_OFFER.id,
      name: DAILY_OFFER.name,
      price: DAILY_OFFER.price,
      image: DAILY_OFFER.image,
    })
    close()
  }

  const handleSeeMenu = () => {
    close()
    navigate('/menu?category=all')
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-carbon/75 p-4 backdrop-blur-sm animate-[offerFade_250ms_ease-out]"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-offer-title"
    >
      <div
        className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-carbon text-crema shadow-[0_30px_80px_-20px_rgba(241,90,36,0.55)] ring-1 ring-fuego/30 animate-[offerPop_400ms_cubic-bezier(0.16,1,0.3,1)] md:grid-cols-[1.1fr_1fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-carbon/70 text-crema backdrop-blur transition-colors hover:bg-fuego focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
          aria-label="Cerrar oferta"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Imagen */}
        <div className="relative aspect-[4/3] bg-[#f7eadc] sm:aspect-[16/10] md:aspect-auto md:min-h-[26rem]">
          <img
            src={DAILY_OFFER.image}
            alt={DAILY_OFFER.name}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-carbon to-transparent md:hidden"
          />
        </div>

        {/* Contenido */}
        <div className="relative flex flex-col justify-center gap-5 p-6 pt-2 sm:p-8 md:pt-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-fuego/20 blur-3xl"
          />

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-dorado/40 bg-dorado/10 px-3 py-1 text-xs font-bold tracking-[0.18em] text-dorado uppercase">
            <span className="h-2 w-2 animate-pulse rounded-full bg-llama" aria-hidden="true" />
            Oferta del día
          </span>

          <div>
            <h2 id="daily-offer-title" className="text-3xl leading-tight font-black sm:text-4xl">
              {DAILY_OFFER.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-crema/75">
              {DAILY_OFFER.description}
            </p>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-dorado">
              {formatPrice(DAILY_OFFER.price)}
            </span>
            <span className="pb-1 text-lg text-crema/50 line-through">
              {formatPrice(DAILY_OFFER.originalPrice)}
            </span>
            <span className="mb-1.5 rounded-md bg-brasa px-2 py-0.5 text-xs font-black text-white">
              -{discount}%
            </span>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-crema/60 uppercase">
              Termina en
            </p>
            <div className="flex gap-2" aria-label={`Termina en ${timeLeft[0]} horas, ${timeLeft[1]} minutos`}>
              {['h', 'min', 's'].map((unit, i) => (
                <div
                  key={unit}
                  className="flex w-16 flex-col items-center rounded-xl border border-crema/10 bg-carbon-suave py-2"
                >
                  <span className="text-xl font-bold tabular-nums">{timeLeft[i]}</span>
                  <span className="text-[10px] text-crema/50 uppercase">{unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 cursor-pointer rounded-xl bg-fuego-oscuro px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            >
              Agregar al carrito
            </button>
            <button
              type="button"
              onClick={handleSeeMenu}
              className="flex-1 cursor-pointer rounded-xl border border-crema/25 px-5 py-3 text-sm font-semibold text-crema transition-colors hover:border-dorado hover:text-dorado focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            >
              Ver menú
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyOfferModal
