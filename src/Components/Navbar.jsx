import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isLoggedIn, logout } from '../api.js'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  // login/register page par navbar nahi dikhana
  if (location.pathname === "/" || location.pathname === "/register") {
    return null
  }

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <h2 className="brand">E-Commerce Store</h2>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/manage-products">Manage Store</Link>
        {isLoggedIn() && (
          <button className="btn-secondary" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  )
}

export default Navbar