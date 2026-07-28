import { useEffect, useState } from 'react'
import { BASE_URL } from '../api.js'

function ManageProducts() {
  const [categories, setCategories] = useState([])
  const [categoryName, setCategoryName] = useState("")

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [categoryId, setCategoryId] = useState("")

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const response = await fetch(BASE_URL + "/category")
    const data = await response.json()
    setCategories(data)
    if (data.length > 0 && !categoryId) {
      setCategoryId(data[0].id)
    }
  }

  async function addCategory() {
    const response = await fetch(BASE_URL + "/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName })
    })

    if (response.ok) {
      alert("Category Added")
      setCategoryName("")
      loadCategories()
    } else {
      alert("Failed")
    }
  }

  async function addProduct() {
    const product = {
      name,
      description,
      price,
      stock,
      category: { id: categoryId }
    }

    const response = await fetch(BASE_URL + "/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    })

    if (response.ok) {
      alert("Product Added Successfully")
      setName("")
      setDescription("")
      setPrice("")
      setStock("")
    } else {
      const error = await response.text()
      alert(error)
    }
  }

  return (
    <div className="container">
      <h1>Manage Store</h1>

      <div className="card">
        <h2>Add Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button onClick={addCategory}>Add Category</button>
      </div>

      <div className="card">
        <h2>Add Product</h2>
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button onClick={addProduct}>Add Product</button>
      </div>
    </div>
  )
}

export default ManageProducts