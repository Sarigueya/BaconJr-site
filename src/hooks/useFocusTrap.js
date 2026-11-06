import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
].join(', ')

const isFocusable = (element, isContainer) => {
  if (isContainer) return true
  if (element.disabled) return false
  const explicitTabIndex = element.getAttribute('tabindex')
  if (explicitTabIndex !== null && Number(explicitTabIndex) < 0) return false
  return element.tabIndex !== -1
}

// Atrapa el foco dentro de un diálogo abierto (p. ej. el panel del carrito).
export function useFocusTrap(ref, isActive = true) {
  const previousElementRef = useRef(null)

  useEffect(() => {
    if (!isActive || !ref.current) return

    const container = ref.current
    previousElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const getFocusable = () =>
      [container, ...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) =>
        isFocusable(element, element === container)
      )

    const focusables = getFocusable()
    ;(focusables[0] ?? container).focus()

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) {
        event.preventDefault()
        container.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey) {
        if (active === first || active === container) {
          event.preventDefault()
          last.focus()
        }
      } else if (active === last || active === container) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)

    return () => {
      container.removeEventListener('keydown', onKeyDown)
      const previous = previousElementRef.current
      if (previous && document.contains(previous)) previous.focus()
    }
  }, [ref, isActive])
}
