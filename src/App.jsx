import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import Orders from './pages/Orders.jsx'
import ManageProducts from './pages/ManageProducts.jsx'
import AdminUsers from './pages/AdminUsers.jsx'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/manage-products"
            element={<AdminRoute><ManageProducts /></AdminRoute>}
          />
          <Route
            path="/admin/users"
            element={<AdminRoute><AdminUsers /></AdminRoute>}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App