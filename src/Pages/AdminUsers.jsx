import { useEffect, useState } from 'react'
import { apiFetch } from '../api.js'

function AdminUsers() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {

    setLoading(true)

    try {

      const response = await apiFetch("/admin/users")

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        alert("Failed to load users")
      }

    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(id, username) {

    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) {
      return
    }

    const response = await apiFetch(`/admin/users/${id}`, {
      method: "DELETE"
    })

    if (response.ok) {
      setUsers(users.filter(user => user.id !== id))
    } else {
      alert("Failed to delete user")
    }
  }

  async function changeRole(id, role) {

    const response = await apiFetch(`/admin/users/${id}/role?role=${role}`, {
      method: "PUT"
    })

    if (response.ok) {

      const updatedUser = await response.json()

      setUsers(
        users.map(user =>
          user.id === id ? updatedUser : user
        )
      )

    } else {
      alert("Failed to update role")
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading users...</p>
      </div>
    )
  }

  return (

    <div className="page-container">

      <div className="page-heading">
        <h1>Admin - Users</h1>
        <p>View, promote or remove user accounts.</p>
      </div>

      <div className="table-wrap">
        <table className="admin-table">

        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {users.map(user => (

            <tr key={user.id}>

              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>

              <td>

                <select
                  value={user.role}
                  onChange={(e) => changeRole(user.id, e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

              </td>

              <td>

                <button
                  className="btn btn-ghost"
                  onClick={() => deleteUser(user.id, user.username)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
      </div>

    </div>

  )
}

export default AdminUsers