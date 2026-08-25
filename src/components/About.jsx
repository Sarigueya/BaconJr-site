const STATS = [
  { value: '25+', label: 'Años de tradición' },
  { value: '100%', label: 'Carbón natural' },
  { value: '50K+', label: 'Clientes satisfechos' },
]

function About() {
  return (
    <section id="about" className="bg-neutral-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] bg-neutral-200 rounded-lg flex items-center justify-center">
            <span className="text-neutral-400 text-sm">Imagen del restaurante</span>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Nuestra Historia
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Desde 1995, Bacon Jr. ha sido sinónimo de sabor auténtico.
              Nuestra receta familiar se ha pasado de generación en generación,
              manteniendo siempre el compromiso con la calidad y el sazón que
              nos caracteriza.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-8">
              Cada corte es seleccionado cuidadosamente y cocinado al carbón
              con la paciencia que merece. Porque sabemos que el buen sabor
              no se apura.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-black">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-500 mt-1">
                    {stat.label}
                  </div>
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
