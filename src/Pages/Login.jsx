import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../api.js'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin() {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.text()
      alert(error)
      return
    }

    // Cookie is set by the browser automatically now — just go.
    navigate("/products")
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <h1>Everyday essentials,<br />sorted in one cart.</h1>
        <p>Browse products, track orders, and check out — all in one place.</p>
        <ul className="auth-feature-list">
          <li>Save items to your cart</li>
          <li>Track every order in real time</li>
          <li>Checkout in a couple of clicks</li>
        </ul>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Log in to keep shopping</p>

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary btn-block" onClick={handleLogin}>
            Log In
          </button>

          <p className="auth-switch">
            New to Commi? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login