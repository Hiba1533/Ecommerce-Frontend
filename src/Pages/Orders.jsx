import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, getUserId, authHeaders } from '../api.js'

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
    setOrders(data)
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
    <div className="container">
      <h1>Place Order</h1>

      <div className="card">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />

        <p><b>Total Amount:</b> Rs. {total}</p>

        <div className="btn-block">
          <button className="btn-success" onClick={placeOrder}>Place Order</button>
        </div>
      </div>

      <hr />

      <h2>My Orders</h2>

      <div className="grid">
        {orders.map((order) => (
          <div className="card order-card" key={order.id}>
            <h3>Order ID: {order.id}</h3>
            <p><b>Total Amount:</b> Rs. {order.amount}</p>
            <p><b>Order Status:</b> {order.status}</p>
            <p><b>Payment Status:</b> {order.paymentStatus}</p>

            {order.paymentStatus === "paid" ? (
              <p className="paid-text"><b>Payment Completed ✓</b></p>
            ) : (
              <button onClick={() => payOrder(order.id)}>Pay</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders