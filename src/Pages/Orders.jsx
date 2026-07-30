import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, getUserId, authHeaders, formatPrice } from '../api.js'

function Orders() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [total, setTotal] = useState(0)
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  const userId = getUserId()

  useEffect(() => {
    if (!userId) {
      alert("Please login first")
      navigate("/")
      return
    }
    loadTotal()
    loadOrders()
  }, [])

  async function loadTotal() {
    const response = await fetch(`${BASE_URL}/cart/total/${userId}`, {
      headers: authHeaders(false)
    })
    if (response.ok) {
      const data = await response.json()
      setTotal(data)
    } else {
      alert("Unable to load total.")
    }
  }

  async function loadOrders() {
    const response = await fetch(`${BASE_URL}/orders/${userId}`, {
      headers: authHeaders(false)
    })
    if (!response.ok) {
      alert("Unable to load orders")
      return
    }
    const data = await response.json()
    setOrders(data.slice().reverse())
  }

  async function placeOrder() {
    const response = await fetch(`${BASE_URL}/orders/${userId}`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name, phone, address })
    })

    if (response.ok) {
      alert("Order placed successfully!")
      setName("")
      setPhone("")
      setAddress("")
      loadTotal()
      loadOrders()
    } else {
      alert(await response.text())
    }
  }

  async function payOrder(orderId) {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/pay`, {
      method: "PUT",
      headers: authHeaders(false)
    })

    if (response.ok) {
      alert("Payment successful!")
      loadOrders()
    } else {
      alert("Payment failed!")
    }
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Checkout & Orders</h1>
        <p>Confirm your delivery details and track past orders.</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">
          <h3>Delivery Details</h3>
          <label>Full Name</label>
          <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Phone</label>
          <input type="text" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <label>Address</label>
          <input type="text" placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />

          <div className="summary-row summary-total">
            <span>Amount Payable</span>
            <span>Rs. {formatPrice(total)}</span>
          </div>

          <button className="btn btn-primary btn-block" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>

      <div className="page-heading" style={{ marginTop: "40px" }}>
        <h2>Order History</h2>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet — place your first order above.</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <h3>Order #{order.id}</h3>
                <span className={`status-pill ${order.paymentStatus === "paid" ? "status-paid" : "status-unpaid"}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <p className="order-amount">Rs. {formatPrice(order.amount)}</p>
              <p className="order-status-line">Status: {order.status}</p>

              {order.paymentStatus !== "paid" && (
                <button className="btn btn-primary" onClick={() => payOrder(order.id)}>
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders