import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../api.js'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin() {
    const response = await fetch(BASE_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    })

    if (response.ok) {
      const token = response.headers.get("Authorization")
      const userId = response.headers.get("User-Id")

      localStorage.setItem("token", token)
      localStorage.setItem("userId", userId)

      const message = await response.text()
      alert(message)
      navigate("/products")
    } else {
      const error = await response.text()
      alert(error)
    }
  }

  return (
    <div className="center-page">
      <h1>E-Commerce Store</h1>
      <div className="card">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="btn-block">
          <button onClick={handleLogin}>Login</button>
        </div>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login