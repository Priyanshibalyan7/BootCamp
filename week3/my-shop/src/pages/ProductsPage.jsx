import { useState } from 'react'
import { useProducts }   from '../hooks/useProducts'
import { useCategories } from '../hooks/useProducts'
import { filterProducts, capitalize } from '../utils/helpers'
import ProductCard      from '../components/ui/ProductCard'
import SkeletonCard     from '../components/ui/SkeletonCard'
import CategoryPills    from '../components/ui/CategoryPills'

export default function ProductsPage() {
  const { products, loading }     = useProducts()
  const { categories }            = useCategories()
  const [selCat,  setSelCat]      = useState('all')
  const [search,  setSearch]      = useState('')
  const [sort,    setSort]        = useState('default')

  const filtered = filterProducts(products, { category: selCat, search, sort })

  return (
    <div className="section">
      {/* Header */}
      <div className="section-head fade-in">
        <h2 className="section-title">All <span>Products</span></h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              padding: '9px 14px', borderRadius: 999, border: '1.5px solid var(--border)',
              fontSize: 13, background: 'var(--card)', fontFamily: 'Inter', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <CategoryPills categories={categories} selected={selCat} onSelect={setSelCat} />

      {/* Result count */}
      {!loading && (
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          {selCat !== 'all' && (
            <span
              className="chip"
              style={{ marginLeft: 8, cursor: 'pointer' }}
              onClick={() => setSelCat('all')}
            >
              {capitalize(selCat)} ✕
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="product-grid stagger">
        {loading
          ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map(p => <ProductCard key={p.id} product={p} />)
        }
        {!loading && filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16 }}>No products found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
