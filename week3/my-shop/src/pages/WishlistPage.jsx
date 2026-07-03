import { Link } from 'react-router-dom'
import { useWishlist } from '../hooks'
import { useCart }     from '../hooks'
import ProductCard     from '../components/ui/ProductCard'

export default function WishlistPage() {
  const { wishlist, toggle } = useWishlist()
  const { addToCart }        = useCart()

  if (wishlist.length === 0) return (
    <div className="wishlist-empty fade-in">
      <div className="wishlist-empty-icon">❤️</div>
      <h2>Your wishlist is empty</h2>
      <p>Save items you love while browsing — they'll appear here.</p>
      <Link to="/products">
        <button className="btn btn-primary">Explore Products</button>
      </Link>
    </div>
  )

  return (
    <div className="section">
      <div className="section-head fade-in">
        <h2 className="section-title">My <span>Wishlist</span></h2>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          {wishlist.length} item{wishlist.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button
          className="btn btn-primary"
          onClick={() => wishlist.forEach(p => addToCart(p))}
        >
          Add All to Cart 🛒
        </button>
      </div>

      <div className="product-grid stagger">
        {wishlist.map(p => (
          <div key={p.id} style={{ position: 'relative' }}>
            <ProductCard product={p} />
            <button
              onClick={() => toggle(p)}
              title="Remove from wishlist"
              style={{
                position: 'absolute', top: 12, left: 12,
                background: 'rgba(255,255,255,.9)', border: 'none', borderRadius: '50%',
                width: 32, height: 32, cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,.1)',
              }}
            >✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
