import { useMemo, useState } from 'react'
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

  const addItem = (product, options = {}) => {
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
  }

  const increment = (target) => {
    setItems((prev) => {
      const line = findLine(prev, target)
      if (!line) return prev
      const key = getItemKey(line)
      return prev.map((item) =>
        getItemKey(item) === key
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    })
  }

  const decrement = (target) => {
    setItems((prev) => {
      const line = findLine(prev, target)
      if (!line) return prev
      const key = getItemKey(line)
      return prev
        .map((item) =>
          getItemKey(item) === key
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    })
  }

  const removeItem = (target) => {
    setItems((prev) => {
      const line = findLine(prev, target)
      if (!line) return prev
      const key = getItemKey(line)
      return prev.filter((item) => getItemKey(item) !== key)
    })
  }

  const clearCart = () => setItems([])

  const getQuantity = (productId) =>
    items
      .filter((item) => item.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0)

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const value = {
    items,
    addItem,
    increment,
    decrement,
    removeItem,
    clearCart,
    getQuantity,
    totalItems,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
