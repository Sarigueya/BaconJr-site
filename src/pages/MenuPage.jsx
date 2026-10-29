import Menu from '../components/Menu'

function MenuPage() {
  return (
    <>
      <section
        className="bg-carbon pt-[calc(var(--navbar-height)+0.25rem)] text-crema"
        aria-labelledby="menu-page-title"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <h1
            id="menu-page-title"
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-crema"
          >
            Menú
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-arena">
            Cortes, bebidas y acompañantes preparados al carbón.
          </p>
        </div>
      </section>

      <Menu />
    </>
  )
}

export default MenuPage
