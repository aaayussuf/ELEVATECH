import { useContext, useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import productService from "../services/productService";
import { CartContext } from "../context/CartContext";
import "../styles/products.css";

export default function Products() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await productService.getProducts();

      // Support either:
      // [ ... ]
      // OR
      // { products:[ ... ] }
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart(product) {
    addToCart(product);
    alert(`${product.name} added to cart.`);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="products-page">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="products-page">
      <h1>Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredProducts.length === 0 ? (
        <h3>No products found.</h3>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
