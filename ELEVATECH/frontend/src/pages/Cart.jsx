import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <h1>Your Cart</h1>

        <p>Your cart is empty.</p>

        <Link to="/products">
          <button style={styles.button}>Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Shopping Cart</h1>

      {cartItems.map((item) => (
        <div key={item.id} style={styles.card}>
          <img
            src={item.image || "/placeholder-product.png"}
            alt={item.name}
            style={styles.image}
          />

          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>

            <p>KES {Number(item.price).toLocaleString()}</p>

            <div style={styles.quantity}>
              <button onClick={() => decreaseQuantity(item.id)}>-</button>

              <span>{item.quantity}</span>

              <button onClick={() => increaseQuantity(item.id)}>+</button>
            </div>
          </div>

          <div>
            <h3>
              KES {(item.price * item.quantity).toLocaleString()}
            </h3>

            <button
              onClick={() => removeFromCart(item.id)}
              style={styles.remove}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <hr />

      <h2>Total Items: {totalItems}</h2>

      <h2>Total: KES {totalPrice.toLocaleString()}</h2>

      <div style={styles.footer}>
        <button onClick={clearCart} style={styles.clear}>
          Clear Cart
        </button>

        <Link to="/checkout">
          <button style={styles.checkout}>
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
  },

  card: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
  },

  image: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  quantity: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },

  button: {
    padding: "10px 20px",
  },

  remove: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    cursor: "pointer",
    borderRadius: "6px",
  },

  clear: {
    background: "#555",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    cursor: "pointer",
    borderRadius: "8px",
  },

  checkout: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    cursor: "pointer",
    borderRadius: "8px",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px",
  },
};
