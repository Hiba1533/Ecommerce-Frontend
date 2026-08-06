import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, fetchCurrentUser, formatPrice } from '../api.js'

function Products() {
  const [products, setProducts] = useState([])
  const [quantities, setQuantities] = useState({})
  const [activeCategory, setActiveCategory] = useState("All")
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCurrentUser().then((u) => {
      if (!u) {
        alert("Please login first")
        navigate("/")
        return
      }
      setUser(u)
      loadProducts()
    })
  }, [])

  async function loadProducts() {
    const response = await apiFetch("/product")
    if (!response.ok) {
      alert("Unable to load products")
      return
    }
    const data = await response.json()
    setProducts(data)
  }

  const categories = useMemo(() => {
    const names = [...new Set(products.map((p) => p.category.name))]
    return ["All", ...names]
  }, [products])

  const visibleProducts = activeCategory === "All"
    ? products
    : products.filter((p) => p.category.name === activeCategory)

  function getQty(productId) {
    return quantities[productId] || 1
  }

  function changeQty(productId, delta, stock) {
    const current = getQty(productId)
    const next = Math.min(Math.max(current + delta, 1), stock || current + delta)
    setQuantities({ ...quantities, [productId]: next })
  }

  async function addToCart(productId) {
    if (!user) return
    const quantity = getQty(productId)

    const response = await apiFetch(
      `/cart/items?userId=${user.id}&productId=${productId}&quantity=${quantity}`,
      { method: "POST" }
    )

    if (response.ok) {
      alert("Added to cart")
    } else {
      alert(await response.text())
    }
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Shop All Products</h1>
        <p>Fresh picks, restocked daily.</p>
      </div>

      <div className="category-pills">
        {categories.map((name) => (
          <button
            key={name}
            className={`pill ${activeCategory === name ? "pill-active" : ""}`}
            onClick={() => setActiveCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <div className="product-card" key={product.id}>
            {product.stock === 0 && (
              <span className="ribbon ribbon-danger">Sold Out</span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="ribbon ribbon-warning">Only {product.stock} left</span>
            )}

            <span className="product-category">{product.category.name}</span>
            <h3>{product.name}</h3>
            <p className="product-desc">{product.description}</p>
            <p className="product-price">Rs. {formatPrice(product.price)}</p>

            <div className="stepper">
              <button onClick={() => changeQty(product.id, -1, product.stock)} disabled={getQty(product.id) <= 1}>−</button>
              <span>{getQty(product.id)}</span>
              <button onClick={() => changeQty(product.id, 1, product.stock)} disabled={getQty(product.id) >= product.stock}>+</button>
            </div>

            <button
              className="btn btn-primary btn-block"
              disabled={product.stock === 0}
              onClick={() => addToCart(product.id)}
            >
              {product.stock === 0 ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products