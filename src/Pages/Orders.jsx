import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, fetchCurrentUser, formatPrice } from '../api.js'

function Orders() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [total, setTotal] = useState(0)
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCurrentUser().then((u) => {
      if (!u) {
        alert("Please login first")
        navigate("/")
        return
      }
      setUser(u)
      loadTotal(u.id)
      loadOrders(u.id)
    })
  }, [])

  async function loadTotal(userId) {
    const response = await apiFetch(`/cart/total/${userId}`)
    if (response.ok) {
      const data = await response.json()
      setTotal(data)
    } else {
      alert("Unable to load total.")
    }
  }

  async function loadOrders(userId) {
    const response = await apiFetch(`/orders/${userId}`)
    if (!response.ok) {
      alert("Unable to load orders")
      return
    }
    const data = await response.json()
    setOrders(data.slice().reverse())
  }

  async function placeOrder() {
    const response = await apiFetch(`/orders/${user.id}`, {
      method: "POST",
      body: JSON.stringify({ name, phone, address })
    })

    if (response.ok) {
      alert("Order placed successfully!")
      setName("")
      setPhone("")
      setAddress("")
      loadTotal(user.id)
      loadOrders(user.id)
    } else {
      alert(await response.text())
    }
  }

  async function payOrder(orderId) {
    const response = await apiFetch(`/orders/${orderId}/pay`, {
      method: "PUT"
    })

    if (response.ok) {
      alert("Payment successful!")
      loadOrders(user.id)
    } else {
      alert("Payment failed!")
    }
  }

  // NEW: user clicks "Request Refund"
  async function requestRefund(orderId) {
    const response = await apiFetch(`/orders/${orderId}/request-refund`, {
      method: "PUT"
    })

    if (response.ok) {
      alert("Refund requested! Admin will review it.")
      loadOrders(user.id)
    } else {
      alert(await response.text())
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
                <span className={`status-pill status-${order.paymentStatus}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <p className="order-amount">Rs. {formatPrice(order.amount)}</p>
              <p className="order-status-line">Status: {order.status}</p>

              {order.paymentStatus === "unpaid" && (
                <button className="btn btn-primary" onClick={() => payOrder(order.id)}>
                  Pay Now
                </button>
              )}

              {order.paymentStatus === "paid" && (
                <button className="btn btn-outline" onClick={() => requestRefund(order.id)}>
                  Request Refund
                </button>
              )}

              {order.paymentStatus === "refund_requested" && (
                <p className="order-status-line">Refund requested, waiting for admin.</p>
              )}

              {order.paymentStatus === "refunded" && (
                <p className="order-status-line">This order has been refunded.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders