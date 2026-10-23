const STEPS = [
  {
    id: 1,
    number: '01',
    title: 'Mira el menú',
    description:
      'Explora nuestros cortes, costillas y acompañamientos. Todo preparado al carbón.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M8 3v4m4-4v4m4-4v4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11h.01M16 11h.01M8 14h.01M12 14h.01" />
      </svg>
    ),
  },
  {
    id: 2,
    number: '02',
    title: 'Selecciona tus favoritos',
    description:
      'Arma tu pedido y agrega a tu carrito lo que más se te antoje hoy.',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    number: '03',
    title: 'Pide a casa o recoge',
    description:
      'Ingresa tu ubicación, elige tu sucursal favorita y disfruta tu pedido donde prefieras.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"
        />
      </svg>
    ),
  },
]

function HowToOrder() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-carbon mb-3">
            ¿Cómo pedir?
          </h2>
          <p className="text-humo max-w-md mx-auto">
            Pedir en Bacon Jr. nunca fue tan fácil. Sigue estos tres pasos
            y disfruta del mejor sabor al carbón.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="relative rounded-2xl bg-white p-7 shadow-lg hover:-translate-y-1 transition-transform"
            >
              <span className="absolute top-4 right-6 text-5xl font-bold text-arena select-none">
                {step.number}
              </span>

              <div className="w-16 h-16 rounded-xl bg-fuego text-white flex items-center justify-center mb-5">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-carbon mb-2">{step.title}</h3>
              <p className="text-humo text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowToOrder
