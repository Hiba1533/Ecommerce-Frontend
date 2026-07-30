import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, getUserId, authHeaders, formatPrice } from '../api.js'

function Cart() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [quantities, setQuantities] = useState({})
  const navigate = useNavigate()
  const userId = getUserId()

  useEffect(() => {
    if (!userId) {
      alert("Please login first")
      navigate("/")
      return
    }
    loadCart()
    loadTotal()
  }, [])

  async function loadCart() {
    const response = await fetch(`${BASE_URL}/cart/items/${userId}`, {
      headers: authHeaders(false)
    })

    if (!response.ok) {
      alert("Error : " + response.status)
      return
    }

    const data = await response.json()
    setItems(data)

    const qtyMap = {}
    data.forEach((item) => { qtyMap[item.id] = item.quantity })
    setQuantities(qtyMap)
  }

  async function loadTotal() {
    const response = await fetch(`${BASE_URL}/cart/total/${userId}`, {
      headers: authHeaders(false)
    })
    if (!response.ok) return
    const data = await response.json()
    setTotal(data)
  }

  function changeQty(cartItemId, delta) {
    const current = quantities[cartItemId] || 1
    const next = Math.max(current + delta, 1)
    setQuantities({ ...quantities, [cartItemId]: next })
  }

  async function updateQuantity(cartItemId) {
    const quantity = quantities[cartItemId]

    const response = await fetch(`${BASE_URL}/cart/items/${cartItemId}?quantity=${quantity}`, {
      method: "PUT",
      headers: authHeaders(false)
    })

    if (response.ok) {
      loadCart()
      loadTotal()
    } else {
      alert(await response.text())
    }
  }

  async function deleteItem(cartItemId) {
    const response = await fetch(`${BASE_URL}/cart/items/${cartItemId}`, {
      method: "DELETE",
      headers: authHeaders(false)
    })

    if (response.ok) {
      loadCart()
      loadTotal()
    } else {
      alert(await response.text())
    }
  }

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add a few things you like — they'll show up here.</p>
          <button className="btn btn-primary" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>My Cart</h1>
        <p>{items.length} item{items.length > 1 ? "s" : ""} in your cart</p>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <div className="cart-row" key={item.id}>
              <div className="cart-row-info">
                <h3>{item.product.name}</h3>
                <p>Rs. {formatPrice(item.product.price)} each</p>
              </div>

              <div className="stepper">
                <button onClick={() => changeQty(item.id, -1)}>−</button>
                <span>{quantities[item.id] || 1}</span>
                <button onClick={() => changeQty(item.id, 1)}>+</button>
              </div>

              <div className="cart-row-actions">
                <button className="btn btn-outline" onClick={() => updateQuantity(item.id)}>Update</button>
                <button className="btn btn-danger" onClick={() => deleteItem(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {formatPrice(total)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>Rs. {formatPrice(total)}</span>
          </div>

          <button className="btn btn-primary btn-block" onClick={() => navigate("/orders")}>
            Proceed to Checkout
          </button>
          <button className="btn btn-ghost btn-block" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart