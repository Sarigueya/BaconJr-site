import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/motion'

let isRegistered = false

function ensureRegistered() {
  if (isRegistered) return
  gsap.registerPlugin(ScrollTrigger)
  isRegistered = true
}

let refreshFrame = 0

// Recalcula las posiciones de ScrollTrigger cuando el layout cambia (filtros,
// listas asíncronas, "ver más"…). Sin esto, los elementos que empiezan ocultos
// pueden quedarse ocultos si su posición cacheada queda fuera de la página.
export function refreshScrollTriggers() {
  ensureRegistered()
  cancelAnimationFrame(refreshFrame)
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0
    ScrollTrigger.refresh()
  })
}

// Anima un único elemento o contenedor. Las opciones se guardan en un ref para
// que los objetos inline de cada render no reinicien la animación.
export function useGsapReveal(ref, options = {}) {
  const {
    enabled = true,
    triggerOnScroll = false,
    scrollStart = 'top 85%',
    once = true,
    delay = 0,
  } = options

  const optionsRef = useRef(options)

  // Sincroniza las últimas opciones sin tocar el ref durante el render.
  useLayoutEffect(() => {
    optionsRef.current = options
  })

  useLayoutEffect(() => {
    if (!enabled) return
    const element = ref?.current
    if (!element || prefersReducedMotion()) return

    ensureRegistered()

    const { from = { autoAlpha: 0, y: 24 }, to = {} } = optionsRef.current

    const ctx = gsap.context(() => {
      const vars = {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        ...to,
        delay,
      }

      if (triggerOnScroll) {
        vars.scrollTrigger = {
          trigger: element,
          start: scrollStart,
          once,
        }
      }

      gsap.fromTo(element, from, vars)
    }, element)

    refreshScrollTriggers()

    return () => ctx.revert()
  }, [ref, enabled, triggerOnScroll, scrollStart, once, delay])
}

// Reveal escalonado de los hijos que coincidan con `itemSelector`.
// Por defecto se dispara al entrar en el viewport.
export function useGsapStaggerReveal(containerRef, itemSelector, options = {}) {
  const {
    enabled = true,
    triggerOnScroll = true,
    scrollStart = 'top 85%',
    once = true,
    delay = 0,
  } = options

  const optionsRef = useRef(options)

  useLayoutEffect(() => {
    optionsRef.current = options
  })

  useLayoutEffect(() => {
    if (!enabled) return
    const container = containerRef?.current
    if (!container || prefersReducedMotion()) return

    ensureRegistered()

    const {
      from = { autoAlpha: 0, y: 20 },
      to = {},
    } = optionsRef.current

    const ctx = gsap.context(() => {
      const items = container.querySelectorAll(itemSelector)
      if (!items.length) return

      const vars = {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        ...to,
        delay,
      }

      if (triggerOnScroll) {
        vars.scrollTrigger = {
          trigger: container,
          start: scrollStart,
          once,
        }
      }

      gsap.fromTo(items, from, vars)
    }, container)

    refreshScrollTriggers()

    return () => ctx.revert()
  }, [containerRef, itemSelector, enabled, triggerOnScroll, scrollStart, once, delay])
}
