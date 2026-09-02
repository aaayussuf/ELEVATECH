import { useContext } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

export default function Wishlist() {
  const { wishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const products = wishlist
    .map((item) => item.product)
    .filter(Boolean);

  function handleAddToCart(product) {
    addToCart(product);
    alert(`${product.name} added to cart.`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Wishlist
        </h1>

        <p className="text-gray-500 mt-2">
          {products.length}{" "}
          {products.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Your wishlist is empty
          </h2>

          <p className="text-gray-500 mt-2">
            Save products you love and find them here later.
          </p>

          <Link
            to="/products"
            className="inline-flex mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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

