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
    <div className="center-page">
      <h1>E-Commerce Store</h1>
      <div className="card">
        <h2>Create Account</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <div className="btn-block">
          <button className="btn-success" onClick={handleRegister}>Register</button>
        </div>

        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  )
}

export default Register