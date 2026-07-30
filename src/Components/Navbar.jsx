import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BASE_URL, isLoggedIn, logout, getUserId, authHeaders } from '../api.js'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (isLoggedIn()) {
      loadCartCount()
    }
  }, [location.pathname])

  async function loadCartCount() {
    try {
      const response = await fetch(`${BASE_URL}/cart/items/${getUserId()}`, {
        headers: authHeaders(false)
      })
      if (response.ok) {
        const data = await response.json()
        setCartCount(data.length)
      }
    } catch (err) {
      // navbar shouldn't crash the app if this fails
    }
  }

  const isAuthPage = location.pathname === "/" || location.pathname === "/register"

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <header className="navbar">
      <Link to={isLoggedIn() ? "/products" : "/"} className="brand">
        <span className="brand-mark">C</span>
        Commi
      </Link>

      {!isAuthPage && (
        <nav className="nav-links">
          <Link to="/products">Shop</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/manage-products">Manage Store</Link>
          <Link to="/cart" className="cart-link">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {isLoggedIn() && (
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          )}
        </nav>
      )}
    </header>
  )
}

export default Navbar