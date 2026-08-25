function Hero() {
  return (
    <section className="relative bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-widest uppercase text-neutral-400 mb-4">
            Asados al Barril
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Sabor que humea
            <br />
            desde 1995
          </h1>
          <p className="text-lg text-neutral-300 mb-8 max-w-lg">
            Carne seleccionada, cocinada al carbón con el sazón que solo
            una tradición de generaciones puede dar.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#menu"
              className="inline-flex items-center px-6 py-3 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Ver menú
            </a>
            <a
              href="#about"
              className="inline-flex items-center px-6 py-3 border border-white text-white text-sm font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              Nuestra historia
            </a>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-neutral-800 to-neutral-950" />
    </section>
  )
}

export default Hero
