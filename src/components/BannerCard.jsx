function BannerCard({ title, subtitle, cta }) {
  return (
    <div className="shrink-0 w-screen">
      <div className="h-64 md:h-80 bg-carbon flex items-center">
        <div className="px-8 md:px-16 max-w-xl">
          <h2 className="text-crema text-2xl md:text-4xl font-bold">
            {title}
          </h2>
          <p className="text-arena mt-2 text-sm md:text-base">
            {subtitle}
          </p>
          <button
            type="button"
            className="mt-4 px-6 py-2 bg-dorado text-carbon text-sm font-semibold rounded-lg hover:bg-llama transition-colors"
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BannerCard
