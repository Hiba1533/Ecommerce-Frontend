import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, getUserId, authHeaders } from '../api.js'

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

  function handleQtyChange(cartItemId, value) {
    setQuantities({ ...quantities, [cartItemId]: value })
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

  return (
    <div className="container">
      <h1>My Cart</h1>

      {items.length === 0 ? (
        <h2>Your Cart is Empty</h2>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <div className="card product-card" key={item.id}>
              <h3>{item.product.name}</h3>
              <p>Price : Rs. {item.product.price}</p>
              <p>Quantity : {item.quantity}</p>

              <input
                type="number"
                min="1"
                value={quantities[item.id] || 1}
                onChange={(e) => handleQtyChange(item.id, e.target.value)}
              />

              <div className="item-actions">
                <button onClick={() => updateQuantity(item.id)}>Update</button>
                <button className="btn-danger" onClick={() => deleteItem(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Total : Rs. {total}</h2>

      <div className="button-group">
        <button className="btn-secondary" onClick={() => navigate("/products")}>Continue Shopping</button>
        <button className="btn-success" onClick={() => navigate("/orders")}>Place Order</button>
      </div>
    </div>
  )
}

export default Cart