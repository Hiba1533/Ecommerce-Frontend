import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { fetchCurrentUser } from '../api.js'

function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading") // "loading" | "guest" | "user" | "admin"

  useEffect(() => {
    let cancelled = false
    fetchCurrentUser().then((user) => {
      if (cancelled) return
      if (!user) setStatus("guest")
      else if (user.role === "ADMIN") setStatus("admin")
      else setStatus("user")
    })
    return () => { cancelled = true }
  }, [])

  if (status === "loading") {
    return <div className="page-container"><p>Loading...</p></div>
  }
  if (status === "guest") {
    return <Navigate to="/" replace />
  }
  if (status === "user") {
    return <Navigate to="/products" replace />
  }
  return children
}

export default AdminRoute