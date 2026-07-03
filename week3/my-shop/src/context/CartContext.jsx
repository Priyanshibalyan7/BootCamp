import { createContext, useCallback, useContext, useState } from 'react'
import { ToastContext } from './ToastContext'

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart]   = useState([])
  const [open, setOpen]   = useState(false)
  const addToast          = useContext(ToastContext)

  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id)
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty }]
    })
    addToast(`"${product.title.slice(0, 28)}…" added to cart`, 'success')
  }, [addToast])

  const removeFromCart = useCallback(id => {
    setCart(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQty = useCallback((id, delta) => {
    setCart(prev => prev.map(i =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const totalQty = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, totalQty, open, setOpen }}>
      {children}
    </CartContext.Provider>
  )
}
