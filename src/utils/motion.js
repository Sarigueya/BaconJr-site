// Detección compartida de la preferencia de movimiento reducido del usuario.
// SSR-safe: fuera del navegador siempre devuelve false.
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
