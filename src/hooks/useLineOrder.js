import { useState } from 'react'
import { useCart } from '../context/cart-context'

const MAX_UNITS = 20

// Gestiona la línea de producto (producto + nota) para el borrador del usuario:
// - La cantidad arranca en la línea existente del carrito (mínimo 1).
// - Antes del primer add es un borrador; al usar el stepper con la línea ya
//   existente escribe directamente en el carrito (sincronía en vivo).
// - Al cambiar la nota se precarga la cantidad de la línea que exista.
// - Una cantidad en 0 confirma la eliminación de la línea.
function useLineOrder(product, defaultQuantity = 1) {
  const { setItemQuantity, getLineQuantity } = useCart()
  const [note, setNote] = useState('')
  const [quantity, setQuantity] = useState(() =>
    Math.max(1, getLineQuantity(product.id, '') || defaultQuantity)
  )

  const lineQuantity = getLineQuantity(product.id, note)
  const isInCart = lineQuantity > 0
  const canSubmit = quantity > 0 || isInCart

  const updateQuantity = (next) => {
    const clamped = Math.min(MAX_UNITS, Math.max(0, next))
    const cleanNote = note.trim()

    setQuantity(clamped)
    if (getLineQuantity(product.id, cleanNote) > 0) {
      // La línea ya existe en el carrito: mantenemos la cantidad sincronizada.
      setItemQuantity(product, clamped, { note: cleanNote })
    }
  }

  const decreaseQuantity = () => updateQuantity(quantity - 1)
  const increaseQuantity = () => updateQuantity(quantity + 1)

  const handleNoteChange = (event) => {
    const value = event.target.value
    const cleanNote = value.trim()

    setNote(value)
    const existing = getLineQuantity(product.id, cleanNote)
    if (existing > 0) {
      setQuantity(Math.max(0, existing))
    }
  }

  const submit = () => {
    if (!canSubmit) return false

    // Cantidad absoluta: si la línea ya existe se actualiza, no se suma encima.
    setItemQuantity(product, quantity, { note })
    setQuantity(quantity)
    return true
  }

  return {
    note,
    setNote: handleNoteChange,
    quantity,
    lineQuantity,
    isInCart,
    canSubmit,
    decreaseQuantity,
    increaseQuantity,
    submit,
  }
}

export default useLineOrder
