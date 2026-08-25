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

const SLIDE_INTERVAL = 5000

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % BANNERS.length)
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

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === current ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlider
