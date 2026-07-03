import { createContext, useCallback, useContext, useState } from 'react'
import { ToastContext } from './ToastContext'

export const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])
  const addToast = useContext(ToastContext)

  const toggle = useCallback((product) => {
    setWishlist(prev => {
      const has = prev.some(i => i.id === product.id)
      if (has) {
        addToast('Removed from wishlist', 'info')
        return prev.filter(i => i.id !== product.id)
      }
      addToast('Added to wishlist ❤️', 'success')
      return [...prev, product]
    })
  }, [addToast])

  const isWishlisted = useCallback(id => wishlist.some(i => i.id === id), [wishlist])

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}
