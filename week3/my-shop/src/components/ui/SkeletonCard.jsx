export default function SkeletonCard() {
  return (
    <div className="product-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ aspectRatio: 1 }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton" style={{ height: 10, width: '50%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 14, marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 18, width: '40%' }} />
      </div>
    </div>
  )
}
