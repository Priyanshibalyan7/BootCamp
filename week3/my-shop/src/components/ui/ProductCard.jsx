import { useNavigate } from 'react-router-dom'
import { useCart, useWishlist } from '../../hooks'
import { productPath } from '../../constants/routes'
import { formatPrice } from '../../utils/helpers'
import Stars from './Stars'

export default function ProductCard({ product }) {
  const { addToCart }                  = useCart()
  const { toggle, isWishlisted }       = useWishlist()
  const nav                            = useNavigate()
  const wishlisted                     = isWishlisted(product.id)

  return (
    <div className="product-card" onClick={() => nav(productPath(product.id))}>
      <div className="card-img-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
        <div className="card-actions" onClick={e => e.stopPropagation()}>
          <button
            className={`card-action-btn ${wishlisted ? 'active' : ''}`}
            onClick={() => toggle(product)}
            title="Wishlist"
          >
            {wishlisted ? '❤️' : '🤍'}
          </button>
          <button
            className="card-action-btn"
            onClick={() => addToCart(product)}
            title="Add to cart"
          >
            🛒
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <div className="card-title">{product.title}</div>
        <div className="card-footer">
          <div>
            <div className="card-price">{formatPrice(product.price)}</div>
            <div className="card-rating">
              <Stars rating={product.rating?.rate ?? 4} />
              <span>({product.rating?.count ?? 0})</span>
            </div>
          </div>
          <button
            className="card-add"
            onClick={e => { e.stopPropagation(); addToCart(product) }}
            title="Add to cart"
          >+</button>
        </div>
      </div>
    </div>
  )
}
