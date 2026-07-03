import { Link } from 'react-router-dom'
import { useFeatured } from '../hooks/useProducts'
import ProductCard   from '../components/ui/ProductCard'
import SkeletonCard  from '../components/ui/SkeletonCard'

const STATS = [
  ['Free Shipping',  'On orders over $50'],
  ['Easy Returns',   '30-day no-fuss'],
  ['Secure Pay',     'SSL encrypted'],
  ['Support 24/7',   'Always here'],
]

export default function HomePage() {
  const { products, loading } = useFeatured(8)

  return (
    <>
      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-inner">
          <h1>Shop<br />the <em>best</em><br />products.</h1>
          <p>Curated finds across electronics, fashion, and jewellery — delivered to your door.</p>
          <div className="hero-actions">
            <Link to="/products">
              <button className="btn btn-accent">Browse All →</button>
            </Link>
            <Link to="/wishlist">
              <button className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,.4)', color: '#fff' }}>
                My Wishlist
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          {STATS.map(([h, s]) => (
            <div key={h}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}>{h}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Featured ── */}
      <div className="section">
        <div className="section-head">
          <h2 className="section-title">Featured <span>Products</span></h2>
          <Link to="/products" style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
            View all →
          </Link>
        </div>
        <div className="product-grid stagger">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </div>

      {/* ── Newsletter CTA ── */}
      <div style={{ background: 'var(--ink)', color: '#fff', padding: '64px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 16 }}>
          Never miss a deal
        </h2>
        <p style={{ color: 'rgba(255,255,255,.55)', marginBottom: 28, fontSize: 15 }}>
          Sign up and get 10% off your first order.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            placeholder="your@email.com"
            style={{ padding: '12px 20px', borderRadius: 999, border: 'none', fontSize: 14, width: 280, fontFamily: 'Inter' }}
            readOnly
          />
          <button className="btn btn-accent">Subscribe</button>
        </div>
      </div>
    </>
  )
}
