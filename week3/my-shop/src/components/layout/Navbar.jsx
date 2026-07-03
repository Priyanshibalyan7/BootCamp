import { Link, useLocation } from 'react-router-dom'
import { useCart }     from '../../hooks'
import { useWishlist } from '../../hooks'
import { ROUTES }      from '../../constants/routes'

const links = [
  { to: ROUTES.HOME,     label: 'Home'     },
  { to: ROUTES.PRODUCTS, label: 'Products' },
  { to: ROUTES.WISHLIST, label: 'Wishlist' },
]

export default function Navbar() {
  const { totalQty, setOpen } = useCart()
  const { wishlist }          = useWishlist()
  const loc                   = useLocation()

  return (
    <nav>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">shop<span>.</span>co</Link>

        <div className="nav-links">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${loc.pathname === l.to ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions" style={{ marginLeft: 'auto' }}>
          <button className="icon-btn" onClick={() => setOpen(true)} title="Cart">
            🛒
            {totalQty > 0 && <span className="badge">{totalQty}</span>}
          </button>
          <Link to={ROUTES.WISHLIST}>
            <button className="icon-btn" title="Wishlist">
              ❤️
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
