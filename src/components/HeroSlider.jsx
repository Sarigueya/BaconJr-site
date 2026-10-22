import { useState, useEffect, useRef, useCallback } from 'react'
import BannerCard from './BannerCard'

const BANNERS = [
  {
    id: 1,
    title: 'Especiales de Temporada',
    subtitle: 'Costillas BBQ con precio especial.',
    cta: 'Ver oferta',
  },
  {
    id: 2,
    title: 'Combo Familiar',
    subtitle: 'Para 4 personas, solo $690.',
    cta: 'Ordenar',
  },
  {
    id: 3,
    title: 'Happy Hour',
    subtitle: '2x1 en bebidas de lunes a viernes.',
    cta: 'Más info',
  },
]

const SLIDE_INTERVAL = 4000

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % BANNERS.length)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)
  }, [])

  useEffect(() => {
    if (isPaused) {
      clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(goToNext, SLIDE_INTERVAL)

    return () => clearInterval(timerRef.current)
  }, [isPaused, goToNext])

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {BANNERS.map((banner) => (
          <BannerCard key={banner.id} {...banner} />
        ))}
      </div>

      <button
        type="button"
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 hidden sm:flex items-center justify-center bg-carbon/50 text-white rounded-full hover:bg-fuego transition-colors"
        aria-label="Slide anterior"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 hidden sm:flex items-center justify-center bg-carbon/50 text-white rounded-full hover:bg-fuego transition-colors"
        aria-label="Siguiente slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-dorado' : 'w-3 bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
        <div
          key={current}
          className="h-full bg-dorado transition-[width] ease-linear"
          style={{
            width: isPaused ? '0%' : '100%',
            animationName: 'autoProgress',
            animationDuration: `${SLIDE_INTERVAL}ms`,
            animationTimingFunction: 'linear',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      </div>
    </section>
  )
}

export default HeroSlider
