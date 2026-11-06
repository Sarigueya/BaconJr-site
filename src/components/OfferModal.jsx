import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { formatPrice } from '../utils/formatPrice'
import OfferOrderForm from './OfferOrderForm'

function OfferModal({ offer, onClose }) {
  if (!offer) return null

  return <OfferModalContent key={offer.id} offer={offer} onClose={onClose} />
}

function OfferModalContent({ offer, onClose }) {
  const closeButtonRef = useRef(null)

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

  const discount = Math.round((1 - offer.price / offer.originalPrice) * 100)

  return createPortal(
    <div
      className="fixed inset-0 z-[68] flex items-center justify-center bg-carbon/75 p-4 backdrop-blur-sm animate-[offerFade_200ms_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-modal-title"
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div
        className="relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-crema text-carbon shadow-[0_30px_80px_-24px_rgba(241,90,36,0.55)] ring-1 ring-fuego/30 animate-[offerPop_320ms_cubic-bezier(0.16,1,0.3,1)] md:grid-cols-2"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-carbon text-crema shadow-md transition-colors hover:bg-fuego focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
          aria-label="Cerrar oferta"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-[4/3] bg-arena/40 md:aspect-auto md:min-h-[26rem]">
          <img
            src={offer.image}
            alt={offer.title}
            className="absolute inset-0 h-full w-full object-contain p-4"
          />
          <span className="absolute bottom-4 left-4 rounded-full bg-brasa px-3 py-1 text-xs font-black tracking-wide text-white uppercase shadow-lg">
            {offer.tag}
          </span>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-fuego-oscuro uppercase">
              Oferta especial
            </p>
            <h2 id="offer-modal-title" className="mt-1 text-2xl font-black text-carbon sm:text-3xl">
              {offer.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-humo">
              {offer.longDescription ?? offer.description}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-fuego-oscuro">
              {formatPrice(offer.price)}
            </span>
            <span className="text-base text-humo line-through">
              {formatPrice(offer.originalPrice)}
            </span>
            <span className="rounded-md bg-brasa px-2 py-0.5 text-xs font-black text-white">
              -{discount}%
            </span>
          </div>

          <OfferOrderForm offer={offer} onAdded={onClose} />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default OfferModal
