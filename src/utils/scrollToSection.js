import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const getNavbarOffset = () => {
  const navbar = document.querySelector('nav')
  return navbar?.offsetHeight || 96
}

const DESKTOP_QUERY = '(min-width: 1024px)'
const EXTRA_OFFSET = 16

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToSection(id) {
  const target = document.getElementById(id)
  if (!target) return false

  // En escritorio algunas secciones apuntan a un bloque interno (p. ej. la
  // cuadrícula de ofertas) para que las imágenes queden protagonistas.
  let anchor = target
  const scrollTargetId = target.dataset.scrollTarget
  if (scrollTargetId && window.matchMedia(DESKTOP_QUERY).matches) {
    anchor = document.getElementById(scrollTargetId) ?? target
  }

  const offsetY = getNavbarOffset() + EXTRA_OFFSET
  const targetY = anchor.getBoundingClientRect().top + window.scrollY - offsetY

  if (prefersReducedMotion()) {
    window.scrollTo({ top: targetY, behavior: 'auto' })
    return true
  }

  gsap.to(window, {
    duration: 1.05,
    ease: 'power3.inOut',
    overwrite: 'auto',
    scrollTo: {
      y: targetY,
      autoKill: false,
    },
  })

  return true
}
