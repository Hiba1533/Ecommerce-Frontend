import { useEffect, useState } from 'react'
import { apiFetch, formatPrice } from '../api.js'

function AdminOrders() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {

    setLoading(true)

    try {

      const response = await apiFetch("/admin/orders")

      if (response.ok) {
        const data = await response.json()
        setOrders(data.slice().reverse())
      } else {
        alert("Failed to load orders")
      }

    } finally {
      setLoading(false)
    }
  }

  async function refundOrder(id) {

    if (!confirm("Refund this order? This cannot be undone.")) {
      return
    }

    const response = await apiFetch(`/admin/orders/${id}/refund`, {
      method: "PUT"
    })

    if (response.ok) {

      const updatedOrder = await response.json()

      setOrders(
        orders.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      )

    } else {
      alert("Failed to refund order")
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading orders...</p>
      </div>
    )
  }

  return (

    <div className="page-container">

      <div className="page-heading">
        <h1>Admin - Orders</h1>
        <p>View all orders and manage refunds.</p>
      </div>

      <button className="btn btn-outline" onClick={loadOrders} style={{ marginTop: "16px" }}>
        Refresh
      </button>

      <div className="table-wrap">
        <table className="admin-table">

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Order Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {orders.map(order => (

              <tr key={order.id}>

                <td>#{order.id}</td>
                <td>{order.user.username} ({order.user.email})</td>
                <td>Rs. {formatPrice(order.amount)}</td>
                <td>{order.status}</td>

                <td>
                  <span className={`status-pill status-${order.paymentStatus}`}>
                    {order.paymentStatus}
                  </span>
                </td>

                <td>
                  {order.paymentStatus === "refund_requested" ? (
                    <button
                      className="btn btn-ghost"
                      onClick={() => refundOrder(order.id)}
                    >
                      Refund
                    </button>
                  ) : (
                    <span style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>—</span>
                  )}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>

    </div>

  )
}

export default AdminOrders