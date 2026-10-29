import restaurantImage from '../assets/img/restaurantepuntofisico.png'

const STATS = [
  { value: '30+', label: 'Años de tradición' },
  { value: '100%', label: 'Carbón natural' },
  { value: '50K+', label: 'Clientes felices' },
]

function About() {
  return (
    <section id="about" className="bg-crema py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <img
              src={restaurantImage}
              alt="Punto físico de Bacon Jr."
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 rounded-lg bg-fuego px-3 py-1 text-sm font-bold text-white">
              Desde 1995
            </span>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-carbon mb-4">
              Nuestra Historia
            </h2>
            <p className="text-humo leading-relaxed mb-6">
              Una receta familiar, cortes seleccionados y fuego lento al
              barril. Porque el buen sabor no se apura.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white p-3 text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-fuego-oscuro">
                    {stat.value}
                  </div>
                  <div className="text-xs text-humo mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
