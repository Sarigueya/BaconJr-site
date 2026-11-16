import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../utils/scrollToSection'

function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const frame = window.requestAnimationFrame(() => {
        scrollToSection(id)
      })
      return () => window.cancelAnimationFrame(frame)
    }

    window.scrollTo(0, 0)
    // `key` cambia en cada navegación, así que repetir el mismo CTA vuelve a
    // desplazarse aunque el hash sea idéntico.
  }, [pathname, hash, key])

  return null
}

export default ScrollManager
