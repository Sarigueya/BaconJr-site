import { useMemo, useState } from 'react'
import { CartContext } from './cart-context'

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // { id, name, price, quantity, image }

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const increment = (productId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decrement = (productId) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCart = () => setItems([])

  const getQuantity = (productId) =>
    items.find((item) => item.id === productId)?.quantity ?? 0

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
