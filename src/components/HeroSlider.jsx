import { useState, useEffect, useRef, useCallback } from 'react'
import BannerCard from './BannerCard'
import carouselCostillas from '../assets/offers/carousel-costillas-bbq.svg'
import carouselComboFamiliar from '../assets/offers/carousel-combo-familiar.svg'
import carouselHappyHour from '../assets/offers/carousel-happy-hour.svg'

const BANNERS = [
  {
    id: 1,
    title: 'Especiales de Temporada',
    subtitle: 'Costillas BBQ con precio especial.',
    cta: 'Ver oferta',
    ctaTo: '/#offers',
    image: carouselCostillas,
    imageMode: 'cutout',
  },
  {
    id: 2,
    title: 'Combo Familiar',
    subtitle: 'Para 6 personas, solo $690.',
    cta: 'Ordenar',
    ctaTo: '/menu?category=all',
    image: carouselComboFamiliar,
    imageMode: 'cover',
  },
  {
    id: 3,
    title: 'Happy Hour',
    subtitle: '2x1 en bebidas de lunes a viernes.',
    cta: 'Más info',
    ctaTo: '/#offers',
    image: carouselHappyHour,
    imageMode: 'cover',
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
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (isPaused || prefersReducedMotion) {
      clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(goToNext, SLIDE_INTERVAL)

    return () => clearInterval(timerRef.current)
  }, [isPaused, goToNext])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToPrev()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToNext()
    }
  }

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsPaused(false)
    }
  }

  return (
    <section
      role="region"
      aria-roledescription="carrusel"
      aria-label="Ofertas destacadas"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={handleBlur}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[76vh] max-h-[880px] min-h-[420px] w-full overflow-hidden bg-carbon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-inset"
    >
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {BANNERS.map((banner, index) => (
          <BannerCard
            key={banner.id}
            {...banner}
            isActive={index === current}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={goToPrev}
        className="absolute top-1/2 left-3 z-20 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-carbon/60 text-white backdrop-blur transition-all duration-200 hover:scale-105 hover:border-dorado hover:bg-fuego hover:text-white focus-visible:ring-2 focus-visible:ring-dorado focus-visible:outline-none sm:flex md:left-6"
        aria-label="Slide anterior"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="absolute top-1/2 right-3 z-20 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-carbon/60 text-white backdrop-blur transition-all duration-200 hover:scale-105 hover:border-dorado hover:bg-fuego hover:text-white focus-visible:ring-2 focus-visible:ring-dorado focus-visible:outline-none sm:flex md:right-6"
        aria-label="Siguiente slide"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {BANNERS.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => setCurrent(index)}
            className={`h-2 cursor-pointer rounded-full transition-all duration-300 hover:bg-dorado focus-visible:ring-2 focus-visible:ring-dorado focus-visible:ring-offset-2 focus-visible:ring-offset-carbon focus-visible:outline-none ${
              index === current ? 'w-9 bg-dorado' : 'w-3 bg-white/40 hover:w-5'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
            aria-current={index === current}
          />
        ))}
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-20 h-1 bg-white/20">
        <div
          key={current}
          className="h-full bg-gradient-to-r from-fuego to-dorado transition-[width] ease-linear"
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
