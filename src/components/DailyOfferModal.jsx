import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { formatPrice } from '../utils/formatPrice'
import { FLASH_OFFER } from '../data/offers'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { prefersReducedMotion } from '../utils/motion'
import OfferModal from './OfferModal'

const STORAGE_KEY = 'baconjr-daily-offer-seen'
const OPEN_DELAY_MS = 900
const FLASH_DURATION_SECONDS = 60

function formatCountdown(totalSeconds) {
  const safe = Math.max(0, totalSeconds)
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0')
  const seconds = String(safe % 60).padStart(2, '0')
  return [minutes, seconds]
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
  const [secondsLeft, setSecondsLeft] = useState(FLASH_DURATION_SECONDS)
  const [isEditing, setIsEditing] = useState(false)
  const closeButtonRef = useRef(null)
  const panelRef = useRef(null)
  const imageRef = useRef(null)
  const navigate = useNavigate()

  const isExpired = secondsLeft === 0

  useBodyScrollLock(isOpen)

  const discount = Math.round(
    (1 - FLASH_OFFER.price / FLASH_OFFER.originalPrice) * 100
  )

  // Se abre una sola vez por sesión, poco después de cargar la página.
  useEffect(() => {
    if (wasSeenThisSession()) return
    const timer = setTimeout(() => {
      setSecondsLeft(FLASH_DURATION_SECONDS)
      setIsOpen(true)
    }, OPEN_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const close = useCallback(() => {
    markAsSeen()
    setIsEditing(false)
    setIsOpen(false)
  }, [])

  useEffect(() => {
    // Mientras se edita el pedido, OfferModal maneja su propio Escape.
    if (!isOpen || isEditing) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close()
        return
      }

      // Mantiene el foco dentro del diálogo mientras está abierto.
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, isEditing, close])

  useEffect(() => {
    if (!isOpen || isExpired) return

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, isExpired])

  useEffect(() => {
    if (!isOpen || isEditing || !imageRef.current) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { autoAlpha: 0, y: 16, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' }
      )
    }, imageRef)

    return () => ctx.revert()
  }, [isOpen, isEditing])

  if (!isOpen) return null

  const [minutes, seconds] = formatCountdown(secondsLeft)

  if (isEditing) {
    return (
      <OfferModal
        offer={FLASH_OFFER}
        onClose={() => setIsEditing(false)}
        onAdded={close}
      />
    )
  }

  const handleAddToCart = () => {
    if (isExpired) return
    setIsEditing(true)
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
        ref={panelRef}
        className="relative grid max-h-[92vh] w-full max-w-5xl overflow-x-hidden overflow-y-auto rounded-3xl bg-carbon bg-[radial-gradient(ellipse_at_top_right,rgba(241,90,36,0.18),transparent_55%)] text-crema shadow-[0_30px_80px_-20px_rgba(241,90,36,0.55)] ring-1 ring-fuego/30 animate-[offerPop_400ms_cubic-bezier(0.16,1,0.3,1)] md:grid-cols-2"
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
        <div className="relative aspect-square overflow-hidden bg-carbon sm:aspect-[4/3] md:aspect-auto md:min-h-[32rem]">
          {/* Relleno difuminado: evita franjas planas sin recortar el póster. */}
          <img
            src={FLASH_OFFER.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-carbon/25" />
          <img
            ref={imageRef}
            src={FLASH_OFFER.image}
            alt={FLASH_OFFER.name}
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-carbon to-transparent md:hidden"
          />
        </div>

        {/* Contenido */}
        <div className="relative flex min-w-0 flex-col justify-center gap-5 p-6 pt-2 sm:p-8 md:pt-8">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-dorado/40 bg-dorado/10 px-3 py-1 text-xs font-bold tracking-[0.18em] text-dorado uppercase">
            <span className="h-2 w-2 animate-pulse rounded-full bg-llama" aria-hidden="true" />
            Oferta Flash
          </span>

          {isExpired ? (
            <div className="flex flex-col gap-4">
              <h2 id="daily-offer-title" className="text-3xl leading-tight font-black sm:text-4xl">
                Esta oferta flash terminó
              </h2>
              <p className="text-sm leading-relaxed text-crema/80 sm:text-base">
                Mantente atento a nuestra página y redes sociales para nuevos lanzamientos y promociones especiales por tiempo limitado.
              </p>
              <button
                type="button"
                onClick={handleSeeMenu}
                className="w-full cursor-pointer rounded-xl bg-fuego-oscuro px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-fuego-profundo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado sm:w-auto"
              >
                Ver menú
              </button>
            </div>
          ) : (
            <>
              <div>
                <h2 id="daily-offer-title" className="text-3xl leading-tight font-black sm:text-4xl">
                  {FLASH_OFFER.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-crema/75">
                  {FLASH_OFFER.longDescription ?? FLASH_OFFER.description}
                </p>
                <p className="mt-2 text-xs font-medium text-dorado/90">
                  Oferta flash: solo disponible durante el próximo minuto en esta visita.
                </p>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-dorado">
                  {formatPrice(FLASH_OFFER.price)}
                </span>
                <span className="pb-1 text-lg text-crema/50 line-through">
                  {formatPrice(FLASH_OFFER.originalPrice)}
                </span>
                <span className="mb-1.5 rounded-md bg-brasa px-2 py-0.5 text-xs font-black text-white">
                  -{discount}%
                </span>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold tracking-wider text-crema/60 uppercase">
                  Termina en
                </p>
                <div
                  className="flex gap-2"
                  role="timer"
                  aria-live="off"
                  aria-label={`Termina en ${minutes} minutos y ${seconds} segundos`}
                >
                  {[
                    { label: 'min', value: minutes },
                    { label: 's', value: seconds },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      className="flex w-16 flex-col items-center rounded-xl border border-crema/10 bg-carbon-suave py-2"
                    >
                      <span className="text-xl font-bold tabular-nums">{unit.value}</span>
                      <span className="text-[10px] text-crema/50 uppercase">{unit.label}</span>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DailyOfferModal
