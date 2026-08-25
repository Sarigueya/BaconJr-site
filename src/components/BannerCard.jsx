function BannerCard({ title, subtitle, cta }) {
  return (
    <div className="shrink-0 snap-start w-screen">
      <div className="h-64 md:h-80 bg-neutral-900 flex items-center">
        <div className="px-8 md:px-16 max-w-xl">
          <h2 className="text-white text-2xl md:text-4xl font-bold">
            {title}
          </h2>
          <p className="text-neutral-300 mt-2 text-sm md:text-base">
            {subtitle}
          </p>
          <button
            type="button"
            className="mt-4 px-6 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BannerCard
