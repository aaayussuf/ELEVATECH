import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";
import AccountLayout from "../../layouts/AccountLayout";
import ProductCard from "../../components/ProductCard";

export default function Wishlist() {
  const { user, token, isLoading, logout } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const {
    wishlist,
  } = useContext(WishlistContext);

  return (
    <AccountLayout user={user} onLogout={logout}>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div style={{ color: "#666" }}>Wishlist is empty.</div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

