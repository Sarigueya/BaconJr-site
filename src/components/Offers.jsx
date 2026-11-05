import { OFFERS } from '../data/offers'
import { formatPrice } from '../utils/formatPrice'

function OfferCard({ offer }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-arena/50 bg-crema shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-1 hover:border-dorado hover:shadow-[0_26px_50px_-20px_rgba(241,90,36,0.55)]">
      <div className="relative aspect-square overflow-hidden bg-arena/50 lg:aspect-auto lg:h-[clamp(320px,54svh,460px)]">
        <img
          src={offer.image}
          alt={offer.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-brasa px-3 py-1 text-xs font-black tracking-wide text-white uppercase shadow-lg">
          {offer.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col border-t border-arena/60 p-4">
        <h3 className="mb-1 text-base font-bold text-carbon sm:text-lg">
          {offer.title}
        </h3>
        <p className="mb-3 line-clamp-2 flex-1 text-sm text-humo">
          {offer.description}
        </p>
        <div className="flex items-center gap-3 border-t border-dashed border-arena pt-3">
          <span className="text-xs text-humo line-through sm:text-sm">
            {formatPrice(offer.originalPrice)}
          </span>
          <span className="text-xl font-black text-fuego-oscuro sm:text-2xl">
            {formatPrice(offer.price)}
          </span>
        </div>
      </div>
    </article>
  )
}

function Offers() {
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
        </div>

        <div id="offers-grid" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Offers
