import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

const NEARBY_STORES = [
  {
    id: 1,
    name: 'BACON JR. Centro',
    address: 'Av. Principal #123, Ciudad de México',
    lat: 19.4326,
    lng: -99.1332,
  },
  {
    id: 2,
    name: 'BACON JR. Roma',
    address: 'Av. Álvaro Obregón #45, Ciudad de México',
    lat: 19.4147,
    lng: -99.165,
  },
]

const DEFAULT_CENTER = {
  lat: NEARBY_STORES[0].lat,
  lng: NEARBY_STORES[0].lng,
}

export const LOCATION_STORAGE_KEY = 'baconjr-location'

const markerIcon = L.divIcon({
  className: 'baconjr-map-marker',
  html: '<div style="width:24px;height:24px;border-radius:9999px;background:#F15A24;border:4px solid #fff;box-shadow:0 4px 12px rgba(28,20,16,.45)"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

const toRadians = (value) => (value * Math.PI) / 180

const getDistanceKm = (from, to) => {
  const earthRadius = 6371
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const lat1 = toRadians(from.lat)
  const lat2 = toRadians(to.lat)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const formatDistance = (km) =>
  km < 1 ? `${Math.max(50, Math.round(km * 1000))} m` : `${km.toFixed(1)} km`

const findNearestStore = (location) =>
  NEARBY_STORES.reduce((closest, store) =>
    getDistanceKm(location, store) < getDistanceKm(location, closest)
      ? store
      : closest
  )

const getStoredLocation = () => {
  try {
    const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed?.lat === 'number' && typeof parsed?.lng === 'number') {
      return parsed
    }
  } catch {
    // Si el navegador bloquea localStorage, usamos el centro por defecto.
  }
  return null
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng)
    },
  })
  return null
}

function MapFocus({ position }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([position.lat, position.lng], Math.max(map.getZoom(), 14), {
      duration: 0.8,
    })
  }, [map, position.lat, position.lng])

  return null
}

function MapResize() {
  const map = useMap()

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 180)
    return () => window.clearTimeout(timer)
  }, [map])

  return null
}

function LocationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return <LocationModalContent onClose={onClose} onConfirm={onConfirm} />
}

