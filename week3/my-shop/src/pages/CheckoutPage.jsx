import { Link } from 'react-router-dom'

export default function CheckoutPage() {
  return (
    <div style={{ maxWidth: 500, margin: '80px auto', padding: '0 24px', textAlign: 'center' }} className="fade-up">
      <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 16 }}>
        Order Placed!
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
        Thank you for shopping with us. Your order is being processed and you'll receive a confirmation shortly.
      </p>
      <Link to="/">
        <button className="btn btn-primary">Continue Shopping →</button>
      </Link>
    </div>
  )
}
