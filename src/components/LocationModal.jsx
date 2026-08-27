import { useEffect, useRef } from 'react'

const NEARBY_STORES = [
  {
    id: 1,
    name: 'BACON JR. Centro',
    address: 'Av. Principal #123, Ciudad de México',
    distance: '0.8 km',
  },
  {
    id: 2,
    name: 'BACON JR. Roma',
    address: 'Av. Álvaro Obregón #45, Ciudad de México',
    distance: '2.3 km',
  },
]

function LocationModal({ isOpen, onClose }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ubicación del restaurante más cercano"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-black">
              ¿Dónde te encuentras?
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Encontramos la sucursal más cercana para tu pedido.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 -mr-1 text-neutral-500 hover:text-black transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-4">
          <label htmlFor="location-address" className="sr-only">
            Escribe tu dirección
          </label>
          <input
            ref={inputRef}
            id="location-address"
            type="text"
            placeholder="Escribe tu dirección"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm text-black placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div
          className="mx-6 flex items-center justify-center rounded-lg border border-neutral-200 bg-gradient-to-br from-neutral-100 to-neutral-200"
          style={{ height: '220px' }}
        >
          <div className="flex flex-col items-center text-neutral-500">
            <svg
              className="w-10 h-10 text-black"
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
            <span className="text-xs mt-2">Sucursal más cercana</span>
          </div>
        </div>

        <div className="px-6 py-4 space-y-3">
          {NEARBY_STORES.map((store) => (
            <div
              key={store.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-black">{store.name}</p>
                <p className="text-xs text-neutral-500">{store.address}</p>
              </div>
              <span className="text-xs font-medium text-neutral-600 whitespace-nowrap ml-3">
                {store.distance}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationModal
