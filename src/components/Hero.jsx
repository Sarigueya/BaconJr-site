import { useState } from 'react'
import LocationModal from './LocationModal'

function Hero() {
  const [isLocationOpen, setIsLocationOpen] = useState(false)

  return (
    <section className="relative bg-carbon text-crema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest uppercase text-dorado mb-4">
            Asados al Barril
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            ¿Cómo quieres hoy tu pedido?
          </h1>
          <p className="text-lg text-arena mb-8 max-w-lg">
            Carne seleccionada, cocinada al carbón con el sazón que solo
            una tradición de generaciones puede dar.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#menu"
              className="inline-flex items-center px-6 py-3 bg-fuego text-white text-sm font-semibold rounded-lg hover:bg-fuego-oscuro transition-colors"
            >
              Pick up
            </a>
            <a
              href="#menu"
              className="inline-flex items-center px-6 py-3 border border-dorado text-dorado text-sm font-semibold rounded-lg hover:bg-dorado hover:text-carbon transition-colors"
            >
              Delivery
            </a>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => setIsLocationOpen(true)}
              className="flex items-center w-full max-w-md bg-white/10 backdrop-blur border border-white/20 rounded-full px-5 py-3 text-left hover:bg-white/15 transition-colors"
            >
              <svg
                className="w-5 h-5 text-llama mr-3 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-arena">¿Dónde te encuentras?</span>
            </button>
            <p className="text-xs text-arena/70 mt-2">
              Encuentra tu Bacon Jr. más cercano.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-carbon-suave to-carbon" />

      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </section>
  )
}

export default Hero
