import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const RESTAURANT_LOCATION = {
  lat: 19.4326,
  lng: -99.1332,
}

const RESTAURANT_INFO = {
  name: 'BACON JR.',
  address: 'Av. Principal #123, Ciudad de México',
  hours: 'Lun-Dom: 12:00 - 22:00',
}

function MapLocation() {
  return (
    <section id="location" className="bg-crema py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-carbon mb-3">
            Encuéntranos
          </h2>
          <p className="text-humo max-w-md mx-auto">
            Visítanos y disfruta del mejor sabor al carbón
            en un ambiente único.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-lg overflow-hidden border border-arena">
            <MapContainer
              center={[RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng]}
              zoom={15}
              className="h-80 lg:h-96 w-full"
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng]}>
                <Popup>
                  <strong>{RESTAURANT_INFO.name}</strong>
                  <br />
                  {RESTAURANT_INFO.address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-roble mb-1">
                Dirección
              </h3>
              <p className="text-neutral-600">{RESTAURANT_INFO.address}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-roble mb-1">
                Horario
              </h3>
              <p className="text-neutral-600">{RESTAURANT_INFO.hours}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-roble mb-1">
                Contacto
              </h3>
              <p className="text-neutral-600">+52 55 1234 5678</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MapLocation
