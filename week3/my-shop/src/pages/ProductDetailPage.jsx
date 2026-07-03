import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct }  from '../api/products'
import { useRelated }  from '../hooks/useProducts'
import { useCart }     from '../hooks'
import { useWishlist } from '../hooks'
import { formatPrice } from '../utils/helpers'
import Stars           from '../components/ui/Stars'
import ProductCard     from '../components/ui/ProductCard'
import SkeletonCard    from '../components/ui/SkeletonCard'
import QuantityControl from '../components/ui/QuantityControl'

const RATING_PERCENTS = [45, 30, 15, 7, 3]

export default function ProductDetailPage() {
  const { id }                       = useParams()
  const nav                          = useNavigate()
  const [product, setProduct]        = useState(null)
  const [qty, setQty]                = useState(1)
  const { addToCart }                = useCart()
  const { toggle, isWishlisted }     = useWishlist()
  const { related }                  = useRelated(product?.category, product?.id)
  const wishlisted                   = product ? isWishlisted(product.id) : false

  useEffect(() => {
    window.scrollTo(0, 0)
    setProduct(null)
    setQty(1)
    getProduct(id).then(setProduct)
  }, [id])

  if (!product) return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
      <div className="skeleton" style={{ aspectRatio: 1, borderRadius: 20 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 20 }}>
        {[60, 40, 20, 80, 40, 30].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: i === 3 ? 48 : 16, width: `${w}%` }} />
        ))}
      </div>
    </div>
  )

  return (
    <>
      <div className="detail-layout fade-in">
        {/* Image */}
        <div className="detail-img-main">
          <img src={product.image} alt={product.title} />
        </div>

        {/* Info */}
        <div style={{ paddingTop: 8 }}>
          <button
            className="btn btn-outline"
            style={{ fontSize: 12, padding: '6px 14px', marginBottom: 20 }}
            onClick={() => nav(-1)}
          >
            ← Back
          </button>

          <span className="detail-badge">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>

          {/* Rating summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Stars rating={product.rating?.rate ?? 4} />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              {product.rating?.rate} ({product.rating?.count} reviews)
            </span>
          </div>

          {/* Rating bars */}
          <div className="rating-bar-wrap">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div className="rating-row" key={star}>
                <span>{star}★</span>
                <div className="rating-bar-bg">
                  <div className="rating-bar-fill" style={{ width: `${RATING_PERCENTS[i]}%` }} />
                </div>
                <span>{RATING_PERCENTS[i]}%</span>
              </div>
            ))}
          </div>

          <div className="detail-price">{formatPrice(product.price)}</div>
          <p className="detail-desc">{product.description}</p>

          {/* Actions */}
          <div className="detail-actions">
            <QuantityControl value={qty} onChange={setQty} />
            <button className="btn btn-primary" onClick={() => addToCart(product, qty)}>
              Add to Cart
            </button>
            <button
              className="btn btn-outline"
              onClick={() => toggle(product)}
              style={wishlisted ? { background: '#ffe4e0', borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
            >
              {wishlisted ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['Free Shipping', 'Easy Returns', 'Secure Payment'].map(t => (
              <span key={t} className="chip">✓ {t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="section">
          <div className="section-head">
            <h2 className="section-title">Related <span>Products</span></h2>
          </div>
          <div className="product-grid stagger">
            {related.map(r => <ProductCard key={r.id} product={r} />)}
          </div>
        </div>
      )}
    </>
  )
}
