import { useEffect, useState } from 'react'
import { apiFetch } from '../api.js'

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

    const response = await apiFetch("/category")
    const data = await response.json()

    setCategories(data)

    if (data.length > 0 && !categoryId) {
      setCategoryId(data[0].id)
    }
  }

  async function addCategory() {

    const response = await apiFetch("/category", {
      method: "POST",
      body: JSON.stringify({ name: categoryName })
    })

    if (response.ok) {

      alert("Category Added")

      setCategoryName("")

      loadCategories()

    } else {

      alert("Failed — check you're logged in as ADMIN")

    }
  }

  async function addProduct() {

    const product = {
      name,
      description,
      price,
      stock,
      category: {
        id: categoryId
      }
    }

    const response = await apiFetch("/product", {
      method: "POST",
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
    <div className="page-container">

      <div className="page-heading">
        <h1>Manage Store</h1>
        <p>Add new categories and products to the catalogue.</p>
      </div>

      <div className="dashboard-layout">

        <div className="dashboard-card">

          <h3>Add Category</h3>

          <label>Category Name</label>

          <input
            type="text"
            placeholder="e.g. Snacks"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <button
            className="btn btn-primary btn-block"
            onClick={addCategory}
          >
            Add Category
          </button>

        </div>

        <div className="dashboard-card">

          <h3>Add Product</h3>

          <label>Product Name</label>

          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Description</label>

          <input
            type="text"
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="form-row">

            <div>

              <label>Price</label>

              <input
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

            </div>

            <div>

              <label>Stock</label>

              <input
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />

            </div>

          </div>

          <label>Category</label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >

            {categories.map((cat) => (

              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>

            ))}

          </select>

          <button
            className="btn btn-primary btn-block"
            onClick={addProduct}
          >
            Add Product
          </button>

        </div>

      </div>

    </div>
  )
}

export default ManageProducts