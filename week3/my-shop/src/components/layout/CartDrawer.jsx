import { useNavigate } from 'react-router-dom'
import { useCart }     from '../../hooks'
import { formatPrice } from '../../utils/helpers'

export default function CartDrawer() {
  const { cart, removeFromCart, updateQty, total, totalQty, open, setOpen, clearCart } = useCart()
  const nav = useNavigate()

  if (!open) return null

  const handleCheckout = () => {
    setOpen(false)
    clearCart()
    nav('/checkout')
  }

  return (
    <>
      <div className="drawer-overlay" onClick={() => setOpen(false)} />
      <div className="drawer slide-in">

        {/* Header */}
        <div className="drawer-header">
          <div>
            <div className="drawer-title">Your Cart</div>
            {totalQty > 0 && (
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {totalQty} item{totalQty !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <button className="drawer-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Discover our collection and add items you love.</p>
              <button className="btn btn-primary" onClick={() => setOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-cat">{item.category}</div>
                  <div className="cart-item-name">{item.title}</div>
                  <div className="cart-item-price">{formatPrice(item.price * item.qty)}</div>
                  <div className="cart-item-ctrl">
                    <button className="ci-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span className="ci-qty">{item.qty}</span>
                    <button className="ci-btn" onClick={() => updateQty(item.id, +1)}>+</button>
                    <button className="ci-remove" onClick={() => removeFromCart(item.id)}>🗑</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="total-row">
              <span className="total-label">Total</span>
              <span className="total-val">{formatPrice(total)}</span>
            </div>
            <div className="total-items">
              {totalQty} item{totalQty !== 1 ? 's' : ''} · Free shipping on orders above $50
            </div>
            <button
              className="btn btn-accent"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              onClick={handleCheckout}
            >
              Checkout →
            </button>
            <button
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', marginTop: 10, padding: '12px' }}
              onClick={() => setOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
