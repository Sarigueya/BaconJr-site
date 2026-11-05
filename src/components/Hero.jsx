import { useState } from 'react'
import { Link } from 'react-router-dom'
import LocationModal, { LOCATION_STORAGE_KEY } from './LocationModal'
import heroBackground from '../assets/hero/hero-background.png'

const readStoredLocation = () => {
  try {
    const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return typeof parsed?.lat === 'number' ? parsed : null
  } catch {
    return null
  }
}

function Hero() {
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [userLocation, setUserLocation] = useState(readStoredLocation)

  return (
    <section
      id="hero"
      className="relative flex min-h-[80vh] items-center overflow-hidden bg-carbon bg-cover bg-center bg-no-repeat pt-[var(--navbar-height)] text-crema"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 sm:pb-14 md:pb-20">
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
            <Link
              to="/menu?category=all"
              className="inline-flex cursor-pointer items-center rounded-lg bg-fuego-oscuro px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-fuego-profundo hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            >
              Pick up
            </Link>
            <Link
              to="/menu?category=all"
              className="inline-flex cursor-pointer items-center rounded-lg border border-dorado px-6 py-3 text-sm font-semibold text-dorado transition-all duration-200 hover:-translate-y-0.5 hover:bg-dorado hover:text-carbon hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            >
              Delivery
            </Link>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => setIsLocationOpen(true)}
              className="flex w-full max-w-md cursor-pointer items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-left backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-dorado/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
            >
              <svg
                className="mr-3 w-5 h-5 shrink-0 text-llama"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="min-w-0">
                <span className="block truncate text-sm text-arena">
                  {userLocation
                    ? `Entregar en ${userLocation.address?.split(',')[0] ?? 'tu ubicación'}`
                    : '¿Dónde te encuentras?'}
                </span>
                {userLocation?.storeName && (
                  <span className="mt-0.5 block truncate text-[11px] text-dorado">
                    Sucursal: {userLocation.storeName}
                  </span>
                )}
              </span>
            </button>
            <p className="mt-2 text-xs text-arena/70">
              {userLocation
                ? 'Haz clic para cambiar tu ubicación de entrega.'
                : 'Encuentra tu Bacon Jr. más cercano.'}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-carbon/90 via-carbon/70 to-carbon/30" />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onConfirm={setUserLocation}
      />
    </section>
  )
}

export default Hero
