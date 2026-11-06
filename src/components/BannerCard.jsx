function BannerCard({
  id,
  title,
  subtitle,
  cta,
  image,
  imageMode = 'cover',
  isActive = true,
  onCta,
}) {
  const isCutout = imageMode === 'cutout'
  const loading = id === 1 ? 'eager' : 'lazy'

  return (
    <div
      aria-hidden={!isActive}
      inert={!isActive}
      className="relative h-full w-full shrink-0 overflow-hidden bg-carbon"
    >
      {isCutout ? (
        <>
          {/* Fondo cálido que envuelve las costillas y llena el espacio. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(107,62,31,0.55)_0%,rgba(43,30,22,0.85)_48%,#1C1410_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 -right-32 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-fuego/10 blur-3xl"
          />
          {/* Imagen recortada sin fondo: se funde con el color sólido. */}
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading={loading}
            decoding="async"
            className="absolute top-0 right-0 left-0 h-[52%] w-full object-contain object-center md:left-auto md:-top-[2%] md:right-[9%] md:h-[104%] md:w-[68%] md:object-right"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/70 to-transparent md:hidden"
          />
        </>
      ) : (
        <>
          {/* Imagen de fondo a sangre completa. */}
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading={loading}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Degradado para legibilidad del texto, nunca un panel sólido. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-carbon/95 via-carbon/50 to-transparent md:bg-gradient-to-r md:from-carbon/95 md:via-carbon/60 md:to-transparent"
          />
        </>
      )}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-end px-4 pt-10 pb-16 sm:px-6 md:flex-row md:items-center md:justify-start md:py-10 lg:px-8">
        <div
          className={`max-w-xl text-center md:text-left ${
            isCutout ? 'md:max-w-[38%]' : ''
          }`}
        >
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-dorado uppercase">
            Bacon Jr. · Especial del día
          </p>
          <h2 className="text-3xl leading-tight font-black text-crema sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-4 text-base text-arena sm:text-lg">{subtitle}</p>
          <button
            type="button"
            onClick={onCta}
            className="mt-7 inline-flex cursor-pointer items-center justify-center rounded-xl bg-dorado px-7 py-3 text-sm font-bold text-carbon shadow-[0_16px_30px_-16px_rgba(245,166,35,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-llama hover:shadow-[0_20px_36px_-14px_rgba(242,140,40,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BannerCard
