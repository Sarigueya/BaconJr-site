const OFFERS = [
  {
    id: 1,
    title: 'Martes de Costillas',
    description: '2x1 en costillas BBQ todos los martes.',
    originalPrice: '$490',
    currentPrice: '$245',
  },
  {
    id: 2,
    title: 'Combo Familiar',
    description: 'Ribeye + papas + ensalada para 4 personas.',
    originalPrice: '$890',
    currentPrice: '$690',
  },
  {
    id: 3,
    title: 'Happy Hour',
    description: '2x1 en bebidas de lunes a viernes 4-7pm.',
    originalPrice: '$120',
    currentPrice: '$60',
  },
]

function OfferCard({ offer }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] bg-neutral-100 flex items-center justify-center">
        <span className="text-neutral-400 text-sm">Imagen de oferta</span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-black mb-1">{offer.title}</h3>
        <p className="text-sm text-neutral-500 mb-4">{offer.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-400 line-through">
            {offer.originalPrice}
          </span>
          <span className="text-xl font-bold text-black">{offer.currentPrice}</span>
        </div>
      </div>
    </div>
  )
}

function Offers() {
  return (
    <section id="offers" className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
            Ofertas del día
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Aprovecha nuestras promociones especiales para disfrutar
            el mejor sabor a mejor precio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFERS.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Offers
