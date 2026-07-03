import { useContext } from 'react'
import { CartContext }     from '../context/CartContext'
import { WishlistContext } from '../context/WishlistContext'
import { ToastContext }    from '../context/ToastContext'

export const useCart     = () => useContext(CartContext)
export const useWishlist = () => useContext(WishlistContext)
export const useToast    = () => useContext(ToastContext)
