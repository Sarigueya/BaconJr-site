import { useEffect, useId, useRef, useState } from 'react'
import { formatPrice } from '../utils/formatPrice'
import OfferOrderForm from './OfferOrderForm'

function OfferCard({ offer, isHighlighted = false }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const backId = useId()
  const frontTriggerRef = useRef(null)
  const backTriggerRef = useRef(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsFlipped(false)
    }

    if (!isFlipped) return

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isFlipped])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (isFlipped) {
      backTriggerRef.current?.focus()
    } else {
      frontTriggerRef.current?.focus()
    }
  }, [isFlipped])

  const handleFlipBack = () => setIsFlipped(false)

  const handleBackClick = (event) => {
    // No se cierra al interactuar con los controles del formulario.
    if (event.target.closest('button, a, input, textarea, select, label')) return
    handleFlipBack()
  }

  const discount = Math.round((1 - offer.price / offer.originalPrice) * 100)

  return (
    <article
      id={offer.id}
      data-highlighted={isHighlighted ? 'true' : undefined}
      className="group relative h-[520px] rounded-2xl transition-transform duration-300 hover:-translate-y-1 data-[highlighted=true]:animate-[offerGlow_1.1s_ease-in-out_2]"
    >
      <div className="h-full [perspective:1600px]">
        <div
          className={`relative h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] motion-reduce:transition-none ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Cara frontal: imagen y resumen */}
          <div
            inert={isFlipped}
            aria-hidden={isFlipped}
            className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-arena/50 bg-crema shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] [backface-visibility:hidden]"
          >
            <button
              ref={frontTriggerRef}
              type="button"
              onClick={() => setIsFlipped(true)}
              aria-expanded={isFlipped}
              aria-controls={backId}
              aria-label={`Ver detalles y agregar ${offer.title} al carrito`}
              className="group/image relative block min-h-0 w-full flex-1 cursor-pointer overflow-hidden bg-arena/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fuego"
            >
              <img
                src={offer.image}
                alt={offer.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover/image:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-full bg-brasa px-3 py-1 text-xs font-black tracking-wide text-white uppercase shadow-lg">
                {offer.tag}
              </span>
              <span className="absolute inset-x-0 bottom-0 translate-y-full bg-carbon/80 px-3 py-2 text-center text-xs font-semibold text-crema backdrop-blur transition-transform duration-300 group-hover/image:translate-y-0">
                Toca la imagen para ver detalles
              </span>
            </button>

            <div className="flex shrink-0 flex-col border-t border-arena/60 p-4">
              <h3 className="mb-1 text-base font-bold text-carbon sm:text-lg">
                {offer.title}
              </h3>
              <p className="mb-3 line-clamp-2 text-sm text-humo">
                {offer.description}
              </p>
              <div className="flex items-center justify-between gap-3 border-t border-dashed border-arena pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-humo line-through sm:text-sm">
                    {formatPrice(offer.originalPrice)}
                  </span>
                  <span className="text-xl font-black text-fuego-oscuro sm:text-2xl">
                    {formatPrice(offer.price)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="shrink-0 rounded-lg border border-arena px-3 py-1.5 text-xs font-semibold text-carbon transition-colors hover:border-fuego hover:text-fuego-oscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </div>

          {/* Cara trasera: detalles, comentario y agregar */}
          <div
            id={backId}
            inert={!isFlipped}
            aria-hidden={!isFlipped}
            onClick={handleBackClick}
            className="absolute inset-0 flex flex-col overflow-y-auto rounded-2xl border border-fuego/40 bg-crema p-4 shadow-[0_24px_50px_-20px_rgba(241,90,36,0.55)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center rounded-full bg-brasa px-2.5 py-0.5 text-[10px] font-black tracking-wide text-white uppercase">
                  {offer.tag}
                </span>
                <h3 className="mt-2 text-base font-bold text-carbon sm:text-lg">
                  {offer.title}
                </h3>
              </div>
              <button
                ref={backTriggerRef}
                type="button"
                onClick={() => setIsFlipped(false)}
                className="shrink-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-carbon text-crema transition-colors hover:bg-fuego focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
                aria-label="Volver al resumen de la oferta"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-humo">
              {offer.longDescription ?? offer.description}
            </p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black text-fuego-oscuro">
                {formatPrice(offer.price)}
              </span>
              <span className="text-sm text-humo line-through">
                {formatPrice(offer.originalPrice)}
              </span>
              <span className="rounded-md bg-brasa px-1.5 py-0.5 text-[10px] font-black text-white">
                -{discount}%
              </span>
            </div>

            <div className="mt-4">
              <OfferOrderForm offer={offer} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default OfferCard
