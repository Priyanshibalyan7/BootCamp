export default function QuantityControl({ value, onChange }) {
  return (
    <div className="qty-ctrl">
      <button className="qty-btn" onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <span className="qty-val">{value}</span>
      <button className="qty-btn" onClick={() => onChange(value + 1)}>+</button>
    </div>
  )
}
