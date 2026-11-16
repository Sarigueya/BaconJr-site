import { useCallback, useMemo, useState } from 'react'
import { CartContext } from './cart-context'

const getLineId = (productId, note) => {
  const cleanNote = note.trim()
  return cleanNote ? `${productId}::${cleanNote.toLowerCase()}` : productId
}

const getItemKey = (item) => item.lineId ?? item.id

const findLine = (items, target) =>
  items.find((item) => getItemKey(item) === target) ??
  items.find((item) => item.id === target)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // { lineId, id, name, price, quantity, image, note }

  const addItem = useCallback((product, options = {}) => {
    const quantity = Math.max(1, options.quantity ?? 1)
    const note = (options.note ?? '').trim()
    const lineId = getLineId(product.id, note)

    setItems((prev) => {
      const existing = prev.find((item) => getItemKey(item) === lineId)
      if (existing) {
        return prev.map((item) =>
          getItemKey(item) === lineId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, lineId, note, quantity }]
    })
  }, [])

  // Fija una cantidad absoluta en una línea del carrito (o la elimina si es 0).
  // Así el contador de tarjetas/modales y el carrito quedan siempre sincronizados.
  const setItemQuantity = useCallback((product, quantity, options = {}) => {
    const nextQuantity = Math.max(0, Math.min(20, quantity))
    const note = (options.note ?? '').trim()
    const lineId = getLineId(product.id, note)

    setItems((prev) => {
      const line = prev.find((item) => getItemKey(item) === lineId)

      if (nextQuantity === 0) {
        return prev.filter((item) => getItemKey(item) !== lineId)
      }

      if (line) {
        return prev.map((item) =>
          getItemKey(item) === lineId ? { ...item, quantity: nextQuantity } : item
        )
      }

      return [...prev, { ...product, lineId, note, quantity: nextQuantity }]
    })
  }, [])

  const removeItem = useCallback((target) => {
    setItems((prev) => {
      const line = findLine(prev, target)
      if (!line) return prev
      const key = getItemKey(line)
      return prev.filter((item) => getItemKey(item) !== key)
    })
  }, [])

  const adjustProductQuantity = useCallback((product, delta) => {
    const step = delta > 0 ? 1 : -1

    setItems((prev) => {
      const matches = prev.filter((item) => item.id === product.id)

      // Si no existe ninguna línea para el producto, agregamos una base.
      if (matches.length === 0) {
        if (delta < 0) return prev
        return [...prev, { ...product, lineId: product.id, note: '', quantity: 1 }]
      }

      // Preferimos la línea sin nota y, si no existe, la última con nota.
      const target =
        matches.find((item) => getItemKey(item) === product.id) ?? matches[matches.length - 1]
      const targetKey = getItemKey(target)
      const nextQuantity = Math.min(20, Math.max(0, target.quantity + step))

      if (nextQuantity <= 0) {
        return prev.filter((item) => getItemKey(item) !== targetKey)
      }

      return prev.map((item) => (getItemKey(item) === targetKey ? { ...item, quantity: nextQuantity } : item))
    })
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const getQuantity = useCallback(
    (productId) =>
      items
        .filter((item) => item.id === productId)
        .reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const getLineQuantity = useCallback(
    (productId, note) =>
      items.find((item) => getItemKey(item) === getLineId(productId, note))
        ?.quantity ?? 0,
    [items]
  )

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      setItemQuantity,
      adjustProductQuantity,
      getLineQuantity,
      removeItem,
      clearCart,
      getQuantity,
      totalItems,
      totalPrice,
    }),
    [
      items,
      addItem,
      setItemQuantity,
      adjustProductQuantity,
      getLineQuantity,
      removeItem,
      clearCart,
      getQuantity,
      totalItems,
      totalPrice,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
