import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { apiFetch, fetchCurrentUser, logoutRequest } from '../api.js'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchCurrentUser().then(setUser)
  }, [location.pathname])

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      loadCartCount()
    }
  }, [user, location.pathname])

  async function loadCartCount() {
    try {
      const response = await apiFetch("/cart/items")
      if (response.ok) {
        const data = await response.json()
        setCartCount(data.length)
      }
    } catch (err) {
      // navbar shouldn't crash the app if this fails
    }
  }

  const isLoggedIn = !!user
  const isAdmin = user?.role === "ADMIN"
  const isAuthPage = location.pathname === "/" || location.pathname === "/register"

  async function handleLogout() {
    await logoutRequest()
    setUser(null)
    navigate("/")
  }

  return (
    <header className="navbar">
      <Link to={isLoggedIn ? "/products" : "/"} className="brand">
        <span className="brand-mark">C</span>
        Commi
      </Link>

      {!isAuthPage && (
        <nav className="nav-links">
          <Link to="/products">Shop</Link>
          <Link to="/orders">Orders</Link>

          {isAdmin && (
            <>
              <Link to="/manage-products">Manage Store</Link>
              <Link to="/admin/users">Admin Users</Link>
              <Link to="/admin/orders">Admin Orders</Link>
            </>
          )}

          {!isAdmin && (
            <Link to="/cart" className="cart-link">
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isLoggedIn && (
            <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
          )}
        </nav>
      )}
    </header>
  )
}

export default Navbar