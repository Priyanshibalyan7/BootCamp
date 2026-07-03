import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastProvider }   from './context/ToastContext'
import { CartProvider }    from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ROUTES }          from './constants/routes'
import Navbar              from './components/layout/Navbar'
import Footer              from './components/layout/Footer'
import CartDrawer          from './components/layout/CartDrawer'
import HomePage            from './pages/HomePage'
import ProductsPage        from './pages/ProductsPage'
import ProductDetailPage   from './pages/ProductDetailPage'
import WishlistPage        from './pages/WishlistPage'
import CheckoutPage        from './pages/CheckoutPage'

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <CartDrawer />
            <Routes>
              <Route path={ROUTES.HOME}     element={<HomePage />} />
              <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
              <Route path={ROUTES.PRODUCT}  element={<ProductDetailPage />} />
              <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
              <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
            </Routes>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </Router>
  )
}
