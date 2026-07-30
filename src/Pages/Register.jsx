import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../api.js'

function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const navigate = useNavigate()

  async function handleRegister() {
    const user = { username, email, password, phone }

    const response = await fetch(BASE_URL + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })

    if (response.ok) {
      alert("Registration Successful")
      navigate("/")
    } else {
      alert("Registration Failed")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <h1>Join Commi and<br />shop smarter.</h1>
        <p>Create an account to save your cart and track every order.</p>

        <ul className="auth-feature-list">
          <li>Free to join, ready in a minute</li>
          <li>Your cart is saved to your account</li>
          <li>See order and payment status anytime</li>
        </ul>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h2>Create your account</h2>
          <p className="auth-subtitle">Takes less than a minute</p>

          <label>Username</label>
          <input type="text" placeholder="Your name" value={username} onChange={(e) => setUsername(e.target.value)} />

          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

          <label>Phone Number</label>
          <input type="text" placeholder="03xx-xxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <button className="btn btn-primary btn-block" onClick={handleRegister}>
            Create Account
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register