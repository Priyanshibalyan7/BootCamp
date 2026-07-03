export default function Stars({ rating }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ opacity: s <= Math.round(rating) ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  )
}
