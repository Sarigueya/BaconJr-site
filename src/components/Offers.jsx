import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { OFFERS } from '../data/offers'
import OfferCard from './OfferCard'

function Offers() {
  const { hash, key } = useLocation()
  const [highlightedId, setHighlightedId] = useState(null)

  useEffect(() => {
    const id = hash.replace('#', '')
    const match = OFFERS.find((offer) => offer.id === id)

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighlightedId(match?.id ?? null)

    if (!match) return

    const timer = window.setTimeout(() => setHighlightedId(null), 2600)
    return () => window.clearTimeout(timer)
    // `key` cambia en cada navegación y permite re-resaltar la misma oferta.
  }, [hash, key])

  return (
    <section
      id="offers"
      data-scroll-target="offers-grid"
      className="relative isolate overflow-hidden bg-carbon py-8 md:py-10 lg:flex lg:min-h-[100svh] lg:items-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(241,90,36,0.24),transparent_42%),radial-gradient(circle_at_88%_82%,rgba(245,166,35,0.16),transparent_45%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brasa via-fuego to-dorado"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-fuego/15 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[88rem]">
        <div className="mb-4 text-center md:mb-5">
          <p className="mb-2 hidden text-xs font-bold tracking-[0.22em] text-dorado uppercase sm:block">
            Recién salido del barril
          </p>
          <h2 className="text-2xl font-black text-crema sm:text-3xl md:text-4xl">
            Ofertas del día
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-crema/70">
            Toca la imagen de una oferta para ver el detalle, dejar tu comentario y agregarla al carrito.
          </p>
        </div>

        <div id="offers-grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isHighlighted={highlightedId === offer.id}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Offers
