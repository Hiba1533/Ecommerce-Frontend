import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, getUserId, getToken } from '../api.js'

function Products() {
  const [products, setProducts] = useState([])
  const [quantities, setQuantities] = useState({})
  const navigate = useNavigate()
  const userId = getUserId()

  useEffect(() => {
    if (!userId) {
      alert("Please login first")
      navigate("/")
      return
    }
    loadProducts()
  }, [])

  async function loadProducts() {
    const response = await fetch(BASE_URL + "/product")
    if (!response.ok) {
      alert("Unable to load products")
      return
    }
    const data = await response.json()
    setProducts(data)
  }

  function handleQtyChange(productId, value) {
    setQuantities({ ...quantities, [productId]: value })
  }

  async function addToCart(productId) {
    const quantity = quantities[productId] || 1

    const response = await fetch(
      `${BASE_URL}/cart/items?userId=${userId}&productId=${productId}&quantity=${quantity}`,
      {
        method: "POST",
        headers: { "Authorization": getToken() }
      }
    )

    if (response.ok) {
      alert("Product Added Successfully")
    } else {
      alert(await response.text())
    }
  }

  return (
    <div className="container">
      <h1>Products</h1>

      <div className="grid">
        {products.map((product) => (
          <div className="card product-card" key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><b>Price:</b> Rs. {product.price}</p>
            <p><b>Stock:</b> {product.stock}</p>
            <p><b>Category:</b> {product.category.name}</p>

            <input
              type="number"
              min="1"
              value={quantities[product.id] || 1}
              onChange={(e) => handleQtyChange(product.id, e.target.value)}
            />

            <button onClick={() => addToCart(product.id)}>Add To Cart</button>
          </div>
        ))}
      </div>

      <div className="action-bar">
        <button onClick={() => navigate("/cart")}>View Cart</button>
        <button onClick={() => navigate("/manage-products")}>Manage Products</button>
      </div>
    </div>
  )
}

export default Products