function LocationModalContent({ onClose, onConfirm }) {
  const inputRef = useRef(null)
  const [initialLocation] = useState(() => getStoredLocation() ?? DEFAULT_CENTER)
  const [position, setPosition] = useState(() => ({
    lat: initialLocation.lat,
    lng: initialLocation.lng,
  }))
  const [mapView, setMapView] = useState(() => ({
    lat: initialLocation.lat,
    lng: initialLocation.lng,
  }))
  const [address, setAddress] = useState(initialLocation.address ?? '')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')
  const [selectedStoreId, setSelectedStoreId] = useState(
    () => findNearestStore(initialLocation).id
  )

  useBodyScrollLock()

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    inputRef.current?.focus()

    const timer = window.setTimeout(() => inputRef.current?.focus(), 250)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  const stores = useMemo(
    () =>
      NEARBY_STORES.map((store) => ({
        ...store,
        distanceKm: getDistanceKm(position, store),
      })).sort((a, b) => a.distanceKm - b.distanceKm),
    [position]
  )

  const reverseGeocode = async (lat, lng) => {
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`
      )
      if (!response.ok) throw new Error('No se pudo obtener la dirección')
      const data = await response.json()
      const label = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setAddress(label)
      setStatus('success')
      setMessage('Ubicación seleccionada correctamente.')
    } catch {
      setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      setStatus('error')
      setMessage('No pudimos obtener la dirección, pero el punto quedó marcado.')
    }
  }

  const pickPosition = (latlng, { moveMap = false } = {}) => {
    const next = { lat: latlng.lat, lng: latlng.lng }
    setPosition(next)
    setSelectedStoreId(findNearestStore(next).id)
    if (moveMap) setMapView(next)
    reverseGeocode(next.lat, next.lng)
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus('error')
      setMessage('Tu navegador no permite obtener la ubicación.')
      return
    }

    setStatus('loading')
    setMessage('Esperando permiso de ubicación del navegador…')

    navigator.geolocation.getCurrentPosition(
      (result) => {
        pickPosition(
          { lat: result.coords.latitude, lng: result.coords.longitude },
          { moveMap: true }
        )
      },
      (error) => {
        setStatus('error')
        if (error.code === error.PERMISSION_DENIED) {
          setMessage(
            'Permiso denegado. Puedes seleccionar tu ubicación haciendo clic en el mapa o buscar tu dirección.'
          )
        } else if (error.code === error.TIMEOUT) {
          setMessage('La ubicación tardó demasiado. Intenta de nuevo.')
        } else {
          setMessage('No pudimos obtener tu ubicación. Selecciona un punto en el mapa.')
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    )
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    const cleanQuery = query.trim()
    if (!cleanQuery) return

    setStatus('loading')
    setMessage('Buscando dirección…')

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          cleanQuery
        )}&limit=1&accept-language=es`
      )
      if (!response.ok) throw new Error('Error en la búsqueda')
      const results = await response.json()
      if (!results.length) {
        setStatus('error')
        setMessage('No encontramos esa dirección. Prueba con un punto en el mapa.')
        return
      }

      const next = {
        lat: Number(results[0].lat),
        lng: Number(results[0].lon),
      }
      setPosition(next)
      setSelectedStoreId(findNearestStore(next).id)
      setMapView(next)
      setAddress(results[0].display_name)
      setStatus('success')
      setMessage('Dirección encontrada.')
    } catch {
      setStatus('error')
      setMessage('No pudimos buscar la dirección. Intenta de nuevo.')
    }
  }

  const handleConfirm = () => {
    const nearest = stores[0]
    const location = {
      lat: position.lat,
      lng: position.lng,
      address: address || `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`,
      storeId: selectedStoreId || nearest?.id,
      storeName:
        stores.find((store) => store.id === selectedStoreId)?.name ?? nearest?.name,
    }

    try {
      window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location))
    } catch {
      // Si no hay almacenamiento disponible, la ubicación solo dura la sesión.
    }

    onConfirm?.(location)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-carbon/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div
        className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.2em] text-fuego-oscuro uppercase">
              Delivery y pick up
            </p>
            <h2 id="location-modal-title" className="text-xl font-bold text-carbon">
              ¿Dónde te encuentras?
            </h2>
            <p className="mt-1 text-sm text-humo">
              Selecciona tu ubicación en el mapa o usa tu ubicación actual.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 cursor-pointer rounded-full p-1 text-humo transition-colors hover:bg-crema hover:text-fuego-oscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="location-address" className="sr-only">
              Escribe tu dirección
            </label>
            <input
              ref={inputRef}
              id="location-address"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Escribe tu dirección"
              className="w-full rounded-lg border border-arena px-4 py-3 text-sm text-carbon placeholder-humo transition-colors focus:border-fuego focus:outline-none focus:ring-2 focus:ring-fuego/30"
            />
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-lg bg-fuego-oscuro px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-fuego-profundo hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
            >
              Buscar
            </button>
          </form>

          <button
            type="button"
            onClick={handleUseMyLocation}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-fuego/60 bg-crema px-4 py-3 text-sm font-bold text-fuego-oscuro transition-all duration-200 hover:-translate-y-0.5 hover:border-fuego hover:bg-fuego/10 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Usar mi ubicación y permitir acceso
          </button>

          <p className="mt-2 text-center text-xs text-humo">
            El navegador te pedirá permiso para acceder a tu ubicación.
          </p>

          <div
            role="status"
            aria-live="polite"
            className={`mt-3 rounded-lg px-3 py-2 text-xs ${
              status === 'error'
                ? 'bg-brasa/10 text-brasa'
                : status === 'success'
                  ? 'bg-fuego/10 text-fuego-oscuro'
                  : 'bg-crema text-humo'
            }`}
          >
            {message || 'Haz clic en el mapa o arrastra el marcador para ajustar tu ubicación.'}
          </div>
        </div>

        <div className="mx-6 overflow-hidden rounded-xl border border-arena bg-crema">
          <div className="h-[260px] w-full sm:h-[300px]">
            <MapContainer
              center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
              aria-label="Mapa para seleccionar tu ubicación"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onPick={(latlng) => pickPosition(latlng)} />
              <MapFocus position={mapView} />
              <MapResize />
              <Marker
                position={[position.lat, position.lng]}
                icon={markerIcon}
                draggable
                eventHandlers={{
                  dragend: (event) => pickPosition(event.target.getLatLng()),
                }}
              />
            </MapContainer>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="mb-2 text-xs font-bold tracking-wider text-humo uppercase">
            Sucursales cerca de ti
          </p>
          <div className="space-y-2">
            {stores.map((store) => {
              const isSelected = store.id === selectedStoreId
              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-fuego bg-fuego/10 shadow-sm'
                      : 'border-arena bg-white hover:border-fuego/60 hover:bg-crema'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-carbon">
                      {store.name}
                    </span>
                    <span className="block truncate text-xs text-humo">
                      {store.address}
                    </span>
                  </span>
                  <span className="ml-3 shrink-0 text-xs font-bold whitespace-nowrap text-fuego-oscuro">
                    {formatDistance(store.distanceKm)}
                  </span>
                </button>
              )
            })}
          </div>

          {address && (
            <p className="mt-3 line-clamp-2 text-xs text-humo">
              <span className="font-semibold text-carbon">Dirección: </span>
              {address}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 bg-crema px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold text-humo transition-colors hover:text-fuego-oscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuego"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="cursor-pointer rounded-lg bg-fuego-oscuro px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-fuego-profundo hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado"
          >
            Confirmar ubicación
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default LocationModal
